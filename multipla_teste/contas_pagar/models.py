#contas_pagar/models.py
from django.db import models
from projetos.models import Projeto
from contratos.models import Contrato
from pagamentos.models import FormaPagamento
from financeiro.models import ContaFinanceira,CentroCusto

class ContaAPagar(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
        ('estornado', 'Estornado'),
    ]

    status = models.CharField(  
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pendente'
    )

    contrato = models.ForeignKey(Contrato, on_delete=models.PROTECT, related_name='contas_pagar')
    forma_pagamento = models.ForeignKey(FormaPagamento, on_delete=models.PROTECT)
    data_pagamento = models.DateField()
    competencia = models.DateField()
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)
    conta_financeira = models.ForeignKey(ContaFinanceira, on_delete=models.SET_NULL, null=True)
    centro_custo = models.ForeignKey(CentroCusto, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)

    @property
    def projetos(self):
        return self.contrato.contrato_projetos.all()


#contas a receber

class ContaAReceber(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('recebido', 'Recebido'),
        ('estornado', 'Estornado'),
    ]

    status = models.CharField(  # <-- Adicione este campo
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pendente'
    )


    contrato = models.ForeignKey('contratos.Contrato', on_delete=models.PROTECT, related_name='contas_receber')
    forma_pagamento = models.ForeignKey('pagamentos.FormaPagamento', on_delete=models.PROTECT)
    data_recebimento = models.DateField()
    competencia = models.DateField()
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)
    conta_financeira = models.ForeignKey('financeiro.ContaFinanceira', on_delete=models.SET_NULL, null=True)
    centro_custo = models.ForeignKey('financeiro.CentroCusto', on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-data_recebimento']

    def __str__(self):
        return f"Conta a Receber #{self.id}"

class ContaPagarAvulso(models.Model):
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_pagamento = models.DateField()
    competencia = models.CharField(max_length=7)  # Formato 'MM/AAAA'
    fornecedor = models.ForeignKey('fornecedores.Fornecedor', on_delete=models.PROTECT)
    conta_financeira = models.ForeignKey(ContaFinanceira, on_delete=models.SET_NULL, null=True)
    centro_custo = models.ForeignKey(CentroCusto, on_delete=models.SET_NULL, null=True)
    projetos = models.ManyToManyField(Projeto, blank=True)
    is_active = models.BooleanField(default=True)

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()
class ContaReceberAvulso(models.Model):
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_recebimento = models.DateField()
    competencia = models.CharField(max_length=7)  # Formato 'MM/AAAA'
    cliente = models.ForeignKey('clientes.Cliente', on_delete=models.PROTECT)
    conta_financeira = models.ForeignKey(ContaFinanceira, on_delete=models.SET_NULL, null=True)
    centro_custo = models.ForeignKey(CentroCusto, on_delete=models.SET_NULL, null=True)
    projetos = models.ManyToManyField(Projeto, blank=True)
    is_active = models.BooleanField(default=True)

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()
