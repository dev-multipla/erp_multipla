// RelatorioFinanceiro.js
import React, { useState } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import SideBar from './SideBar'; // Importa o componente SideBar
import './RelatorioFinanceiro.css'; // Certifique-se de criar o arquivo CSS

const RelatorioFinanceiro = () => {
  const [dados, setDados] = useState([]);
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarRelatorio = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get('http://127.0.0.1:8000/api/relatorio-financeiro/gerar_relatorio/', {
        params: { mes, ano },
        headers
      });

      setDados(response.data);
    } catch (error) {
      setError('Erro ao buscar relatório.');
    } finally {
      setLoading(false);
    }
  };

  // Usando os valores diretamente do "Total" que vem da API
  const totalLinha = dados.find(item => item.Contrato === 'Total') || {};

  // Se desejar recalcular, faça a verificação
  const totalReceitas = dados.reduce((acc, item) => acc + (parseFloat(item.Receita) || 0), 0).toFixed(2);
  const totalDespesas = dados.reduce((acc, item) => acc + (parseFloat(item.Despesa) || 0), 0).toFixed(2);
  const resultadoLiquido = (totalReceitas - totalDespesas).toFixed(2);

  // Compare os valores calculados com os valores fornecidos pela API (opcional)
  console.log('Receita calculada:', totalReceitas, 'Receita fornecida:', totalLinha.Receita);
  console.log('Despesa calculada:', totalDespesas, 'Despesa fornecida:', totalLinha.Despesa);
  console.log('Resultado calculado:', resultadoLiquido, 'Resultado fornecido:', totalLinha.Resultado);

  const columns = React.useMemo(
    () => [
      { Header: 'Contrato', accessor: 'Contrato' },
      { Header: 'Projeto', accessor: 'Projeto' },
      { Header: 'Receita', accessor: 'Receita' },
      { Header: 'Despesa', accessor: 'Despesa' },
      { Header: 'Resultado', accessor: 'Resultado' }
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: dados });

  return (
    <div className="dashboard">
      <SideBar /> {/* Usa o componente SideBar existente */}

      <div className="main-content">
        <header>
          <h1>Relatório Financeiro</h1>
          <div className="filters">
            <div className="filter-item">
              <label>Mês:</label>
              <input
                type="number"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                min="1"
                max="12"
              />
            </div>
            <div className="filter-item">
              <label>Ano:</label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                min="2000"
                max="2100"
              />
            </div>
            <button onClick={buscarRelatorio} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
          </div>
        </header>

        {error && <p className="error">{error}</p>}

        <section className="stats-overview">
          <div className="stat-card">
            <h3>Total de Receitas</h3>
            <p>R$ {totalLinha.Receita ? totalLinha.Receita.toFixed(2) : totalReceitas}</p>
          </div>
          <div className="stat-card">
            <h3>Total de Despesas</h3>
            <p>R$ {totalLinha.Despesa ? totalLinha.Despesa.toFixed(2) : totalDespesas}</p>
          </div>
          <div className="stat-card">
            <h3>Resultado Líquido</h3>
            <p>R$ {totalLinha.Resultado ? totalLinha.Resultado.toFixed(2) : resultadoLiquido}</p>
          </div>
        </section>

        <section className="table-container">
          <h2>Detalhamento por Contrato</h2>
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default RelatorioFinanceiro;
