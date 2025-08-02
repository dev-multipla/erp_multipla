<<<<<<< HEAD
//ContaReceberList
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContaReceberList.css';
import { GrEdit, GrTrash } from "react-icons/gr";


const ContaReceberList = ({ onEdit }) => {
  const [contasReceber, setContasReceber] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState({});
  const [contratos, setContratos] = useState({});
  const [editFormData, setEditFormData] = useState(null); // Estado para os dados de edição

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Função para buscar as contas a Receber
    const fetchContasReceber = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contas-receber/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContasReceber(response.data);
      } catch (error) {
        console.error('Erro ao carregar as contas a receber:', error);
        toast.error('Erro ao carregar as contas a receber');
      }
    };

    // Função para buscar a lista de contratos
    const fetchContratos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contratos-list/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const contratosMap = response.data.reduce((acc, contrato) => {
=======
// src/components/ContaReceberList.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import './ContaReceberList.css';
import toast, { Toaster } from 'react-hot-toast';
// import './toast-styles.css'; // Use o mesmo arquivo CSS dos outros componentes
import { GrEdit, GrTrash } from 'react-icons/gr';
import ConfirmModal from './ConfirmModal';
import { BarLoader } from 'react-spinners';

// Funções helper para toasts customizados (mesmo padrão dos outros componentes)
const showSuccessToast = (message) => {
  return toast.success(message, {
    className: 'toast-success',
    style: {
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      color: '#15803d',
      border: '1px solid #bbf7d0',
      borderLeft: '4px solid #22c55e',
    },
  });
};

const showErrorToast = (message) => {
  return toast.error(message, {
    className: 'toast-error',
    style: {
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      color: '#dc2626',
      border: '1px solid #fecaca',
      borderLeft: '4px solid #ef4444',
    },
  });
};

const showLoadingToast = (message) => {
  return toast.loading(message, {
    className: 'toast-loading',
    style: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      color: '#475569',
      border: '1px solid #cbd5e1',
      borderLeft: '4px solid #3b82f6',
    },
  });
};

const ContaReceberList = ({ onEdit, refresh }) => {
  const [contasReceber, setContasReceber] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState({});
  const [contratos, setContratos] = useState({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  useEffect(() => {
    const fetchContasReceber = async () => {
      try {
        const response = await api.get('/api/contas-receber/');
        setContasReceber(response.data);
      } catch (error) {
        console.error('Erro ao carregar as contas a receber:', error);
        showErrorToast('Erro ao carregar as contas a receber');
        throw error;
      }
    };

    const fetchContratos = async () => {
      try {
        const response = await api.get('/api/contratos-list/');
        // Filtra apenas contratos de cliente para contas a receber
        const contratosFiltrados = response.data.filter(c => c.tipo === 'cliente');
        const contratosMap = contratosFiltrados.reduce((acc, contrato) => {
>>>>>>> e62255e (Atualizações no projeto)
          acc[contrato.id] = contrato.descricao;
          return acc;
        }, {});
        setContratos(contratosMap);
      } catch (error) {
        console.error('Erro ao carregar os contratos:', error);
<<<<<<< HEAD
        toast.error('Erro ao carregar os contratos');
      }
    };

    // Função para buscar formas de pagamento
    const fetchFormasPagamento = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/select/formas-pagamento/', {
          headers: { Authorization: `Bearer ${token}` },
        });
=======
        showErrorToast('Erro ao carregar os contratos');
        throw error;
      }
    };

    const fetchFormasPagamento = async () => {
      try {
        const response = await api.get('/api/select/formas-pagamento/');
>>>>>>> e62255e (Atualizações no projeto)
        const formasPagamentoMap = response.data.reduce((acc, forma) => {
          acc[forma.id] = forma.descricao;
          return acc;
        }, {});
        setFormasPagamento(formasPagamentoMap);
      } catch (error) {
        console.error('Erro ao carregar as formas de pagamento:', error);
<<<<<<< HEAD
        toast.error('Erro ao carregar as formas de pagamento');
      }
    };

    fetchFormasPagamento();
    fetchContasReceber();
    fetchContratos();
  }, []);

  // Função para deletar uma conta
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/contas-receber/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContasReceber(contasReceber.filter((conta) => conta.id !== id));
      toast.success('Conta a receber deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar a conta a receber:', error);
      toast.error('Erro ao deletar a conta a receber');
