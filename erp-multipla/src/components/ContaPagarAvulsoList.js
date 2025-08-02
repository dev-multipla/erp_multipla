<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContaPagarList.css';
import { GrEdit, GrTrash } from "react-icons/gr";

const ContaPagarAvulsoList = () => {
  const [contasPagarAvulso, setContasPagarAvulso] = useState([]);
  const [fornecedores, setFornecedores] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token armazenado:', token); // Log do token para verificação

    const fetchContasPagarAvulso = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contas-a-pagar-avulso/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Resposta da requisição de contas a pagar:', response.data);
        setContasPagarAvulso(response.data);
      } catch (error) {
        console.error('Erro ao carregar as contas a pagar:', error);
        toast.error('Erro ao carregar as contas a pagar');
      }
    };

    const fetchFornecedores = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/fornecedor-list/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fornecedoresMap = response.data.reduce((acc, fornecedor) => {
          acc[fornecedor.id] = fornecedor.nome;
          return acc;
        }, {});
        console.log('Fornecedores carregados:', fornecedoresMap);
        setFornecedores(fornecedoresMap);
      } catch (error) {
        console.error('Erro ao carregar os fornecedores:', error);
        toast.error('Erro ao carregar os fornecedores');
      }
    };

    fetchContasPagarAvulso();
    fetchFornecedores();   
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    console.log(`Tentando deletar a conta de ID: ${id}`);
    console.log('Token para deleção:', token);

    try {
      await axios.delete(`http://localhost:8000/api/contas-a-pagar-avulso/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContasPagarAvulso(contasPagarAvulso.filter((conta) => conta.id !== id));
=======
// ContaPagarAvulsoList.js

import React, { useEffect, useState } from 'react';
import api from '../api'; // Importa a instância configurada do axios
import { ToastContainer, toast } from 'react-toastify';
import { BarLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import './ContaPagarList.css';
import { GrEdit, GrTrash } from "react-icons/gr";
import ConfirmModal from './ConfirmModal';

const ContaPagarAvulsoList = ({ onEdit, refresh }) => {
  const [contasPagarAvulso, setContasPagarAvulso] = useState([]);
  const [fornecedores, setFornecedores] = useState({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const fetchContasPagarAvulso = async () => {
    try {
      const response = await api.get('/api/contas-a-pagar-avulso/'); // Caminho relativo
      setContasPagarAvulso(response.data);
    } catch (error) {
      console.error('Erro ao carregar as contas a pagar:', error);
      toast.error('Erro ao carregar as contas a pagar');
    }
  };

  const fetchFornecedores = async () => {
    try {
      const response = await api.get('/api/fornecedor-list/'); // Caminho relativo
      const fornecedoresMap = response.data.reduce((acc, fornecedor) => {
        acc[fornecedor.id] = fornecedor.nome;
        return acc;
      }, {});
      setFornecedores(fornecedoresMap);
    } catch (error) {
      console.error('Erro ao carregar os fornecedores:', error);
      toast.error('Erro ao carregar os fornecedores');
    }
  };

  // Reexecuta os fetchs sempre que "refresh" mudar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchContasPagarAvulso(), fetchFornecedores()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  // Abre o modal e define o id do item a ser excluído
  const openModal = (id) => {
    setSelectedDeleteId(id);
    setIsModalOpen(true);
  };

  // Fecha o modal e reseta o id selecionado
  const closeModal = () => {
    setSelectedDeleteId(null);
    setIsModalOpen(false);
  };

  // Função de confirmação que executa a deleção
  const confirmDelete = async () => {
    setDeletingId(selectedDeleteId);
    try {
      await api.delete(`/api/contas-a-pagar-avulso/${selectedDeleteId}/`); // Caminho relativo
      setContasPagarAvulso(contasPagarAvulso.filter((conta) => conta.id !== selectedDeleteId));
>>>>>>> e62255e (Atualizações no projeto)
      toast.success('Conta a pagar deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar a conta a pagar:', error);
      toast.error('Erro ao deletar a conta a pagar');
<<<<<<< HEAD
    }
  };

  const handleEdit = (id) => {
    console.log(`Editando conta com ID: ${id}`);
    // Navegar ou abrir formulário de edição com o ID da conta selecionada
  };
=======
    } finally {
      setDeletingId(null);
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="conta-receber-list">
        <BarLoader color="#36D7B7" />
      </div>
    );
  }
>>>>>>> e62255e (Atualizações no projeto)

  return (
    <div className="conta-receber-list">
      <h2>Listagem de Contas a Pagar Avulso</h2>
      <ToastContainer />
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Data de Pagamento</th>
            <th>Fornecedor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contasPagarAvulso.map((conta) => (
            <tr key={conta.id}>
              <td>{conta.descricao}</td>
<<<<<<< HEAD
              <td>{conta.valor}</td>
              <td>{conta.data_pagamento}</td>
              <td>{fornecedores[conta.fornecedor] || "Fornecedor não encontrado"}</td>
              <td>
              <button onClick={() => handleEdit(conta)} className="edit-button-pl">
                  <GrEdit />
                </button>
                <button onClick={() => handleDelete(conta.id)} className="delete-button-pl">
                  <GrTrash />
                </button>
=======
              <td>R$ {parseFloat(conta.valor).toFixed(2)}</td>
              <td>{new Date(conta.data_pagamento).toLocaleDateString('pt-BR')}</td>
              <td>{fornecedores[conta.fornecedor] || "Fornecedor não encontrado"}</td>
              <td>
                <button onClick={() => onEdit(conta.id)} className="edit-button-pl">
                  <GrEdit />
                </button>
                {deletingId === conta.id ? (
                  <BarLoader width={50} color="#36D7B7" />
                ) : (
                  <button onClick={() => openModal(conta.id)} className="delete-button-pl">
                    <GrTrash />
                  </button>
                )}
>>>>>>> e62255e (Atualizações no projeto)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
<<<<<<< HEAD
=======

      {/* Componente de Modal para confirmação de exclusão */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmação de exclusão"
        message="Tem certeza que deseja excluir esta conta?"
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />
>>>>>>> e62255e (Atualizações no projeto)
    </div>
  );
};

<<<<<<< HEAD
export default ContaPagarAvulsoList;
=======
export default ContaPagarAvulsoList;
>>>>>>> e62255e (Atualizações no projeto)
