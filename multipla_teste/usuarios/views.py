<<<<<<< HEAD
# app/usuarios/views.py
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import render

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Permite cadastro sem autenticação

    def post(self, request, *args, **kwargs):
        print("Dados da requisição na view:", request.data)  # Adicione este print
        return super().post(request, *args, **kwargs)

class LogoutView(APIView):
=======
#usuarios/views.py
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from .models import PerfilUsuario
from .serializers import UserSerializer, UserDetailSerializer
from empresas.models import Empresa
from empresas.serializers import EmpresaSerializer
from django.db.models import Q

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [AllowAny] 

    def get_serializer_class(self):
        # Se estivermos criando, use o serializer que seta password
        if self.action == 'create':
            return UserSerializer
        # Para todos os outros (list, retrieve, update, partial_update, destroy)
        return UserDetailSerializer

    def partial_update(self, request, *args, **kwargs):
        user = self.get_object()
        perfil_data = request.data.get('perfilusuario', {})

        # Se veio lista de empresas, atualiza o M2M diretamente
        empresas = perfil_data.get('empresas_acessiveis', None)
        if empresas is not None:
            try:
                perfil = user.perfilusuario
                # Valida se as empresas existem
                empresas_validas = Empresa.objects.filter(id__in=empresas)
                if len(empresas_validas) != len(empresas):
                    return Response(
                        {"detail": "Uma ou mais empresas não foram encontradas."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                perfil.empresas_acessiveis.set(empresas)
                perfil.save()
            except ObjectDoesNotExist:
                return Response(
                    {"detail": "Usuário sem perfil cadastrado."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def toggle_empresa_acesso(self, request, pk=None):
        user = self.get_object()
        empresa_id = request.data.get('empresa_id')
        papel_padrao = request.data.get('default_role', 'leitura')  # ex.: ou "financeiro"

        if not empresa_id:
            return Response({"detail": "empresa_id é obrigatório"}, status=400)

        try:
            empresa = Empresa.objects.get(id=empresa_id)
            perfil = user.perfilusuario

            existing = UsuarioEmpresaRole.objects.filter(
                perfil_usuario=perfil,
                empresa=empresa
            ).first()

            if existing:
                existing.delete()
                action_performed = "removido"
            else:
                # Se quiser atribuir um role padrão ao adicionar, pegue de request
                role = request.data.get('role', papel_padrao)
                UsuarioEmpresaRole.objects.create(
                    perfil_usuario=perfil,
                    empresa=empresa,
                    role=role
                )
                action_performed = "adicionado"

            return Response({
                "detail": f"Acesso à empresa {empresa.nome} {action_performed}",
                "empresa": {"id": empresa.id, "nome": empresa.nome},
                "action": action_performed
            })
        except Empresa.DoesNotExist:
            return Response({"detail": "Empresa não encontrada"}, status=404)
        except PerfilUsuario.DoesNotExist:
            return Response({"detail": "Usuário sem perfil cadastrado"}, status=400)


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class MeView(RetrieveAPIView):
    """
    GET /api/me/ → dados do usuário logado + empresas acessíveis
    """
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        
        # Adiciona informações extras sobre tenant atual
        try:
            perfil = request.user.perfilusuario
            current_tenant_id = request.headers.get('X-Company-ID')
            
            extra_info = {
                "tenant_atual": None,
                "empresas_totais": perfil.empresas_acessiveis.count() + 1,  # +1 da padrão
            }
            
            if current_tenant_id and current_tenant_id.lower() != 'all':
                try:
                    tenant_id = int(current_tenant_id)
                    empresa = Empresa.objects.get(id=tenant_id)
                    extra_info["tenant_atual"] = {
                        "id": empresa.id,
                        "nome": empresa.nome
                    }
                except (ValueError, Empresa.DoesNotExist):
                    pass
            else:
                # Usa empresa padrão
                extra_info["tenant_atual"] = {
                    "id": perfil.empresa_padrao.id,
                    "nome": perfil.empresa_padrao.nome
                }
            
            response.data.update(extra_info)
            
        except PerfilUsuario.DoesNotExist:
            pass
            
        return response

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

>>>>>>> e62255e (Atualizações no projeto)
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
<<<<<<< HEAD
            return Response(status=status.HTTP_205_RESET_CONTENT)  # Código de status mais apropriado para logout
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# Adicione a view para renderizar a página de login com a mensagem de expiração
def login_view(request):
    message = request.GET.get('message', '')
    return render(request, 'login.html', {'message': message})
=======
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class MinhasEmpresasViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/minhas-empresas/ → lista todas as empresas acessíveis
    """
    serializer_class = EmpresaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            perfil = self.request.user.perfilusuario
            # Retorna empresas acessíveis + empresa padrão (sem duplicatas)
            acessiveis = perfil.empresas_acessiveis.all()
            padrao = Empresa.objects.filter(id=perfil.empresa_padrao_id)
            return acessiveis.union(padrao).order_by('nome')
        except PerfilUsuario.DoesNotExist:
            raise PermissionDenied("Usuário sem perfil cadastrado")

    @action(detail=False, methods=['get'])
    def atual(self, request):
        """
        GET /api/minhas-empresas/atual/ → dados da empresa atualmente selecionada
        """
        try:
            perfil = request.user.perfilusuario
            company_id_header = request.headers.get('X-Company-ID', '').strip()
            
            if company_id_header and company_id_header.lower() != 'all':
                company_id = int(company_id_header)
                # Verifica se tem acesso
                empresas_acessiveis = set(perfil.empresas_acessiveis.values_list('id', flat=True))
                empresas_acessiveis.add(perfil.empresa_padrao.id)
                
                if company_id in empresas_acessiveis:
                    empresa = Empresa.objects.get(id=company_id)
                else:
                    empresa = perfil.empresa_padrao
            else:
                empresa = perfil.empresa_padrao
            
            serializer = self.get_serializer(empresa)
            return Response(serializer.data)
            
        except (ValueError, Empresa.DoesNotExist, PerfilUsuario.DoesNotExist):
            return Response(
                {"detail": "Erro ao identificar empresa atual"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

def login_view(request):
    message = request.GET.get('message', '')
    return render(request, 'login.html', {'message': message})

class UserByEmpresaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        empresa_id = int(self.request.query_params.get('empresa_id'))
        # Perfis cujo padrão é a empresa OU que têm acesso a ela
        perfis = PerfilUsuario.objects.filter(
            Q(empresa_padrao_id=empresa_id) |
            Q(empresas_acessiveis__id=empresa_id)
        ).distinct()
        # Retorna os Users vinculados
        return User.objects.filter(perfilusuario__in=perfis)
>>>>>>> e62255e (Atualizações no projeto)
