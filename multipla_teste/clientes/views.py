# clientes/views.py
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import Cliente
from .serializers import ClienteSerializer, ClienteSelectSerializer, ClientListSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.filter(is_active=True)  # Filtra apenas clientes ativos
    serializer_class = ClienteSerializer
    
    @action(detail=False, methods=['post'], url_path='soft-delete')
    def soft_delete(self, request):
        ids = request.data.get('ids', [])  # Recebe a lista de IDs
        Cliente.objects.filter(id__in=ids).update(is_active=False)  # Marca como inativo
        return Response({"message": "Clientes excluídos com sucesso."}, status=status.HTTP_200_OK)

class ClienteSelectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cliente.objects.filter(is_active=True)  # Filtra apenas clientes ativos
    serializer_class = ClienteSelectSerializer

class ClientListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cliente.objects.filter(is_active=True)  # Filtra apenas clientes ativos
    serializer_class = ClientListSerializer
    permission_classes = [permissions.IsAuthenticated]
