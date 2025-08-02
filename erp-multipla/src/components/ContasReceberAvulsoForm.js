<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Importa o CSS do react-datepicker
import './ContasReceberAvulsoForm.css'; // Crie o arquivo CSS se necessário
import SideBar from './SideBar';
import Header from './Header';
import ContaReceberAvulsoList from './ContaReceberAvulsoList';

function ContasReceberAvulsoForm() {
    const [clientes, setClientes] = useState([]);
    const [projetos, setProjetos] = useState([]);
    const [contaFinanceira, setContaFinanceira] = useState([]);
    const [centrCusto, setCentroCusto] = useState([]);
    const [formData, setFormData] = useState({
        descricao: '',
        valor_total: 0,
        data_recebimento: '',
        competencia: '',
        conta_financeira: '',
        centro_custo: '',
        cliente: '',
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

                const [clientesResponse, projetosResponse, contaFinanceirasResponse, centroCustoResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/select/clientes/', { headers }),
                    axios.get('http://127.0.0.1:8000/api/select/projetos/', { headers }),
                    axios.get('http://localhost:8000/api/contas-financeiras/', { headers }),
                    axios.get('http://localhost:8000/api/centros-custos/', { headers }),
                ]);

                console.log('Clientes Response:', clientesResponse.data);
                console.log('Projetos Response:', projetosResponse.data);

                setClientes(clientesResponse.data);
                setProjetos(projetosResponse.data);
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
        // Atualizar valor total quando os projetos mudam
        const total = formData.projetos.reduce((acc, projeto) => acc + parseFloat(projeto.valor || 0), 0);
        setFormData(prevFormData => ({ ...prevFormData, valor_total: total }));
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
        // Atualiza a competência com o formato MM/YYYY
        const formattedDate = date ? `${date.getMonth() + 1}/${date.getFullYear()}` : '';
        setFormData(prevFormData => ({
            ...prevFormData,
            competencia: formattedDate,
        }));
    };

    const handleDataRecebimentoChange = (event) => {
        const date = event.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            data_recebimento: date,
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
                descricao: formData.descricao,
                valor: parseFloat(formData.valor_total), // Enviando como valor
                data_recebimento: formData.data_recebimento, // No formato YYYY-MM-DD
                competencia: formData.competencia,
                cliente: parseInt(formData.cliente, 10),
                conta_financeira: parseInt(formData.conta_financeira, 10), // Corrigido
                centro_custo: parseInt(formData.centro_custo, 10), // Corrigido
                projetos: formData.projetos.map(projeto => parseInt(projeto.projeto, 10)), // Enviando apenas IDs dos projetos
            };
            console.log('Enviando dados:', payload);
            const response = await axios.post('http://127.0.0.1:8000/api/contas-a-receber-avulso/', payload, { headers });
            console.log('Conta a receber avulso criada:', response.data);
            setSuccessMessage('Conta a receber avulso criada com sucesso!');
            setFormData({
                descricao: '',
                valor_total: 0,
                data_recebimento: '',
                competencia: '',
                cliente: '',
                conta_financeira: '',
                centro_custo: '',
                projetos: [],
            });

        } catch (error) {
            setError('Erro ao criar conta a receber avulso.');
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
                    <h2>Faturamento de Contrato avulso</h2>
                    <form onSubmit={handleSubmit} className="conta-receber-avulso-form">
                        <div className="form-group">
                            <label htmlFor="descricao">Descrição:</label>
                            <input
                                type="text"
                                id="descricao"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="cliente">Cliente:</label>
                                    <select
                                        id="cliente"
                                        name="cliente"
                                        value={formData.cliente}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione um cliente</option>
                                        {clientes.map(cliente => (
                                            <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="data_recebimento">Data de Recebimento:</label>
                                    <input
                                        type="date"
                                        id="data_recebimento"
                                        name="data_recebimento"
                                        value={formData.data_recebimento}
                                        onChange={handleDataRecebimentoChange}
                                    />
                                </div>
                        
                                <div className="form-group">
                                    <label htmlFor="competencia">Competência:</label>
                                    <DatePicker
                                        selected={formData.competencia ? new Date(`01/${formData.competencia}`) : null}
                                        onChange={handleDateChange}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                    />
                                </div>
                        </div>
                        <div className="form-row"></div>
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


                        <div className="projetos-section">
                            <h3>Projetos:</h3>
                            {formData.projetos.map((projetoItem, index) => (
                                <div key={index} className="projeto-item">
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
                        <div className="form-group">
                            <label htmlFor="valor_total">Valor Total:</label>
                            <input
                                type="text"
                                id="valor_total"
                                name="valor_total"
                                value={formData.valor_total}
                                readOnly
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                        {error && typeof error === 'string' && <p className="error">{error}</p>}
                        {successMessage && <p className="success">{successMessage}</p>}
                    </form>
                </div>
            </main>
            <ContaReceberAvulsoList />
        </div>
    );
}

export default ContasReceberAvulsoForm;
=======
// ContasReceberAvulsoForm.js

import React, { useState, useEffect } from 'react';
import api from '../api'; // Importa a instância configurada do axios
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { BarLoader } from 'react-spinners';
import './ContasReceberAvulsoForm.css';
import SideBar from './SideBar';
import ContaReceberAvulsoList from './ContaReceberAvulsoList';
import { toast } from 'react-toastify';

function ContasReceberAvulsoForm() {
  const [clientes, setClientes] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [contaFinanceira, setContaFinanceira] = useState([]);
  const [centrCusto, setCentroCusto] = useState([]);
  const [formData, setFormData] = useState({
    descricao: '',
    valor_total: 0,
    data_recebimento: '',
    competencia: null,
    conta_financeira: '',
    centro_custo: '',
    cliente: '',
    projetos: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usando a instância api para requisições
        const [
          clientesResponse,
          projetosResponse,
          contaFinanceirasResponse,
          centroCustoResponse
        ] = await Promise.all([
          api.get('/api/select/clientes/'), // Caminho relativo
          api.get('/api/select/projetos/'),
          api.get('/api/contas-financeiras/'),
          api.get('/api/centros-custos/')
        ]);

        setClientes(clientesResponse.data);
        setProjetos(projetosResponse.data);
        setContaFinanceira(contaFinanceirasResponse.data);
        setCentroCusto(centroCustoResponse.data);
      } catch (error) {
        toast.error('Erro ao carregar dados iniciais');
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const total = formData.projetos.reduce((acc, projeto) => 
      acc + parseFloat(projeto.valor || 0), 0
    );
    setFormData(prev => ({ ...prev, valor_total: total.toFixed(2) }));
  }, [formData.projetos]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjetoChange = (event, index) => {
    const { name, value } = event.target;
    const updatedProjetos = [...formData.projetos];
    updatedProjetos[index] = { ...updatedProjetos[index], [name]: value };
    setFormData(prev => ({ ...prev, projetos: updatedProjetos }));
  };

  const addProjeto = () => {
    setFormData(prev => ({
      ...prev,
      projetos: [...prev.projetos, { projeto: '', valor: 0 }]
    }));
  };

  const removeProjeto = (index) => {
    setFormData(prev => ({
      ...prev,
      projetos: prev.projetos.filter((_, i) => i !== index)
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, competencia: date }));
  };

  // Função de edição corrigida
  const handleEdit = async (id) => {
    setLoadingEdit(true);
    try {
      // Usando a instância api para requisições
      const response = await api.get(`/api/contas-a-receber-avulso/${id}/`);

      let projetosFormatados = [];
      if (response.data.projetos_info && response.data.projetos_info.length > 0) {
        projetosFormatados = response.data.projetos_info.map(item => ({
          projeto: item.projeto_id.toString(),
          valor: item.valor
        }));
      }

      let competenciaDate = null;
      if (response.data.competencia) {
        const [month, year] = response.data.competencia.split('/');
        competenciaDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
      }

      const dataRecebimento = response.data.data_recebimento?.split('T')[0];

      setFormData({
        descricao: response.data.descricao,
        valor_total: response.data.valor,
        data_recebimento: dataRecebimento || '',
        competencia: competenciaDate,
        conta_financeira: response.data.conta_financeira?.toString() || '',
        centro_custo: response.data.centro_custo?.toString() || '',
        cliente: response.data.cliente?.toString() || '',
        projetos: projetosFormatados
      });
      setEditingId(id);
      toast.success('Dados carregados para edição');
    } catch (error) {
      console.error('Erro na edição:', error);
      toast.error(`Erro: ${error.response?.data?.detail || 'Falha ao carregar dados'}`);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Formatação da competência para "MM/YYYY"
      const formattedCompetencia = formData.competencia
        ? `${String(formData.competencia.getMonth() + 1).padStart(2, '0')}/${formData.competencia.getFullYear()}`
        : '';

      const payload = {
        descricao: formData.descricao,
        valor: parseFloat(formData.valor_total),
        data_recebimento: formData.data_recebimento,
        competencia: formattedCompetencia,
        cliente: parseInt(formData.cliente, 10) || null,
        conta_financeira: parseInt(formData.conta_financeira, 10) || null,
        centro_custo: parseInt(formData.centro_custo, 10) || null,
        projetos: formData.projetos.map(p => ({
          projeto: parseInt(p.projeto, 10),
          valor: parseFloat(p.valor)
        }))
      };

      if (editingId) {
        await api.put(`/api/contas-a-receber-avulso/${editingId}/`, payload);
        toast.success('Conta atualizada com sucesso!');
      } else {
        await api.post('/api/contas-a-receber-avulso/', payload);
        toast.success('Conta criada com sucesso!');
      }

      setRefreshList(prev => !prev);
      resetForm();
    } catch (error) {
      console.error('Erro ao processar solicitação:', error);
      toast.error(error.response?.data?.detail || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      descricao: '',
      valor_total: 0,
      data_recebimento: '',
      competencia: null,
      conta_financeira: '',
      centro_custo: '',
      cliente: '',
      projetos: [],
    });
    setEditingId(null);
  };

  const showProjectWarning = () => {
    if (editingId && formData.projetos.length > 0 && !formData.projetos[0].projeto) {
      return (
        <div className="warning-message" style={{
          backgroundColor: "#fff3cd", 
          color: "#856404", 
          padding: "10px", 
          borderRadius: "4px", 
          marginBottom: "15px"
        }}>
          <strong>Atenção:</strong> Não foi possível recuperar automaticamente os projetos associados a esta conta. 
          Por favor, selecione o(s) projeto(s) correto(s).
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cpa-main-form-container">
      <SideBar />
      <main className="cpa-main-content">
        <div className="cpa-cliente-form-container">
          <h2>Contas a Receber Avulso</h2>
          {loadingEdit && <BarLoader color="#36D7B7" width="100%" />}
          <form onSubmit={handleSubmit} className="conta-receber-avulso-form">
            <div className="form-row">
              <div className="form-group">
                <label>Descrição:</label>
                <input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Cliente:</label>
                <select
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Data Recebimento:</label>
                <input
                  type="date"
                  name="data_recebimento"
                  value={formData.data_recebimento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Competência:</label>
                <DatePicker
                  selected={formData.competencia}
                  onChange={handleDateChange}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  placeholderText="MM/AAAA"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Conta Financeira:</label>
                <select
                  name="conta_financeira"
                  value={formData.conta_financeira}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  {contaFinanceira.map(conta => (
                    <option key={conta.id} value={conta.id}>
                      {conta.descricao}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Centro Custo:</label>
                <select
                  name="centro_custo"
                  value={formData.centro_custo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  {centrCusto.map(centro => (
                    <option key={centro.id} value={centro.id}>
                      {centro.descricao}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="projetos-section">
              <h3>Projetos Vinculados</h3>
              {showProjectWarning()}
              {formData.projetos.map((projeto, index) => (
                <div key={index} className="projeto-item">
                  <select
                    name="projeto"
                    value={projeto.projeto}
                    onChange={(e) => handleProjetoChange(e, index)}
                    required
                  >
                    <option value="">Selecione</option>
                    {projetos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="valor"
                    value={projeto.valor}
                    onChange={(e) => handleProjetoChange(e, index)}
                    step="0.01"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeProjeto(index)}
                    className="remove-button"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addProjeto}
                className="add-projeto-button"
              >
                + Adicionar Projeto
              </button>
            </div>
            <div className="form-row">
              {formData.projetos.length > 0 && (
                <div className="form-row">
                  <div className="form-group total-value">
                    <label>Valor Total:</label>
                    <div className="total-display-cra">R$ {formData.valor_total}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <BarLoader color="#fff" width={50} />
                ) : editingId ? (
                  'Atualizar Conta'
                ) : (
                  'Cadastrar Conta'
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="cpa-list-container">
          <ContaReceberAvulsoList
            onEdit={handleEdit}
            refresh={refreshList}
          />
        </div>
      </main>
    </div>
  );
}

export default ContasReceberAvulsoForm;
>>>>>>> e62255e (Atualizações no projeto)
