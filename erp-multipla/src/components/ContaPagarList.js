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
        setContasPagar(response.data);
      } catch (error) {
        console.error('Erro ao carregar as contas a pagar:', error);
        toast.error('Erro ao carregar as contas a pagar');
      }
    };

    // Função para buscar a lista de contratos
    const fetchContratos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contratos-list/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const contratosMap = response.data.reduce((acc, contrato) => {
          acc[contrato.id] = contrato.descricao;
          return acc;
        }, {});
        setContratos(contratosMap);
      } catch (error) {
        console.error('Erro ao carregar os contratos:', error);
        toast.error('Erro ao carregar os contratos');
      }
    };

    // Função para buscar formas de pagamento
    const fetchFormasPagamento = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/select/formas-pagamento/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formasPagamentoMap = response.data.reduce((acc, forma) => {
          acc[forma.id] = forma.descricao;
          return acc;
        }, {});
        setFormasPagamento(formasPagamentoMap);
      } catch (error) {
        console.error('Erro ao carregar as formas de pagamento:', error);
        toast.error('Erro ao carregar as formas de pagamento');
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
    }
  };

  const handleEdit = (conta) => {
    console.log("Conta original recebida:", conta);
    
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

  return (
    <div className="conta-pagar-list-container">
      <div className="conta-pagar-list">
        <h2>Listagem de Contas a Pagar</h2>
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
    </div>
  );
};

export default ContaPagarList;