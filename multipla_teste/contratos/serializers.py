<<<<<<< HEAD
=======
#contratos/serializers.py
>>>>>>> e62255e (Atualizações no projeto)
from rest_framework import serializers
from .models import Contrato, ProjecaoFaturamento, ContratoProjeto
from decimal import Decimal
from clientes.models import Cliente
from fornecedores.models import Fornecedor
<<<<<<< HEAD
from projetos.models import Projeto
from django.core.validators import RegexValidator
from django.db import transaction
=======
from funcionarios.models import Funcionario
from projetos.models import Projeto
from django.core.validators import RegexValidator
from django.db import transaction
from rest_framework.validators import UniqueValidator
import os
>>>>>>> e62255e (Atualizações no projeto)

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
<<<<<<< HEAD
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
=======
            'projeto': {'write_only': True}  
        }

class ContratoCreateSerializer(serializers.ModelSerializer):
    empresa = serializers.PrimaryKeyRelatedField(read_only=True)
    projetos = ContratosProjetoSerializer(source='contrato_projetos', many=True)
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), required=False)
    fornecedor = serializers.PrimaryKeyRelatedField(queryset=Fornecedor.objects.all(), required=False)
    funcionario = serializers.PrimaryKeyRelatedField(queryset=Funcionario.objects.all(), required=False)
    numero = serializers.CharField(
        max_length=50,
        validators=[
            UniqueValidator(
                queryset=Contrato.objects.all(),
                message="Já existe um contrato com este número."
            )
        ]
    )
    horizonte_projecao = serializers.IntegerField(
        write_only=True,
        required=False,
        allow_null=True,
        help_text="Número de meses para projeção em contratos sem data de término"
    )
    arquivo = serializers.FileField(required=False)
>>>>>>> e62255e (Atualizações no projeto)
    confirmado = serializers.BooleanField(write_only=True, default=False)
    valor_parcela = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2,
<<<<<<< HEAD
        required=True  # Adicione esta linha
=======
        required=True
>>>>>>> e62255e (Atualizações no projeto)
    )
    
    class Meta:
        model = Contrato
        fields = [
<<<<<<< HEAD
            'numero', 'descricao', 'data_inicio', 'data_termino', 'valor_total',
            'status', 'tipo', 'cliente', 'fornecedor', 'projetos', 'valor_parcela',
            'periodicidade_vencimento', 'data_primeiro_vencimento', 'confirmado'
        ]
=======
            'id', 'numero', 'descricao', 'data_inicio', 'data_termino', 'valor_total',
            'status', 'tipo', 'cliente', 'fornecedor', 'funcionario', 'projetos', 'empresa', 'valor_parcela',
            'periodicidade_vencimento', 'data_primeiro_vencimento', 'horizonte_projecao', 'confirmado',
            'arquivo'
        ]
        read_only_fields = ('id',)
>>>>>>> e62255e (Atualizações no projeto)
        extra_kwargs = {
            'valor_parcela': {'write_only': True},
            'periodicidade_vencimento': {'write_only': True},
            'data_primeiro_vencimento': {'write_only': True},
<<<<<<< HEAD
=======
            'data_termino': {'required': False, 'allow_null': True}
>>>>>>> e62255e (Atualizações no projeto)
        }

    def validate(self, data):
        valor_total = data['valor_total']
        projetos_data = data.get('contrato_projetos', [])
        confirmado = data.get('confirmado', False)
<<<<<<< HEAD
        
        if not projetos_data:
            raise serializers.ValidationError("Pelo menos um projeto deve ser vinculado.")
        
        total_projetos = sum(Decimal(p['valor_projeto']) for p in projetos_data)
        if abs(valor_total - total_projetos) > Decimal('0.01'):
            raise serializers.ValidationError("A soma dos projetos deve ser igual ao valor total do contrato.")
        
=======

        if not projetos_data:
            raise serializers.ValidationError("Pelo menos um projeto deve ser vinculado.")

        total_projetos = sum(Decimal(p['valor_projeto']) for p in projetos_data)
        if abs(valor_total - total_projetos) > Decimal('0.01'):
            raise serializers.ValidationError("A soma dos projetos deve ser igual ao valor total do contrato.")

>>>>>>> e62255e (Atualizações no projeto)
        tipo = data.get('tipo')
        if tipo == 'cliente' and not data.get('cliente'):
            raise serializers.ValidationError("Cliente é obrigatório para contratos do tipo cliente.")
        if tipo == 'fornecedor' and not data.get('fornecedor'):
            raise serializers.ValidationError("Fornecedor é obrigatório para contratos do tipo fornecedor.")
<<<<<<< HEAD
        
=======
        if tipo == 'funcionario' and not data.get('funcionario'):
            raise serializers.ValidationError("Funcionario é obrigatório para contratos do tipo funcionario.")

>>>>>>> e62255e (Atualizações no projeto)
        # Nova validação de parcelas vs valor total
        if 'valor_parcela' in data:
            contrato_tmp = Contrato(
                valor_parcela=data['valor_parcela'],
                periodicidade_vencimento=data['periodicidade_vencimento'],
                data_primeiro_vencimento=data['data_primeiro_vencimento'],
                data_inicio=data['data_inicio'],
<<<<<<< HEAD
                data_termino=data['data_termino']
            )
            
            try:
                projecoes = contrato_tmp.gerar_projecoes(save=False)
            except ValueError as e:
                raise serializers.ValidationError(str(e))
            
