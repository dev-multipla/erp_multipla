from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from fornecedores.views import FornecedorViewSet, FornecedorSelectViewSet, FornecedorListViewSet
from clientes.views import ClienteViewSet, ClienteSelectViewSet, ClientListViewSet
from contratos.views import ContratoViewSet, ContratoSelectViewSet, ContratoListViewSet
from projetos.views import ProjetoViewSet, ProjetoSelectViewSet, ProjetoListViewSet
from pagamentos.views import FormaPagamentoViewSet, FormaPagamentoSelectViewSet, FormaPagamentoViewSet
from contas_pagar import views
from contas_pagar.views import ContaAPagarViewSet, ContaAReceberViewSet, RelatorioProjecoesViewSet
from .views import UserCreate, LogoutView
from usuarios.views import UserCreate, LogoutView, login_view 
from empresas.views import EmpresaViewSet, FilialViewSet, EmpresaListViewSet, FilialListViewSet
from contratos import views as contratos_views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = routers.DefaultRouter()
router.register(r'fornecedores', FornecedorViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'contratos', ContratoViewSet)
router.register(r'projetos', ProjetoViewSet)
router.register(r'formas-pagamento', FormaPagamentoViewSet)
router.register(r'select/clientes', ClienteSelectViewSet, basename='cliente-select')
router.register(r'select/fornecedores', FornecedorSelectViewSet, basename='fornecedor-select')
router.register(r'select/contratos', ContratoSelectViewSet, basename='contrato-select')
router.register(r'select/formas-pagamento', FormaPagamentoSelectViewSet, basename='forma-pagamento-select')
router.register(r'select/projetos', ProjetoSelectViewSet, basename='projeto-select')
router.register(r'contas-pagar', views.ContaAPagarViewSet)  # Adiciona o ContaAPagarViewSet diretamente no router principal
router.register(r'contas-receber', views.ContaAReceberViewSet)
router.register(r'contas-a-pagar-avulso', views.ContaPagarAvulsoViewSet)
router.register(r'contas-a-receber-avulso', views.ContaReceberAvulsoViewSet)
router.register(r'relatorio-financeiro', views.RelatorioFinanceiroViewSet, basename='relatorio-financeiro')
router.register(r'empresas', EmpresaViewSet)
router.register(r'filiais', FilialViewSet)
router.register(r'empresas-list', EmpresaListViewSet, basename='empresa-list')
router.register(r'filiais-list', FilialListViewSet, basename='filial-list')
router.register(r'contratos-list', ContratoListViewSet, basename='contrato-list')
router.register(r'projeto-list', ProjetoListViewSet, basename='projeto-list')
router.register(r'cliente-list', ClientListViewSet, basename='cliente-list')
router.register(r'fornecedor-list', FornecedorListViewSet, basename='fornecedor-list')
router.register(r'formas-pagamento', FormaPagamentoViewSet, basename='formas-pagamento')
router.register(r'contas/contapagar/ultima-conta/', ContaAPagarViewSet, basename='contas/contapagar/ultima-conta/' )
router.register(r'contas-receber/ultima-conta', views.ContaAReceberViewSet, basename='contas-receber-ultima-conta')



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', UserCreate.as_view(), name='user-create'),  # Sem necessidade de decorador
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('login/', login_view, name='login'), 
    path('api/contas-a-pagar/total/', views.TotalContasAPagarView.as_view(), name='total-contas-a-pagar'),
    path('api/contas-a-pagar/proximos-vencimentos/', views.ProximosVencimentosView.as_view(), name='proximos-vencimentos'),
    path('api/contas-a-pagar/contas_pendentes/', views.ContaAPagarViewSet.as_view({'get': 'contas_pendentes'}), name='contas-a-pagar-pendentes'),
    path('api/contas-a-receber/contas_pendentes/', views.ContaAReceberViewSet.as_view({'get': 'contas_pendentes'}), name='contas-a-receber-pendentes'),
    path('api/contratos/fornecedor/', contratos_views.ContratosFornecedorView.as_view(), name='contratos-fornecedor'),
    path('api/contratos/cliente/', contratos_views.ContratosClienteView.as_view(), name='contratos-cliente'),
    path('api/contratos/<int:pk>/soft_delete/', ContratoViewSet.as_view({'delete': 'soft_delete'}), name='contrato-soft-delete'),
    path('api/contratos/projecoes/', ContratoViewSet.as_view({'post': 'gerar_projecoes'}), name='gerar-projecoes'),
    #path('api/contratos/salvar/', ContratoViewSet.as_view({'post': 'salvar_contrato'}), name='salvar-contrato'),
    path('api/contas-a-pagar/total-pagas-ano/', views.ContaAPagarViewSet.as_view({'get': 'total_pagas_ano'}), name='total-pagas-ano'),
    path('api/contas-a-receber/total-recebidas-ano/', views.ContaAReceberViewSet.as_view({'get': 'total_recebidas_ano'}), name='total-recebidas-ano'),
    path('api/contas-a-pagar/total_faturamento_pagar/', views.ContaAPagarViewSet.as_view({'get': 'total_faturamento_pagar'}), name='total_faturamento_pagar'),
    path('api/contas-a-receber/total_faturamento_receber/', views.ContaAReceberViewSet.as_view({'get': 'total_faturamento_receber'}), name='total_faturamento_receber'),
    path('api/relatorio-projecoes/', RelatorioProjecoesViewSet.as_view({'get': 'gerar_relatorio'}), name='relatorio-projecoes'),
]
