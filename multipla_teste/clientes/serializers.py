from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    cpf_cnpj = serializers.CharField(required=False, allow_blank=True)
    cep = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_null=True)
    class Meta:
        model = Cliente
        fields = '__all__'

class ClienteSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nome'] 

class ClientListSerializer(serializers.ModelSerializer):
    cpf_cnpj = serializers.CharField(required=False, allow_blank=True)
    cep = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_null=True)
    class Meta:
        model = Cliente
        fields = '__all__'