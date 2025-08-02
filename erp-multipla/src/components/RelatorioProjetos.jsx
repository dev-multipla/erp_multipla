import React, { useState, useEffect } from 'react';
import api from '../api';
import './RelatorioProjetos.css';

const RelatorioResultadoProjeto = () => {
  const [filtros, setFiltros] = useState({
    projeto_id: '',
    data_inicio: '',
    data_fim: '',
    tipo: '',
    include_orcado: true,
    contrato_id: '',
    centro_custo: '',
    conta_financeira: '',
    valor_min: '',
    valor_max: '',
    order_by: 'data_movimento'
  });

  const [dados, setDados] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [saldoFinal, setSaldoFinal] = useState(0);

  // Carregar projetos ao montar o componente
  useEffect(() => {
    carregarProjetos();
  }, []);

  // Carregar contratos quando um projeto for selecionado
  useEffect(() => {
    if (filtros.projeto_id) {
      carregarContratos();
    }
  }, [filtros.projeto_id]);

  const carregarProjetos = async () => {
    try {
      const response = await api.get('/api/projetos/');
      setProjetos(response.data.results || response.data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const carregarContratos = async () => {
    try {
      const response = await api.get(`/api/contratos/?projeto_id=${filtros.projeto_id}`);
      setContratos(response.data.results || response.data);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calcularResumo = (dadosRelatorio) => {
    let receitas = 0;
    let despesas = 0;

    dadosRelatorio.forEach(item => {
      if (item.tipo === 'RECEITA') {
        receitas += parseFloat(item.valor);
      } else if (item.tipo === 'DESPESA') {
        despesas += parseFloat(item.valor);
      }
    });

    setTotalReceitas(receitas);
    setTotalDespesas(despesas);
    setSaldoFinal(receitas - despesas);
  };

  const buscarRelatorio = async (e) => {
    e.preventDefault();
    
    if (!filtros.projeto_id || !filtros.data_inicio || !filtros.data_fim) {
      setError('Projeto, data de início e data de fim são obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== '' && filtros[key] !== null) {
          params.append(key, filtros[key]);
        }
      });

      const response = await api.get(`/api/relatorio-resultado-projeto/?${params.toString()}`);
      setDados(response.data);
      calcularResumo(response.data);
    } catch (error) {
      setError('Erro ao buscar relatório: ' + (error.response?.data?.error || error.message));
      setDados([]);
    } finally {
      setLoading(false);
    }
  };

  const limparFiltros = () => {
    setFiltros({
      projeto_id: '',
      data_inicio: '',
      data_fim: '',
      tipo: '',
      include_orcado: true,
      contrato_id: '',
      centro_custo: '',
      conta_financeira: '',
      valor_min: '',
      valor_max: '',
      order_by: 'data_movimento'
    });
    setDados([]);
    setContratos([]);
    setError('');
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const exportarCSV = () => {
    if (dados.length === 0) return;

    const headers = ['Tipo', 'Data Movimento', 'Projeto', 'Contrato', 'Centro Custo', 'Conta Financeira', 'Valor', 'Saldo'];
    const csvContent = [
      headers.join(','),
      ...dados.map(item => [
        item.tipo,
        formatarData(item.data_movimento),
        item.projeto,
        item.contrato,
        item.centro_custo,
        item.conta_financeira,
        item.valor,
        item.saldo
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_projeto_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relatorio-projeto-container">
      <div className="relatorio-header">
        <h1>Relatório de Resultado por Projeto - Analítico</h1>
      </div>

      <form onSubmit={buscarRelatorio} className="filtros-form">
        <div className="filtros-grid">
          <div className="campo-obrigatorio">
            <label htmlFor="projeto_id">Projeto *</label>
            <select
              id="projeto_id"
              name="projeto_id"
              value={filtros.projeto_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione um projeto</option>
              {projetos.map(projeto => (
                <option key={projeto.id} value={projeto.id}>
                  {projeto.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="campo-obrigatorio">
            <label htmlFor="data_inicio">Data Início *</label>
            <input
              type="date"
              id="data_inicio"
              name="data_inicio"
              value={filtros.data_inicio}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="campo-obrigatorio">
            <label htmlFor="data_fim">Data Fim *</label>
            <input
              type="date"
              id="data_fim"
              name="data_fim"
              value={filtros.data_fim}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              name="tipo"
              value={filtros.tipo}
              onChange={handleInputChange}
            >
              <option value="">Todos</option>
              <option value="RECEITA">Receita</option>
              <option value="DESPESA">Despesa</option>
              <option value="ORÇADO">Orçado</option>
            </select>
          </div>

          <div>
            <label htmlFor="contrato_id">Contrato</label>
            <select
              id="contrato_id"
              name="contrato_id"
              value={filtros.contrato_id}
              onChange={handleInputChange}
            >
              <option value="">Todos os contratos</option>
              {contratos.map(contrato => (
                <option key={contrato.id} value={contrato.id}>
                  {contrato.numero} - {contrato.descricao}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="centro_custo">Centro de Custo</label>
            <input
              type="text"
              id="centro_custo"
              name="centro_custo"
              value={filtros.centro_custo}
              onChange={handleInputChange}
              placeholder="Filtrar por centro de custo"
            />
          </div>

          <div>
            <label htmlFor="conta_financeira">Conta Financeira</label>
            <input
              type="text"
              id="conta_financeira"
              name="conta_financeira"
              value={filtros.conta_financeira}
              onChange={handleInputChange}
              placeholder="Filtrar por conta financeira"
            />
          </div>

          <div>
            <label htmlFor="valor_min">Valor Mínimo</label>
            <input
              type="number"
              id="valor_min"
              name="valor_min"
              value={filtros.valor_min}
              onChange={handleInputChange}
              step="0.01"
              placeholder="0,00"
            />
          </div>

          <div>
            <label htmlFor="valor_max">Valor Máximo</label>
            <input
              type="number"
              id="valor_max"
              name="valor_max"
              value={filtros.valor_max}
              onChange={handleInputChange}
              step="0.01"
              placeholder="0,00"
            />
          </div>

          <div>
            <label htmlFor="order_by">Ordenar por</label>
            <select
              id="order_by"
              name="order_by"
              value={filtros.order_by}
              onChange={handleInputChange}
            >
              <option value="data_movimento">Data Movimento</option>
              <option value="-data_movimento">Data Movimento (Desc)</option>
              <option value="valor">Valor</option>
              <option value="-valor">Valor (Desc)</option>
              <option value="tipo">Tipo</option>
            </select>
          </div>
        </div>

        <div className="checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="include_orcado"
              checked={filtros.include_orcado}
              onChange={handleInputChange}
            />
            Incluir dados orçados
          </label>
        </div>

        <div className="botoes-container">
          <button type="submit" className="btn-buscar" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar Relatório'}
          </button>
          <button type="button" className="btn-limpar" onClick={limparFiltros}>
            Limpar Filtros
          </button>
          {dados.length > 0 && (
            <button type="button" className="btn-exportar" onClick={exportarCSV}>
              Exportar CSV
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {dados.length > 0 && (
        <>
          <div className="resumo-container">
            <div className="resumo-card receitas">
              <h3>Total Receitas</h3>
              <span className="valor-receita">{formatarValor(totalReceitas)}</span>
            </div>
            <div className="resumo-card despesas">
              <h3>Total Despesas</h3>
              <span className="valor-despesa">{formatarValor(totalDespesas)}</span>
            </div>
            <div className={`resumo-card saldo ${saldoFinal >= 0 ? 'positivo' : 'negativo'}`}>
              <h3>Saldo Final</h3>
              <span className="valor-saldo">{formatarValor(saldoFinal)}</span>
            </div>
          </div>

          <div className="tabela-container">
            <table className="tabela-relatorio">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Data Movimento</th>
                  <th>Projeto</th>
                  <th>Contrato</th>
                  <th>Centro de Custo</th>
                  <th>Conta Financeira</th>
                  <th>Valor</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {dados.map((item, index) => (
                  <tr key={index} className={`linha-${item.tipo.toLowerCase()}`}>
                    <td>
                      <span className={`badge ${item.tipo.toLowerCase()}`}>
                        {item.tipo}
                      </span>
                    </td>
                    <td>{formatarData(item.data_movimento)}</td>
                    <td>{item.projeto}</td>
                    <td>{item.contrato}</td>
                    <td>{item.centro_custo}</td>
                    <td>{item.conta_financeira}</td>
                    <td className={item.tipo === 'RECEITA' ? 'valor-positivo' : item.tipo === 'DESPESA' ? 'valor-negativo' : ''}>
                      {formatarValor(item.valor)}
                    </td>
                    <td className={item.saldo >= 0 ? 'saldo-positivo' : 'saldo-negativo'}>
                      {formatarValor(item.saldo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span>Carregando relatório...</span>
        </div>
      )}
    </div>
  );
};

export default RelatorioResultadoProjeto;