<<<<<<< HEAD
=======
# pagamentos/serializers.py

>>>>>>> e62255e (Atualizações no projeto)
from rest_framework import serializers
from .models import FormaPagamento

class FormaPagamentoSerializer(serializers.ModelSerializer):
<<<<<<< HEAD
=======
    # Tornamos empresa read-only, pois o valor virá do tenant (header X-Company-ID)
    empresa = serializers.PrimaryKeyRelatedField(read_only=True)

>>>>>>> e62255e (Atualizações no projeto)
    class Meta:
        model = FormaPagamento
        fields = '__all__'

<<<<<<< HEAD
class FormaPagamentoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormaPagamento
        fields = '__all__'
=======

class FormaPagamentoListSerializer(serializers.ModelSerializer):
    # Também exibe empresa apenas em modo read-only
    empresa = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = FormaPagamento
        fields = '__all__'


class FormaPagamentoSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormaPagamento
        fields = ['id', 'descricao']
>>>>>>> e62255e (Atualizações no projeto)
