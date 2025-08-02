<<<<<<< HEAD
=======
#contratos/views
>>>>>>> e62255e (Atualizações no projeto)
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from dateutil.relativedelta import relativedelta
from .models import Contrato, ProjecaoFaturamento
from .serializers import ContratoCreateSerializer, ContratoSerializer, ContratoListSerializer, ProjecaoFaturamentoSerializer
<<<<<<< HEAD


class ContratoViewSet(viewsets.ModelViewSet):
    queryset = Contrato.objects.filter(is_deleted=False)
    serializer_class = ContratoSerializer

    def get_serializer_class(self):
        if self.action in ['create', 'preview']:
            return ContratoCreateSerializer
        return super().get_serializer_class()

=======
from rest_framework.parsers import MultiPartParser, FormParser
from multipla_teste.core.mixins import CompanyScopedMixin
import logging

logger = logging.getLogger(__name__)

class ContratoViewSet(CompanyScopedMixin, viewsets.ModelViewSet):
    # necessário para o router, mas não será usado em runtime
    queryset = Contrato.objects.none()  
    serializer_class = ContratoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        # para criação, atualização e preview, usar o CreateSerializer
        if self.action in ['create', 'update', 'partial_update', 'preview']:
            return ContratoCreateSerializer
        # para list/retrieve, usar o Serializer normal
        return ContratoSerializer

    def get_queryset(self):
        # 1) pega o company_id do header
        company_id = self.get_current_company_id()

        # 2) monta o alias do tenant e força o ORM a usá-lo
        alias = f"tenant_{company_id}"
        qs = (
            Contrato.objects
            .using(alias)
            .filter(is_deleted=False, empresa_id=company_id)
            .order_by('numero')
        )

        # 3) **debug**: vai aparecer no console do Django
        logger.debug(
            "ContratoViewSet.get_queryset() → alias=%s  company_id=%s  count=%s  sql=%s",
            alias, company_id, qs.count(), qs.query
        )

        return qs
    
>>>>>>> e62255e (Atualizações no projeto)
    @action(detail=False, methods=['post'], url_path='preview')
    def preview(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
<<<<<<< HEAD
        
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

=======
        preview_data = serializer.create(serializer.validated_data)
        return Response(preview_data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.validated_data['confirmado'] = serializer.validated_data.get('confirmado', False)
        super().perform_create(serializer)

    @action(detail=True, methods=['patch'], url_path='upload', parser_classes=[MultiPartParser, FormParser])
    def upload_arquivo(self, request, pk=None):
        # agora self.get_object() vai usar nosso get_queryset() debugado
        try:
            contrato = self.get_object()
        except Exception:
            return Response({'error': 'Contrato não encontrado'}, status=404)

        arquivo = request.FILES.get('arquivo')
        # … seu código de validação e save do arquivo …
        contrato.arquivo = arquivo
        contrato.save()
        return Response({
            'id': contrato.id,
            'numero': contrato.numero,
            'arquivo': request.build_absolute_uri(contrato.arquivo.url)
        })

    @action(detail=True, methods=['patch'], url_path='arquivo', parser_classes=[MultiPartParser, FormParser])
    def atualizar_arquivo(self, request, pk=None):
        
        contrato = self.get_object()
        
        # Se enviou um arquivo, vamos atualizar
        if 'arquivo' in request.FILES:
            arquivo = request.FILES['arquivo']
            # (Opcional) Você pode validar o arquivo novamente aqui, se necessário
            contrato.arquivo = arquivo
            contrato.save()
            serializer = ContratoSerializer(contrato)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Se o usuário pediu a remoção do arquivo
        remover_flag = request.data.get('remover', 'false').lower() == 'true'
        if remover_flag:
            # Se você usa um campo FileField, para remover o arquivo do armazenamento:
            if contrato.arquivo:
                contrato.arquivo.delete(save=False)  # remove o arquivo físico se necessário
            contrato.arquivo = None  # define o campo como None
            contrato.save()
            serializer = ContratoSerializer(contrato)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Caso nenhum dado válido tenha sido enviado
        return Response({'error': 'Nenhum arquivo enviado ou ação definida'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], url_path='soft_delete')
    def soft_delete(self, request, pk=None):
        contrato = self.get_object()
        contrato.is_deleted = True
        contrato.save()
        return Response(
            {"status": "Contrato desativado com sucesso."},
            status=status.HTTP_200_OK
        )

class ContratoSelectViewSet(CompanyScopedMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Contrato.objects.filter(is_deleted=False)
    serializer_class = ContratoListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False).order_by('numero')

class ProjecaoFaturamentoViewSet(CompanyScopedMixin, viewsets.ModelViewSet):
    serializer_class = ProjecaoFaturamentoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Primeiro pega o queryset filtrado pelo tenant (CompanyScopedMixin),
        # depois remove projeções deletadas (se houver is_deleted em Contrato) ou filtra por contrato ativo:
        return super().get_queryset().select_related('contrato').filter(
            contrato__is_deleted=False
        )

>>>>>>> e62255e (Atualizações no projeto)
    @action(detail=True, methods=['patch'])
    def marcar_como_pago(self, request, pk=None):
        projecao = self.get_object()
        projecao.pago = True
        projecao.save()
        return Response({'status': 'marcado como pago'})

<<<<<<< HEAD
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
=======
class ContratoListViewSet(CompanyScopedMixin, viewsets.ReadOnlyModelViewSet):
    # queryset base, sem filtros de is_deleted ou ordenação
    queryset = Contrato.objects.all()
    serializer_class = ContratoListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # aqui super() chama o CompanyScopedMixin.get_queryset
        # que já filtra empresa_id via header
        return super().get_queryset() \
                    .filter(is_deleted=False) \
                    .order_by('numero')

class ContratosFornecedorView(CompanyScopedMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        # Usamos 'super().get_queryset()' para garantir que já haja filtro por empresa
        qs = self.get_queryset().filter(tipo='fornecedor', is_deleted=False)
        serializer = ContratoSerializer(qs, many=True)
        return Response(serializer.data)

class ContratosClienteView(CompanyScopedMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = self.get_queryset().filter(tipo='cliente', is_deleted=False)
        serializer = ContratoSerializer(qs, many=True)
        return Response(serializer.data)

class ContratosFuncionarioView(CompanyScopedMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = self.get_queryset().filter(tipo='funcionario', is_deleted=False)
        serializer = ContratoSerializer(qs, many=True)
>>>>>>> e62255e (Atualizações no projeto)
        return Response(serializer.data)