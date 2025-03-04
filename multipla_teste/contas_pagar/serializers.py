#contas_pagar/serializers.py
from rest_framework import serializers
from django.core.validators import DecimalValidator
from .models import ContaAPagar, ContaAReceber, ContaPagarAvulso, ContaReceberAvulso
from projetos.models import Projeto
from pagamentos.models import FormaPagamento
from contratos.models import Contrato
from financeiro.models import ContaFinanceira, CentroCusto

'''class ProjetoContaAPagarSerializer(serializers.ModelSerializer):
    projeto = serializers.PrimaryKeyRelatedField(queryset=Projeto.objects.all()) 

    class Meta:
        model = ProjetoContaAPagar
        fields = ['projeto', 'valor']'''

class ContaAPagarSerializer(serializers.ModelSerializer):
    # Campos calculados para front-end
    projetos = serializers.SerializerMethodField(read_only=True)
    cliente_fornecedor = serializers.SerializerMethodField(read_only=True)
    tipo_contrato = serializers.CharField(source='contrato.tipo', read_only=True)

    class Meta:
        model = ContaAPagar
        fields = [
            'id', 'contrato', 'forma_pagamento', 'data_pagamento', 'competencia',
            'valor_total', 'conta_financeira', 'centro_custo', 'projetos',
            'cliente_fornecedor', 'tipo_contrato', 'status'
        ]

    def get_projetos(self, obj):
        return [{
            'id': cp.projeto.id,
            'nome': cp.projeto.nome,
            'valor': cp.valor_projeto
        } for cp in obj.contrato.contrato_projetos.all()]

    def get_cliente_fornecedor(self, obj):
        if obj.contrato.tipo == 'cliente':
            return {'id': obj.contrato.cliente.id, 'nome': obj.contrato.cliente.nome}
        return {'id': obj.contrato.fornecedor.id, 'nome': obj.contrato.fornecedor.nome}

class ContaPagarAvulsoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContaPagarAvulso
        fields = '__all__'
        extra_kwargs = {
            'valor': {'validators': [DecimalValidator(max_digits=10, decimal_places=2)]},
        }

'''class ProjetoContaAReceberSerializer(serializers.ModelSerializer):
    projeto = serializers.PrimaryKeyRelatedField(queryset=Projeto.objects.all()) 

    class Meta:
        model = ProjetoContaAPagar
        fields = ['projeto', 'valor']'''

class ContaAReceberSerializer(serializers.ModelSerializer):
    projetos = serializers.SerializerMethodField()
    cliente = serializers.SerializerMethodField()
    tipo_contrato = serializers.CharField(source='contrato.tipo', read_only=True)

    class Meta:
        model = ContaAReceber
        fields = [
            'id', 'contrato', 'forma_pagamento', 'data_recebimento', 
            'competencia', 'valor_total', 'conta_financeira', 
            'centro_custo', 'projetos', 'cliente', 'tipo_contrato'
        ]

    def get_projetos(self, obj):
        try:
            return [{
                'id': cp.projeto.id,
                'nome': cp.projeto.nome,
                'valor': cp.valor_projeto
            } for cp in obj.contrato.contrato_projetos.all()]
        except Exception as e:
            print(f"Erro ao buscar projetos: {e}")
            return []

    def get_cliente(self, obj):
        try:
            if obj.contrato and obj.contrato.cliente:
                return {
                    'id': obj.contrato.cliente.id,
                    'nome': obj.contrato.cliente.nome
                }
            return None
        except Exception as e:
            print(f"Erro ao buscar cliente: {e}")
            return None

    
class ContaReceberAvulsoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContaReceberAvulso
        fields = '__all__'
        extra_kwargs = {
            'valor': {'validators': [DecimalValidator(max_digits=10, decimal_places=2)]},
        }

class StatusContaAPagarSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=ContaAPagar.STATUS_CHOICES)

class StatusContaAReceberSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=ContaAReceber.STATUS_CHOICES)

class ConsolidatedContasSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    contrato = serializers.SerializerMethodField()
    tipo = serializers.SerializerMethodField()
    descricao = serializers.SerializerMethodField()
    data_vencimento = serializers.SerializerMethodField()
    valor_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    status = serializers.CharField()
    detalhes = serializers.SerializerMethodField()

    def get_contrato(self, obj):
        # Serializa o objeto para extrair o campo "contrato" do serializer interno
        if isinstance(obj, ContaAPagar):
            data = ContaAPagarSerializer(obj, context=self.context).data
        else:
            data = ContaAReceberSerializer(obj, context=self.context).data
        return data.get('contrato')

    def get_tipo(self, obj):
        # Determina o tipo baseado na classe do objeto
        return 'pagar' if isinstance(obj, ContaAPagar) else 'receber'

    def get_descricao(self, obj):
        if isinstance(obj, ContaAPagar):
            return f"Conta a Pagar - {obj.contrato.fornecedor.nome}"
        return f"Conta a Receber - {obj.contrato.cliente.nome}"
    
    def get_data_vencimento(self, obj):
        # Retorna a data correta baseada no tipo de conta
        if isinstance(obj, ContaAPagar):
            return obj.data_pagamento
        return obj.data_recebimento

    def get_detalhes(self, obj):
        from .serializers import ContaAPagarSerializer, ContaAReceberSerializer  # Import local para evitar circular
        serializer = (
            ContaAPagarSerializer(obj, context=self.context)
            if isinstance(obj, ContaAPagar)
            else ContaAReceberSerializer(obj, context=self.context)
        )
        return serializer.data
    
class RelatorioFinanceiroSerializer(serializers.Serializer):
    contrato_nome = serializers.CharField()
    projeto_nome = serializers.CharField()
    receita = serializers.DecimalField(max_digits=10, decimal_places=2)
    despesa = serializers.DecimalField(max_digits=10, decimal_places=2)
    resultado = serializers.DecimalField(max_digits=10, decimal_places=2)

class ProjecaoMensalSerializer(serializers.Serializer):
    mes = serializers.CharField()
    tipo = serializers.CharField()
    valor_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    valor_pago = serializers.DecimalField(max_digits=10, decimal_places=2)
    valor_aberto = serializers.DecimalField(max_digits=10, decimal_places=2)

class TotaisSerializer(serializers.Serializer):
    total_receber = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_pagar = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_recebido = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_pago = serializers.DecimalField(max_digits=10, decimal_places=2)

class RelatorioProjecoesSerializer(serializers.Serializer):
    relatorio = ProjecaoMensalSerializer(many=True)
    totais = TotaisSerializer()

    def to_representation(self, instance):
        # Este método permite customizar a representação final dos dados
        data = super().to_representation(instance)
        
        # Aqui você pode adicionar lógica adicional se necessário
        # Por exemplo, adicionar campos calculados ou reformatar dados

        return data