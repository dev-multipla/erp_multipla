from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from .models import Fornecedor
from .serializers import FornecedorSerializer, FornecedorSelectSerializer, FornecedorListSerializer

class FornecedorViewSet(viewsets.ModelViewSet):
    queryset = Fornecedor.objects.filter(is_active=True)
    serializer_class = FornecedorSerializer
    
    @action(detail=False, methods=['post'], url_path='soft-delete')
    def soft_delete(self, request):
        ids = request.data.get('ids', [])  # Recebe a lista de IDs
        Fornecedor.objects.filter(id__in=ids).update(is_active=False)  # Marca como inativo
        return Response({"message": "Clientes excluídos com sucesso."}, status=status.HTTP_200_OK)

class FornecedorSelectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fornecedor.objects.filter(is_active=True)
    serializer_class = FornecedorSelectSerializer

class FornecedorListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Fornecedor.objects.filter(is_active=True)
    serializer_class = FornecedorListSerializer
