// RelatorioProjecoes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RelatorioProjecoes.css'
import SideBar from './SideBar';

const RelatorioProjecoes = () => {
  const [relatorio, setRelatorio] = useState([]);
  const [totais, setTotais] = useState({});
  const [filters, setFilters] = useState({
    data_inicio: '',
    data_fim: '',
    cliente: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRelatorio();
  }, []);

  const fetchRelatorio = async () => {
    setLoading(true);
    setError(null);
    try {
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
      setError('Erro ao carregar o relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRelatorio();
  };

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
