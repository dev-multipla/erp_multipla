import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
<<<<<<< HEAD
import { Search, RefreshCw, ArrowLeft, Calendar, Filter, ChevronDown } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
=======
import {
  Search,
  RefreshCw,
  ArrowLeft,
  Calendar,
  Filter,
  ChevronDown,
  X
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FinancialManagement.css';
import api from '../api';
import SideBar from './SideBar';
>>>>>>> e62255e (Atualizações no projeto)

const FinancialManagement = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [contracts, setContracts] = useState({});
  const [filters, setFilters] = useState({
<<<<<<< HEAD
    tipo: 'receber',  // Alterado para valores da API
=======
    tipo: 'receber',
>>>>>>> e62255e (Atualizações no projeto)
    status: 'pendente',
    data_inicio: '',
    data_fim: '',
  });
  const [error, setError] = useState(null);
  const { token } = useAuth();

<<<<<<< HEAD
=======
  const [confirmationModal, setConfirmationModal] = useState({
    visible: false,
    accountId: null,
    action: null,
    confirmationDate: new Date().toISOString().split('T')[0],
    account: null
  });

>>>>>>> e62255e (Atualizações no projeto)
  const showNotification = (message, type) => {
    toast[type](message, { position: 'top-right', autoClose: 3000 });
  };

  const fetchContracts = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch('http://localhost:8000/api/contratos-list/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      // Converte o array em um objeto mapeado por id
      const contractsMap = data.reduce((acc, contract) => {
        acc[contract.id] = contract;
        return acc;
      }, {});
      setContracts(contractsMap);
    } catch (error) {
      console.error("Erro ao buscar contratos", error);
      showNotification("Erro ao carregar contratos", "error");
    }
  };
  
=======
      const response = await api.get('/api/contratos-list/');
      const map = response.data.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
      }, {});
      setContracts(map);
    } catch (err) {
      console.error(err);
      showNotification('Erro ao carregar contratos', 'error');
    }
  };
>>>>>>> e62255e (Atualizações no projeto)

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
<<<<<<< HEAD
  
    try {
      // Garantir valores padrão para datas vazias
      const params = {
        tipo: filters.tipo,
        status: filters.status,
        data_inicio: filters.data_inicio || undefined,
        data_fim: filters.data_fim || undefined,
       
      };
      const queryParams = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined))
      ).toString();

      const response = await fetch(`http://localhost:8000/api/contas-consolidadas/?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);

      const data = await response.json();
      setAccounts(processApiData(data));
      showNotification('Contas carregadas com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      setError(error.message);
      showNotification(`Erro ao carregar contas: ${error.message}`, 'error');
=======
    try {
      const { data } = await api.get('/api/contas-consolidadas/', {
        params: {
          tipo: filters.tipo,
          status: filters.status,
          data_inicio: filters.data_inicio || undefined,
          data_fim: filters.data_fim || undefined
        }
      });
      setAccounts(data.map(acc => {
        const contratoData = acc.contrato || acc.detalhes.contrato;
        const isAvulsa = typeof contratoData === 'string';
        return {
          id: acc.id,
          contrato: typeof contratoData === 'object' ? contratoData.id : contratoData,
          valor: acc.valor_total,
          vencimento: acc.data_vencimento,
          status: acc.status,
          tipo: acc.tipo,
          detalhes: acc.detalhes,
          isAvulsa
        };
      }));
      showNotification('Contas carregadas com sucesso!', 'success');
    } catch (err) {
      console.error(err);
      setError(err.message);
      showNotification(`Erro ao carregar contas: ${err.message}`, 'error');
>>>>>>> e62255e (Atualizações no projeto)
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const processApiData = (data) => {
    return data.map(account => {
      // Verifica se a propriedade "contrato" existe no nível superior; se não, busca em "detalhes"
      const contratoData = account.contrato || account.detalhes.contrato;
      return {
        id: account.id,
        // Se contratoData for um objeto com a propriedade id, use-a; 
        // caso contrário, se for um número, mantenha como está.
        contrato: typeof contratoData === 'object' ? contratoData.id : contratoData,
        valor: account.valor_total,
        vencimento: account.data_vencimento,
        status: account.status,
        tipo: account.tipo,
        detalhes: account.detalhes
      };
    });
  };

  const handleStatusUpdate = async (accountId, action) => {
    setLoading(true);
  
=======
  const openConfirmationModal = (accountId, action, account) => {
    setConfirmationModal({
      visible: true,
      accountId,
      action,
      confirmationDate: new Date().toISOString().split('T')[0],
      account
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      visible: false,
      accountId: null,
      action: null,
      confirmationDate: new Date().toISOString().split('T')[0],
      account: null
    });
  };

  const handleDateChange = e => {
    setConfirmationModal(m => ({
      ...m,
      confirmationDate: e.target.value
    }));
  };

  const confirmOperation = async () => {
    setLoading(true);
    const { accountId, action, confirmationDate, account } = confirmationModal;
>>>>>>> e62255e (Atualizações no projeto)
    const statusMap = {
      baixar: filters.tipo === 'receber' ? 'recebido' : 'pago',
      estornar: 'estornado'
    };
<<<<<<< HEAD

    try {
      const response = await fetch(
        `http://localhost:8000/api/contas-consolidadas/${accountId}/atualizar-status/`, 
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: statusMap[action] }),
        }
      );

      if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);

      showNotification(
        action === 'baixar' 
          ? 'Status atualizado com sucesso!' 
          : 'Estorno realizado com sucesso!', 
        'success'
      );
      fetchAccounts();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showNotification(`Erro: ${error.message}`, 'error');
