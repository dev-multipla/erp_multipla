from django.db import models
from clientes.models import Cliente
from fornecedores.models import Fornecedor

class Contrato(models.Model):
    STATUS_CHOICES = (
        ('andamento', 'Em Andamento'),
        ('concluido', 'Concluído'),
        ('cancelado', 'Cancelado'),
    )
    TIPO_CHOICES = (
        ('cliente', 'Cliente'),
        ('fornecedor', 'Fornecedor'),
    )

    # Campos para contas a receber (quando o tipo de contrato é 'cliente')
    valor_parcela_receber = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    periodicidade_vencimento_receber = models.CharField(
        max_length=10, 
        choices=(
            ('mensal', 'Mensal'),
            ('trimestral', 'Trimestral'),
            ('semestral', 'Semestral'),
            ('anual', 'Anual'),
        ),
        null=True, 
        blank=True
    )
    data_primeiro_vencimento_receber = models.DateField(null=True, blank=True)

    # Campos para contas a pagar (quando o tipo de contrato é 'fornecedor')
    valor_parcela_pagar = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    periodicidade_vencimento_pagar = models.CharField(
        max_length=10, 
        choices=(
            ('mensal', 'Mensal'),
            ('trimestral', 'Trimestral'),
            ('semestral', 'Semestral'),
            ('anual', 'Anual'),
        ),
        null=True, 
        blank=True
    )
    data_primeiro_vencimento_pagar = models.DateField(null=True, blank=True)

    numero = models.CharField(max_length=50, unique=True)
    descricao = models.TextField()
    data_inicio = models.DateField()
    data_termino = models.DateField()
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='andamento')
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, null=True, blank=True)
    fornecedor = models.ForeignKey(Fornecedor, on_delete=models.PROTECT, null=True, blank=True)
    arquivo = models.FileField(upload_to='contratos/', null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Contrato {self.numero}"

class ProjecaoFaturamento(models.Model):
    contrato = models.ForeignKey(Contrato, related_name='projecoes_faturamento', on_delete=models.CASCADE)
    data_vencimento = models.DateField()
    valor_parcela = models.DecimalField(max_digits=10, decimal_places=2)
    pago = models.BooleanField(default=False, null=True, blank=True)  # Permitir valores nulos

    def __str__(self):
        return f"Projeção {self.contrato.numero} - {self.data_vencimento}"
