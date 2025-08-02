// src/componentes/RelatorioContrato.jsx

import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from './SideBar';
import './RelatorioContrato.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';

const RelatorioContrato = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [contratos, setContratos] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [centrosCusto, setCentrosCusto] = useState([]);
  const [contasFinanceiras, setContasFinanceiras] = useState([]);

  const [relatorioData, setRelatorioData] = useState(null);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [saldoFinal, setSaldoFinal] = useState(0);

  const [filtros, setFiltros] = useState({
    contrato_id: '',
    data_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    data_fim: new Date(),
    tipo: [],               // ['RECEITA','DESPESA']
    include_orcado: false,
    projeto_id: '',
    centro_custo: '',
    conta_financeira: '',
    valor_min: '',
    valor_max: '',
    order_by: '-data_movimento'
  });

  // Busca dados iniciais de filtros
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

        // só contratos de cliente
        setContratos(
          contratosRes.data.filter(c => c.tipo === 'cliente')
        );
        setProjetos(projetosRes.data);
        setCentrosCusto(centrosCustoRes.data);
        setContasFinanceiras(contasFinanceirasRes.data);

      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
        toast.error('Erro ao carregar dados iniciais');
      }
    };

    fetchInitialData();
  }, []);

  // Lida com inputs e checkboxes
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

  // Lida com DatePicker
  const handleDateChange = (date, fieldName) => {
    setFiltros(prev => ({ ...prev, [fieldName]: date }));
  };

  // Gera o relatório
  const gerarRelatorio = async e => {
    e.preventDefault();
    if (!filtros.contrato_id) {
      toast.error('Selecione um contrato para gerar o relatório');
      return;
    }

    setIsLoading(true);
    try {
      const params = {
        contrato_id: filtros.contrato_id,
        data_inicio: format(filtros.data_inicio, 'yyyy-MM-dd'),
        data_fim: format(filtros.data_fim, 'yyyy-MM-dd'),
        include_orcado: filtros.include_orcado,
        order_by: filtros.order_by
      };
      if (filtros.tipo.length) params.tipo = filtros.tipo.join(',');
      if (filtros.projeto_id) params.projeto_id = filtros.projeto_id;
      if (filtros.centro_custo) params.centro_custo = filtros.centro_custo;
      if (filtros.conta_financeira) params.conta_financeira = filtros.conta_financeira;
      if (filtros.valor_min) params.valor_min = filtros.valor_min;
      if (filtros.valor_max) params.valor_max = filtros.valor_max;

      const { data: relData } = await api.get(
        '/api/relatorio-resultado/',
        { params }
      );
      setRelatorioData(relData);

      // calcula totais
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
      toast.error('Erro ao gerar relatório');
    } finally {
      setIsLoading(false);
    }
  };

  const formatarValor = valor =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const limparFiltros = () => {
    setFiltros({
      contrato_id: '',
      data_inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      data_fim: new Date(),
      tipo: [],
      include_orcado: false,
      projeto_id: '',
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

  // impressão e exportação
  const relatorioRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => relatorioRef.current,
    documentTitle: 'Relatorio-Contrato',
    pageStyle: '@page { margin: 20mm; }'
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(relatorioData || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatorio');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'relatorio.xlsx');
  };

  const exportToPDF = async () => {
    const toolbarEl = relatorioRef.current.querySelector('.r-results-toolbar');
    if (toolbarEl) toolbarEl.style.display = 'none';
    const canvas = await html2canvas(relatorioRef.current, { scale: 2 });
    if (toolbarEl) toolbarEl.style.display = '';
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('relatorio.pdf');
  };

  return (
    <div className="relatorio-container">
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
      <main className="r-main-content">
        <div className="r-relatorio-container">
          <h2>Relatório de Resultados por Contrato</h2>

          <form onSubmit={gerarRelatorio} className="r-filtros-form">
            {/* === FILTROS === */}
            <div className="r-form-row">
              <div className="r-form-group">
                <label>Contrato:</label>
                <select
                  name="contrato_id"
                  value={filtros.contrato_id}
                  onChange={handleInputChange}
                  className="r-select"
                  required
                >
                  <option value="">Selecione um contrato</option>
                  {contratos.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.descricao}
                    </option>
                  ))}
                </select>
              </div>
              <div className="r-form-group">
                <label>Projeto:</label>
                <select
                  name="projeto_id"
                  value={filtros.projeto_id}
                  onChange={handleInputChange}
                  className="r-select"
                >
                  <option value="">Todos os projetos</option>
                  {projetos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="r-form-row">
              <div className="r-form-group">
                <label>Data Início:</label>
                <DatePicker
                  selected={filtros.data_inicio}
                  onChange={date => handleDateChange(date, 'data_inicio')}
                  dateFormat="dd/MM/yyyy"
                  className="r-date-picker"
                  required
                />
              </div>
              <div className="r-form-group">
                <label>Data Fim:</label>
                <DatePicker
                  selected={filtros.data_fim}
                  onChange={date => handleDateChange(date, 'data_fim')}
                  dateFormat="dd/MM/yyyy"
                  className="r-date-picker"
                  required
                />
              </div>
            </div>

            <div className="r-form-row">
              <div className="r-form-group">
                <label>Centro de Custo:</label>
                <select
                  name="centro_custo"
                  value={filtros.centro_custo}
                  onChange={handleInputChange}
                  className="r-select"
                >
                  <option value="">Todos os centros</option>
                  {centrosCusto.map(cc => (
                    <option key={cc.id} value={cc.descricao}>
                      {cc.descricao}
                    </option>
                  ))}
                </select>
              </div>
              <div className="r-form-group">
                <label>Conta Financeira:</label>
                <select
                  name="conta_financeira"
                  value={filtros.conta_financeira}
                  onChange={handleInputChange}
                  className="r-select"
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

            <div className="r-form-row">
              <div className="r-form-group">
                <label>Valor Mínimo:</label>
                <input
                  type="number"
                  name="valor_min"
                  value={filtros.valor_min}
                  onChange={handleInputChange}
                  className="r-input"
                  step="0.01"
                  min="0"
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="r-form-group">
                <label>Valor Máximo:</label>
                <input
                  type="number"
                  name="valor_max"
                  value={filtros.valor_max}
                  onChange={handleInputChange}
                  className="r-input"
                  step="0.01"
                  min="0"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="r-form-row">
              <div className="r-form-group">
                <label>Ordenação:</label>
                <select
                  name="order_by"
                  value={filtros.order_by}
                  onChange={handleInputChange}
                  className="r-select"
                >
                  <option value="-data_movimento">Data (mais recente primeiro)</option>
                  <option value="data_movimento">Data (mais antiga primeiro)</option>
                  <option value="-valor">Valor (maior primeiro)</option>
                  <option value="valor">Valor (menor primeiro)</option>
                  <option value="tipo">Tipo (A-Z)</option>
                  <option value="-tipo">Tipo (Z-A)</option>
                </select>
              </div>
              <div className="r-form-group r-checkbox-group">
                <label className="r-checkbox-label">Tipo de Movimentação:</label>
                <div className="r-checkbox-options">
                  <label className="r-checkbox-option">
                    <input
                      type="checkbox"
                      name="tipo_RECEITA"
                      checked={filtros.tipo.includes('RECEITA')}
                      onChange={handleInputChange}
                    /> Receitas
                  </label>
                  <label className="r-checkbox-option">
                    <input
                      type="checkbox"
                      name="tipo_DESPESA"
                      checked={filtros.tipo.includes('DESPESA')}
                      onChange={handleInputChange}
                    /> Despesas
                  </label>
                  <label className="r-checkbox-option">
                    <input
                      type="checkbox"
                      name="include_orcado"
                      checked={filtros.include_orcado}
                      onChange={handleInputChange}
                    /> Incluir Valores Orçados
                  </label>
                </div>
              </div>
            </div>

            <div className="r-form-actions">
              <button type="submit" className="r-btn-primary" disabled={isLoading}>
                {isLoading ? 'Gerando Relatório...' : 'Gerar Relatório'}
              </button>
              <button type="button" className="r-btn-secondary" onClick={limparFiltros}>
                Limpar Filtros
              </button>
            </div>
          </form>

          {relatorioData && (
            <div className="r-resultado-section" ref={relatorioRef}>
              <div className="r-results-toolbar">
                <button onClick={exportToExcel} className="r-btn-secondary">Exportar XLSX</button>
                <button onClick={exportToPDF}   className="r-btn-secondary">Exportar PDF</button>
                <button onClick={handlePrint}   className="r-btn-secondary">Imprimir</button>
              </div>

              {/* Resumo */}
              <div className="r-resumo-container">
                <div className="r-resumo-card r-receitas">
                  <h4>Total de Receitas</h4>
                  <p className="r-valor">{formatarValor(totalReceitas)}</p>
                </div>
                <div className="r-resumo-card r-despesas">
                  <h4>Total de Despesas</h4>
                  <p className="r-valor">{formatarValor(totalDespesas)}</p>
                </div>
                <div className={`r-resumo-card r-saldo ${saldoFinal >= 0 ? 'r-positivo' : 'r-negativo'}`}>
                  <h4>Saldo Final</h4>
                  <p className="r-valor">{formatarValor(saldoFinal)}</p>
                </div>
              </div>

              {/* Tabela */}
              <div className="r-tabela-container">
                <table className="r-tabela-resultado">
                  <thead>
                    <tr>
                      <th>Data</th><th>Descrição</th><th>Tipo</th>
                      <th>Centro de Custo</th><th>Conta Financeira</th>
                      <th>Valor</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorioData.length > 0 ? (
                      relatorioData.map((item, idx) => (
                        <tr key={idx} className={item.tipo === 'RECEITA' ? 'r-linha-receita' : 'r-linha-despesa'}>
                          <td>{new Date(item.data_movimento).toLocaleDateString('pt-BR')}</td>
                          <td>{item.descricao}</td>
                          <td>{item.tipo}</td>
                          <td>{item.centro_custo}</td>
                          <td>{item.conta_financeira}</td>
                          <td className="r-valor-cell">{formatarValor(item.valor)}</td>
                          <td>{item.orcado ? 'Orçado' : 'Realizado'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="r-sem-dados">
                          Nenhum dado encontrado para os filtros selecionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RelatorioContrato;