=======
    const novoStatus = statusMap[action];

    try {
      if (account.isAvulsa) {
        const urlBase = filters.tipo === 'pagar'
          ? `/api/contas-a-pagar-avulso/${accountId}/`
          : `/api/contas-a-receber-avulso/${accountId}/`;
        const payload = filters.tipo === 'pagar'
          ? { status: novoStatus, data_pagamento: confirmationDate }
          : { status: novoStatus, data_recebimento: confirmationDate };
        await api.patch(urlBase, payload);
      } else {
        await api.patch(
          `/api/contas-consolidadas/${accountId}/atualizar-status/`,
          { status: novoStatus, data_confirmacao: confirmationDate },
          { params: { tipo: filters.tipo } }
        );
      }
      showNotification(
        action === 'baixar'
          ? 'Status atualizado com sucesso!'
          : 'Estorno realizado com sucesso!',
        'success'
      );
      closeConfirmationModal();
      fetchAccounts();
    } catch (err) {
      console.error(err);
      showNotification(`Erro: ${err.message}`, 'error');
>>>>>>> e62255e (Atualizações no projeto)
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    fetchAccounts();
  }, [filters]);

  useEffect(() => {
    fetchContracts();
  }, []);

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR');

  // Renderização - Ajustes nos valores
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <ToastContainer />

      {/* Header Section */}
      <div className="bg-white border-b">
        {/* Top Navigation Bar */}
        <div className="border-b bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Gerenciamento Financeiro</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={fetchAccounts}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    <span>Buscar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Filter style={{ width: '16px', height: '16px', color: '#6B7280', marginRight: '8px' }} />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>Filtros</span>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
          {/* Tipo de Movimentação */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px' }}>
              Tipo de Movimentação
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={filters.tipo}
                onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 40px 8px 12px',
                  fontSize: '14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  appearance: 'none'
                }}
=======
  useEffect(() => { fetchAccounts(); }, [filters]);
  useEffect(() => { fetchContracts(); }, []);

  const formatCurrency = v =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
      .format(v);
  const formatDate = d =>
    new Date(d).toLocaleDateString('pt-BR');

  return (
     <div className="app-layout">
      <SideBar />

      <div className="fm-container">

      <ToastContainer />
      
      {/* Header */}
      <div className="fm-header">
        <div className="fm-nav">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => window.history.back()}
              className="fm-nav-button"
            >
              <ArrowLeft />
            </button>
            <h1 className="fm-title">Gerenciamento Financeiro</h1>
          </div>
          <button
            className="btn btn-search"
            onClick={fetchAccounts}
            disabled={loading}
          >
            {loading
              ? <><RefreshCw className="animate-spin" /> Processando...</>
              : <><Search /> Buscar</>
            }
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-header">
          <Filter className="filter-icon" />
          <span className="filters-label">Filtros</span>
        </div>
        <div className="filters-group">
          {/** Tipo */}
          <div className="filter-item">
            <label className="filter-label">Tipo de Movimentação</label>
            <div className="select-container">
              <select
                className="filter-select"
                value={filters.tipo}
                onChange={e => setFilters(f => ({ ...f, tipo: e.target.value }))}
>>>>>>> e62255e (Atualizações no projeto)
              >
                <option value="receber">Receitas</option>
                <option value="pagar">Despesas</option>
              </select>
