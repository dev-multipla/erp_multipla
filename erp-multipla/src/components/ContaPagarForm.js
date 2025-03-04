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
