from rest_framework import serializers
from django.core.validators import DecimalValidator
from .models import ContaAPagar, ProjetoContaAPagar, ContaAReceber, ProjetoContaAReceber, ContaPagarAvulso, ContaReceberAvulso
from projetos.models import Projeto
from pagamentos.models import FormaPagamento
from contratos.models import Contrato


class ProjetoContaAPagarSerializer(serializers.ModelSerializer):
    projeto = serializers.PrimaryKeyRelatedField(queryset=Projeto.objects.all()) 

    class Meta:
        model = ProjetoContaAPagar
        fields = ['projeto', 'valor']

class ContaAPagarSerializer(serializers.ModelSerializer):
    contrato = serializers.PrimaryKeyRelatedField(queryset=Contrato.objects.all())
    forma_pagamento = serializers.PrimaryKeyRelatedField(queryset=FormaPagamento.objects.all())
    projetos = ProjetoContaAPagarSerializer(many=True)
    avulso = serializers.BooleanField(read_only=True, default=False)

    class Meta:
        model = ContaAPagar
        fields = ['contrato', 'forma_pagamento', 'data_pagamento', 'competencia', 'valor_total', 'projetos', 'avulso']  # Inclua 'avulso' aqui
    
    def validate(self, data):
        # Verificar se o contrato já está pago no ProjecaoFaturamento
        contrato = data.get('contrato')
        vencimentos_pagos = contrato.projecoes_faturamento.filter(pago=True)
        if vencimentos_pagos.exists():
            raise serializers.ValidationError("Este contrato já foi pago anteriormente.")
        return data

    def create(self, validated_data):
        projetos_data = validated_data.pop('projetos')
        conta_a_pagar = ContaAPagar.objects.create(**validated_data)
        for projeto_data in projetos_data:
            ProjetoContaAPagar.objects.create(conta_a_pagar=conta_a_pagar, **projeto_data)
        return conta_a_pagar
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Serializar os projetos usando o related_name correto
        representation['projetos'] = [
            {'id': projeto.projeto.id, 'nome': projeto.projeto.nome} 
            for projeto in instance.projeto_contas_a_pagar.all()
        ]
        return representation

class ContaPagarAvulsoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContaPagarAvulso
        fields = '__all__'
        extra_kwargs = {
            'valor': {'validators': [DecimalValidator(max_digits=10, decimal_places=2)]},
        }

class ProjetoContaAReceberSerializer(serializers.ModelSerializer):
    projeto = serializers.PrimaryKeyRelatedField(queryset=Projeto.objects.all()) 

    class Meta:
        model = ProjetoContaAPagar
        fields = ['projeto', 'valor']

class ContaAReceberSerializer(serializers.ModelSerializer):
    contrato = serializers.PrimaryKeyRelatedField(queryset=Contrato.objects.filter(tipo='cliente'))  # Filtra contratos de clientes
    forma_pagamento = serializers.PrimaryKeyRelatedField(queryset=FormaPagamento.objects.all())
    projetos = ProjetoContaAReceberSerializer(many=True)
    avulso = serializers.BooleanField(read_only=True, default=False)

    class Meta:
        model = ContaAReceber
        fields = ['contrato', 'forma_pagamento', 'data_recebimento', 'competencia', 'valor_total', 'projetos', 'avulso']  # Inclua 'avulso' aqui
    
    def validate(self, data):
        # Verificar se o contrato já recebeu em ProjecaoFaturamento
        contrato = data.get('contrato')
        vencimentos_recebidos = contrato.projecoes_faturamento.filter(pago=True)
        if vencimentos_recebidos.exists():
            raise serializers.ValidationError("Este contrato já teve recebimento registrado anteriormente.")
        return data

    def create(self, validated_data):
        projetos_data = validated_data.pop('projetos')
        conta_a_receber = ContaAReceber.objects.create(**validated_data)
        for projeto_data in projetos_data:
            ProjetoContaAReceber.objects.create(conta_a_receber=conta_a_receber, **projeto_data)
        return conta_a_receber

class ContaReceberAvulsoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContaReceberAvulso
        fields = '__all__'
        extra_kwargs = {
            'valor': {'validators': [DecimalValidator(max_digits=10, decimal_places=2)]},
        }
    
class RelatorioFinanceiroSerializer(serializers.Serializer):
    contrato_nome = serializers.CharField()
    projeto_nome = serializers.CharField()
    receita = serializers.DecimalField(max_digits=10, decimal_places=2)
    despesa = serializers.DecimalField(max_digits=10, decimal_places=2)
    resultado = serializers.DecimalField(max_digits=10, decimal_places=2)