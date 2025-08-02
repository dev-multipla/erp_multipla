from rest_framework import serializers
from .models import ContaFinanceira, CentroCusto
<<<<<<< HEAD

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
=======
from multipla_teste.tenant_router import get_current_tenant

class ContaFinanceiraSerializer(serializers.ModelSerializer):
    empresa = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ContaFinanceira
        fields = '__all__'
        read_only_fields = ('id', 'empresa', 'is_active')

    def validate_mascara_conta(self, value):
          # Restrinja a busca ao tenant atual
        tenant = get_current_tenant()
        qs = ContaFinanceira.objects.all()
        if tenant:
            qs = qs.filter(empresa_id=tenant.id)

        # Se for update, exclua a própria instância
        if self.instance:
            qs = qs.exclude(id=self.instance.id)

        if qs.filter(mascara_conta=value).exists():
            raise serializers.ValidationError(
                "A máscara da conta financeira já existe nessa empresa."
            )
        return value

class CentroCustoSerializer(serializers.ModelSerializer):
    empresa = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CentroCusto
        # Exibe id, descrição, máscara e empresa (para saber a que empresa pertence)
        fields = ['id', 'descricao', 'mascara_centro_custo', 'empresa']
        read_only_fields = ('id', 'mascara_centro_custo', 'empresa', 'is_active')
>>>>>>> e62255e (Atualizações no projeto)
