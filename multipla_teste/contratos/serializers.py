from rest_framework import serializers
from .models import Contrato, ProjecaoFaturamento

class ProjecaoFaturamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjecaoFaturamento
        fields = ['data_vencimento', 'valor_parcela']

class ContratoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contrato
        fields = '__all__'

class ContratoListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contrato
        fields = '__all__'  
