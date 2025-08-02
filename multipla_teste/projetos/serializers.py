<<<<<<< HEAD
=======
#projetos/serializers.py
>>>>>>> e62255e (Atualizações no projeto)
from rest_framework import serializers
from .models import Projeto

class ProjetoSerializer(serializers.ModelSerializer):
<<<<<<< HEAD
=======
    prazo_indeterminado = serializers.ReadOnlyField()
    empresa = serializers.PrimaryKeyRelatedField(read_only=True)

>>>>>>> e62255e (Atualizações no projeto)
    class Meta:
        model = Projeto
        fields = '__all__'

class ProjetoListSerializer(serializers.ModelSerializer):
<<<<<<< HEAD
    class Meta:
        model = Projeto
        fields = '__all__'
=======
    empresa = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Projeto
        fields = '__all__'
        
class ProjetoSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projeto
        fields = ['id', 'nome']
>>>>>>> e62255e (Atualizações no projeto)
