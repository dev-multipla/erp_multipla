from rest_framework import serializers
from .models import Fornecedor

class FornecedorSerializer(serializers.ModelSerializer):
    cpf_cnpj = serializers.CharField(required=False, allow_blank=True, allow_null=True) 
    cep = serializers.CharField(required=False, allow_blank=True, allow_null=True) 
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    class Meta:
        model = Fornecedor
        fields = '__all__'  # Inclui todos os campos do modelo
    
    def validate_email(self, value):
        if value == '':
            return None
        return value

class FornecedorSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = ['id', 'nome']  

class FornecedorListSerializer(serializers.ModelSerializer):
    cpf_cnpj = serializers.CharField(required=False, allow_blank=True)
    cep = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_null=True)
    class Meta:
        model = Fornecedor
        fields = '__all__'