<<<<<<< HEAD
              <ChevronDown
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  width: '16px',
                  height: '16px',
                  color: '#9CA3AF'
                }}
              />
            </div>
          </div>


             {/* Status */}
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px' }}>
                Status
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 40px 8px 12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    appearance: 'none'
                  }}
                >
                  <option value="pendente">Pendentes</option>
                  <option value="pago">Pagas</option>
                  <option value="recebido">Recebidas</option>
                  <option value="estornado">Estornadas</option>
                </select>
                <ChevronDown
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    width: '16px',
                    height: '16px',
                    color: '#9CA3AF'
                  }}
                />
              </div>
            </div>

            {/* Data Inicial */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px' }}>
              Data Inicial
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={filters.data_inicio}
                onChange={(e) => setFilters({ ...filters, data_inicio: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 36px 8px 12px',
                  fontSize: '14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px'
                }}
              />
              <Calendar
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  width: '16px',
                  height: '16px',
                  color: '#9CA3AF'
                }}
              />
            </div>
          </div>

            {/* Data Final */}
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px' }}>
                Data Final
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={filters.data_fim}
                  onChange={(e) => setFilters({ ...filters, data_fim: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 36px 8px 12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px'
                  }}
                />
                <Calendar
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    width: '16px',
                    height: '16px',
                    color: '#9CA3AF'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-6 py-4">
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
=======
              <ChevronDown className="select-icon" />
            </div>
          </div>

          {/** Status */}
          <div className="filter-item">
            <label className="filter-label">Status</label>
            <div className="select-container">
              <select
                className="filter-select"
                value={filters.status}
                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              >
                <option value="pendente">Pendentes</option>
                <option value="pago">Pagas</option>
                <option value="recebido">Recebidas</option>
                <option value="estornado">Estornadas</option>
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>

          {/** Data Inicial */}
          <div className="filter-item">
            <label className="filter-label">Data Inicial</label>
            <div className="select-container">
              <input
                type="date"
                className="filter-date"
                value={filters.data_inicio}
                onChange={e => setFilters(f => ({ ...f, data_inicio: e.target.value }))}
              />
              <Calendar className="select-icon" />
            </div>
          </div>

          {/** Data Final */}
          <div className="filter-item">
            <label className="filter-label">Data Final</label>
            <div className="select-container">
              <input
                type="date"
                className="filter-date"
                value={filters.data_fim}
                onChange={e => setFilters(f => ({ ...f, data_fim: e.target.value }))}
              />
              <Calendar className="select-icon" />
            </div>
          </div>
        </div>
        {error && (
          <div style={{ marginTop: '16px', color: '#DC2626' }}>
            {error}
>>>>>>> e62255e (Atualizações no projeto)
          </div>
        )}
      </div>

<<<<<<< HEAD
      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {accounts.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{contracts[account.contrato]?.numero || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contracts[account.contrato]?.descricao || 'Sem descrição'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(account.valor)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(account.vencimento)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                        account.status === 'estornado' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button
                      onClick={() => handleStatusUpdate(account.id, 'baixar')}
                      className={`text-indigo-600 hover:text-indigo-900 ${
                        !['pendente', 'estornado'].includes(account.status) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!['pendente', 'estornado'].includes(account.status)}
                    >
                      Baixar
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(account.id, 'estornar')}
                      className={`text-red-600 hover:text-red-900 ${
                        !['pago', 'recebido'].includes(account.status) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!['pago', 'recebido'].includes(account.status)}
                    >
                      Estornar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {loading ? 'Carregando...' : 'Nenhuma conta encontrada. Use os filtros acima para buscar.'}
          </div>
        )}
      </div>
    </div>
 );
};

export default FinancialManagement;
=======
      {/* Tabela */}
      <div className="table-container">
        {accounts.length ? (
          <table className="financial-table">
            <thead>
              <tr>
                <th>Contrato</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => {
                const isAvulsa = acc.isAvulsa;
                const contratoInfo = isAvulsa
                  ? acc.contrato
                  : contracts[acc.contrato]?.numero || 'N/A';
                const descricaoInfo = isAvulsa
                  ? (acc.detalhes?.descricao || 'Sem descrição')
                  : (contracts[acc.contrato]?.descricao || 'Sem descrição');
                return (
                  <tr key={acc.id}>
                    <td>{contratoInfo}</td>
                    <td>{descricaoInfo}</td>
                    <td>{formatCurrency(acc.valor)}</td>
                    <td>{formatDate(acc.vencimento)}</td>
                    <td>
                      <span className={`badge badge-${acc.status}`}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button
                        onClick={() => openConfirmationModal(acc.id, 'baixar', acc)}
                        className="action-baixar"
                        disabled={!['pendente','estornado'].includes(acc.status)}
                      >Baixar</button>
                      <button
                        onClick={() => openConfirmationModal(acc.id, 'estornar', acc)}
                        className="action-estornar"
                        disabled={!['pago','recebido'].includes(acc.status)}
                      >Estornar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            {loading ? 'Carregando...' : 'Nenhuma conta encontrada.'}
          </div>
        )}
      </div>

      {/* Modal */}
      {confirmationModal.visible && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {confirmationModal.action === 'baixar'
                  ? 'Confirmar Baixa'
                  : 'Confirmar Estorno'}
              </h3>
              <button
                onClick={closeConfirmationModal}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <label className="modal-label">
                {confirmationModal.action === 'baixar'
                  ? (filters.tipo === 'receber'
                      ? 'Data de Recebimento'
                      : 'Data de Pagamento')
                  : 'Data de Estorno'}
              </label>
              <input
                type="date"
                className="modal-input"
                value={confirmationModal.confirmationDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="modal-footer">
              <button
                onClick={closeConfirmationModal}
                className="modal-btn cancel"
              >Cancelar</button>
              <button
                onClick={confirmOperation}
                className="modal-btn confirm"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default FinancialManagement;
>>>>>>> e62255e (Atualizações no projeto)
