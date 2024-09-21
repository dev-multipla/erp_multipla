from django.db import models
from projetos.models import Projeto
from contratos.models import Contrato
from pagamentos.models import FormaPagamento


class ContaAPagar(models.Model):
    contrato = models.ForeignKey(Contrato, on_delete=models.PROTECT)
    forma_pagamento = models.ForeignKey(FormaPagamento, on_delete=models.PROTECT)
    data_pagamento = models.DateField()
    competencia = models.DateField()
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)
    projetos = models.ManyToManyField(Projeto)

class ProjetoContaAPagar(models.Model):
    conta_a_pagar = models.ForeignKey(ContaAPagar, on_delete=models.CASCADE, related_name='projeto_contas_a_pagar')  # Adiciona related_name
    projeto = models.ForeignKey(Projeto, on_delete=models.PROTECT)
    valor = models.DecimalField(max_digits=10, decimal_places=2)

#contas a receber

class ContaAReceber(models.Model):
    contrato = models.ForeignKey(Contrato, on_delete=models.PROTECT, limit_choices_to={'tipo': 'cliente'})  # Limita a contratos de clientes
    forma_pagamento = models.ForeignKey(FormaPagamento, on_delete=models.PROTECT)
    data_recebimento = models.DateField()  # Campo renomeado para data_recebimento
    competencia = models.DateField()
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)

class ProjetoContaAReceber(models.Model):  # Modelo para associar projetos
    conta_a_receber = models.ForeignKey(ContaAReceber, on_delete=models.CASCADE, related_name='projetos')
    projeto = models.ForeignKey(Projeto, on_delete=models.PROTECT)
    valor = models.DecimalField(max_digits=10, decimal_places=2)

class ContaPagarAvulso(models.Model):
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_pagamento = models.DateField()
    competencia = models.CharField(max_length=7)  # Formato 'MM/AAAA'
    fornecedor = models.ForeignKey('fornecedores.Fornecedor', on_delete=models.PROTECT)  # Substitua 'fornecedores' pelo nome do seu app de fornecedores
    projetos = models.ManyToManyField(Projeto, blank=True)  # Permite projetos associados, mas não obrigatório

class ContaReceberAvulso(models.Model):
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_recebimento = models.DateField()
    competencia = models.CharField(max_length=7)  # Formato 'MM/AAAA'
    cliente = models.ForeignKey('clientes.Cliente', on_delete=models.PROTECT)  # Substitua 'clientes' pelo nome do seu app de clientes
    projetos = models.ManyToManyField(Projeto, blank=True)  # Permite projetos associados, mas não obrigatório