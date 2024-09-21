from rest_framework import viewsets, permissions
from .models import Empresa, Filial
from .serializers import EmpresaSerializer, FilialSerializer, EmpresaListSerializer, FilialListSerializer

class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [permissions.IsAuthenticated]

class FilialViewSet(viewsets.ModelViewSet):
    queryset = Filial.objects.all()
    serializer_class = FilialSerializer
    permission_classes = [permissions.IsAuthenticated]

class EmpresaListViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para listar empresas."""

    queryset = Empresa.objects.all()
    serializer_class = EmpresaListSerializer
    permission_classes = [permissions.IsAuthenticated]


class FilialListViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para listar filiais."""

    queryset = Filial.objects.all()
    serializer_class = FilialListSerializer
    permission_classes = [permissions.IsAuthenticated]