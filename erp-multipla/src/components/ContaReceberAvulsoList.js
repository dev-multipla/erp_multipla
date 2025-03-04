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
    </div>
  );
};

export default ContaReceberAvulsoList;
