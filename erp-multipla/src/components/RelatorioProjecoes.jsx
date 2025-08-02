<<<<<<< HEAD
// RelatorioProjecoes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RelatorioProjecoes.css'
import SideBar from './SideBar';

const RelatorioProjecoes = () => {
  const [relatorio, setRelatorio] = useState([]);
  const [totais, setTotais] = useState({});
=======
import React, { useState, useEffect } from 'react';
import api from '../api';
import SideBar from './SideBar';
import './RelatorioProjecoes.css';

const RelatorioOperacional = () => {
  const [receberAtrasadas, setReceberAtrasadas] = useState([]);
  const [receberPagas, setReceberPagas] = useState([]);
  const [receberNaoFaturadas, setReceberNaoFaturadas] = useState([]);
  const [pagar, setPagar] = useState([]);
  const [pagarAtrasadas, setPagarAtrasadas] = useState([]);

>>>>>>> e62255e (Atualizações no projeto)
  const [filters, setFilters] = useState({
    data_inicio: '',
    data_fim: '',
    cliente: '',
<<<<<<< HEAD
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

=======
    contrato: '',
    projeto: '',
    fornecedor: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

>>>>>>> e62255e (Atualizações no projeto)
  useEffect(() => {
    fetchRelatorio();
  }, []);

  const fetchRelatorio = async () => {
    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      // Filtrar parâmetros que não estão vazios
      const params = {};
      if (filters.data_inicio) params.data_inicio = filters.data_inicio;
      if (filters.data_fim) params.data_fim = filters.data_fim;
      if (filters.cliente) params.cliente = filters.cliente;
      if (filters.status) params.status = filters.status;

      const response = await axios.get('http://localhost:8000/api/relatorio-projecoes/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: params
      });
      setRelatorio(response.data.relatorio);
      setTotais(response.data.totais);
    } catch (error) {
=======
      const params = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params[key] = val;
      });
      const { data } = await api.get(
        '/api/relatorios/operacional/gerar_relatorio/',
        { params }
      );
      setReceberAtrasadas(data.receber_atrasadas);
      setReceberPagas(data.receber_pagas);
      setReceberNaoFaturadas(data.receber_nao_faturadas);
      setPagar(data.pagar);
      setPagarAtrasadas(data.pagar_atrasadas);
    } catch (err) {
      console.error(err);
>>>>>>> e62255e (Atualizações no projeto)
      setError('Erro ao carregar o relatório');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
=======
  const handleChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
>>>>>>> e62255e (Atualizações no projeto)
    e.preventDefault();
    fetchRelatorio();
  };

<<<<<<< HEAD
  return (
  <div className="relatorio-projecoes-container">
    <SideBar /> {/* Usa o componente SideBar existente */}
    <div className="relatorio-projecoes">
      <h2>Relatório de Projeções</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Data Início:</label>
          <input
            type="date"
            name="data_inicio"
            value={filters.data_inicio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Data Fim:</label>
          <input
            type="date"
            name="data_fim"
            value={filters.data_fim}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Cliente:</label>
          <input
            type="text"
            name="cliente"
            value={filters.cliente}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="pago">Pago</option>
            <option value="aberto">Aberto</option>
          </select>
        </div>
        <button type="submit">Filtrar</button>
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h3>Totais</h3>
          <p>Total a Receber: {totais.total_receber}</p>
          <p>Total a Pagar: {totais.total_pagar}</p>
          <p>Total Recebido: {totais.total_recebido}</p>
          <p>Total Pago: {totais.total_pago}</p>

          <h3>Detalhes do Relatório</h3>
          <table>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Tipo</th>
                <th>Valor Total</th>
                <th>Valor Pago</th>
                <th>Valor Aberto</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.map((item, index) => (
                <tr key={index}>
                  <td>{item.mes}</td>
                  <td>{item.tipo}</td>
                  <td>{item.valor_total}</td>
                  <td>{item.valor_pago}</td>
                  <td>{item.valor_aberto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);
};
export default RelatorioProjecoes;
=======
  const renderProjTable = (items) => (
    <div className="table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Contrato</th>
            <th>Cliente/Fornecedor</th>
            <th>Projetos</th>
            <th>Data Vencimento</th>
            <th>Valor</th>
            <th>Pago</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.contrato.numero}</td>
              <td>{item.cliente_fornecedor}</td>
              <td>{item.projetos.join(', ')}</td>
              <td>{item.data_vencimento}</td>
              <td>{item.valor}</td>
              <td>{item.pago ? 'Sim' : 'Não'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContratoTable = (items) => (
    <div className="table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Contrato</th>
            <th>Cliente</th>
          </tr>
        </thead>
        <tbody>
          {items.map(c => (
            <tr key={c.contrato_id}>
              <td>{c.contrato_id}</td>
              <td>{c.numero}</td>
              <td>{c.cliente}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="app-layout">
      <SideBar />
      <div className="report-container">
        <header className="report-header">
          <h2>Relatório Operacional Financeiro</h2>
        </header>

        <form className="filters-form" onSubmit={handleSubmit}>
          {/* Data Início */}
          <div className="filter-item">
            <label htmlFor="data_inicio">Data Início</label>
            <input
              id="data_inicio"
              type="date"
              name="data_inicio"
              value={filters.data_inicio}
              onChange={handleChange}
            />
          </div>
          {/* Data Fim */}
          <div className="filter-item">
            <label htmlFor="data_fim">Data Fim</label>
            <input
              id="data_fim"
              type="date"
              name="data_fim"
              value={filters.data_fim}
              onChange={handleChange}
            />
          </div>
          {/* Cliente */}
          <div className="filter-item">
            <label htmlFor="cliente">Cliente</label>
            <input
              id="cliente"
              type="text"
              name="cliente"
              placeholder="Nome do cliente"
              value={filters.cliente}
              onChange={handleChange}
            />
          </div>
          {/* Fornecedor */}
          <div className="filter-item">
            <label htmlFor="fornecedor">Fornecedor</label>
            <input
              id="fornecedor"
              type="text"
              name="fornecedor"
              placeholder="Nome do fornecedor"
              value={filters.fornecedor}
              onChange={handleChange}
            />
          </div>
          {/* Contrato */}
          <div className="filter-item">
            <label htmlFor="contrato">Contrato</label>
            <input
              id="contrato"
              type="text"
              name="contrato"
              placeholder="Número do contrato"
              value={filters.contrato}
              onChange={handleChange}
            />
          </div>
          {/* Projeto */}
          <div className="filter-item">
            <label htmlFor="projeto">Projeto</label>
            <input
              id="projeto"
              type="text"
              name="projeto"
              placeholder="ID ou nome do projeto"
              value={filters.projeto}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="filter-submit">
            Filtrar
          </button>
        </form>

        <div className="report-body">
          {loading && <div className="report-message">Carregando...</div>}
          {error && <div className="report-message">{error}</div>}
          {!loading && !error && (
            <>
              <h3>Contas a Receber Atrasadas</h3>
              {receberAtrasadas.length
                ? renderProjTable(receberAtrasadas)
                : <p>Nenhuma conta a receber atrasada.</p>
              }

              <h3>Contas a Receber Pagas</h3>
              {receberPagas.length
                ? renderProjTable(receberPagas)
                : <p>Nenhuma conta a receber paga.</p>
              }

              <h3>Contratos Não Faturados</h3>
              {receberNaoFaturadas.length
                ? renderContratoTable(receberNaoFaturadas)
                : <p>Nenhum contrato não faturado.</p>
              }

              <h3>Contas a Pagar</h3>
              {pagar.length
                ? renderProjTable(pagar)
                : <p>Nenhuma conta a pagar.</p>
              }

              <h3>Contas a Pagar Atrasadas</h3>
              {pagarAtrasadas.length
                ? renderProjTable(pagarAtrasadas)
                : <p>Nenhuma conta a pagar atrasada.</p>
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatorioOperacional;
>>>>>>> e62255e (Atualizações no projeto)