=======
                data_termino=data.get('data_termino')  # Pode ser None
            )
            horizonte = data.get('horizonte_projecao')
            try:
                projecoes = contrato_tmp.gerar_projecoes(save=False, horizonte_projecao=horizonte)
            except ValueError as e:
                raise serializers.ValidationError(str(e))

>>>>>>> e62255e (Atualizações no projeto)
            total_parcelas = sum(Decimal(p['valor_parcela']) for p in projecoes)
            if abs(total_parcelas - valor_total) > Decimal('0.01'):
                raise serializers.ValidationError(
                    f"Soma das parcelas ({total_parcelas}) não confere com valor total do contrato ({valor_total})"
                )
<<<<<<< HEAD
        
        return data

    def create(self, validated_data):
        confirmado = validated_data.pop('confirmado', False)
        projetos_data = validated_data.pop('contrato_projetos', [])
        
        if not confirmado:
            # Serialização manual para evitar objetos Django
=======

        # Se data_termino for nula, horizonte_projecao deve ser informado
        if not data.get('data_termino') and data.get('horizonte_projecao') is None:
            raise serializers.ValidationError("Para contratos sem data de término, informe o horizonte de projeção (em meses).")

        return data

    def validate_arquivo(self, value):
        if value:
            # Verifica a extensão do arquivo
            ext = os.path.splitext(value.name)[1]
            valid_extensions = ['.pdf', '.doc', '.docx']
            if not ext.lower() in valid_extensions:
                raise serializers.ValidationError('Formato de arquivo não suportado. Use PDF ou Word.')
            
            # Verifica o tamanho do arquivo (limite de 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError('Tamanho máximo de arquivo é 5MB.')
        return value

    def create(self, validated_data):
        # Converter data_termino para None se estiver vazia
        if 'data_termino' in validated_data and validated_data['data_termino'] in ['', None]:
            validated_data['data_termino'] = None
        
        horizonte = validated_data.pop('horizonte_projecao', None)
        confirmado = validated_data.pop('confirmado', False)
        projetos_data = validated_data.pop('contrato_projetos', [])
        if not confirmado:
>>>>>>> e62255e (Atualizações no projeto)
            contrato_data = {
                key: value.id if hasattr(value, 'id') else value
                for key, value in validated_data.items()
            }
<<<<<<< HEAD
            
            # Converter objetos Projeto para IDs
=======
            if horizonte is not None:
                contrato_data['horizonte_projecao'] = horizonte

>>>>>>> e62255e (Atualizações no projeto)
            projetos_serializados = []
            for projeto in projetos_data:
                projetos_serializados.append({
                    'projeto': projeto['projeto'].id,
                    'valor_projeto': projeto['valor_projeto']
                })
<<<<<<< HEAD
            
            # Simular contrato para cálculo
            contrato = Contrato(**validated_data)
            try:
                projecoes = contrato.gerar_projecoes(save=False)
            except Exception as e:
                raise serializers.ValidationError(str(e))
            
=======
            contrato = Contrato(**validated_data)
            try:
                projecoes = contrato.gerar_projecoes(save=False, horizonte_projecao=horizonte)
            except Exception as e:
                raise serializers.ValidationError(str(e))
>>>>>>> e62255e (Atualizações no projeto)
            return {
                'projecoes': projecoes,
                'contrato': contrato_data,
                'projetos': projetos_serializados
            }
        else:
            with transaction.atomic():
<<<<<<< HEAD
                contrato = Contrato.objects.create(**validated_data)
=======
                if horizonte is not None:
                    validated_data['horizonte_projecao'] = horizonte

                contrato = Contrato.objects.create(**validated_data)

>>>>>>> e62255e (Atualizações no projeto)
                for projeto_data in projetos_data:
                    ContratoProjeto.objects.create(
                        contrato=contrato,
                        projeto=projeto_data['projeto'],
                        valor_projeto=projeto_data['valor_projeto']
                    )
<<<<<<< HEAD
                contrato.gerar_projecoes(save=True)
            return contrato

class ContratoSerializer(serializers.ModelSerializer):
=======
                
                contrato.gerar_projecoes(save=True, horizonte_projecao=horizonte)
            return contrato


    def update(self, instance, validated_data):
        projetos_data = validated_data.pop('contrato_projetos', [])
        
        # Atualize o contrato
        instance = super().update(instance, validated_data)
        
        # Atualize projetos
        instance.contrato_projetos.all().delete()
        for projeto_data in projetos_data:
            ContratoProjeto.objects.create(
                contrato=instance,
                **projeto_data
            )
            
        return instance    

class ContratoSerializer(serializers.ModelSerializer):
    empresa = serializers.PrimaryKeyRelatedField(read_only=True)
>>>>>>> e62255e (Atualizações no projeto)
    projetos = ContratosProjetoSerializer(many=True, source='contrato_projetos', read_only=True)
    projecoes = ProjecaoFaturamentoSerializer(many=True, source='projecoes_faturamento', read_only=True)

    class Meta:
        model = Contrato
        fields = '__all__'
    
class ContratoListSerializer(serializers.ModelSerializer):
<<<<<<< HEAD

    class Meta:
        model = Contrato
        fields = '__all__'  
=======
    
    class Meta:
        model = Contrato
        fields = '__all__'  
>>>>>>> e62255e (Atualizações no projeto)
