<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContaAReceberForm.css';
import SideBar from './SideBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContaReceberList from './ContaReceberList';

function ContaReceberForm() {
    const [contratos, setContratos] = useState([]);
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [contaFinanceira, setContaFinanceira] = useState([]);
    const [centrCusto, setCentroCusto] = useState([]);
    const [formData, setFormData] = useState({
        contrato: '',
        forma_pagamento: '',
        data_recebimento: '',
        competencia: '',
        conta_financeira: '',
        centro_custo: '',
        valor_total: '',
    });
    
    // Estados simplificados
    const [selectedConta, setSelectedConta] = useState(null);
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [ultimaConta, setUltimaConta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [
                    contratosResponse, 
                    formasPagamentoResponse,
                    contaFinanceirasResponse, 
                    centroCustoResponse
                ] = await Promise.all([
                    axios.get('http://localhost:8000/api/contratos-list/', { headers }),
                    axios.get('http://localhost:8000/api/select/formas-pagamento/', { headers }),
                    axios.get('http://localhost:8000/api/contas-financeiras/', { headers }),
                    axios.get('http://localhost:8000/api/centros-custos/', { headers }),
                ]);

                setContratos(contratosResponse.data);
                setFormasPagamento(formasPagamentoResponse.data);
                setContaFinanceira(contaFinanceirasResponse.data);
                setCentroCusto(centroCustoResponse.data);
            } catch (error) {
                toast.error('Erro ao buscar dados da API');
            }
        };
        fetchData();
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'contrato' && value) {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                // Buscar detalhes do contrato
                const contratoResponse = await axios.get(
                    `http://localhost:8000/api/contratos/${value}/`,    //http://localhost:8000/api/contratos-list/${value}/
                    { headers }
                );
                setContratoSelecionado(contratoResponse.data);

                // Buscar última conta associada
                const ultimaContaResponse = await axios.get(
                    `http://localhost:8000/api/contas-receber/ultima-conta/?contrato_id=${value}`,
                    { headers }
                );
                setUltimaConta(ultimaContaResponse.data);

                // Preencher automaticamente valores do contrato
                setFormData(prev => ({
                    ...prev,
                    valor_total: contratoResponse.data.valor_parcela,
                    data_recebimento: contratoResponse.data.data_primeiro_vencimento
                }));

            } catch (error) {
                toast.error('Erro ao buscar detalhes do contrato');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const url = selectedConta?.id 
                ? `http://localhost:8000/api/contas-receber/${selectedConta.id}/`
                : 'http://localhost:8000/api/contas-receber/';

            const response = selectedConta?.id
                ? await axios.put(url, formData, { headers })
                : await axios.post(url, formData, { headers });

            toast.success(selectedConta?.id 
                ? 'Conta atualizada com sucesso!' 
                : 'Conta criada com sucesso!');

            // Resetar formulário após sucesso
            if (!selectedConta?.id) {
                setFormData({
                    contrato: '',
                    forma_pagamento: '',
                    data_recebimento: '',
                    competencia: '',
                    conta_financeira: '',
                    centro_custo: '',
                    valor_total: '',
                });
                setContratoSelecionado(null);
            }

        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Erro ao processar solicitação';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
          <SideBar />
          <div className="container">
            <div className="cp-header">
              <h1>Faturamento de Contrato</h1>
              <div className="user-info">
                <img src="https://via.placeholder.com/40" alt="Usuário" />
              </div>
            </div>
            <div className="summary">
            <div className="meu-card">
                <h3>Total de Contas Recebidas</h3>
                <p></p>
            </div>
            <div className="meu-card">
                <h3>Próximo Vencimento</h3>
                <p></p>
            </div>
            <div className="meu-card">
                <h3>Contas Pendentes</h3>
                <p></p>
            </div>
            </div>

    
            {contratoSelecionado && (
              <div className="contract-info">
                <p>
                  <strong>Contrato:</strong> {contratoSelecionado.numero}
                </p>
                <p>
                  <strong>Descrição:</strong> {contratoSelecionado.descricao}
                </p>
                <p>
                  <strong>Valor da Parcela:</strong> {contratoSelecionado.valor_parcela}
                </p>
                <p>
                  <strong>Quantidade de Parcelas:</strong>{' '}
                  {contratoSelecionado.projecoes ? contratoSelecionado.projecoes.length : 0}
                </p>
                <div className="projetos-info">
                  <h4>Projetos Vinculados:</h4>
                  {contratoSelecionado.projetos && contratoSelecionado.projetos.length > 0 ? (
                    contratoSelecionado.projetos.map((projeto) => (
                      <div key={projeto.projeto} className="projeto-item">
                        <span>
                          <strong>Projeto:</strong> {projeto.projeto_nome}
                        </span>
                        <span>
                          <strong>Valor:</strong> R$ {projeto.valor_projeto}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>Este contrato não possui projetos vinculados.</p>
                  )}
                </div>
              </div>
            )}
    
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contrato">Contrato:</label>
                    <select
                      id="contrato"
                      name="contrato"
                      value={formData.contrato}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um contrato</option>
                      {contratos.map((contrato) => (
                        <option key={contrato.id} value={contrato.id}>
                          {contrato.numero} - {contrato.descricao}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="forma_pagamento">Forma de Pagamento:</label>
                    <select
                      id="forma_pagamento"
                      name="forma_pagamento"
                      value={formData.forma_pagamento}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione a forma de pagamento</option>
                      {formasPagamento.map((forma) => (
                        <option key={forma.id} value={forma.id}>
                          {forma.descricao}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="data_recebimento">Data de Recebimento:</label>
                    <input
                      type="date"
                      id="data_recebimento"
                      name="data_recebimento"
                      value={formData.data_recebimento}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="competencia">Competência:</label>
                    <input
                      type="date"
                      id="competencia"
                      name="competencia"
                      value={formData.competencia}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="conta_financeira">Conta Financeira:</label>
                    <select
                      id="conta_financeira"
                      name="conta_financeira"
                      value={formData.conta_financeira}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione a conta</option>
                      {contaFinanceira.map((conta) => (
                        <option key={conta.id} value={conta.id}>
                          {conta.descricao}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="centro_custo">Centro de Custo:</label>
                    <select
                      id="centro_custo"
                      name="centro_custo"
                      value={formData.centro_custo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione o centro de custo</option>
                      {centrCusto.map((centro) => (
                        <option key={centro.id} value={centro.id}>
                          {centro.descricao}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="valor_total">Valor Total:</label>
                    <input
                      type="number"
                      id="valor_total"
                      name="valor_total"
                      value={formData.valor_total}
                      onChange={handleChange}
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="cp-submit-btn" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Lançamento'}
                </button>
              </form>
            </div>
    
            <ContaReceberList
              onEdit={(conta) => {
                setSelectedConta(conta);
                setFormData({
                  contrato: conta.contrato.id,
                  forma_pagamento: conta.forma_pagamento.id,
                  data_recebimento: conta.data_recebimento,
                  competencia: conta.competencia,
                  conta_financeira: conta.conta_financeira.id,
                  centro_custo: conta.centro_custo.id,
                  valor_total: conta.valor_total,
                });
              }}
            />
    
            <ToastContainer />
          </div>
        </div>
      );
    }
    
    export default ContaReceberForm;
=======
// ContaReceberForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import './ContaAReceberForm.css';
import SideBar from './SideBar';
import ContaReceberList from './ContaReceberList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from 'react-hot-toast';
// Importe o arquivo CSS customizado que criamos
// import './toast-styles.css';

// Funções helper para toasts customizados
const showSuccessToast = (message) => {
  return toast.success(message, {
    className: 'toast-success',
    style: {
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      color: '#15803d',
      border: '1px solid #bbf7d0',
      borderLeft: '4px solid #22c55e',
    },
  });
};

const showErrorToast = (message) => {
  return toast.error(message, {
    className: 'toast-error',
    style: {
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      color: '#dc2626',
      border: '1px solid #fecaca',
      borderLeft: '4px solid #ef4444',
    },
  });
};

const showLoadingToast = (message) => {
  return toast.loading(message, {
    className: 'toast-loading',
    style: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      color: '#475569',
      border: '1px solid #cbd5e1',
      borderLeft: '4px solid #3b82f6',
    },
  });
};

const showWarningToast = (message) => {
  return toast(message, {
    icon: '⚠️',
    className: 'toast-warning',
    style: {
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      color: '#92400e',
      border: '1px solid #fcd34d',
      borderLeft: '4px solid #f59e0b',
    },
  });
};

function ContaReceberForm() {
  // estados de dados
  const [contratos, setContratos] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [contaFinanceira, setContaFinanceira] = useState([]);
  const [centrCusto, setCentroCusto] = useState([]);

  const [formData, setFormData] = useState({
    contrato: '',
    forma_pagamento: '',
    data_recebimento: '',
    competencia: '',
    conta_financeira: '',
    centro_custo: '',
    valor_total: '',
    justificativa_diferenca: ''
  });
  const [selectedConta, setSelectedConta] = useState(null);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);

  // estados de UI
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalJustificativa, setModalJustificativa] = useState('');
  const [calculatedDiferenca, setCalculatedDiferenca] = useState(0);

  // totais e indicadores
  const [totalContasRecebidas, setTotalContasRecebidas] = useState(null);
  const [loadingTotalRecebidas, setLoadingTotalRecebidas] = useState(true);
  const [totalContasPendentes, setTotalContasPendentes] = useState(null);
  const [loadingTotalPendentes, setLoadingTotalPendentes] = useState(true);
  const [proximoVencimento, setProximoVencimento] = useState(null);

  // --- Fetchs iniciais ---
  useEffect(() => {
    (async () => {
      const loadingToast = showLoadingToast('Carregando dados iniciais...');
      try {
        const [
          contratosRes,
          formasRes,
          contasFinRes,
          centrosRes
        ] = await Promise.all([
          api.get('/api/contratos-list/'),
          api.get('/api/select/formas-pagamento/'),
          api.get('/api/contas-financeiras/'),
          api.get('/api/centros-custos/')
        ]);

        setContratos(contratosRes.data.filter(c => c.tipo === 'cliente'));
        setFormasPagamento(formasRes.data);
        setContaFinanceira(contasFinRes.data);
        setCentroCusto(centrosRes.data);
        
        toast.success('Dados carregados com sucesso!', { id: loadingToast });
      } catch (err) {
        console.error(err);
        toast.error('Erro ao buscar dados iniciais.', { id: loadingToast });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado.');
        const resp = await api.get('/api/contas-a-receber/total_faturamento_receber/');
        setTotalContasPendentes(resp.data.total_faturamento_receber);
      } catch (err) {
        console.error(err);
        showErrorToast('Erro ao buscar total de contas pendentes.');
      } finally {
        setLoadingTotalPendentes(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado.');
        const resp = await axios.get(
          'https://financeiro.multipla.tec.br/api/contas-a-receber/total-recebidas-mes-vencimento/',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTotalContasRecebidas(resp.data.total_recebidas_mes_vencimento);
      } catch (err) {
        console.error(err);
        showErrorToast('Erro ao buscar total de recebidas.');
      } finally {
        setLoadingTotalRecebidas(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get('/api/contas-a-pagar/proximos_vencimentos/?conta=receber/');
        if (Array.isArray(resp.data) && resp.data.length) {
          setProximoVencimento(resp.data[0]);
        }
      } catch (err) {
        console.error(err);
        showErrorToast('Erro ao buscar próximo vencimento.');
      }
    })();
  }, []);

  // --- Handlers gerais ---
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));

    if (name === 'contrato' && value) {
      const loadingToast = showLoadingToast('Carregando detalhes do contrato...');
      try {
        const contratoRes = await api.get(`/api/contratos/${value}/`);
        setContratoSelecionado(contratoRes.data);

        const ultimaRes = await api.get(`/api/contas-receber/ultima-conta/?contrato_id=${value}`);
        setFormData(f => ({
          ...f,
          valor_total: contratoRes.data.valor_parcela,
          data_recebimento: contratoRes.data.data_primeiro_vencimento
        }));
        
        toast.success('Contrato carregado com sucesso!', { id: loadingToast });
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar detalhes do contrato.', { id: loadingToast });
      }
    }
  };

  const handleCompetenciaChange = (date) => {
    setFormData(f => ({ ...f, competencia: date }));
  };

  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,'0');
    const d = String(date.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  };

  const formatDateToDisplay = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  // Submissão real
  const submitForm = async (payload) => {
    const loadingToast = showLoadingToast(
      selectedConta ? 'Atualizando conta...' : 'Criando conta...'
    );
    
    try {
      const data = {
        ...payload,
        competencia: formatDate(payload.competencia)
      };
      const endpoint = selectedConta
        ? `/api/contas-receber/${selectedConta.id}/`
        : '/api/contas-receber/';
      const method = selectedConta ? api.put : api.post;
      await method(endpoint, data);

      const successMsg = selectedConta
        ? 'Conta atualizada com sucesso!'
        : 'Conta criada com sucesso!';
      
      toast.success(successMsg, { id: loadingToast });
      
      // limpa formulário
      if (!selectedConta) {
        setFormData({
          contrato: '',
          forma_pagamento: '',
          data_recebimento: '',
          competencia: '',
          conta_financeira: '',
          centro_custo: '',
          valor_total: '',
          justificativa_diferenca: ''
        });
        setContratoSelecionado(null);
      }
    } catch (err) {
      console.error(err.response?.data || err);
      const msgs = err.response?.data 
        ? Object.values(err.response.data).flat().join(' • ')
        : err.message;
      toast.error(msgs, { id: loadingToast });
    }
  };

  // Botão salvar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const esperado = contratoSelecionado
      ? (contratoSelecionado.valor_parcela || contratoSelecionado.valor_total)
      : formData.valor_total;

    if (parseFloat(formData.valor_total) !== parseFloat(esperado)) {
      setCalculatedDiferenca(
        parseFloat(formData.valor_total) - parseFloat(esperado)
      );
      setShowModal(true);
      setLoading(false);
      return;
    }

    await submitForm(formData);
    setLoading(false);
  };

  // Confirmação da justificativa
  const handleModalSubmit = async () => {
    if (!modalJustificativa.trim()) {
      showErrorToast('Informe a justificativa para a diferença.');
      return;
    }
    setShowModal(false);
    setFormData(f => ({
      ...f,
      justificativa_diferenca: modalJustificativa
    }));
    await submitForm({ ...formData, justificativa_diferenca: modalJustificativa });
  };

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div className="container">
        <div className='cpr-header'>
        <h1>Contas a Receber(Contratos)</h1>
        </div>
        {/* Toaster component for notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            top: 20,
            right: 20,
            zIndex: 9999,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '400px',
              minWidth: '300px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
              lineHeight: '1.5',
              transition: 'all 0.2s ease',
            },
            success: {
              duration: 3000,
              style: {
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                borderLeft: '4px solid #22c55e',
              },
              iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderLeft: '4px solid #ef4444',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
            loading: {
              style: {
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderLeft: '4px solid #3b82f6',
              },
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#ffffff',
              },
            },
          }}
        />

        {/* Resumo */}
        <div className="summary">
          <div className="meu-card">
            <h3>Total Recebidas</h3>
            {loadingTotalRecebidas
              ? '...'
              : totalContasRecebidas?.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
          </div>
          <div className="meu-card">
            <h3>Próximo Vencimento</h3>
            {proximoVencimento
              ? formatDateToDisplay(proximoVencimento.data_vencimento)
              : '...'}
          </div>
          <div className="meu-card">
            <h3>Contas Pendentes</h3>
            {loadingTotalPendentes
              ? '...'
              : totalContasPendentes?.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
          </div>
        </div>

        {/* Info contrato selecionado */}
        {contratoSelecionado && (
          <div className="contract-info">
            <p><strong>Contrato:</strong> {contratoSelecionado.numero}</p>
            <p><strong>Descrição:</strong> {contratoSelecionado.descricao}</p>
            <p><strong>Valor Parcela:</strong> R$ {contratoSelecionado.valor_parcela}</p>
            <p><strong>Primeiro Vencimento:</strong> {formatDateToDisplay(contratoSelecionado.data_primeiro_vencimento)}</p>
            <p><strong>Parcelas:</strong> {contratoSelecionado.projecoes?.length || 0}</p>
            <h4>Projetos Vinculados</h4>
            {contratoSelecionado.projetos?.length
              ? contratoSelecionado.projetos.map(p => (
                  <div key={p.projeto}>
                    {p.projeto_nome}: R$ {p.valor_projeto}
                  </div>
                ))
              : <p>Sem projetos</p>}
          </div>
        )}

        {/* Formulário */}
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Contrato</label>
              <select name="contrato" value={formData.contrato} onChange={handleChange} required>
                <option value="">Selecione</option>
                {contratos.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.numero} – {c.descricao}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Forma Pagamento</label>
              <select name="forma_pagamento" value={formData.forma_pagamento} onChange={handleChange} required>
                <option value="">Selecione</option>
                {formasPagamento.map(f => (
                  <option key={f.id} value={f.id}>{f.descricao}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data Recebimento</label>
              <input
                type="date"
                name="data_recebimento"
                value={formData.data_recebimento}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Competência (Mês/Ano)</label>
              <DatePicker
                selected={formData.competencia instanceof Date ? formData.competencia : null}
                onChange={handleCompetenciaChange}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="MM/AAAA"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Conta Financeira</label>
              <select name="conta_financeira" value={formData.conta_financeira} onChange={handleChange} required>
                <option value="">Selecione</option>
                {contaFinanceira.map(c => (
                  <option key={c.id} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Centro de Custo</label>
              <select name="centro_custo" value={formData.centro_custo} onChange={handleChange} required>
                <option value="">Selecione</option>
                {centrCusto.map(c => (
                  <option key={c.id} value={c.id}>{c.descricao}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Valor Total</label>
              <input
                type="number"
                name="valor_total"
                value={formData.valor_total}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>
          </div>

          <button type="submit" className="cp-submit-btn" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Lançamento'}
          </button>
        </form>

        {/* Modal de justificativa */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Justificativa da Diferença</h2>
              <p>
                Diferença de{' '}
                <strong>
                  {calculatedDiferenca.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
                </strong>. Informe a justificativa:
              </p>
              <textarea
                value={modalJustificativa}
                onChange={e => setModalJustificativa(e.target.value)}
                rows="3"
              />
              <div className="modal-actions">
                <button onClick={() => setShowModal(false)}>Cancelar</button>
                <button onClick={handleModalSubmit}>Confirmar</button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Contas */}
        <ContaReceberList
          onEdit={conta => {
            setSelectedConta(conta);
            setModalJustificativa('');
            setFormData({
              contrato: conta.contrato,
              forma_pagamento: conta.forma_pagamento,
              data_recebimento: conta.data_recebimento,
              competencia: new Date(conta.competencia),
              conta_financeira: conta.conta_financeira,
              centro_custo: conta.centro_custo,
              valor_total: conta.valor_total,
              justificativa_diferenca: ''
            });
            showSuccessToast('Conta selecionada para edição!');
          }}
        />
      </div>
    </div>
  );
}

export default ContaReceberForm;
>>>>>>> e62255e (Atualizações no projeto)
