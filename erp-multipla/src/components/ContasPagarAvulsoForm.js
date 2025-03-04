import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import SideBar from './SideBar';
import './ContasPagarAvulsoForm.css'
import ContaPagarAvulsoList from './ContaPagarAvulsoList';

function ContasPagarAvulsoForm() {
    const [projetos, setProjetos] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [contaFinanceira, setContaFinanceira] = useState([]);
    const [centrCusto, setCentroCusto] = useState([]);
    const [formData, setFormData] = useState({
        descricao: '',
        valor: '',
        data_pagamento: '',
        competencia: '',
        conta_financeira: '',
        centro_custo: '',
        fornecedor: '',
        projetos: [],
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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

                const [projetosResponse, fornecedoresResponse, contaFinanceirasResponse, centroCustoResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/select/projetos/', { headers }),
                    axios.get('http://127.0.0.1:8000/api/select/fornecedores/', { headers }),
                    axios.get('http://localhost:8000/api/contas-financeiras/', { headers }),
                    axios.get('http://localhost:8000/api/centros-custos/', { headers }),
                ]);

                setProjetos(projetosResponse.data);
                setFornecedores(fornecedoresResponse.data);
                setContaFinanceira(contaFinanceirasResponse.data);
                setCentroCusto(centroCustoResponse.data);
            } catch (error) {
                setError('Erro ao buscar dados da API.');
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const total = formData.projetos.reduce((acc, projeto) => acc + parseFloat(projeto.valor || 0), 0).toFixed(2);
        setFormData(prevFormData => ({ ...prevFormData, valor: total }));
    }, [formData.projetos]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
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

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
            setFormData(prevFormData => ({
                ...prevFormData,
                competencia: formattedDate,
            }));
        }
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
                'Content-Type': 'application/json',
            };

            const payload = {
                descricao: formData.descricao,
                valor: formData.valor,
                data_pagamento: formData.data_pagamento,
                competencia: formData.competencia,
                fornecedor: parseInt(formData.fornecedor, 10),
                conta_financeira: parseInt(formData.conta_financeira, 10), // Corrigido
                centro_custo: parseInt(formData.centro_custo, 10), // Corrigido
                projetos: formData.projetos.map(projeto => parseInt(projeto.projeto, 10)),
                
            };

            console.log('Enviando dados:', payload);
            const response = await axios.post('http://127.0.0.1:8000/api/contas-a-pagar-avulso/', payload, { headers });
            console.log('Conta a pagar avulso criada:', response.data);
            setSuccessMessage('Conta a pagar avulso criada com sucesso!');
            setFormData({
                descricao: '',
                valor: '',
                data_pagamento: '',
                competencia: '',
                fornecedor: '',
                conta_financeira: '',
                centro_custo: '',
                projetos: [],
            });
        } catch (error) {
            setError('Erro ao criar conta a pagar avulso.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cpa-main-form-container">
            <SideBar />
            
            <main className="cpa-main-content">
                
                <div className="cpa-cliente-form-container">
                    <h2>Conta a pagar avulso</h2>
                    <form onSubmit={handleSubmit} className="contas-pagar-avulso-form">
                      
                        <div className="cpa-form-group">
                            <label htmlFor="descricao">Descrição:</label>
                            <input type="text" id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <div className="cpa-form-group">
                                <label htmlFor="data_pagamento">Data de Pagamento:</label>
                                <input type="date" id="data_pagamento" className="dt-pick" name="data_pagamento" value={formData.data_pagamento} onChange={handleChange} />
                            </div>
                        
                            <div className="cpa-form-group">
                                <label htmlFor="competencia">Competência:</label>
                                <DatePicker
                                    selected={formData.competencia ? new Date(`01/${formData.competencia}`) : null}
                                    onChange={handleDateChange}
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                />
                            </div>
                        
                            <div className="cpa-form-group">
                                <label htmlFor="fornecedor">Fornecedor:</label>
                                <select id="fornecedor" name="fornecedor" value={formData.fornecedor} onChange={handleChange}>
                                    <option value="">Selecione um fornecedor</option>
                                    {fornecedores.map(fornecedor => (
                                        <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div> 
                        <div className="form-row">
                        <div className="form-row financeiro">   
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
                    </div>
                
                        <div className="cpa-projetos-section">
                            <h3>Projetos:</h3>
                            {formData.projetos.map((projetoItem, index) => (
                                <div key={index} className="cpa-projeto-item">
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
                                    <input
                                        type="number"
                                        name="valor"
                                        value={projetoItem.valor}
                                        onChange={(event) => handleProjetoChange(event, index)}
                                        step="0.01"
                                    />
                                    <button type="button" onClick={() => removeProjeto(index)}>Remover</button>
                                </div>
                            ))}
                            <button type="button" onClick={addProjeto}>Adicionar Projeto</button>
                        </div>

                        <div className="cpa-form-group">
                            <label htmlFor="valor">Valor Total:</label>
                            <input type="text" id="valor" name="valor" value={formData.valor} readOnly />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>

                        {error && typeof error === 'string' && <p className="error">{error}</p>}
                        {successMessage && <p className="success">{successMessage}</p>}
                    </form>
                </div>
            </main>
            <ContaPagarAvulsoList />
        </div>
    );
}

export default ContasPagarAvulsoForm;
