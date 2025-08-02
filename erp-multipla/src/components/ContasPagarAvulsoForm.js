<<<<<<< HEAD
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
=======
// ContasPagarAvulsoForm.js

import React, { useState, useEffect } from 'react';
import api from '../api'; // Importa a instância configurada do axios
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import SideBar from './SideBar';
import './ContasPagarAvulsoForm.css';
import ContaPagarAvulsoList from './ContaPagarAvulsoList';
import { toast } from 'react-toastify';
import { BarLoader } from 'react-spinners';

function ContasPagarAvulsoForm() {
  const [projetos, setProjetos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [contaFinanceira, setContaFinanceira] = useState([]);
  const [centrCusto, setCentroCusto] = useState([]);
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data_pagamento: '',
    competencia: null,
    conta_financeira: '',
    centro_custo: '',
    fornecedor: '',
    projetos: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  // Busca dados gerais (projetos, fornecedores, contas financeiras, centros de custo)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          projetosResponse,
          fornecedoresResponse,
          contaFinanceirasResponse,
          centroCustoResponse
        ] = await Promise.all([
          api.get('/api/select/projetos/'), // Caminho relativo
          api.get('/api/select/fornecedores/'),
          api.get('/api/contas-financeiras/'),
          api.get('/api/centros-custos/')
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

  // Calcula o valor total a partir dos projetos
  useEffect(() => {
    const total = formData.projetos
      .reduce((acc, projeto) => acc + parseFloat(projeto.valor || 0), 0)
      .toFixed(2);
    setFormData(prevFormData => ({ ...prevFormData, valor: total }));
  }, [formData.projetos]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleProjetoChange = (event, index) => {
    const { name, value } = event.target;
    const updatedProjetos = [...formData.projetos];
    updatedProjetos[index] = { ...updatedProjetos[index], [name]: value };
    setFormData(prevFormData => ({
      ...prevFormData,
      projetos: updatedProjetos
    }));
  };

  const addProjeto = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      projetos: [...prevFormData.projetos, { projeto: '', valor: 0 }]
    }));
  };

  const removeProjeto = (index) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      projetos: prevFormData.projetos.filter((_, i) => i !== index)
    }));
  };

  // Atualiza a competência armazenando a data como objeto Date
  const handleDateChange = (date) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      competencia: date
    }));
  };

  // Função para buscar os dados da conta e preencher o formulário para edição
  const handleEdit = async (id) => {
    setLoadingEdit(true);
    try {
      const response = await api.get(`/api/contas-a-pagar-avulso/${id}/`); // Caminho relativo

      // Converte a string de competência ("MM/YYYY") para objeto Date
      let competenciaDate = null;
      if (response.data.competencia) {
        const [month, year] = response.data.competencia.split('/');
        competenciaDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
      }

      // Use o campo 'projetos_info' para formatar os dados dos projetos
      const projetosFormatados = Array.isArray(response.data.projetos_info)
        ? response.data.projetos_info.map(p => ({
            projeto: p.projeto_id?.toString() || '',
            valor: p.valor?.toString() || '0'
          }))
        : [];

      setFormData({
        descricao: response.data.descricao || '',
        valor: response.data.valor || '',
        data_pagamento: response.data.data_pagamento || '',
        competencia: competenciaDate,
        conta_financeira: response.data.conta_financeira?.toString() || '',
        centro_custo: response.data.centro_custo?.toString() || '',
        fornecedor: response.data.fornecedor?.toString() || '',
        projetos: projetosFormatados
      });

      setEditingId(id);
    } catch (error) {
      console.error('Erro ao buscar conta para edição:', error);
      toast.error('Erro ao carregar dados da conta para edição');
    } finally {
      setLoadingEdit(false);
    }
  };

  // Manipula o envio do formulário para criação ou atualização
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Formata a competência para "MM/YYYY" ao enviar os dados
      const formattedCompetencia = formData.competencia
        ? `${String(formData.competencia.getMonth() + 1).padStart(2, '0')}/${formData.competencia.getFullYear()}`
        : '';

      const payload = {
        descricao: formData.descricao,
        valor: formData.valor,
        data_pagamento: formData.data_pagamento,
        competencia: formattedCompetencia,
        fornecedor: parseInt(formData.fornecedor, 10),
        conta_financeira: parseInt(formData.conta_financeira, 10),
        centro_custo: parseInt(formData.centro_custo, 10),
        projetos: formData.projetos.map(p => ({
          projeto: parseInt(p.projeto, 10),
          valor: parseFloat(p.valor)
        }))
      };

      if (editingId) {
        // Atualiza a conta existente
        await api.put(`/api/contas-a-pagar-avulso/${editingId}/`, payload); // Caminho relativo
        setSuccessMessage('Conta a pagar avulso atualizada com sucesso!');
      } else {
        // Cria nova conta
        await api.post('/api/contas-a-pagar-avulso/', payload);
        setSuccessMessage('Conta a pagar avulso criada com sucesso!');
      }

      // Dispara o refresh da listagem
      setRefreshList(prev => !prev);
      resetForm();
    } catch (error) {
      // 1) Veja o payload de validação que veio do DRF
      console.error('Resposta de erro do backend:', error.response?.data);

      // 2) Extraia todas as mensagens e exiba num só toast
      const messages = Object
        .values(error.response?.data || {})
        .flat()
        .join(' • ');
      toast.error(messages || 'Erro desconhecido ao enviar');
    }
  };

  const resetForm = () => {
    setFormData({
      descricao: '',
      valor: '',
      data_pagamento: '',
      competencia: null,
      fornecedor: '',
      conta_financeira: '',
      centro_custo: '',
      projetos: []
    });
    setEditingId(null);
  };

  return (
    <div className="cpa-main-form-container">
      <SideBar />
      <main className="cpa-main-content">
        <div className="cpa-cliente-form-container">
          <h2>Conta a pagar avulso</h2>
          {loadingEdit && <BarLoader color="#36D7B7" />}
          <form onSubmit={handleSubmit} className="contas-pagar-avulso-form">
            {/* Linha 1: Descrição e Data de Pagamento */}
            <div className="form-row">
              <div className="cpa-form-group">
                <label htmlFor="descricao">Descrição:</label>
                <input
                  type="text"
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                />
              </div>
              <div className="cpa-form-group">
                <label htmlFor="data_pagamento">Data de Pagamento:</label>
                <input
                  type="date"
                  id="data_pagamento"
                  className="dt-pick"
                  name="data_pagamento"
                  value={formData.data_pagamento}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Linha 2: Competência e Fornecedor */}
            <div className="form-row">
              <div className="cpa-form-group">
                <label htmlFor="competencia">Competência:</label>
                <DatePicker
                  selected={formData.competencia}
                  onChange={handleDateChange}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                />
              </div>
              <div className="cpa-form-group">
                <label htmlFor="fornecedor">Fornecedor:</label>
                <select
                  id="fornecedor"
                  name="fornecedor"
                  value={formData.fornecedor}
                  onChange={handleChange}
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.map(fornecedor => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Linha 3: Contas Financeiras e Centro de Custos */}
            <div className="form-row">
              <div className="cpa-form-group">
                <label htmlFor="contas_financeiras">Contas Financeiras:</label>
                <select
                  id="conta_financeira"
                  name="conta_financeira"
                  value={formData.conta_financeira}
                  onChange={handleChange}
                >
                  <option value="">Selecione uma Conta Financeira</option>
                  {contaFinanceira.map(conta => (
                    <option key={conta.id} value={conta.id}>
                      {conta.descricao}
                    </option>
                  ))}
                </select>
              </div>
              <div className="cpa-form-group">
                <label htmlFor="centro_custo">Centro de Custos:</label>
                <select
                  id="centro_custo"
                  name="centro_custo"
                  value={formData.centro_custo}
                  onChange={handleChange}
                >
                  <option value="">Selecione um Centro de custo</option>
                  {centrCusto.map(centro => (
                    <option key={centro.id} value={centro.id}>
                      {centro.descricao}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Seção de Projetos */}
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
                      <option key={projeto.id} value={projeto.id}>
                        {projeto.nome}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="valor"
                    value={projetoItem.valor}
                    onChange={(event) => handleProjetoChange(event, index)}
                    step="0.01"
                  />
                  <button type="button" onClick={() => removeProjeto(index)}>
                    Remover
                  </button>
                </div>
              ))}
              <button type="button" onClick={addProjeto}>
                Adicionar Projeto
              </button>
            </div>

            {/* Exibe o total somente se houver projetos */}
            {formData.projetos.length > 0 && (
              <div className="form-row">
                <div className="form-group total-value">
                  <label>Valor Total:</label>
                  <div className="total-display">R$ {formData.valor}</div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : editingId ? 'Atualizar' : 'Enviar'}
            </button>

            {error && typeof error === 'string' && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
          </form>
        </div>
        <div className="cpa-list-container">
          <ContaPagarAvulsoList onEdit={handleEdit} refresh={refreshList} />
        </div>
      </main>
    </div>
  );
}

export default ContasPagarAvulsoForm;
>>>>>>> e62255e (Atualizações no projeto)
