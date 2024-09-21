import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContaAReceberForm.css'; // Import the CSS file for styling
import SideBar from './SideBar';
import { FaSync } from 'react-icons/fa';

function ContaReceberForm() {
    const [contratos, setContratos] = useState([]);
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [projetos, setProjetos] = useState([]);
    const [formData, setFormData] = useState({
        contrato: '',
        forma_pagamento: '',
        data_recebimento: '',
        competencia: '',
        valor_total: 0,
        projetos: [],
    });
    
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [ultimaConta, setUltimaConta] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showText, setShowText] = useState(false);
    const [proximoVencimento, setProximoVencimento] = useState(''); // Estado para armazenar o próximo vencimento

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // Recupera o token armazenado no localStorage

                if (!token) {
                    setError('Token não encontrado.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [contratosResponse, formasPagamentoResponse, projetosResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/contratos/cliente/', { headers }),
                    axios.get('http://127.0.0.1:8000/api/select/formas-pagamento/', { headers }),
                    axios.get('http://127.0.0.1:8000/api/select/projetos/', { headers }),
                ]);

                setContratos(contratosResponse.data);
                setFormasPagamento(formasPagamentoResponse.data);
                setProjetos(projetosResponse.data);
            } catch (error) {
                setError('Erro ao buscar dados da API.');
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Chama a API de projeções de vencimento e obtém a data mais próxima
        const fetchProjecoesReceber = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token não encontrado.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get('http://127.0.0.1:8000/api/contratos/projecoes_receber/', { headers });
                const projecoes = response.data;

                // Obter a data atual
                const dataAtual = new Date();

                // Filtrar as projeções que possuem datas futuras e encontrar a mais próxima
                const proximasDatas = projecoes
                    .map(projecao => new Date(projecao.data_vencimento))
                    .filter(data => data > dataAtual)
                    .sort((a, b) => a - b);

                // Se houver uma data mais próxima, atualizar o estado
                if (proximasDatas.length > 0) {
                    setProximoVencimento(proximasDatas[0].toLocaleDateString('pt-BR'));
                } else {
                    setProximoVencimento('Nenhum vencimento próximo');
                }
            } catch (error) {
                setError('Erro ao buscar projeções de vencimento.');
                console.error(error);
            }
        };

        fetchProjecoesReceber();
    }, []); // Executa apenas uma vez, ao carregar o componente

    useEffect(() => {
        // Atualizar valor total quando os projetos mudam
        const total = formData.projetos.reduce((acc, projeto) => acc + parseFloat(projeto.valor || 0), 0);
        setFormData(prevFormData => ({ ...prevFormData, valor_total: total }));
    }, [formData.projetos]);

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

                const ultimaContaResponse = await axios.get(`http://127.0.0.1:8000/api/contas-receber/ultima-conta/?contrato_id=${value}`, { headers });
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
                data_recebimento: ultimaConta.data_recebimento,
                competencia: ultimaConta.competencia,
                valor_total: ultimaConta.valor_total,
                projetos: ultimaConta.projetos.map(projeto => ({
                    projeto: projeto.id,  
                    valor: projeto.valor,
                })),
            });
        }
    };

    const handleProjetoChange = (event, index) => {
        const { name, value } = event.target;
        const updatedProjetos = [...formData.projetos];
        updatedProjetos[index] = { ...updatedProjetos[index], [name]: value };
        setFormData(prevFormData => ({
            ...prevFormData,
            projetos: updatedProjetos,
        }));
    };

    const addProjeto = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            projetos: [...prevFormData.projetos, { projeto: '', valor: 0 }],
        }));
    };

    const removeProjeto = (index) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            projetos: prevFormData.projetos.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token não encontrado.');
                return;
            }
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const payload = {
                ...formData,
                projetos: formData.projetos.map(projeto => ({
                    projeto: parseInt(projeto.projeto, 10),
                    valor: parseFloat(projeto.valor)
                })),
                contrato: parseInt(formData.contrato, 10),
                forma_pagamento: parseInt(formData.forma_pagamento, 10),
                competencia: new Date(formData.competencia).toISOString().split('T')[0]
            };
            const response = await axios.post('http://127.0.0.1:8000/api/contas-receber/', payload, { headers });
            setSuccessMessage('Conta a receber criada com sucesso!');
            setFormData({
                contrato: '',
                forma_pagamento: '',
                data_recebimento: '',
                competencia: '',
                valor_total: 0,
                projetos: [],
            });

        } catch (error) {
            setError('Erro ao criar conta a receber.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (valor) => {
        if (contratoSelecionado && contratoSelecionado.valor_total && valor) {
            return (parseFloat(valor) / parseFloat(contratoSelecionado.valor_total) * 100).toFixed(2);
        }
        return 0;
    };

    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <div className="container">
                <div className="cp-header">
                    <h1>Faturamento de Contrato</h1>
                    <div className="user-info">
                        <img src="https://via.placeholder.com/40" alt="Usuário" />
                        <span></span>
                    </div>
                </div>

                <div className="summary">
                    <div className="meu-card">
                        <h3>Total de Contas</h3>
                        <p>R$ 10,000</p>
                    </div>
                    <div className="meu-card">
                        <h3>Próximo Vencimento</h3>
                        <p>{proximoVencimento}</p>
                    </div>
                    <div className="meu-card">
                        <h3>Contas Pendentes</h3>
                        <p>R$ 5,000</p>
                    </div>
                </div>

                {contratoSelecionado && (
                    <div className="contract-info">
                        <p><strong>Contrato:</strong> {contratoSelecionado.numero}</p>
                        <p><strong>Descrição:</strong> {contratoSelecionado.descricao}</p>
                        <p><strong>Valor da Parcela:</strong> {contratoSelecionado.valor_total}</p>
                        <p><strong>Periodicidade de Vencimento:</strong> {contratoSelecionado.periodicidade_vencimento_receber}</p>
                        <p><strong>Data do Primeiro Vencimento:</strong> {contratoSelecionado.data_primeiro_vencimento_receber}</p>
                    </div>
                )}

                {ultimaConta && (
                    <button
                        type="button"
                        className="botao-preencher"
                        onClick={preencherComUltimaConta}
                        onMouseEnter={() => setShowText(true)}
                        onMouseLeave={() => setShowText(false)}
                        title="Preencher com a Última Conta" // Tooltip padrão do navegador
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
                            <label htmlFor="data_recebimento">Data de Recebimento:</label>
                            <input type="date" id="data_recebimento" name="data_recebimento" value={formData.data_recebimento} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="competencia">Competência:</label>
                            <input type="date" id="competencia" name="competencia" value={formData.competencia} onChange={handleChange} />
                        </div>
                    </div>

                    {formData.projetos.map((projetoItem, index) => (
                        <div key={index} className="project-group">
                            <select
                                name="projeto"
                                value={projetoItem.projeto}
                                onChange={(event) => handleProjetoChange(event, index)}
                            >
                                <option value="">Selecione um projeto</option>
                                {projetos.map(projeto => (
                                    <option key={projeto.id} value={projeto.id}>{projeto.nome}</option>
                                ))}
                            </select>
                            <span className="percentage-label">
                                {calculatePercentage(projetoItem.valor)}%
                            </span>
                            <input
                                type="number"
                                name="valor"
                                value={projetoItem.valor}
                                onChange={(event) => handleProjetoChange(event, index)}
                                placeholder="Valor"
                            />

                            <button type="button" onClick={() => removeProjeto(index)}>Remover</button>
                        </div>
                    ))}
                    <button type="button" onClick={addProjeto}>Adicionar Projeto</button>

                    <div className="total-group">
                        <label>Valor Total:</label>
                        <span>{formData.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}

                    <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
                </form>
            </div>
        </div>
    );
}
export default ContaReceberForm;
