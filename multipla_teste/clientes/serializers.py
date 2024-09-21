from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class ClienteSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nome'] 

class ClientListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cliente
        fields = '__all__'