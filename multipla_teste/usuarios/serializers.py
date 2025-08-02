<<<<<<< HEAD
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
=======
# app/usuarios/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import PerfilUsuario
from empresas.models import Empresa
from .models import PerfilUsuario, UsuarioEmpresaRole
from empresas.serializers import EmpresaSerializer


class UsuarioEmpresaRoleSerializer(serializers.ModelSerializer):
    empresa = serializers.PrimaryKeyRelatedField(queryset=Empresa.objects.all())
    role = serializers.ChoiceField(choices=UsuarioEmpresaRole.ROLE_CHOICES)

    class Meta:
        model = UsuarioEmpresaRole
        fields = ['empresa', 'role']

class PerfilUsuarioCreateSerializer(serializers.ModelSerializer):
    # Antes, era PrimaryKeyRelatedField(many=True). Agora, usamos o serializer do through:
    empresas_acessiveis = UsuarioEmpresaRoleSerializer(many=True, required=False)

    class Meta:
        model = PerfilUsuario
        fields = ['email', 'empresa_padrao', 'empresas_acessiveis']

    def create(self, validated_data):
        # Extraímos a lista de papéis
        empresas_roles_data = validated_data.pop('empresas_acessiveis', [])
        perfil = PerfilUsuario.objects.create(**validated_data)
        # Criamos cada instância de UsuarioEmpresaRole
        for er in empresas_roles_data:
            UsuarioEmpresaRole.objects.create(
                perfil_usuario=perfil,
                empresa=er['empresa'],
                role=er['role']
            )
        return perfil

    def update(self, instance, validated_data):
        empresas_roles_data = validated_data.pop('empresas_acessiveis', None)
        instance = super().update(instance, validated_data)
        if empresas_roles_data is not None:
            UsuarioEmpresaRole.objects.filter(perfil_usuario=instance).delete()
            for er in empresas_roles_data:
                UsuarioEmpresaRole.objects.create(
                    perfil_usuario=instance,
                    empresa=er['empresa'],
                    role=er['role']
                )
        return instance

class PerfilUsuarioDetailSerializer(serializers.ModelSerializer):
    EmpresaRole = serializers.SerializerMethodField()

    class Meta:
        model = PerfilUsuario
        fields = ['email', 'empresa_padrao', 'EmpresaRole']

    def get_EmpresaRole(self, obj):
        queryset = UsuarioEmpresaRole.objects.filter(perfil_usuario=obj)
        return [
            {
                "empresa": EmpresaSerializer(ur.empresa).data,
                "role": ur.role
            }
            for ur in queryset
        ]

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    perfilusuario = PerfilUsuarioCreateSerializer()
    is_staff = serializers.BooleanField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'perfilusuario', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Já existe usuário com este e-mail.")
        return value

    def create(self, validated_data):
        is_staff = validated_data.pop('is_staff', False)
        email = validated_data.pop('email')
        perfil_data = validated_data.pop('perfilusuario')
        password = validated_data.pop('password')

        user = User(username=validated_data['username'], email=email)
        user.is_staff = is_staff
        user.set_password(password)
        user.save()

        perfil = PerfilUsuario.objects.create(
            user=user,
            email=email,
            empresa_padrao=perfil_data['empresa_padrao']
        )
        empresas_roles_data = perfil_data.get('empresas_acessiveis', [])
        for er in empresas_roles_data:
            UsuarioEmpresaRole.objects.create(
                perfil_usuario=perfil,
                empresa=er['empresa'],
                role=er['role']
            )
        return user

    def update(self, instance, validated_data):
        perfil_data = validated_data.pop('perfilusuario', None)
        is_staff = validated_data.pop('is_staff', None)
        new_email = validated_data.pop('email', None)

        if is_staff is not None:
            instance.is_staff = is_staff
        if new_email:
            if User.objects.filter(email=new_email).exclude(pk=instance.pk).exists():
                raise serializers.ValidationError("E-mail já em uso.")
            instance.email = new_email
        instance = super().update(instance, validated_data)

        if perfil_data:
            perfil = instance.perfilusuario
            if new_email:
                perfil.email = new_email
            padrao = perfil_data.get('empresa_padrao')
            if padrao:
                perfil.empresa_padrao = padrao

            empresas_roles_data = perfil_data.get('empresas_acessiveis', None)
            if empresas_roles_data is not None:
                UsuarioEmpresaRole.objects.filter(perfil_usuario=perfil).delete()
                for er in empresas_roles_data:
                    UsuarioEmpresaRole.objects.create(
                        perfil_usuario=perfil,
                        empresa=er['empresa'],
                        role=er['role']
                    )
            perfil.save()

        instance.save()
        return instance


class PerfilUsuarioNestedSerializer(serializers.ModelSerializer):
    # Declarar o campo M2M como gravável
    empresas_acessiveis = serializers.PrimaryKeyRelatedField(
        queryset=Empresa.objects.all(),
        many=True,
        required=False
    )
    # FK padrão também como gravável
    empresa_padrao = serializers.PrimaryKeyRelatedField(
        queryset=Empresa.objects.all()
    )

    class Meta:
        model = PerfilUsuario
        fields = [
            'email',
            'empresa_padrao',
            'empresas_acessiveis',
        ]

    def update(self, instance, validated_data):
        # Extrai o M2M se vier
        empresas = validated_data.pop('empresas_acessiveis', None)
        # Extrai a FK padrão se vier (opcional)
        padrao = validated_data.pop('empresa_padrao', None)

        # Atualiza campos simples (email, etc)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)

        # Se mudou a empresa_padrao, atualiza também
        if padrao is not None:
            instance.empresa_padrao = padrao

        instance.save()

        # Agora, só se veio o M2M, faz o set
        if empresas is not None:
            instance.empresas_acessiveis.set(empresas)

        return instance


class UserDetailSerializer(serializers.ModelSerializer):
    perfilusuario = PerfilUsuarioDetailSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id','username','perfilusuario']

    def update(self, instance, validated_data):
        perfil_data = validated_data.pop('perfilusuario', None)
        instance = super().update(instance, validated_data)
        if perfil_data:
            perfil_serializer = self.fields['perfilusuario']
            perfil_serializer.update(instance.perfilusuario, perfil_data)
        return instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Ao gerar o access+refresh, também injeta:
      - empresa_padrao: { id, nome, cnpj, ... }
      - empresas_acessiveis: [ { id, nome, cnpj, ... }, ... ]
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Aqui poderia adicionar claims customizadas se desejasse
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # A partir de agora, 'self.user' está disponível
        try:
            perfil = self.user.perfilusuario
        except PerfilUsuario.DoesNotExist:
            # Caso o usuário não tenha perfil (o que não deveria acontecer),
            # deixamos a resposta apenas com tokens
            return data

        # Serializamos empresa_padrao e empresas_acessiveis
        empresa_padrao = EmpresaSerializer(perfil.empresa_padrao).data
        empresas_acessiveis = EmpresaSerializer(
            perfil.empresas_acessiveis.all(), many=True
        ).data

        # Coleciona dados extras
        data.update({
            'user_id': self.user.id,
            'empresa_padrao': empresa_padrao,
            'empresas_acessiveis': empresas_acessiveis
        })
        return data
>>>>>>> e62255e (Atualizações no projeto)
