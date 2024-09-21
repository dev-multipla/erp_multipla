from rest_framework import viewsets, status, permissions
from .models import ContaAPagar, ContaAReceber
from .serializers import ContaAPagarSerializer, ContaAReceberSerializer
from rest_framework.views import APIView
from django.db.models import Sum 
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, F, Case, When, Value, DecimalField, CharField, Subquery, OuterRef 
from django.db.models.functions import Coalesce
from .models import ContaAPagar, ContaAReceber, ProjetoContaAPagar, ProjetoContaAReceber,ContaPagarAvulso,ContaReceberAvulso
from .serializers import ContaAPagarSerializer, ContaAReceberSerializer, ContaPagarAvulsoSerializer, ContaReceberAvulsoSerializer
import pandas as pd
from datetime import date, timedelta, datetime




class ContaAPagarViewSet(viewsets.ModelViewSet):
    queryset = ContaAPagar.objects.all().prefetch_related('projetos')  # Use prefetch_related para carregar os projetos
    serializer_class = ContaAPagarSerializer
    @action(detail=False, methods=['get'], url_path='ultima-conta', url_name='ultima-conta')
    def get_last_conta_by_contrato(self, request):
        contrato_id = request.query_params.get('contrato_id')

        if not contrato_id:
            return Response({"error": "O ID do contrato é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

        # Busca a última conta a pagar relacionada ao contrato, ordenada por data de pagamento
        ultima_conta = ContaAPagar.objects.filter(contrato_id=contrato_id).order_by('-data_pagamento').first()

        if not ultima_conta:
            return Response({"error": "Nenhuma conta encontrada para este contrato"}, status=status.HTTP_404_NOT_FOUND)

        # Serializa a conta encontrada
        serializer = self.get_serializer(ultima_conta)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def valor_total(self, request):
        total = ContaAPagar.objects.aggregate(total=Sum('valor'))['total']
        return Response({'valor_total': total})

    @action(detail=False, methods=['get'])
    def proximo_vencimento(self, request):
        conta = ContaAPagar.objects.order_by('data_vencimento').first()
        serializer = self.get_serializer(conta)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def contas_pendentes(self, request):
        contas = ContaAPagar.objects.filter(data_pagamento__isnull=True)  # Assumindo que 'status' é o campo usado para indicar pendência
        serializer = self.get_serializer(contas, many=True)
        return Response(serializer.data)


class ContaAReceberViewSet(viewsets.ModelViewSet):
    queryset = ContaAReceber.objects.all()
    serializer_class = ContaAReceberSerializer
    @action(detail=False, methods=['get'], url_path='ultima-conta', url_name='ultima-conta')  # Adicione o decorator
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


class ContaPagarAvulsoViewSet(viewsets.ModelViewSet):
    queryset = ContaPagarAvulso.objects.all()
    serializer_class = ContaPagarAvulsoSerializer

class ContaReceberAvulsoViewSet(viewsets.ModelViewSet):
    queryset = ContaReceberAvulso.objects.all()
    serializer_class = ContaReceberAvulsoSerializer

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
            data_vencimento__gte=hoje,
            data_vencimento__lte=data_limite
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