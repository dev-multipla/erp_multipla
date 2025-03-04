from django.contrib.auth.models import User
from rest_framework import serializers
from .models import PerfilUsuario
from empresas.serializers import EmpresaSerializer  # Certifique-se de ter o serializer EmpresaSerializer no seu app 'empresas'

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = ['email', 'empresa']

class UserSerializer(serializers.ModelSerializer):
    perfilusuario = PerfilUsuarioSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'perfilusuario']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        print("Dados validados no serializer:", validated_data)  # Adicione este print
        perfil_data = validated_data.pop('perfilusuario')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        PerfilUsuario.objects.create(user=user, **perfil_data)
        return user