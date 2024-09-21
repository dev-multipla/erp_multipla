from rest_framework import viewsets, permissions, serializers, status
from .models import Contrato, ProjecaoFaturamento
from .serializers import ContratoSerializer, ContratoListSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import ProjecaoFaturamentoSerializer
from dateutil.relativedelta import relativedelta
from datetime import datetime 

class ContratoViewSet(viewsets.ModelViewSet):
    queryset = Contrato.objects.filter(is_deleted=False)
    serializer_class = ContratoSerializer

    @action(detail=False, methods=['get'])
    def fornecedor(self, request):
        contratos = Contrato.objects.filter(tipo='fornecedor')
        serializer = ContratoSerializer(contratos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def cliente(self, request):
        contratos = Contrato.objects.filter(tipo='cliente')
        serializer = ContratoSerializer(contratos, many=True)
        return Response(serializer.data)
    
    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    @action(detail=True, methods=['delete'])
    def soft_delete(self, request, pk=None):
        try:
            contrato = Contrato.objects.get(pk=pk)  # Busca sem considerar o filtro is_deleted
            contrato.is_deleted = True
            contrato.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Contrato.DoesNotExist:
            return Response({"detail": "Contrato not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def gerar_projecoes(self, request):
        data = request.data
        valor_parcela = data.get('valor_parcela')
        periodicidade = data.get('periodicidade')
        data_primeiro_vencimento = data.get('data_primeiro_vencimento')
        data_termino = data.get('data_termino')

        if not valor_parcela or not periodicidade or not data_primeiro_vencimento or not data_termino:
            return Response({'error': 'Dados incompletos para gerar projeções.'}, status=status.HTTP_400_BAD_REQUEST)

        # Converta as strings de data para objetos datetime
        try:
            data_primeiro_vencimento = datetime.strptime(data_primeiro_vencimento, '%Y-%m-%d')
            data_termino = datetime.strptime(data_termino, '%Y-%m-%d')
        except ValueError:
            return Response({'error': 'Formato de data inválido. Use o formato YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        projecoes = []
        periodicidade_map = {
            'mensal': 1,
            'trimestral': 3,
            'semestral': 6,
            'anual': 12,
        }
        meses_a_adicionar = periodicidade_map.get(periodicidade)

        if not meses_a_adicionar:
            return Response({'error': 'Periodicidade inválida.'}, status=status.HTTP_400_BAD_REQUEST)

        data_vencimento = data_primeiro_vencimento

        # Gerar as datas das parcelas até o término
        while data_vencimento <= data_termino:
            projecoes.append({
                'data_vencimento': data_vencimento.strftime('%Y-%m-%d'),
                'valor_parcela': valor_parcela
            })
            data_vencimento += relativedelta(months=meses_a_adicionar)

        # Retornar as projeções sem salvar ainda
        return Response(projecoes, status=status.HTTP_200_OK)


    @action(detail=False, methods=['post'])
    def salvar_contrato(self, request):
        data = request.data
        contrato_data = data.get('contrato')  # Dados do contrato
        projecoes_data = data.get('projecoes')  # Projeções de faturamento geradas anteriormente

        contrato_serializer = ContratoSerializer(data=contrato_data)
        if contrato_serializer.is_valid():
            # Salvar o contrato
            contrato = contrato_serializer.save()

            # Salvar cada projeção de faturamento associada ao contrato
            for projecao_data in projecoes_data:
                ProjecaoFaturamento.objects.create(
                    contrato=contrato,
                    data_vencimento=projecao_data['data_vencimento'],
                    valor_parcela=projecao_data['valor_parcela']
                )

            return Response({'message': 'Contrato e projeções salvos com sucesso.'}, status=status.HTTP_201_CREATED)
        else:
            return Response(contrato_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Endpoint para listar projeções de vencimentos a receber (clientes)
    @action(detail=False, methods=['get'])
    def projecoes_receber(self, request):
        contratos_cliente = Contrato.objects.filter(tipo='cliente', is_deleted=False)
        projecoes = ProjecaoFaturamento.objects.filter(contrato__in=contratos_cliente)
        serializer = ProjecaoFaturamentoSerializer(projecoes, many=True)
        return Response(serializer.data)

    # Endpoint para listar projeções de vencimentos a pagar (fornecedores)
    @action(detail=False, methods=['get'])
    def projecoes_pagar(self, request):
        contratos_fornecedor = Contrato.objects.filter(tipo='fornecedor', is_deleted=False)
        projecoes = ProjecaoFaturamento.objects.filter(contrato__in=contratos_fornecedor)
        serializer = ProjecaoFaturamentoSerializer(projecoes, many=True)
        return Response(serializer.data)

class ContratoSelectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Contrato.objects.filter(is_deleted=False)
    serializer_class = ContratoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return ContratoSelectSerializer
        return ContratoSerializer


class ContratoSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contrato
        fields = ['id', 'numero']

class ContratoListViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para listar todos os contratos com detalhes."""

    queryset = Contrato.objects.filter(is_deleted=False)
    serializer_class = ContratoListSerializer
    permission_classes = [permissions.IsAuthenticated]

class ContratosFornecedorView(APIView):
    def get(self, request):
        contratos = Contrato.objects.filter(tipo='fornecedor', is_deleted=False)
        serializer = ContratoSerializer(contratos, many=True)
        return Response(serializer.data)
    
class ContratosClienteView(APIView):
    def get(self, request):
        contratos = Contrato.objects.filter(tipo='cliente', is_deleted=False)
        serializer = ContratoSerializer(contratos, many=True)
        return Response(serializer.data)

