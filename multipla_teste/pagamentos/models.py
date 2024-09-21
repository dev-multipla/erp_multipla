from django.db import models

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

    def __str__(self):
        return self.descricao
