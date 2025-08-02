<<<<<<< HEAD
//ContaPagarList
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContaPagarList.css';
import { GrEdit, GrTrash } from "react-icons/gr";


const ContaPagarList = ({ onEdit }) => {
  const [contasPagar, setContasPagar] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState({});
  const [contratos, setContratos] = useState({});
  const [editFormData, setEditFormData] = useState(null); // Estado para os dados de edição

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Função para buscar as contas a pagar
    const fetchContasPagar = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contas-pagar/', {
          headers: { Authorization: `Bearer ${token}` },
        });
=======
// ContaPagarList.jsx
import React, { useEffect, useState } from 'react';
import api from '../api'; // Importa a instância configurada do axios
import { ToastContainer, toast } from 'react-toastify';
import { BarLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import './ContaPagarList.css';
import { GrEdit, GrTrash } from "react-icons/gr";
import ConfirmModal from './ConfirmModal';

const ContaPagarList = ({ onEdit, refresh }) => {
  const [contasPagar, setContasPagar] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState({});
  const [contratos, setContratos] = useState({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Estados para controle do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  useEffect(() => {
    const fetchContasPagar = async () => {
      try {
        const response = await api.get('/api/contas-pagar/');
>>>>>>> e62255e (Atualizações no projeto)
        setContasPagar(response.data);
      } catch (error) {
        console.error('Erro ao carregar as contas a pagar:', error);
        toast.error('Erro ao carregar as contas a pagar');
<<<<<<< HEAD
      }
    };

    // Função para buscar a lista de contratos
    const fetchContratos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contratos-list/', {
          headers: { Authorization: `Bearer ${token}` },
        });
=======
        throw error; // Re-throw para ser capturado no fetchAllData
      }
    };

    const fetchContratos = async () => {
      try {
        const response = await api.get('/api/contratos-list/');
>>>>>>> e62255e (Atualizações no projeto)
        const contratosMap = response.data.reduce((acc, contrato) => {
          acc[contrato.id] = contrato.descricao;
          return acc;
        }, {});
        setContratos(contratosMap);
      } catch (error) {
        console.error('Erro ao carregar os contratos:', error);
        toast.error('Erro ao carregar os contratos');
<<<<<<< HEAD
      }
    };

    // Função para buscar formas de pagamento
    const fetchFormasPagamento = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/select/formas-pagamento/', {
          headers: { Authorization: `Bearer ${token}` },
        });
=======
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
        toast.error('Erro ao carregar as formas de pagamento');
<<<<<<< HEAD
      }
    };

    fetchFormasPagamento();
    fetchContasPagar();
    fetchContratos();
  }, []);

  // Função para deletar uma conta
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/contas-pagar/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContasPagar(contasPagar.filter((conta) => conta.id !== id));
      toast.success('Conta a pagar deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar a conta a pagar:', error);
      toast.error('Erro ao deletar a conta a pagar');
=======
        throw error;
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchContasPagar(),
          fetchContratos(),
          fetchFormasPagamento()
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Toast já foi exibido nas funções individuais
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [refresh]);

  // Função de deleção usando a instância api centralizada
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/contas-pagar/${id}/`);
      setContasPagar(prevContas => prevContas.filter((conta) => conta.id !== id));
      toast.success('Conta a pagar deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar a conta a pagar:', error);
      
      // Tratamento de erro mais específico
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Erro ao deletar a conta a pagar';
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  // Abre o modal e define o ID do item a ser excluído
  const openModal = (id) => {
    setSelectedDeleteId(id);
    setIsModalOpen(true);
  };

  // Fecha o modal e reseta o ID selecionado
  const closeModal = () => {
    setSelectedDeleteId(null);
    setIsModalOpen(false);
  };

  // Função de confirmação que executa a deleção
  const confirmDelete = async () => {
    if (selectedDeleteId) {
      await handleDelete(selectedDeleteId);
      closeModal();
>>>>>>> e62255e (Atualizações no projeto)
    }
  };

  const handleEdit = (conta) => {
    console.log("Conta original recebida:", conta);
<<<<<<< HEAD
    
    const contaFormatada = {
        id: conta.id, // Inclua o ID para garantir que seja passado
        contrato: conta.contrato,
        forma_pagamento: conta.forma_pagamento,
        data_pagamento: conta.data_pagamento,
        competencia: conta.competencia,
        conta_financeira: conta.conta_financeira,
        centro_custo: conta.centro_custo,
        valor_total: parseFloat(conta.valor_total),
    };

    console.log("Conta formatada para edição:", conta);
    onEdit(contaFormatada);
};
=======
    const contaFormatada = {
      id: conta.id,
      contrato: conta.contrato,
      forma_pagamento: conta.forma_pagamento,
      data_pagamento: conta.data_pagamento,
      competencia: conta.competencia,
      conta_financeira: conta.conta_financeira,
      centro_custo: conta.centro_custo,
      valor_total: parseFloat(conta.valor_total),
    };
    console.log("Conta formatada para edição:", contaFormatada);
    onEdit(contaFormatada);
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
      <div className="conta-pagar-list-container">
        <div className="loading-container">
          <BarLoader color="#36D7B7" />
          <p>Carregando contas a pagar...</p>
        </div>
      </div>
    );
  }
>>>>>>> e62255e (Atualizações no projeto)

  return (
    <div className="conta-pagar-list-container">
      <div className="conta-pagar-list">
        <h2>Listagem de Contas a Pagar</h2>
<<<<<<< HEAD
        <ToastContainer />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Contrato</th>
              <th>Descrição</th>
              <th>Forma Pagamento</th>
              <th>Valor</th>
              <th>Data de Vencimento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contasPagar.map((conta) => (
              <tr key={conta.id}>
                <th>{conta.id}</th>
                <td>{conta.contrato}</td>
                <td>{contratos[conta.contrato] || "Descrição não encontrada"}</td>
                <td>{formasPagamento[conta.forma_pagamento] || "Forma de pagamento não encontrada"}</td>
                <td>{conta.valor_total}</td>
                <td>{conta.data_pagamento}</td>
                <td>
                  <button onClick={() => handleEdit(conta)} className="edit-button-pl">
                    <GrEdit />
                  </button>
                  <button onClick={() => handleDelete(conta.id)} className="delete-button-pl">
                    <GrTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
=======
        {contasPagar.length === 0 ? (
          <div className="no-data">
            <p>Nenhuma conta a pagar encontrada.</p>
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
                <th>Data de Vencimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contasPagar.map((conta) => (
                <tr key={conta.id}>
                  <td>{conta.id}</td>
                  <td>{conta.contrato}</td>
                  <td>{contratos[conta.contrato] || "Descrição não encontrada"}</td>
                  <td>{formasPagamento[conta.forma_pagamento] || "Forma de pagamento não encontrada"}</td>
                  <td>{formatCurrency(parseFloat(conta.valor_total || 0))}</td>
                  <td>{formatDate(conta.data_pagamento)}</td>
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
        message="Tem certeza que deseja excluir esta conta a pagar? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
>>>>>>> e62255e (Atualizações no projeto)
    </div>
  );
};

export default ContaPagarList;