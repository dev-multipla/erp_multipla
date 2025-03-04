from rest_framework import serializers
from .models import Contrato, ProjecaoFaturamento, ContratoProjeto
from decimal import Decimal
from clientes.models import Cliente
from fornecedores.models import Fornecedor
from projetos.models import Projeto
from django.core.validators import RegexValidator
from django.db import transaction

class ProjecaoFaturamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjecaoFaturamento
        fields = ['data_vencimento', 'valor_parcela', 'pago']

class ContratosProjetoSerializer(serializers.ModelSerializer):
    projeto = serializers.PrimaryKeyRelatedField(queryset=Projeto.objects.all())
    projeto_nome = serializers.CharField(source='projeto.nome', read_only=True)
    
    class Meta:
        model = ContratoProjeto
        fields = ['projeto', 'projeto_nome', 'valor_projeto']
        extra_kwargs = {
            'projeto': {'write_only': True}  # Opcional: dependendo da necessidade da API
        }

class ContratoCreateSerializer(serializers.ModelSerializer):
    projetos = ContratosProjetoSerializer(source='contrato_projetos', many=True)
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), required=False)
    fornecedor = serializers.PrimaryKeyRelatedField(queryset=Fornecedor.objects.all(), required=False)
    #numero = serializers.CharField(
    #    max_length=50,
    #    validators=[RegexValidator(r'^CTR-\d{4}/\d{2}$', message='Formato inválido. Use CTR-AAAA/MM')]
    #)
    numero = serializers.CharField(max_length=50)
    confirmado = serializers.BooleanField(write_only=True, default=False)
    valor_parcela = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2,
        required=True  # Adicione esta linha
    )
    
    class Meta:
        model = Contrato
        fields = [
            'numero', 'descricao', 'data_inicio', 'data_termino', 'valor_total',
            'status', 'tipo', 'cliente', 'fornecedor', 'projetos', 'valor_parcela',
            'periodicidade_vencimento', 'data_primeiro_vencimento', 'confirmado'
        ]
        extra_kwargs = {
            'valor_parcela': {'write_only': True},
            'periodicidade_vencimento': {'write_only': True},
            'data_primeiro_vencimento': {'write_only': True},
        }

    def validate(self, data):
        valor_total = data['valor_total']
        projetos_data = data.get('contrato_projetos', [])
        confirmado = data.get('confirmado', False)
        
        if not projetos_data:
            raise serializers.ValidationError("Pelo menos um projeto deve ser vinculado.")
        
        total_projetos = sum(Decimal(p['valor_projeto']) for p in projetos_data)
        if abs(valor_total - total_projetos) > Decimal('0.01'):
            raise serializers.ValidationError("A soma dos projetos deve ser igual ao valor total do contrato.")
        
        tipo = data.get('tipo')
        if tipo == 'cliente' and not data.get('cliente'):
            raise serializers.ValidationError("Cliente é obrigatório para contratos do tipo cliente.")
        if tipo == 'fornecedor' and not data.get('fornecedor'):
            raise serializers.ValidationError("Fornecedor é obrigatório para contratos do tipo fornecedor.")
        
        # Nova validação de parcelas vs valor total
        if 'valor_parcela' in data:
            contrato_tmp = Contrato(
                valor_parcela=data['valor_parcela'],
                periodicidade_vencimento=data['periodicidade_vencimento'],
                data_primeiro_vencimento=data['data_primeiro_vencimento'],
                data_inicio=data['data_inicio'],
                data_termino=data['data_termino']
            )
            
            try:
                projecoes = contrato_tmp.gerar_projecoes(save=False)
            except ValueError as e:
                raise serializers.ValidationError(str(e))
            
            total_parcelas = sum(Decimal(p['valor_parcela']) for p in projecoes)
            if abs(total_parcelas - valor_total) > Decimal('0.01'):
                raise serializers.ValidationError(
                    f"Soma das parcelas ({total_parcelas}) não confere com valor total do contrato ({valor_total})"
                )
        
        return data

    def create(self, validated_data):
        confirmado = validated_data.pop('confirmado', False)
        projetos_data = validated_data.pop('contrato_projetos', [])
        
        if not confirmado:
            # Serialização manual para evitar objetos Django
            contrato_data = {
                key: value.id if hasattr(value, 'id') else value
                for key, value in validated_data.items()
            }
            
            # Converter objetos Projeto para IDs
            projetos_serializados = []
            for projeto in projetos_data:
                projetos_serializados.append({
                    'projeto': projeto['projeto'].id,
                    'valor_projeto': projeto['valor_projeto']
                })
            
            # Simular contrato para cálculo
            contrato = Contrato(**validated_data)
            try:
                projecoes = contrato.gerar_projecoes(save=False)
            except Exception as e:
                raise serializers.ValidationError(str(e))
            
            return {
                'projecoes': projecoes,
                'contrato': contrato_data,
                'projetos': projetos_serializados
            }
        else:
            with transaction.atomic():
                contrato = Contrato.objects.create(**validated_data)
                for projeto_data in projetos_data:
                    ContratoProjeto.objects.create(
                        contrato=contrato,
                        projeto=projeto_data['projeto'],
                        valor_projeto=projeto_data['valor_projeto']
                    )
                contrato.gerar_projecoes(save=True)
            return contrato

class ContratoSerializer(serializers.ModelSerializer):
    projetos = ContratosProjetoSerializer(many=True, source='contrato_projetos', read_only=True)
    projecoes = ProjecaoFaturamentoSerializer(many=True, source='projecoes_faturamento', read_only=True)

    class Meta:
        model = Contrato
        fields = '__all__'
    
class ContratoListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contrato
        fields = '__all__'  
