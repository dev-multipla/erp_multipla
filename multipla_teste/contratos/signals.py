from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Contrato, ProjecaoFaturamento
from dateutil.relativedelta import relativedelta

@receiver(post_save, sender=Contrato)
def gerar_projecoes_faturamento(sender, instance, created, **kwargs):
    if created:
        # Gerar projeções apenas se o contrato for de cliente ou fornecedor
        if instance.tipo == 'cliente':
            gerar_projecoes(
                contrato=instance, 
                valor_parcela=instance.valor_parcela_receber,
                periodicidade=instance.periodicidade_vencimento_receber,
                data_primeiro_vencimento=instance.data_primeiro_vencimento_receber
            )
        elif instance.tipo == 'fornecedor':
            gerar_projecoes(
                contrato=instance, 
                valor_parcela=instance.valor_parcela_pagar,
                periodicidade=instance.periodicidade_vencimento_pagar,
                data_primeiro_vencimento=instance.data_primeiro_vencimento_pagar
            )

def gerar_projecoes(contrato, valor_parcela, periodicidade, data_primeiro_vencimento):
    if not valor_parcela or not periodicidade or not data_primeiro_vencimento:
        return

    # Mapeamento para definir o número de meses a adicionar com base na periodicidade
    periodicidade_map = {
        'mensal': 1,
        'trimestral': 3,
        'semestral': 6,
        'anual': 12,
    }

    meses_a_adicionar = periodicidade_map.get(periodicidade)
    data_vencimento = data_primeiro_vencimento

    # Loop para gerar projeções até a data de término do contrato
    while data_vencimento <= contrato.data_termino:
        ProjecaoFaturamento.objects.create(
            contrato=contrato,
            data_vencimento=data_vencimento,
            valor_parcela=valor_parcela
        )
        # Atualiza a data de vencimento para a próxima parcela, usando relativedelta para adicionar meses
        data_vencimento += relativedelta(months=meses_a_adicionar)
