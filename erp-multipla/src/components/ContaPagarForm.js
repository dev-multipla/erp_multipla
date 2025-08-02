<<<<<<< HEAD
// ContaPagarForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContaPagarForm.css';
import SideBar from './SideBar';
import { FaSync } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContaPagarList from './ContaPagarList';


function ContaPagarForm() {
    const [contratos, setContratos] = useState([]);
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [contaFinanceira, setContaFinanceira] = useState([]);
    const [centrCusto, setCentroCusto] = useState([]);
    const [formData, setFormData] = useState({
        contrato: '',
        forma_pagamento: '',
        data_pagamento: '',
        competencia: '',
        conta_financeira: '',
        centro_custo: '',
        valor_total: 0,
        
    });
    const [selectedConta, setSelectedConta] = useState(null); // Estado para a conta selecionada
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [ultimaConta, setUltimaConta] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showText, setShowText] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [RefreshList, setRefreshList] = useState(null);

    // Estados para os valores dos cartões de resumo
    const [totalContas, setTotalContas] = useState(0);
    const [contasPendentes, setContasPendentes] = useState(0);
    const [proximoVencimento, setProximoVencimento] = useState('');
    const [totalContasPagas, setTotalContasPagas] = useState(null);
    const [loadingTotalContasPagas, setLoadingTotalContasPagas] = useState(true);
    const [totalContasPendentes, setTotalContasPendentes] = useState(null);
    const [loadingTotalContasPendentes, setLoadingTotalContasPendentes] = useState(true);

    useEffect(() => {
        console.log("Estado atual:", {
            isEditing,
            editingId,
            selectedConta
        });
    }, [isEditing, editingId, selectedConta]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token não encontrado.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [contratosResponse, formasPagamentoResponse, , contaFinanceirasResponse, centroCustoResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/contratos/', { headers }),
                    axios.get('http://127.0.0.1:8000/api/select/formas-pagamento/', { headers }),
                    axios.get('http://localhost:8000/api/contas-financeiras/', { headers }),
                    axios.get('http://localhost:8000/api/centros-custos/', { headers }),
                ]);

                setContratos(contratosResponse.data);
                setFormasPagamento(formasPagamentoResponse.data);
                setContaFinanceira(contaFinanceirasResponse.data);
                setCentroCusto(centroCustoResponse.data);

                const resumoResponse = await axios.get('http://127.0.0.1:8000/api/contas-pagar/resumo/', { headers });
                setTotalContas(resumoResponse.data.total_contas);
                setProximoVencimento(resumoResponse.data.proximo_vencimento);
                setContasPendentes(resumoResponse.data.contas_pendentes);

            } catch (error) {
                setError('Erro ao buscar dados da API.');
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!selectedConta) return;
        setFormData({
            contrato: selectedConta.contrato,
            forma_pagamento: selectedConta.forma_pagamento,
            data_pagamento: selectedConta.data_pagamento,
            competencia: selectedConta.competencia,
            conta_financeira: selectedConta.conta_financeira,
            centro_custo: selectedConta.centro_custo,
            valor_total: selectedConta.valor_total,
        });
        setIsEditing(true);
        setEditingId(selectedConta.id);
    }, [selectedConta]);
    

    useEffect(() => {
        const fetchTotalContasPagas = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token não encontrado.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get('http://localhost:8000/api/contas-a-pagar/total-pagas-ano', { headers });
                const total = response.data.total_pagas_ano;

                if (total === undefined) {
                    setError('Erro ao buscar total de contas recebidas.');
                    return;
                }

                setTotalContasPagas(total);
                setLoadingTotalContasPagas(false);
            } catch (error) {
                setError('Erro ao buscar total de contas recebidas.');
                console.error(error);
                setLoadingTotalContasPagas(false);
            }
        };

        fetchTotalContasPagas();
    }, []);

    useEffect(() => {
        const fetchTotalContasPendentes = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token não encontrado.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get('http://localhost:8000/api/contas-a-pagar/total_faturamento_pagar/', { headers });
                const total = response.data.total_faturamento_pagar;

                if (total === undefined) {
                    setError('Erro ao buscar total de contas pendentes.');
                    return;
                }

                setTotalContasPendentes(total);
                setLoadingTotalContasPendentes(false);
            } catch (error) {
                setError('Erro ao buscar total de contas pendentes.');
                console.error(error);
                setLoadingTotalContasPendentes(false);
            }
        };

        fetchTotalContasPendentes();
    }, []);

    const handleChange = async (event) => {
        const { name, value } = event.target;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === 'contrato' && value) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token não encontrado.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const contratoResponse = await axios.get(`http://127.0.0.1:8000/api/contratos/${value}/`, { headers });
                setContratoSelecionado(contratoResponse.data);

                const ultimaContaResponse = await axios.get(`http://127.0.0.1:8000/api/contas-pagar/ultima-conta/?contrato_id=${value}`, { headers });
                setUltimaConta(ultimaContaResponse.data);

            } catch (error) {
                setError('Erro ao buscar detalhes do contrato ou última conta.');
                console.error(error);
            }
        }
    };

    const preencherComUltimaConta = () => {
        if (ultimaConta) {
            setFormData({
                contrato: ultimaConta.contrato.id,
                forma_pagamento: ultimaConta.forma_pagamento.id,
                data_pagamento: ultimaConta.data_pagamento,
                competencia: ultimaConta.competencia,
                valor_total: ultimaConta.valor_total,
            });
        }
    };

    const handleEdit = (conta) => {
        console.log("Conta a ser editada:", conta);


        setFormData({
            contrato: conta.contrato,
            forma_pagamento: conta.forma_pagamento,
            data_pagamento: conta.data_pagamento,
            competencia: conta.competencia,
            conta_financeira: conta.conta_financeira,
            centro_custo: conta.centro_custo,
            valor_total: parseFloat(conta.valor_total),
            
        });

        setIsEditing(true);
        setEditingId(conta.id);
        setSelectedConta(conta);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("Estado de edição:", { isEditing, editingId });
        console.log("Dados do formulário:", formData);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token não encontrado.');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            // Definir o payload com os dados do formulário
            const payload = { ...formData };

            console.log("Tipo de requisição:", isEditing ? "PUT" : "POST");
            console.log("ID para edição:", editingId);

            let response;
            if (isEditing && editingId) {
                console.log("Enviando PUT para:", `http://127.0.0.1:8000/api/contas-pagar/${editingId}/`);
                response = await axios.put(
                    `http://127.0.0.1:8000/api/contas-pagar/${editingId}/`,
                    payload,
                    { headers }
                );
                toast.success('Conta a pagar atualizada com sucesso!');
            } else {
                console.log("Enviando POST");
                response = await axios.post(
                    'http://127.0.0.1:8000/api/contas-pagar/',
                    payload,
                    { headers }
                );
                toast.success('Conta a pagar criada com sucesso!');
            }

            setRefreshList(prev => !prev);
            resetForm();
            return response.data;
        } catch (error) {
            console.error('Erro completo:', error);
            console.error('Resposta do servidor:', error.response?.data);

            const errorMessage = error.response?.data?.detail ||
                (isEditing ? 'Erro ao atualizar conta a pagar.' : 'Erro ao criar conta a pagar.');

            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const resetForm = () => {

        setFormData({

            contrato: '',

            forma_pagamento: '',

            data_pagamento: '',

            competencia: '',

            conta_financeira: '',

            centro_custo: '',

            valor_total: 0

        });

        setIsEditing(false);

        setEditingId(null);

        setSelectedConta(null);

    };

    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <div className="container">
                <div className="cp-header">
                    <h1>Painel de Contas a Pagar</h1>
                    <div className="user-info">
                        <img src="https://via.placeholder.com/40" alt="Usuário" />
                        <span></span>
                    </div>
                </div>
    
                <div className="summary">
                    <div className="meu-card">
                        <h3>Total de Contas pagas</h3>
                        {loadingTotalContasPagas ? (
                            <p>Carregando...</p>
                        ) : totalContasPagas !== null ? (
                            <p>{totalContasPagas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        ) : (
                            <p>Nenhum valor encontrado</p>
                        )}
                    </div>
                    <div className="meu-card">
                        <h3>Próximo Vencimento</h3>
                        <p>{proximoVencimento}</p>
                    </div>
                    <div className="meu-card">
                        <h3>Contas Pendentes</h3>
                        {loadingTotalContasPendentes ? (
                            <p>Carregando...</p>
                        ) : totalContasPendentes !== null ? (
                            <p>{totalContasPendentes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        ) : (
                            <p>Nenhum valor encontrado</p>
                        )}
                    </div>
                </div>
    
                {contratoSelecionado && (
                    <div className="contract-info">
                        <p><strong>Contrato:</strong> {contratoSelecionado.numero}</p>
                        <p><strong>Descrição:</strong> {contratoSelecionado.descricao}</p>
                        <p><strong>Valor da Parcela:</strong> {contratoSelecionado.valor_total}</p>
                        <p><strong>Periodicidade de Vencimento:</strong> {contratoSelecionado.periodicidade_vencimento_pagar}</p>
                        <p><strong>Data do Primeiro Vencimento:</strong> {contratoSelecionado.data_primeiro_vencimento_pagar}</p>
                    </div>
                )}
    
                <div className="form-container">
                    {ultimaConta && (
                        <button
                            type="button"
                            className="botao-preencher"
                            onClick={preencherComUltimaConta}
                            onMouseEnter={() => setShowText(true)}
                            onMouseLeave={() => setShowText(false)}
                            title="Preencher com a Última Conta"
                        >
                            <FaSync />
                        </button>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="contrato">Contrato:</label>
                                <select id="contrato" name="contrato" value={formData.contrato} onChange={handleChange}>
                                    <option value="">Selecione um contrato</option>
                                    {contratos.map(contrato => (
                                        <option key={contrato.id} value={contrato.id}>{contrato.numero}</option>
                                    ))}
                                </select>
                            </div>
    
                            <div className="form-group">
                                <label htmlFor="forma_pagamento">Forma de Pagamento:</label>
                                <select id="forma_pagamento" name="forma_pagamento" value={formData.forma_pagamento} onChange={handleChange}>
                                    <option value="">Selecione uma forma de pagamento</option>
                                    {formasPagamento.map(forma => (
                                        <option key={forma.id} value={forma.id}>{forma.descricao}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="data_pagamento">Data de Pagamento:</label>
                                <input type="date" id="data_pagamento" name="data_pagamento" value={formData.data_pagamento} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="competencia">Competência:</label>
                                <input type="date" id="competencia" name="competencia" value={formData.competencia} onChange={handleChange} />
                            </div>
                        </div>
    
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="contas_financeiras">Contas Financeiras:</label>
                                <select id="contas_financeiras" name="conta_financeira" value={formData.conta_financeira} onChange={handleChange}>
                                    <option value="">Selecione uma Conta Financeira</option>
                                    {contaFinanceira.map(conta => (
                                        <option key={conta.id} value={conta.id}>{conta.descricao}</option>
                                    ))}
                                </select>
                            </div>
    
                            <div className="form-group">
                                <label htmlFor="centro_custos">Centro de Custos:</label>
                                <select id="centro_custos" name="centro_custo" value={formData.centro_custo} onChange={handleChange}>
                                    <option value="">Selecione um Centro de custo</option>
                                    {centrCusto.map(centro => (
                                        <option key={centro.id} value={centro.id}>{centro.descricao}</option>
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
                                />
                            </div>
                        </div>
    
                        {successMessage && <p className="success-message">{successMessage}</p>}
    
                        <button type="submit" className='cp-submit-btn' disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Lançamento'}
                        </button>
                    </form>
                </div>
                
                <ContaPagarList onEdit={handleEdit} />
                <ToastContainer />
            </div>
        </div>
    );
}

export default ContaPagarForm;
=======
// src/componentes/ContaPagarForm.jsx

import React, { useState, useEffect } from 'react';
import api from '../api';
import './ContaPagarForm.css';
import SideBar from './SideBar';
import { FaSync } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
// Importe o arquivo CSS customizado
// import './toast-styles.css';
import ContaPagarList from './ContaPagarList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

function ContaPagarForm() {
  const [contratos, setContratos] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [contaFinanceira, setContaFinanceira] = useState([]);
  const [centrCusto, setCentroCusto] = useState([]);
  const [formData, setFormData] = useState({
    contrato: '',
    forma_pagamento: '',
    data_pagamento: '',
    competencia: '',
    conta_financeira: '',
    centro_custo: '',
    valor_total: 0,
    justificativa_diferenca: ''
  });
  const [selectedConta, setSelectedConta] = useState(null);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  // Estados para resumo
  const [totalContasPagas, setTotalContasPagas] = useState(null);
  const [loadingTotalContasPagas, setLoadingTotalContasPagas] = useState(true);
  const [totalContasPendentes, setTotalContasPendentes] = useState(null);
  const [loadingTotalContasPendentes, setLoadingTotalContasPendentes] = useState(true);

  // Próximo vencimento
  const [proximoVencimento, setProximoVencimento] = useState(null);

  const formatDateToDisplay = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Busca o próximo vencimento
  useEffect(() => {
    const fetchProximoVencimento = async () => {
      try {
        const response = await api.get('/api/contas-a-pagar/proximos_vencimentos/?conta=pagar/');
        if (response.data && response.data.length > 0) {
          setProximoVencimento(response.data[0]);
        }
      } catch (err) {
        console.error(err);
        showErrorToast('Erro ao buscar o próximo vencimento.');
      }
    };
    fetchProximoVencimento();
  }, []);

  // Busca contratos, formas de pagamento, contas financeiras e centros de custo
  useEffect(() => {
    const fetchData = async () => {
      const loadingToast = showLoadingToast('Carregando dados iniciais...');
      try {
        const [
          contratosResponse,
          formasPagamentoResponse,
          contaFinanceirasResponse,
          centroCustoResponse
        ] = await Promise.all([
          api.get('/api/contratos/'),
          api.get('/api/select/formas-pagamento/'),
          api.get('/api/contas-financeiras/'),
          api.get('/api/centros-custos/')
        ]);

        const contratosFiltrados = contratosResponse.data.filter(c => c.tipo === 'fornecedor');
        setContratos(contratosFiltrados);
        setFormasPagamento(formasPagamentoResponse.data);
        setContaFinanceira(contaFinanceirasResponse.data);
        setCentroCusto(centroCustoResponse.data);
        
        toast.success('Dados carregados com sucesso!', { id: loadingToast });
      } catch (err) {
        console.error(err);
        toast.error('Erro ao buscar dados da API.', { id: loadingToast });
      }
    };
    fetchData();
  }, []);

  // Busca total de contas pagas no mês de vencimento
  useEffect(() => {
    const fetchTotalContasPagas = async () => {
      try {
        setLoadingTotalContasPagas(true);
        const response = await api.get('/api/contas-a-pagar/total-pagas-mes-vencimento/');
        const total = response.data.total_pagas_mes_vencimento;
        if (typeof total !== 'number') throw new Error('Resposta inválida da API');
        setTotalContasPagas(total);
      } catch (err) {
        console.error(err);
        showErrorToast(err.message || 'Erro ao buscar total de contas pagas.');
        setTotalContasPagas(null);
      } finally {
        setLoadingTotalContasPagas(false);
      }
    };
    fetchTotalContasPagas();
  }, []);

  // Busca total de contas pendentes
  useEffect(() => {
    const fetchTotalContasPendentes = async () => {
      try {
        const response = await api.get('/api/contas-a-pagar/total_faturamento_pagar/');
        const total = response.data.total_faturamento_pagar;
        if (total === undefined) throw new Error('Dados inválidos');
        setTotalContasPendentes(total);
      } catch (err) {
        console.error(err);
        showErrorToast('Erro ao buscar total de contas pendentes.');
      } finally {
        setLoadingTotalContasPendentes(false);
      }
    };
    fetchTotalContasPendentes();
  }, []);

  // Quando seleciona uma conta na lista para editar
  useEffect(() => {
    if (!selectedConta) return;
    const competenciaDate = selectedConta.competencia
      ? new Date(selectedConta.competencia)
      : null;

    setFormData({
      contrato: selectedConta.contrato,
      forma_pagamento: selectedConta.forma_pagamento,
      data_pagamento: selectedConta.data_pagamento,
      competencia: competenciaDate,
      conta_financeira: selectedConta.conta_financeira,
      centro_custo: selectedConta.centro_custo,
      valor_total: selectedConta.valor_total,
      justificativa_diferenca: ''
    });
    setIsEditing(true);
    setEditingId(selectedConta.id);
    showSuccessToast('Conta selecionada para edição!');
  }, [selectedConta]);

  // Handle select change e busca detalhes de contrato
  const handleChange = async ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'contrato' && value) {
      const loadingToast = showLoadingToast('Carregando detalhes do contrato...');
      try {
        const resp = await api.get(`/api/contratos/${value}/`);
        setContratoSelecionado(resp.data);
        setFormData(prev => ({
          ...prev,
          valor_total: resp.data.valor_parcela || resp.data.valor_total,
          data_pagamento: resp.data.data_primeiro_vencimento
        }));
        toast.success('Contrato carregado com sucesso!', { id: loadingToast });
      } catch (err) {
        console.error(err);
        toast.error('Erro ao buscar detalhes do contrato', { id: loadingToast });
      }
    }
  };

  // Atualiza competência
  const handleCompetenciaChange = date => {
    setFormData(prev => ({ ...prev, competencia: date }));
  };

  // Preenche com dados do contrato selecionado
  const preencherComUltimaConta = () => {
    if (!contratoSelecionado) {
      showWarningToast('Selecione um contrato primeiro.');
      return;
    }
    const competenciaDate = formData.competencia || new Date();

    setFormData({
      contrato: contratoSelecionado.id,
      forma_pagamento: formData.forma_pagamento,
      data_pagamento: contratoSelecionado.data_primeiro_vencimento_pagar,
      competencia: competenciaDate,
      conta_financeira: formData.conta_financeira,
      centro_custo: formData.centro_custo,
      valor_total: contratoSelecionado.valor_parcela || contratoSelecionado.valor_total,
      justificativa_diferenca: ''
    });
    showSuccessToast('Formulário preenchido com dados do contrato!');
  };

  // Formata data para YYYY-MM-DD
  const formatDate = date => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Envia POST ou PUT
  const submitForm = async payload => {
    const loadingToast = showLoadingToast(
      isEditing && editingId ? 'Atualizando conta...' : 'Criando conta...'
    );
    
    try {
      setLoading(true);
      const formatted = { ...payload };
      if (formatted.competencia instanceof Date) {
        formatted.competencia = formatDate(formatted.competencia);
      }

      let resp;
      if (isEditing && editingId) {
        resp = await api.put(`/api/contas-pagar/${editingId}/`, formatted);
        toast.success('Conta a pagar atualizada com sucesso!', { id: loadingToast });
      } else {
        resp = await api.post('/api/contas-pagar/', formatted);
        toast.success('Conta a pagar criada com sucesso!', { id: loadingToast });
      }

      setRefreshList(prev => !prev);
      resetForm();
      return resp.data;
    } catch (err) {
      console.error('Erro completo:', err);
      const msg = err.response?.data?.detail ||
        (isEditing ? 'Erro ao atualizar conta a pagar.' : 'Erro ao criar conta a pagar.');
      toast.error(msg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // Lógica de diferença e modal
  const [showModal, setShowModal] = useState(false);
  const [modalJustificativa, setModalJustificativa] = useState('');
  const [calculatedDiferenca, setCalculatedDiferenca] = useState(0);

  const handleSubmit = async e => {
    e.preventDefault();
    const esperado = contratoSelecionado
      ? (contratoSelecionado.valor_parcela || contratoSelecionado.valor_total)
      : formData.valor_total;

    if (parseFloat(formData.valor_total) !== parseFloat(esperado)) {
      const diff = parseFloat(formData.valor_total) - parseFloat(esperado);
      setCalculatedDiferenca(diff);
      setShowModal(true);
      return;
    }

    await submitForm(formData);
  };

  const handleModalSubmit = async () => {
    if (!modalJustificativa.trim()) {
      showErrorToast("Informe a justificativa para a diferença.");
      return;
    }
    const updated = { ...formData, justificativa_diferenca: modalJustificativa };
    setShowModal(false);
    await submitForm(updated);
  };

  const resetForm = () => {
    setFormData({
      contrato: '',
      forma_pagamento: '',
      data_pagamento: '',
      competencia: '',
      conta_financeira: '',
      centro_custo: '',
      valor_total: 0,
      justificativa_diferenca: ''
    });
    setIsEditing(false);
    setEditingId(null);
    setSelectedConta(null);
    setModalJustificativa('');
    setCalculatedDiferenca(0);
  };

  // Ação de editar a partir da lista
  const handleEdit = conta => {
    setSelectedConta(conta);
  };

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div className="container">
        <div className="cp-header">
          <h1>Contas a Pagar(Contratos)</h1>
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

        <div className="summary">
          <div className="meu-card">
            <h3>Total de Contas Pagas</h3>
            {loadingTotalContasPagas ? (
              <p>Carregando...</p>
            ) : totalContasPagas !== null ? (
              <p>{totalContasPagas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            ) : (
              <p>Nenhum valor encontrado</p>
            )}
          </div>

          <div className="meu-card">
            <h3>Próximo Vencimento</h3>
            {proximoVencimento ? (
              <p>{formatDateToDisplay(proximoVencimento.data_vencimento)}</p>
            ) : (
              <p>Carregando...</p>
            )}
          </div>

          <div className="meu-card">
            <h3>Contas Pendentes</h3>
            {loadingTotalContasPendentes ? (
              <p>Carregando...</p>
            ) : totalContasPendentes !== null ? (
              <p>{totalContasPendentes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            ) : (
              <p>Nenhum valor encontrado</p>
            )}
          </div>
        </div>

        {contratoSelecionado && (
          <div className="contract-info">
            <p><strong>Contrato:</strong> {contratoSelecionado.numero}</p>
            <p><strong>Descrição:</strong> {contratoSelecionado.descricao}</p>
            <p><strong>Valor da Parcela:</strong> R$ {contratoSelecionado.valor_parcela || contratoSelecionado.valor_total}</p>
            <p><strong>Periodicidade de Vencimento:</strong> {contratoSelecionado.periodicidade_vencimento}</p>
            <p><strong>Data do Primeiro Vencimento:</strong> {(() => {
              const d = new Date(contratoSelecionado.data_primeiro_vencimento);
              return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
            })()}</p>
            <p><strong>Quantidade de Parcelas:</strong> {contratoSelecionado.projecoes?.length || 0}</p>
            <div className="projetos-info">
              <h4>Projetos Vinculados:</h4>
              {contratoSelecionado.projetos?.length > 0 ? (
                contratoSelecionado.projetos.map(p => (
                  <div key={p.projeto} className="projeto-item">
                    <span><strong>Projeto:</strong> {p.projeto_nome}</span>
                    <span><strong>Valor:</strong> R$ {p.valor_projeto}</span>
                  </div>
                ))
              ) : (
                <p>Este contrato não possui projetos vinculados.</p>
              )}
            </div>
          </div>
        )}

        <div className="form-container">
          <button
            type="button"
            className="botao-preencher"
            onClick={preencherComUltimaConta}
            onMouseEnter={() => setShowText(true)}
            onMouseLeave={() => setShowText(false)}
            title="Preencher com os dados do contrato"
          >
            <FaSync />
          </button>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contrato">Contrato:</label>
                <select id="contrato" name="contrato" value={formData.contrato} onChange={handleChange}>
                  <option value="">Selecione um contrato</option>
                  {contratos.map(c => (
                    <option key={c.id} value={c.id}>{c.numero}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="forma_pagamento">Forma de Pagamento:</label>
                <select id="forma_pagamento" name="forma_pagamento" value={formData.forma_pagamento} onChange={handleChange}>
                  <option value="">Selecione uma forma de pagamento</option>
                  {formasPagamento.map(fp => (
                    <option key={fp.id} value={fp.id}>{fp.descricao}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="data_pagamento">Data de Pagamento:</label>
                <input
                  type="date"
                  id="data_pagamento"
                  name="data_pagamento"
                  value={formData.data_pagamento}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="competencia">Competência (Mês/Ano):</label>
                <DatePicker
                  selected={formData.competencia instanceof Date ? formData.competencia : null}
                  onChange={handleCompetenciaChange}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  className="form-control"
                  id="competencia"
                  placeholderText="Selecione o mês/ano"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="conta_financeira">Contas Financeiras:</label>
                <select id="conta_financeira" name="conta_financeira" value={formData.conta_financeira} onChange={handleChange}>
                  <option value="">Selecione uma Conta Financeira</option>
                  {contaFinanceira.map(cf => (
                    <option key={cf.id} value={cf.id}>{cf.descricao}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="centro_custo">Centro de Custos:</label>
                <select id="centro_custo" name="centro_custo" value={formData.centro_custo} onChange={handleChange}>
                  <option value="">Selecione um Centro de custo</option>
                  {centrCusto.map(cc => (
                    <option key={cc.id} value={cc.id}>{cc.descricao}</option>
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

        <ContaPagarList onEdit={handleEdit} refresh={refreshList} />

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Justificativa da Diferença</h2>
              <p>
                O valor informado difere do valor esperado em{' '}
                <strong>
                  {calculatedDiferenca.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </strong>
                . Por favor, informe uma justificativa para essa diferença:
              </p>
              <textarea
                value={modalJustificativa}
                onChange={e => setModalJustificativa(e.target.value)}
                placeholder="Informe a justificativa..."
                rows="3"
                className="input-justificativa-cp"
              />
              <div className="modal-actions">
                <button onClick={() => setShowModal(false)}>Cancelar</button>
                <button onClick={handleModalSubmit}>Confirmar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContaPagarForm;
>>>>>>> e62255e (Atualizações no projeto)