=======
        showErrorToast('Erro ao carregar as formas de pagamento');
        throw error;
      }
    };

    const fetchAllData = async () => {
      const loadingToast = showLoadingToast('Carregando contas a receber...');
      setLoading(true);
      try {
        await Promise.all([
          fetchContasReceber(),
          fetchContratos(),
          fetchFormasPagamento()
        ]);
        toast.success('Dados carregados com sucesso!', { id: loadingToast });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados', { id: loadingToast });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [refresh]);

  const openModal = (id) => {
    setSelectedDeleteId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDeleteId(null);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedDeleteId) return;
    
    const loadingToast = showLoadingToast('Removendo conta...');
    try {
      setDeletingId(selectedDeleteId);
      await api.delete(`/api/contas-receber/${selectedDeleteId}/`);
      setContasReceber(prev => prev.filter(c => c.id !== selectedDeleteId));
      toast.success('Conta removida com sucesso!', { id: loadingToast });
    } catch (err) {
      console.error('Erro ao excluir:', err.response?.data || err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Falha ao remover conta';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setDeletingId(null);
      closeModal();
>>>>>>> e62255e (Atualizações no projeto)
    }
  };

  const handleEdit = (conta) => {
<<<<<<< HEAD
    console.log("Conta original recebida:", conta);
    
    const contaFormatada = {
        id: conta.id, // 
        contrato: conta.contrato,
        forma_receber: conta.forma_pagamento,
        data_receber: conta.data_receber,
        competencia: conta.competencia,
        conta_financeira: conta.conta_financeira,
        centro_custo: conta.centro_custo,
        valor_total: parseFloat(conta.valor_total),
        projetos: conta.projetos.map(projeto => ({
            projeto: projeto.id,
            valor: projeto.valor || conta.valor_total / conta.projetos.length,
        })),
    };

    console.log("Conta formatada para edição:", conta);
    onEdit(contaFormatada);
};

  return (
    <div className="conta-pagar-list-container">
    <div className="conta-receber-list">
      <h2>Listagem de Contas a Receber</h2>
      <ToastContainer />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Contrato</th>
            <th>Descrição</th>
            <th>Forma receber</th>
            <th>Valor</th>
            <th>Data de Vencimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contasReceber.map((conta) => (
            <tr key={conta.id}>
              <th>{conta.id}</th>
              <td>{conta.contrato}</td>
              <td>{contratos[conta.contrato] || "Descrição não encontrada"}</td> {/* Mostra a descrição do contrato */}
              <td>{formasPagamento[conta.forma_pagamento] || "Forma de receber não encontrada"}</td>
              <td>{conta.valor_total}</td>
              <td>{conta.data_recebimento}</td>
              <td>
                <button onClick={() => handleEdit(conta)} className="edit-button">
                <GrEdit />
                  </button>
                <button onClick={() => handleDelete(conta.id)} className="delete-button">
                <GrTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
=======
    const contaFormatada = {
      id: conta.id,
      contrato: conta.contrato,
      forma_pagamento: conta.forma_pagamento,
      data_recebimento: conta.data_recebimento,
      competencia: conta.competencia,
      conta_financeira: conta.conta_financeira,
      centro_custo: conta.centro_custo,
      valor_total: parseFloat(conta.valor_total),
      projetos: conta.projetos?.map(p => ({ projeto: p.id, valor: p.valor })) || []
    };
    onEdit(contaFormatada);
    showSuccessToast('Conta selecionada para edição!');
  };

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para formatar datas
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="conta-receber-list-container">
        <div className="loading-container">
          <BarLoader color="#36D7B7" />
          <p>Carregando contas a receber...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="conta-receber-list-container">
      {/* Toaster component for notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          top: 20,
          right: 20,
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '400px',
            minWidth: '300px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
            lineHeight: '1.5',
            transition: 'all 0.2s ease',
          },
          success: {
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              color: '#15803d',
              border: '1px solid #bbf7d0',
              borderLeft: '4px solid #22c55e',
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderLeft: '4px solid #ef4444',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              color: '#475569',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #3b82f6',
            },
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#ffffff',
            },
          },
        }}
      />

      <div className="conta-receber-list">
        <h2>Listagem de Contas a Receber</h2>
        {contasReceber.length === 0 ? (
          <div className="no-data">
            <p>Nenhuma conta a receber encontrada.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Contrato</th>
                <th>Descrição</th>
                <th>Forma Pagamento</th>
                <th>Valor</th>
                <th>Data Recebimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contasReceber.map((conta) => (
                <tr key={conta.id}>
                  <td>{conta.id}</td>
                  <td>{conta.contrato}</td>
                  {/* CORREÇÃO: Buscar descrição do contrato usando o ID */}
                  <td>{contratos[conta.contrato] || "Descrição não encontrada"}</td>
                  <td>{formasPagamento[conta.forma_pagamento] || "Forma de pagamento não encontrada"}</td>
                  <td>{formatCurrency(parseFloat(conta.valor_total || 0))}</td>
                  <td>{formatDate(conta.data_recebimento)}</td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleEdit(conta)} 
                      className="edit-button-pl"
                      title="Editar conta"
                      disabled={deletingId === conta.id}
                    >
                      <GrEdit />
                    </button>
                    {deletingId === conta.id ? (
                      <div className="deleting-spinner">
                        <BarLoader width={30} height={3} color="#36D7B7" />
                      </div>
                    ) : (
                      <button 
                        onClick={() => openModal(conta.id)} 
                        className="delete-button-pl"
                        title="Excluir conta"
                      >
                        <GrTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Modal de confirmação para exclusão */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmação de exclusão"
        message="Tem certeza que deseja excluir esta conta a receber? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />
>>>>>>> e62255e (Atualizações no projeto)
    </div>
  );
};

export default ContaReceberList;