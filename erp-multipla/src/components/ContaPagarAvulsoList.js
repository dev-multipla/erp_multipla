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
      toast.success('Conta a pagar deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar a conta a pagar:', error);
      toast.error('Erro ao deletar a conta a pagar');
    }
  };

  const handleEdit = (id) => {
    console.log(`Editando conta com ID: ${id}`);
    // Navegar ou abrir formulário de edição com o ID da conta selecionada
  };

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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContaPagarAvulsoList;
