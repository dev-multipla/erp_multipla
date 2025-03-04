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