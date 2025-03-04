from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Contrato, ProjecaoFaturamento
from dateutil.relativedelta import relativedelta
import logging

# Configuração básica do logger
logger = logging.getLogger(__name__)  # Obtém um logger com o nome do módulo
logger.setLevel(logging.ERROR)  # Define o nível mínimo de log para ERROR

# Cria um handler para escrever logs para o console
handler = logging.StreamHandler()
handler.setLevel(logging.ERROR)  # Define o nível para o handler também

# Cria um formatador para a mensagem de log
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# Adiciona o handler ao logger
logger.addHandler(handler)

@receiver(post_save, sender=Contrato)
def gerar_projecoes_faturamento(sender, instance, created, **kwargs):
    if created and instance.confirmado:
        try:
            instance.gerar_projecoes(save=True)
        except Exception as e:
            logger.error(f"Erro ao gerar projeções para contrato {instance.id}: {str(e)}")

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
