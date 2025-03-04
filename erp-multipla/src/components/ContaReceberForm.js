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