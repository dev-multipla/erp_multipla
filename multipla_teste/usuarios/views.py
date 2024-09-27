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
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)  # Código de status mais apropriado para logout
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# Adicione a view para renderizar a página de login com a mensagem de expiração
def login_view(request):
    message = request.GET.get('message', '')
    return render(request, 'login.html', {'message': message})
