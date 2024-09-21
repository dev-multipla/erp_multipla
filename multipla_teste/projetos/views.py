from rest_framework import viewsets, permissions, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import Projeto
from .serializers import ProjetoSerializer, ProjetoListSerializer

class ProjetoViewSet(viewsets.ModelViewSet):
    queryset = Projeto.objects.filter(is_active=True)
    serializer_class = ProjetoSerializer
    
    @action(detail=False, methods=['post'], url_path='soft-delete')
    def soft_delete(self, request):
        ids = request.data.get('ids', [])  # Recebe a lista de IDs
        Projeto.objects.filter(id__in=ids).update(is_active=False)  # Marca como inativo
        return Response({"message": "Projetos excluídos com sucesso."}, status=status.HTTP_200_OK)

class ProjetoSelectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Projeto.objects.filter(is_active=True)
    serializer_class = ProjetoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjetoSelectSerializer
        return ProjetoSerializer


class ProjetoSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projeto
        fields = ['id', 'nome']
    
class ProjetoListViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Projeto.objects.filter(is_active=True)
    serializer_class = ProjetoListSerializer
    permission_classes = [permissions.IsAuthenticated]