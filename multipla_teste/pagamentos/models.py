from django.db import models
<<<<<<< HEAD
=======
from empresas.models import Empresa
>>>>>>> e62255e (Atualizações no projeto)

class FormaPagamento(models.Model):
    TIPO_CHOICES = (
        ('dinheiro', 'Dinheiro'),
        ('cartao_credito', 'Cartão de Crédito'),
        ('cartao_debito', 'Cartão de Débito'),
        ('boleto', 'Boleto'),
        ('pix', 'PIX'),
        # Adicione outros tipos de pagamento conforme necessário
    )

    descricao = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    is_active = models.BooleanField(default=True)
<<<<<<< HEAD
=======
    empresa = models.ForeignKey(
        'empresas.Empresa',
        on_delete=models.PROTECT,
        db_constraint=False,
        db_index=True
    )
>>>>>>> e62255e (Atualizações no projeto)

    def __str__(self):
        return self.descricao
