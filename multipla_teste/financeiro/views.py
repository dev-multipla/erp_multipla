<<<<<<< HEAD
from rest_framework import viewsets
from .models import ContaFinanceira, CentroCusto
from .serializers import ContaFinanceiraSerializer, CentroCustoSerializer

class ContaFinanceiraViewSet(viewsets.ModelViewSet):
    serializer_class = ContaFinanceiraSerializer
    def get_queryset(self):
        return ContaFinanceira.objects.filter(is_active=True)

class CentroCustoViewSet(viewsets.ModelViewSet):
    serializer_class = CentroCustoSerializer
    def get_queryset(self):
        return CentroCusto.objects.filter(is_active=True)
=======
# financeiro/views.py

from rest_framework import viewsets, permissions
from .models import ContaFinanceira, CentroCusto
from .serializers import ContaFinanceiraSerializer, CentroCustoSerializer
from multipla_teste.core.mixins import CompanyScopedMixin

class ContaFinanceiraViewSet(CompanyScopedMixin, viewsets.ModelViewSet):
    queryset = ContaFinanceira.objects.all()
    serializer_class = ContaFinanceiraSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()  # já filtra por empresa_id
        return qs.filter(is_active=True).order_by('descricao')


class CentroCustoViewSet(CompanyScopedMixin, viewsets.ModelViewSet):
    queryset = CentroCusto.objects.all()
    serializer_class = CentroCustoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()  # já filtra por empresa_id
        return qs.filter(is_active=True).order_by('descricao')
>>>>>>> e62255e (Atualizações no projeto)
