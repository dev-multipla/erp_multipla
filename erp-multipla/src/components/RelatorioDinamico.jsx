// src/componentes/RelatorioDinamico.jsx

import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from './SideBar';
import './RelatorioDinamico.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';

const RelatorioDinamico = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [contratos, setContratos] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [centrosCusto, setCentrosCusto] = useState([]);
  const [contasFinanceiras, setContasFinanceiras] = useState([]);

  const [relatorioData, setRelatorioData] = useState(null);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [saldoFinal, setSaldoFinal] = useState(0);

  // Modo do relatório: 'contrato', 'projeto', 'geral'
  const [modo, setModo] = useState('contrato');

  const [filtros, setFiltros] = useState({
    // Filtros principais
    contrato_id: '',
    projeto_id: '',
    
    // Filtros de data
    data_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    data_fim: new Date(),
    
    // Filtros de tipo
    tipo: [], // ['RECEITA','DESPESA']
    include_orcado: false,
    
    // Filtros adicionais
    centro_custo: '',
    conta_financeira: '',
    valor_min: '',
    valor_max: '',
    order_by: '-data_movimento'
  });

  // Busca dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const companyId = localStorage.getItem('selectedCompanyId');
        if (!companyId || companyId === 'all') return;

        const [
          contratosRes,
          projetosRes,
          centrosCustoRes,
          contasFinanceirasRes
        ] = await Promise.all([
          api.get('/api/contratos/'),
          api.get('/api/projetos/'),
          api.get('/api/centros-custos/'),
          api.get('/api/contas-financeiras/')
        ]);

        setContratos(contratosRes.data.filter(c => c.tipo === 'cliente'));
        setProjetos(projetosRes.data.results || projetosRes.data);
        setCentrosCusto(centrosCustoRes.data);
        setContasFinanceiras(contasFinanceirasRes.data);

      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
        toast.error('Erro ao carregar dados iniciais');
      }
    };

    fetchInitialData();
  }, []);

  // Carregar contratos quando projeto é selecionado
  useEffect(() => {
    if (filtros.projeto_id && modo === 'projeto') {
      carregarContratosPorProjeto();
    }
  }, [filtros.projeto_id, modo]);

  const carregarContratosPorProjeto = async () => {
    try {
      const response = await api.get(`/api/contratos/?projeto_id=${filtros.projeto_id}`);
      setContratos(response.data.results || response.data);
    } catch (error) {
      console.error('Erro ao carregar contratos do projeto:', error);
    }
  };

  // Limpar filtros ao mudar modo
  useEffect(() => {
    limparFiltros();
  }, [modo]);

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFiltros(prev => {
      if (type === 'checkbox') {
        if (name === 'include_orcado') {
          return { ...prev, include_orcado: checked };
        }
        if (name.startsWith('tipo_')) {
          const tipoValue = name.replace('tipo_', '');
          const novoTipo = checked
            ? [...prev.tipo, tipoValue]
            : prev.tipo.filter(t => t !== tipoValue);
          return { ...prev, tipo: novoTipo };
        }
      }
      return { ...prev, [name]: value };
    });
  };

  const handleDateChange = (date, fieldName) => {
    setFiltros(prev => ({ ...prev, [fieldName]: date }));
  };

  const handleModoChange = (novoModo) => {
    setModo(novoModo);
    setRelatorioData(null);
    setTotalReceitas(0);
    setTotalDespesas(0);
    setSaldoFinal(0);
  };

  const validarFiltros = () => {
    switch (modo) {
      case 'contrato':
        if (!filtros.contrato_id) {
          toast.error('Selecione um contrato para gerar o relatório');
          return false;
        }
        break;
      case 'projeto':
        if (!filtros.projeto_id) {
          toast.error('Selecione um projeto para gerar o relatório');
          return false;
        }
        break;
      case 'geral':
        // Para relatório geral, não há campos obrigatórios específicos
        break;
      default:
        return false;
    }
    return true;
  };

  const gerarRelatorio = async e => {
    e.preventDefault();
    
    if (!validarFiltros()) return;

    setIsLoading(true);
    try {
      const params = {
        data_inicio: format(filtros.data_inicio, 'yyyy-MM-dd'),
        data_fim: format(filtros.data_fim, 'yyyy-MM-dd'),
        include_orcado: filtros.include_orcado,
        order_by: filtros.order_by
      };

      // Adicionar filtros específicos do modo
      if (modo === 'contrato' && filtros.contrato_id) {
        params.contrato_id = filtros.contrato_id;
      }
      if (modo === 'projeto' && filtros.projeto_id) {
        params.projeto_id = filtros.projeto_id;
      }

      // Filtros adicionais
      if (filtros.tipo.length) params.tipo = filtros.tipo.join(',');
      if (filtros.centro_custo) params.centro_custo = filtros.centro_custo;
      if (filtros.conta_financeira) params.conta_financeira = filtros.conta_financeira;
      if (filtros.valor_min) params.valor_min = filtros.valor_min;
      if (filtros.valor_max) params.valor_max = filtros.valor_max;

      // Selecionar endpoint baseado no modo
      let endpoint = '/api/relatorio-resultado/';
      if (modo === 'projeto') {
        endpoint = '/api/relatorio-resultado-projeto/';
      }

      const { data: relData } = await api.get(endpoint, { params });
      setRelatorioData(relData);

      // Calcular totais
      let receitas = 0, despesas = 0;
      relData.forEach(item => {
        if (item.tipo === 'RECEITA') receitas += parseFloat(item.valor);
        else if (item.tipo === 'DESPESA') despesas += parseFloat(item.valor);
      });
      setTotalReceitas(receitas);
      setTotalDespesas(despesas);
      setSaldoFinal(receitas - despesas);

      toast.success('Relatório gerado com sucesso');
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
      toast.error('Erro ao gerar relatório: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const formatarValor = valor =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const limparFiltros = () => {
    setFiltros({
      contrato_id: '',
      projeto_id: '',
      data_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      data_fim: new Date(),
      tipo: [],
      include_orcado: false,
      centro_custo: '',
      conta_financeira: '',
      valor_min: '',
      valor_max: '',
      order_by: '-data_movimento'
    });
    setRelatorioData(null);
    setTotalReceitas(0);
    setTotalDespesas(0);
    setSaldoFinal(0);
  };

  // Funções de exportação
  const relatorioRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => relatorioRef.current,
    documentTitle: `Relatorio-${modo}`,
    pageStyle: '@page { margin: 20mm; }'
  });

  const exportToExcel = () => {
    if (!relatorioData || relatorioData.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(relatorioData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatorio');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `relatorio_${modo}.xlsx`);
  };

  const exportToPDF = async () => {
    if (!relatorioRef.current) return;

    const toolbarEl = relatorioRef.current.querySelector('.rd-results-toolbar');
    if (toolbarEl) toolbarEl.style.display = 'none';
    
    const canvas = await html2canvas(relatorioRef.current, { scale: 2 });
    
    if (toolbarEl) toolbarEl.style.display = '';
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`relatorio_${modo}.pdf`);
  };

  const exportToCSV = () => {
    if (!relatorioData || relatorioData.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const headers = ['Tipo', 'Data Movimento', 'Descrição', 'Projeto', 'Contrato', 'Centro Custo', 'Conta Financeira', 'Valor', 'Status'];
    const csvContent = [
      headers.join(','),
      ...relatorioData.map(item => [
        item.tipo,
        formatarData(item.data_movimento),
        item.descricao || '',
        item.projeto || '',
        item.contrato || '',
        item.centro_custo || '',
        item.conta_financeira || '',
        item.valor,
        item.orcado ? 'Orçado' : 'Realizado'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${modo}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relatorio-dinamico-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast-container"
        toastClassName="custom-toast"
        progressClassName="custom-progress"
      />
      <SideBar />
      <main className="rd-main-content">
        <div className="rd-container">
          <h2>Relatório Dinâmico de Resultados</h2>

          {/* Seletor de Modo */}
          <div className="rd-modo-selector">
            <button
              className={`rd-modo-btn ${modo === 'contrato' ? 'active' : ''}`}
              onClick={() => handleModoChange('contrato')}
            >
              Por Contrato
            </button>
            <button
              className={`rd-modo-btn ${modo === 'projeto' ? 'active' : ''}`}
              onClick={() => handleModoChange('projeto')}
            >
              Por Projeto
            </button>
            <button
              className={`rd-modo-btn ${modo === 'geral' ? 'active' : ''}`}
              onClick={() => handleModoChange('geral')}
            >
              Geral
            </button>
          </div>

          <form onSubmit={gerarRelatorio} className="rd-filtros-form">
            {/* Filtros Principais */}
            <div className="rd-form-row">
              {modo === 'contrato' && (
                <div className="rd-form-group">
                  <label>Contrato: <span className="required">*</span></label>
                  <select
                    name="contrato_id"
                    value={filtros.contrato_id}
                    onChange={handleInputChange}
                    className="rd-select"
                    required
                  >
                    <option value="">Selecione um contrato</option>
                    {contratos.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.numero ? `${c.numero} - ${c.descricao}` : c.descricao}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modo === 'projeto' && (
                <div className="rd-form-group">
                  <label>Projeto: <span className="required">*</span></label>
                  <select
                    name="projeto_id"
                    value={filtros.projeto_id}
                    onChange={handleInputChange}
                    className="rd-select"
                    required
                  >
                    <option value="">Selecione um projeto</option>
                    {projetos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(modo === 'geral' || modo === 'contrato') && (
                <div className="rd-form-group">
                  <label>Projeto:</label>
                  <select
                    name="projeto_id"
                    value={filtros.projeto_id}
                    onChange={handleInputChange}
                    className="rd-select"
                  >
                    <option value="">Todos os projetos</option>
                    {projetos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(modo === 'geral' || modo === 'projeto') && (
                <div className="rd-form-group">
                  <label>Contrato:</label>
                  <select
                    name="contrato_id"
                    value={filtros.contrato_id}
                    onChange={handleInputChange}
                    className="rd-select"
                  >
                    <option value="">Todos os contratos</option>
                    {contratos.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.numero ? `${c.numero} - ${c.descricao}` : c.descricao}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Filtros de Data */}
            <div className="rd-form-row">
              <div className="rd-form-group">
                <label>Data Início: <span className="required">*</span></label>
                <DatePicker
                  selected={filtros.data_inicio}
                  onChange={date => handleDateChange(date, 'data_inicio')}
                  dateFormat="dd/MM/yyyy"
                  className="rd-date-picker"
                  required
                />
              </div>
              <div className="rd-form-group">
                <label>Data Fim: <span className="required">*</span></label>
                <DatePicker
                  selected={filtros.data_fim}
                  onChange={date => handleDateChange(date, 'data_fim')}
                  dateFormat="dd/MM/yyyy"
                  className="rd-date-picker"
                  required
                />
              </div>
            </div>

            {/* Filtros Adicionais */}
            <div className="rd-form-row">
              <div className="rd-form-group">
                <label>Centro de Custo:</label>
                <select
                  name="centro_custo"
                  value={filtros.centro_custo}
                  onChange={handleInputChange}
                  className="rd-select"
                >
                  <option value="">Todos os centros</option>
                  {centrosCusto.map(cc => (
                    <option key={cc.id} value={cc.descricao}>
                      {cc.descricao}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rd-form-group">
                <label>Conta Financeira:</label>
                <select
                  name="conta_financeira"
                  value={filtros.conta_financeira}
                  onChange={handleInputChange}
                  className="rd-select"
                >
                  <option value="">Todas as contas</option>
                  {contasFinanceiras.map(cf => (
                    <option key={cf.id} value={cf.descricao}>
                      {cf.descricao}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtros de Valor */}
            <div className="rd-form-row">
              <div className="rd-form-group">
                <label>Valor Mínimo:</label>
                <input
                  type="number"
                  name="valor_min"
                  value={filtros.valor_min}
                  onChange={handleInputChange}
                  className="rd-input"
                  step="0.01"
                  min="0"
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="rd-form-group">
                <label>Valor Máximo:</label>
                <input
                  type="number"
                  name="valor_max"
                  value={filtros.valor_max}
                  onChange={handleInputChange}
                  className="rd-input"
                  step="0.01"
                  min="0"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            {/* Filtros de Tipo e Ordenação */}
            <div className="rd-form-row">
              <div className="rd-form-group">
                <label>Ordenação:</label>
                <select
                  name="order_by"
                  value={filtros.order_by}
                  onChange={handleInputChange}
                  className="rd-select"
                >
                  <option value="-data_movimento">Data (mais recente primeiro)</option>
                  <option value="data_movimento">Data (mais antiga primeiro)</option>
                  <option value="-valor">Valor (maior primeiro)</option>
                  <option value="valor">Valor (menor primeiro)</option>
                  <option value="tipo">Tipo (A-Z)</option>
                  <option value="-tipo">Tipo (Z-A)</option>
                </select>
              </div>
              <div className="rd-form-group rd-checkbox-group">
                <label className="rd-checkbox-label">Filtros de Tipo:</label>
                <div className="rd-checkbox-options">
                  <label className="rd-checkbox-option">
                    <input
                      type="checkbox"
                      name="tipo_RECEITA"
                      checked={filtros.tipo.includes('RECEITA')}
                      onChange={handleInputChange}
                    /> Receitas
                  </label>
                  <label className="rd-checkbox-option">
                    <input
                      type="checkbox"
                      name="tipo_DESPESA"
                      checked={filtros.tipo.includes('DESPESA')}
                      onChange={handleInputChange}
                    /> Despesas
                  </label>
                  <label className="rd-checkbox-option">
                    <input
                      type="checkbox"
                      name="include_orcado"
                      checked={filtros.include_orcado}
                      onChange={handleInputChange}
                    /> Incluir Orçados
                  </label>
                </div>
              </div>
            </div>

            <div className="rd-form-actions">
              <button type="submit" className="rd-btn-primary" disabled={isLoading}>
                {isLoading ? 'Gerando Relatório...' : 'Gerar Relatório'}
              </button>
              <button type="button" className="rd-btn-secondary" onClick={limparFiltros}>
                Limpar Filtros
              </button>
            </div>
          </form>

          {/* Resultados */}
          {relatorioData && (
            <div className="rd-resultado-section" ref={relatorioRef}>
              <div className="rd-results-toolbar">
                <button onClick={exportToExcel} className="rd-btn-secondary">
                  Exportar XLSX
                </button>
                <button onClick={exportToPDF} className="rd-btn-secondary">
                  Exportar PDF
                </button>
                <button onClick={exportToCSV} className="rd-btn-secondary">
                  Exportar CSV
                </button>
                <button onClick={handlePrint} className="rd-btn-secondary">
                  Imprimir
                </button>
              </div>

              {/* Resumo */}
              <div className="rd-resumo-container">
                <div className="rd-resumo-card rd-receitas">
                  <h4>Total de Receitas</h4>
                  <p className="rd-valor">{formatarValor(totalReceitas)}</p>
                </div>
                <div className="rd-resumo-card rd-despesas">
                  <h4>Total de Despesas</h4>
                  <p className="rd-valor">{formatarValor(totalDespesas)}</p>
                </div>
                <div className={`rd-resumo-card rd-saldo ${saldoFinal >= 0 ? 'rd-positivo' : 'rd-negativo'}`}>
                  <h4>Saldo Final</h4>
                  <p className="rd-valor">{formatarValor(saldoFinal)}</p>
                </div>
              </div>

              {/* Tabela */}
              <div className="rd-tabela-container">
                <table className="rd-tabela-resultado">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Tipo</th>
                      {modo !== 'projeto' && <th>Projeto</th>}
                      {modo !== 'contrato' && <th>Contrato</th>}
                      <th>Centro de Custo</th>
                      <th>Conta Financeira</th>
                      <th>Valor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorioData.length > 0 ? (
                      relatorioData.map((item, idx) => (
                        <tr key={idx} className={item.tipo === 'RECEITA' ? 'rd-linha-receita' : 'rd-linha-despesa'}>
                          <td>{formatarData(item.data_movimento)}</td>
                          <td>{item.descricao}</td>
                          <td>
                            <span className={`rd-badge ${item.tipo.toLowerCase()}`}>
                              {item.tipo}
                            </span>
                          </td>
                          {modo !== 'projeto' && <td>{item.projeto || '-'}</td>}
                          {modo !== 'contrato' && <td>{item.contrato || '-'}</td>}
                          <td>{item.centro_custo || '-'}</td>
                          <td>{item.conta_financeira || '-'}</td>
                          <td className={`rd-valor-cell ${item.tipo === 'RECEITA' ? 'rd-positivo' : 'rd-negativo'}`}>
                            {formatarValor(item.valor)}
                          </td>
                          <td>
                            <span className={`rd-status ${item.orcado ? 'orcado' : 'realizado'}`}>
                              {item.orcado ? 'Orçado' : 'Realizado'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="rd-sem-dados">
                          Nenhum dado encontrado para os filtros selecionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="rd-loading-container">
              <div className="rd-loading-spinner"></div>
              <span>Carregando relatório...</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RelatorioDinamico;