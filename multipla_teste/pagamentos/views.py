from rest_framework import viewsets, permissions, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import FormaPagamento
from .serializers import FormaPagamentoSerializer

class FormaPagamentoViewSet(viewsets.ModelViewSet):
    queryset = FormaPagamento.objects.filter(is_active=True)
    serializer_class = FormaPagamentoSerializer
    
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'], url_path='soft-delete')
    def soft_delete(self, request):
        ids = request.data.get('ids', [])  # Recebe a lista de IDs
        FormaPagamento.objects.filter(id__in=ids).update(is_active=False)  # Marca como inativo
        return Response({"message": "Formas de pagamento excluídas com sucesso."}, status=status.HTTP_200_OK)


class FormaPagamentoSelectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FormaPagamento.objects.filter(is_active=True)
    serializer_class = FormaPagamentoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return FormaPagamentoSelectSerializer
        return FormaPagamentoSerializer


class FormaPagamentoSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormaPagamento
        fields = ['id', 'descricao']
