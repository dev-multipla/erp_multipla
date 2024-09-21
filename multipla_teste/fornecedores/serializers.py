from rest_framework import serializers
from .models import Fornecedor

class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = '__all__'  # Inclui todos os campos do modelo

class FornecedorSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = ['id', 'nome']  

class FornecedorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = '__all__'