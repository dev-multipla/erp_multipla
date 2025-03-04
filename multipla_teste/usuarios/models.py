from django.db import models
from django.contrib.auth.models import User
from empresas.models import Empresa  # Certifique-se de ter o modelo Empresa no seu app 'empresas'

class PerfilUsuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    empresa = models.ForeignKey(Empresa, on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        return self.user.username
