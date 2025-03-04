from django.db import models

class Projeto(models.Model):
    STATUS_CHOICES = (
        ('andamento', 'Em Andamento'),
        ('concluido', 'Concluído'),
        ('cancelado', 'Cancelado'),
    )

    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    data_inicio = models.DateField()
    data_termino = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='andamento')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.nome
