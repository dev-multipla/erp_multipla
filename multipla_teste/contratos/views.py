from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from dateutil.relativedelta import relativedelta
from .models import Contrato, ProjecaoFaturamento
from .serializers import ContratoCreateSerializer, ContratoSerializer, ContratoListSerializer, ProjecaoFaturamentoSerializer


class ContratoViewSet(viewsets.ModelViewSet):
    queryset = Contrato.objects.filter(is_deleted=False)
    serializer_class = ContratoSerializer

    def get_serializer_class(self):
        if self.action in ['create', 'preview']:
            return ContratoCreateSerializer
        return super().get_serializer_class()

    @action(detail=False, methods=['post'], url_path='preview')
    def preview(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        preview_data = serializer.create(serializer.validated_data)
        return Response(preview_data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if not serializer.validated_data.get('confirmado', False):
            return Response(
                {'error': 'Use o endpoint /preview para simulação'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        with transaction.atomic():
            contrato = serializer.save()
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ContratoSelectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Contrato.objects.filter(is_deleted=False)
    serializer_class = ContratoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return ContratoListSerializer if self.action == 'list' else ContratoSerializer

class ProjecaoFaturamentoViewSet(viewsets.ModelViewSet):
    queryset = ProjecaoFaturamento.objects.all()
    serializer_class = ProjecaoFaturamentoSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def marcar_como_pago(self, request, pk=None):
        projecao = self.get_object()
        projecao.pago = True
        projecao.save()
        return Response({'status': 'marcado como pago'})

class ContratoListViewSet(viewsets.ReadOnlyModelViewSet):
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