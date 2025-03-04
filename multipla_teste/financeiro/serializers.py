from rest_framework import serializers
from .models import ContaFinanceira, CentroCusto

class ContaFinanceiraSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContaFinanceira
        fields = '__all__'

    def validate_mascara_conta(self, value):
        # Se estamos editando, ignoramos a validação de unicidade para a própria instância
        if self.instance:
            if ContaFinanceira.objects.filter(mascara_conta=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("A máscara da conta financeira já existe.")
        else:
            if ContaFinanceira.objects.filter(mascara_conta=value).exists():
                raise serializers.ValidationError("A máscara da conta financeira já existe.")
        return value


class CentroCustoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CentroCusto
        fields = ['id', 'descricao']
