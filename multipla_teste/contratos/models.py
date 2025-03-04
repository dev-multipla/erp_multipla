from django.db import models
from clientes.models import Cliente
from fornecedores.models import Fornecedor
from projetos.models import Projeto
from dateutil.relativedelta import relativedelta
from decimal import Decimal 

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

    # Campos unificados para simplificação
    valor_parcela = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    periodicidade_vencimento = models.CharField(
        max_length=10, choices=(
            ('mensal', 'Mensal'),
            ('trimestral', 'Trimestral'),
            ('semestral', 'Semestral'),
            ('anual', 'Anual'),
        ), null=True, blank=True)
    data_primeiro_vencimento = models.DateField(null=True, blank=True)

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
    confirmado = models.BooleanField(default=False)  # Novo campo
    

    def gerar_projecoes(self, save=True):
        projecoes = []
        
        if not all([self.valor_parcela, self.periodicidade_vencimento, self.data_primeiro_vencimento]):
            raise ValueError("Dados incompletos para geração de projeções")

        if not (self.data_inicio <= self.data_primeiro_vencimento <= self.data_termino):
            raise ValueError("Data do primeiro vencimento fora do período do contrato")

        mapeamento_periodicidade = {
            'mensal': 1,
            'trimestral': 3,
            'semestral': 6,
            'anual': 12
        }

        intervalo = mapeamento_periodicidade[self.periodicidade_vencimento]
        data_vencimento = self.data_primeiro_vencimento
        
        while data_vencimento <= self.data_termino:
            projecoes.append({
                'data_vencimento': data_vencimento,
                'valor_parcela': self.valor_parcela
            })
            data_vencimento += relativedelta(months=intervalo)

        if save:
            self.projecoes_faturamento.all().delete()
            for projecao in projecoes:
                ProjecaoFaturamento.objects.create(
                    contrato=self,
                    **projecao
                )
        
        return projecoes

    def __str__(self):
        return f"Contrato {self.numero}"

class ContratoProjeto(models.Model):
    contrato = models.ForeignKey(Contrato, related_name='contrato_projetos', on_delete=models.CASCADE)
    projeto = models.ForeignKey(Projeto, related_name='contrato_projetos', on_delete=models.PROTECT)
    valor_projeto = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ['contrato', 'projeto']

    def __str__(self):
        return f"{self.contrato.numero} - {self.projeto.nome}"

class ProjecaoFaturamento(models.Model):
    contrato = models.ForeignKey(Contrato, related_name='projecoes_faturamento', on_delete=models.CASCADE)
    data_vencimento = models.DateField()
    valor_parcela = models.DecimalField(max_digits=10, decimal_places=2)
    pago = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return f"Projeção {self.contrato.numero} - {self.data_vencimento}"