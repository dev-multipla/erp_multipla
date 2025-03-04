#contas_pagar/views.py
from rest_framework import viewsets, status, permissions
from .models import ContaAPagar, ContaAReceber
from .serializers import ContaAPagarSerializer, ContaAReceberSerializer, StatusContaAPagarSerializer, StatusContaAReceberSerializer
from rest_framework.views import APIView
from django.db.models import Sum 
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, F, Case, When, Value, DecimalField, CharField, Subquery, OuterRef 
from django.db.models.functions import Coalesce, TruncMonth
from .models import ContaAPagar, ContaAReceber,ContaPagarAvulso,ContaReceberAvulso
from .serializers import ContaAPagarSerializer, ContaAReceberSerializer, ContaPagarAvulsoSerializer, ContaReceberAvulsoSerializer, ConsolidatedContasSerializer
import pandas as pd
from dateutil.relativedelta import relativedelta
from datetime import date, timedelta, datetime
from contratos.models import ProjecaoFaturamento
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q


class ContaAPagarViewSet(viewsets.ModelViewSet):
    serializer_class = ContaAPagarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (ContaAPagar.objects
                .filter(is_active=True)
                .select_related(
                    'contrato',
                    'forma_pagamento',
                    'conta_financeira',
                    'centro_custo',
                    'contrato__fornecedor'  # Corrigido para fornecedor
                )
                .prefetch_related(
                    'contrato__contrato_projetos',
                    'contrato__contrato_projetos__projeto'
                )
                .order_by('-data_pagamento'))

    @action(detail=False, methods=['get'], url_path='ultima-conta')
    def get_last_conta_by_contrato(self, request):
        contrato_id = request.query_params.get('contrato_id')

        if not contrato_id:
            return Response({"error": "O ID do contrato é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

        ultima_conta = ContaAPagar.objects.filter(contrato_id=contrato_id).order_by('-data_pagamento').first()

        if not ultima_conta:
            return Response({"error": "Nenhuma conta encontrada para este contrato"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(ultima_conta)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def valor_total(self, request):
        total = ContaAPagar.objects.aggregate(total=Sum('valor_total'))['total']
        return Response({'valor_total': total})

    @action(detail=False, methods=['get'])
    def proximo_vencimento(self, request):
        conta = ContaAPagar.objects.order_by('data_pagamento').first()
        serializer = self.get_serializer(conta)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def contas_pendentes(self, request):
        contas = ContaAPagar.objects.filter(data_pagamento__isnull=True)
        serializer = self.get_serializer(contas, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        conta = serializer.save()

        # Atualizar status da projeção correspondente
        projecao = ProjecaoFaturamento.objects.filter(
            contrato=conta.contrato,
            data_vencimento=conta.data_pagamento
        ).first()

        if projecao:
            projecao.pago = True
            projecao.save()

    def perform_update(self, serializer):
        conta = serializer.save()

        # Atualiza o status de 'pago' na projeção correspondente
        projecao = ProjecaoFaturamento.objects.filter(
            contrato=conta.contrato,
            data_vencimento=conta.data_pagamento
        ).first()

        if projecao:
            projecao.pago = True
            projecao.save()

    @action(detail=False, methods=['get'], url_path='total-pagas-ano')
    def total_pagas_ano(self, request):
        ano_atual = date.today().year
        total_pagas = ContaAPagar.objects.filter(data_pagamento__year=ano_atual).aggregate(total=Sum('valor_total'))['total']
        return Response({'total_pagas_ano': total_pagas})

    @action(detail=False, methods=['get'])
    def total_faturamento_pagar(self, request):
        parcelas = ProjecaoFaturamento.objects.filter(contrato__tipo='fornecedor', pago=False)
        total = parcelas.aggregate(total=Sum('valor_parcela'))['total']
        return Response({'total_faturamento_pagar': total})

    def perform_destroy(self, instance):
        # Soft delete: define is_active como False
        instance.is_active = False
        instance.save()
        
        

class ContaAReceberViewSet(viewsets.ModelViewSet):
    serializer_class = ContaAReceberSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ContaAReceber.objects.all()
    def get_queryset(self):
        return (ContaAReceber.objects
                .filter(is_active=True)
                .select_related(
                    'contrato',
                    'forma_pagamento',
                    'conta_financeira',
                    'centro_custo',
                    'contrato__cliente'
                )
                .prefetch_related(
                    'contrato__contrato_projetos',
                    'contrato__contrato_projetos__projeto'
                )
                .order_by('-data_recebimento'))

    @action(detail=False, methods=['get'], url_path='ultima-conta')
    def get_last_conta_by_contrato(self, request):
        contrato_id = request.query_params.get('contrato_id')

        if not contrato_id:
            return Response({"error": "O ID do contrato é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

        # Busca a última conta a receber relacionada ao contrato, ordenada por data de recebimento (corrigido)
        ultima_conta = ContaAReceber.objects.filter(contrato_id=contrato_id).order_by('-data_recebimento').first()

        if not ultima_conta:
            return Response({"error": "Nenhuma conta encontrada para este contrato"}, status=status.HTTP_404_NOT_FOUND)

        # Serializa a conta encontrada
        serializer = self.get_serializer(ultima_conta)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def valor_total(self, request):
        total = ContaAReceber.objects.aggregate(total=Sum('valor_total'))['total']
        return Response({'valor_total': total})

    @action(detail=False, methods=['get'])
    def proximo_vencimento(self, request):
        conta = ContaAReceber.objects.order_by('data_recebimento').first()
        serializer = self.get_serializer(conta)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def contas_pendentes(self, request):
        contas = ContaAReceber.objects.filter(data_recebimento__isnull=True)  # Assumindo que 'status' é o campo usado para indicar pendência
        serializer = self.get_serializer(contas, many=True)
        return Response(serializer.data)


    def perform_create(self, serializer):
        conta = serializer.save()
        
        # Corrigir para data_recebimento
        projecao = ProjecaoFaturamento.objects.filter(
            contrato=conta.contrato,
            data_vencimento=conta.data_recebimento  # Alterado aqui
        ).first()
        
        if projecao:
            projecao.pago = True
            projecao.save()

    
    def perform_update(self, serializer):
        conta = serializer.save()
        
        # Atualiza o status de 'pago' na projeção correspondente
        projecao = ProjecaoFaturamento.objects.filter(
            contrato=conta.contrato,
            data_vencimento=conta.data_recebimento
        ).first()
        
        if projecao:
            projecao.pago = True
            projecao.save()

    @action(detail=False, methods=['get'], url_path='total-recebidas-ano')
    def total_recebidas_ano(self, request):
        ano_atual = date.today().year
        total_recebidas = ContaAReceber.objects.filter(data_recebimento__year=ano_atual).aggregate(total=Sum('valor_total'))['total']
        return Response({'total_recebidas_ano': total_recebidas})        
    
    @action(detail=False, methods=['get'])

    def total_faturamento_receber(self, request):

        parcelas = ProjecaoFaturamento.objects.filter(contrato__tipo='cliente', pago=False)

        total = parcelas.aggregate(total=Sum('valor_parcela'))['total']

        return Response({'total_faturamento_receber': total})

    def perform_destroy(self, instance):
        # Soft delete: define is_active como False
        instance.is_active = False
        instance.save()
    #def get_queryset(self):
        #ContaAReceber.objects.all().prefetch_related('contrato__contrato_projetos')
    
    
class ContaPagarAvulsoViewSet(viewsets.ModelViewSet):
    queryset = ContaPagarAvulso.objects.all()
    serializer_class = ContaPagarAvulsoSerializer

    @action(detail=True, methods=['post'], url_path='soft-delete')
    def soft_delete(self, request, pk=None):
        conta = self.get_object()
        conta.is_active = False
        conta.save()
        return Response({"status": "Conta desativada"}, status=status.HTTP_200_OK)

class ContaReceberAvulsoViewSet(viewsets.ModelViewSet):
    queryset = ContaReceberAvulso.objects.all()
    serializer_class = ContaReceberAvulsoSerializer

    @action(detail=True, methods=['delete'], url_path='soft-delete')
    def soft_delete(self, request, pk=None):
        conta = self.get_object()
        conta.delete()  # Aciona o soft-delete
        return Response({"status": "Conta a Pagar Avulso excluída com sucesso"}, status=status.HTTP_204_NO_CONTENT)

class ConsolidatedViewSet(viewsets.GenericViewSet):
    serializer_class = ConsolidatedContasSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = None  # Definido dinamicamente no get_queryset

    def get_queryset(self):
        tipo = self.request.query_params.get('tipo', 'receber')
        status = self.request.query_params.get('status')
        data_inicio = self.request.query_params.get('data_inicio')
        data_fim = self.request.query_params.get('data_fim')

        # Filtros para Contas a Pagar
        if tipo == 'pagar':
            queryset = ContaAPagar.objects.filter(is_active=True)
            date_field = 'data_pagamento'
            
            if status:
                queryset = queryset.filter(status=status)
                
            if data_inicio:
                queryset = queryset.filter(**{f'{date_field}__gte': data_inicio})
                
            if data_fim:
                queryset = queryset.filter(**{f'{date_field}__lte': data_fim})

        # Filtros para Contas a Receber
        else:
            queryset = ContaAReceber.objects.filter(is_active=True)
            date_field = 'data_recebimento'
            
            if status:
                queryset = queryset.filter(status=status)
                
            if data_inicio:
                queryset = queryset.filter(**{f'{date_field}__gte': data_inicio})
                
            if data_fim:
                queryset = queryset.filter(**{f'{date_field}__lte': data_fim})

        return queryset


    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            instance = ContaAPagar.objects.get(pk=pk, is_active=True)
        except ContaAPagar.DoesNotExist:
            instance = ContaAReceber.objects.get(pk=pk, is_active=True)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='atualizar-status')
    def atualizar_status(self, request, pk=None):
        try:
            conta = ContaAPagar.objects.get(pk=pk, is_active=True)
            serializer_class = StatusContaAPagarSerializer
        except ContaAPagar.DoesNotExist:
            conta = ContaAReceber.objects.get(pk=pk, is_active=True)
            serializer_class = StatusContaAReceberSerializer

        serializer = serializer_class(data=request.data)
        
        if serializer.is_valid():
            novo_status = serializer.validated_data['status']
            
            # Validação comum
            if conta.status == 'estornado' and novo_status != 'estornado':
                return Response(
                    {"error": "Não é possível alterar o status de uma conta estornada"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Atualização do status
            conta.status = novo_status
            conta.save()
            
            # Atualização da projeção
            data_field = 'data_pagamento' if isinstance(conta, ContaAPagar) else 'data_recebimento'
            projecao = ProjecaoFaturamento.objects.filter(
                contrato=conta.contrato,
                data_vencimento=getattr(conta, data_field)
            ).first()
            
            if projecao:
                projecao.pago = (novo_status in ['pago', 'recebido'])
                projecao.save()

            return Response({"status": f"Status atualizado para {novo_status}"})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='resumo')
    def resumo_consolidado(self, request):
        resumo = {
            'total_pagar': ContaAPagar.objects.filter(is_active=True).aggregate(total=Sum('valor_total'))['total'],
            'total_receber': ContaAReceber.objects.filter(is_active=True).aggregate(total=Sum('valor_total'))['total'],
            'proximos_vencimentos': self.get_queryset()[:5]
        }
        return Response(resumo)
    
class RelatorioProjecoesViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def gerar_relatorio(self, request):
        # Obter parâmetros da requisição
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')
        cliente = request.query_params.get('cliente')
        status = request.query_params.get('status')
        forma_pagamento = request.query_params.get('forma_pagamento')

        # Definir valores padrão se os parâmetros estiverem ausentes ou vazios
        if not data_inicio:
            data_inicio = date.today().replace(day=1).isoformat()
        if not data_fim:
            data_fim = (date.today() + relativedelta(months=12)).replace(day=1).isoformat()

        # Consulta base para projeções
        projecoes = ProjecaoFaturamento.objects.filter(
            data_vencimento__range=[data_inicio, data_fim]
        ).annotate(
            mes=TruncMonth('data_vencimento')
        )

        # Aplicar filtros adicionais se fornecidos e não vazios
        if cliente and cliente.strip():
            projecoes = projecoes.filter(contrato__cliente__nome__icontains=cliente)
        
        if status and status.strip():
            if status.lower() == 'pago':
                projecoes = projecoes.filter(pago=True)
            elif status.lower() == 'aberto':
                projecoes = projecoes.filter(pago=False)
        
        # Agregar dados
        projecoes_agregadas = projecoes.values('mes', 'contrato__tipo').annotate(
            valor_total=Sum('valor_parcela'),
            valor_pago=Sum(Case(
                When(pago=True, then=F('valor_parcela')),
                default=0,
                output_field=DecimalField()
            )),
            valor_aberto=Sum(Case(
                When(pago=False, then=F('valor_parcela')),
                default=0,
                output_field=DecimalField()
            ))
        ).order_by('mes', 'contrato__tipo')

        # Preparar dados para o relatório
        relatorio = []
        for projecao in projecoes_agregadas:
            relatorio.append({
                'mes': projecao['mes'].strftime('%Y-%m'),
                'tipo': 'Receber' if projecao['contrato__tipo'] == 'cliente' else 'Pagar',
                'valor_total': projecao['valor_total'],
                'valor_pago': projecao['valor_pago'],
                'valor_aberto': projecao['valor_aberto']
            })

        # Calcular totais
        total_receber = sum(p['valor_total'] for p in relatorio if p['tipo'] == 'Receber')
        total_pagar = sum(p['valor_total'] for p in relatorio if p['tipo'] == 'Pagar')
        total_recebido = sum(p['valor_pago'] for p in relatorio if p['tipo'] == 'Receber')
        total_pago = sum(p['valor_pago'] for p in relatorio if p['tipo'] == 'Pagar')

        resultado = {
            'relatorio': relatorio,
            'totais': {
                'total_receber': total_receber,
                'total_pagar': total_pagar,
                'total_recebido': total_recebido,
                'total_pago': total_pago
            }
        }

        return Response(resultado)

class RelatorioFinanceiroViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def gerar_relatorio(self, request):
        mes = request.query_params.get('mes')
        ano = request.query_params.get('ano')

        if not mes.isdigit() or not ano.isdigit():
            return Response({'error': 'Período inválido'}, status=status.HTTP_400_BAD_REQUEST)
        mes = int(mes)
        ano = int(ano)

        # Consultar receitas
        receitas = ContaAReceber.objects.filter(
            data_recebimento__month=mes,
            data_recebimento__year=ano
        ).values(
            contrato_nome=F('contrato__numero'),
            projeto_nome=F('projetos__projeto__nome')
        ).annotate(
            receita=Coalesce(Sum('projetos__valor'), Value(0), output_field=DecimalField()),
            despesa=Value(0, output_field=DecimalField())
        )

        # Consultar receitas avulsas
        receitas_avulsas = ContaReceberAvulso.objects.filter(
            data_recebimento__month=mes,
            data_recebimento__year=ano
        ).values(
            contrato_nome=Value('Avulso', output_field=CharField()),
            projeto_nome=Case(
                When(projetos__isnull=False, then=F('projetos__nome')),
                default=Value('-', output_field=CharField())
            )
        ).annotate(
            receita=F('valor'),
            despesa=Value(0, output_field=DecimalField())
        )

        # Consultar despesas
        despesas = ContaAPagar.objects.filter(
            data_pagamento__month=mes,
            data_pagamento__year=ano
        ).values(
            contrato_nome=F('contrato__numero'),
            projeto_nome=Case(
                When(projetos__isnull=False, then=F('projetos__nome')),
                default=Value('Custo Fixo'),
                output_field=CharField()
            )
        ).annotate(
            despesa=Coalesce(Sum('projeto_contas_a_pagar__valor'), F('valor_total'), output_field=DecimalField()),
            receita=Value(0, output_field=DecimalField())
        )

        # Consultar despesas avulsas
        despesas_avulsas = ContaPagarAvulso.objects.filter(
            data_pagamento__month=mes,
            data_pagamento__year=ano
        ).values(
            contrato_nome=Value('Avulso', output_field=CharField()),
            projeto_nome=Case(
                When(projetos__isnull=False, then=F('projetos__nome')),
                default=Value('-', output_field=CharField())
            )
        ).annotate(
            despesa=F('valor'),
            receita=Value(0, output_field=DecimalField())
        )

        # Converter para DataFrames
        df_receitas = pd.DataFrame(list(receitas))
        df_despesas = pd.DataFrame(list(despesas))
        df_receitas_avulsas = pd.DataFrame(list(receitas_avulsas))
        df_despesas_avulsas = pd.DataFrame(list(despesas_avulsas))

        # Combinar DataFrames
        df = pd.concat([df_receitas, df_despesas, df_receitas_avulsas, df_despesas_avulsas], ignore_index=True)

        # Calcular resultados
        df['resultado'] = df['receita'] - df['despesa']

        # Calcular totais
        total_receita = df['receita'].sum()
        total_despesa = df['despesa'].sum()
        total_geral = total_receita - total_despesa

        # Adicionar linha de total geral
        total_row = pd.DataFrame([{
            'contrato_nome': 'Total',
            'projeto_nome': '',
            'receita': total_receita,
            'despesa': total_despesa,
            'resultado': total_geral
        }])
        df = pd.concat([df, total_row], ignore_index=True)

        # Renomear colunas
        df = df.rename(columns={
            'contrato_nome': 'Contrato',
            'projeto_nome': 'Projeto',
            'receita': 'Receita',
            'despesa': 'Despesa',
            'resultado': 'Resultado'
        })

        # Serializar os dados para JSON
        data = df.to_dict('records')
        return Response(data)

class TotalContasAPagarView(APIView):
    def get(self, request, *args, **kwargs):
        total = ContaAPagar.objects.aggregate(total_sum=Sum('valor_total'))['total_sum'] or 0
        return Response({"total_contas_a_pagar": total}, status=status.HTTP_200_OK)

class ProximosVencimentosView(APIView):
    def get(self, request, *args, **kwargs):
        today = datetime.now().date()
        next_week = today + timedelta(days=7)
        proximos_vencimentos = ContaAPagar.objects.filter(data_primeiro_vencimento__range=[today, next_week])
        return Response({
            "proximos_vencimentos": proximos_vencimentos.values('id', 'descricao', 'data_primeiro_vencimento', 'valor_total')
        }, status=status.HTTP_200_OK)
    
class ProximosVencimentosViewSet(viewsets.ViewSet):
    """
    ViewSet para listar os próximos vencimentos de contas a pagar.
    """
    serializer_class = ContaAPagarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Obtenha a data de hoje
        hoje = date.today()

        # Defina o número de dias para considerar como "próximos vencimentos"
        dias_a_frente = 30  # Você pode ajustar esse valor conforme necessário

        # Calcule a data limite para os próximos vencimentos
        data_limite = hoje + timedelta(days=dias_a_frente)

        # Filtre as contas a pagar com vencimento entre hoje e a data limite
        queryset = ContaAPagar.objects.filter(
            data_pagamento__gte=hoje,  # Alterado de data_vencimento
            data_pagamento__lte=data_limite
        )
        print("Queryset de próximos vencimentos:", queryset)
        return queryset
    
class ContasPendentesViewSet(viewsets.ViewSet):
    """
    ViewSet para listar as contas a pagar pendentes (não pagas).
    """
    serializer_class = ContaAPagarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtre as contas a pagar que ainda não foram pagas (data_pagamento é nula)
        queryset = ContaAPagar.objects.filter(data_pagamento__isnull=True)
        print("Queryset de contas pendentes:", queryset)
        return queryset

class ContasListView(APIView):
    def get(self, request, *args, **kwargs):
        contas_pagar = ContaAPagar.objects.all()
        contas_receber = ContaAReceber.objects.all()
        pagar_serializer = ContaAPagarSerializer(contas_pagar, many=True)
        receber_serializer = ContaAReceberSerializer(contas_receber, many=True)
        return Response({
            "contas_pagar": pagar_serializer.data,
            "contas_receber": receber_serializer.data
        })