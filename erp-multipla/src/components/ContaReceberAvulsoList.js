<<<<<<< HEAD
// ContaReceberList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContaReceberList.css';
import { GrEdit, GrTrash } from "react-icons/gr";

const ContaReceberAvulsoList = () => {
  const [contasReceberAvulso, setContasReceberAvulso] = useState([]);

  useEffect(() => {
    // Função para buscar as contas a receber
    const fetchContasReceberAvulso = async () => {
      const token = localStorage.getItem('token');
      console.log('Token armazenado:', token); // Log do token para verificação

      try {
        const response = await axios.get('http://localhost:8000/api/contas-a-receber-avulso/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Resposta da requisição de contas a receber:', response.data); // Log da resposta do servidor
        setContasReceberAvulso(response.data);
      } catch (error) {
        console.error('Erro ao carregar as contas a receber:', error); // Log de erro para diagnóstico
        toast.error('Erro ao carregar as contas a receber');
      }
    };

    fetchContasReceberAvulso();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    console.log(`Tentando deletar a conta de ID: ${id}`); // Log do ID a ser deletado
    console.log('Token para deleção:', token); // Log do token usado na deleção

    try {
      const response = await axios.delete(`http://localhost:8000/api/contas-receber/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Resposta da requisição de deleção:', response); // Log da resposta ao deletar
      setContasReceberAvulso(contasReceberAvulso.filter((conta) => conta.id !== id));
      toast.success('Conta a receber deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar a conta a receber:', error); // Log de erro para diagnóstico
      toast.error('Erro ao deletar a conta a receber');
    }
  };
  

  const handleEdit = (id) => {
    console.log(`Editando conta com ID: ${id}`); // Log do ID para edição
    // Navegar ou abrir formulário de edição com o ID da conta selecionada
  };

  return (
    <div className="conta-receber-list">
      <h2>Listagem de Contas a Receber Avulso</h2>
      <ToastContainer />
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Data de Recebimento</th>
            <th>Cliente</th>
            <th>Projetos</th>
          </tr>
        </thead>
        <tbody>
  {contasReceberAvulso.map((conta) => (
    <tr key={conta.contrato}> {/* Use uma chave única, como 'contrato' */}
      <td>{conta.descricao}</td> {/* Ajuste para o campo correto */}
      <td>{conta.valor}</td> {/* Exemplo, ajuste conforme necessário */}
      <td>{conta.data_recebimento}</td> {/* Ajuste para 'valor_total' */}
      <td>{conta.cliente}</td> {/* Ajuste para 'data_recebimento' */}
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
=======
// ContaReceberAvulsoList.js

import React, { useEffect, useState } from 'react';
import api from '../api'; // Importa a instância configurada do axios
import { ToastContainer, toast } from 'react-toastify';
import { BarLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import './ContaReceberList.css';
import { GrEdit, GrTrash } from "react-icons/gr";
import ConfirmModal from './ConfirmModal';

const ContaReceberAvulsoList = ({ onEdit, refresh }) => {
  const [contas, setContas] = useState([]);
  const [clientes, setClientes] = useState({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Usando a instância api para requisições
      const [contasResponse, clientesResponse] = await Promise.all([
        api.get('/api/contas-a-receber-avulso/'), // Caminho relativo
        api.get('/api/select/clientes/') // Caminho relativo
      ]);

      const clientesMap = clientesResponse.data.reduce((acc, cliente) => {
        acc[cliente.id] = cliente.nome;
        return acc;
      }, {});

      setContas(contasResponse.data);
      setClientes(clientesMap);
    } catch (error) {
      toast.error('Erro ao carregar dados');
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      // Usando a instância api para deletar
      await api.delete(`/api/contas-a-receber-avulso/${id}/`); // Caminho relativo
      setContas(prev => prev.filter(conta => conta.id !== id));
      toast.success('Conta removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover conta:', error);
      toast.error('Erro ao remover conta');
    } finally {
      setDeletingId(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="conta-receber-avulso-container">
      <h2>Faturamento de contratos Avulsos</h2>
      <ToastContainer />

      {loading ? (
        <BarLoader color="#36D7B7" width="100%" />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data Recebimento</th>
                <th>Cliente</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contas.map(conta => (
                <tr key={conta.id}>
                  <td>{conta.descricao}</td>
                  <td>R$ {parseFloat(conta.valor).toFixed(2)}</td>
                  <td>{new Date(conta.data_recebimento).toLocaleDateString('pt-BR')}</td>
                  <td>{clientes[conta.cliente] || 'N/A'}</td>
                  <td>
                    <div className="actions">
                      <button
                        onClick={() => {
                          console.log('Editando conta:', conta);
                          onEdit(conta.id);
                        }}
                        className="edit-button"
                        title="Editar"
                      >
                        <GrEdit />
                      </button>
                      {deletingId === conta.id ? (
                        <BarLoader width={30} color="#ff4444" />
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedDeleteId(conta.id);
                            setIsModalOpen(true);
                          }}
                          className="delete-button"
                          title="Excluir"
                        >
                          <GrTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {contas.length === 0 && !loading && (
            <div className="no-results">
              <p>Nenhuma conta encontrada</p>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta conta permanentemente?"
        onConfirm={() => handleDelete(selectedDeleteId)}
        onCancel={() => setIsModalOpen(false)}
      />
>>>>>>> e62255e (Atualizações no projeto)
    </div>
  );
};

<<<<<<< HEAD
export default ContaReceberAvulsoList;
=======
export default ContaReceberAvulsoList;
>>>>>>> e62255e (Atualizações no projeto)
