// ContractsList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './ClienteListForm.css'; // Importa o CSS específico para ContractsList
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionamento
import { GrAdd, GrTrash } from "react-icons/gr"; // Importa o ícone de lixeira

const ClienteListForm = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]); // Armazena os IDs dos clientes selecionados
  const navigate = useNavigate(); // Hook para redirecionamento

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de acesso não encontrado.');
        }

        const response = await axios.get('http://127.0.0.1:8000/api/cliente-list/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Response:', response.data); // Verifica a resposta

        // Verifica se a resposta contém contratos
        if (Array.isArray(response.data)) {
          setContracts(response.data);
        } else {
          throw new Error('Dados recebidos não estão no formato esperado.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleButtonClick = () => {
    navigate('/cadastro-cliente'); // Redireciona para a nova página
  };

  const handleSelectClient = (id) => {
    setSelectedClients(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(clientId => clientId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteClients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de acesso não encontrado.');
      }

      // Faz a requisição para o soft delete
      await axios.post('http://127.0.0.1:8000/api/clientes/soft-delete/', {
        ids: selectedClients  // Envia a lista de IDs dos clientes selecionados
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove os clientes deletados da lista no frontend
      const updatedContracts = contracts.filter(
        (cliente) => !selectedClients.includes(cliente.id)
      );
      setContracts(updatedContracts);
      setSelectedClients([]);  // Limpa a seleção após a exclusão

    } catch (error) {
      console.error('Erro ao deletar clientes:', error);
    }
  };


  if (loading) {
    return <div className="loader-container"><BounceLoader color="#009C95" size={50} /></div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="client-list-container"> {/* Novo contêiner flex */}
      <Sidebar /> {/* Renderiza a Sidebar */}
      <div className="client-list">
        <div className="actions">
          <input
            type="text"
            placeholder="Pesquisar Cliente ..."
            value={""}
            onChange={""}
          />
          <button className="add-button" onClick={handleButtonClick}>
            <GrAdd /> Incluir Fornecedor
          </button>
          <button className="delete-button" onClick={handleDeleteClients} disabled={selectedClients.length === 0}>
            <GrTrash /> Excluir Selecionados
          </button>
        </div>
        <h1>Clientes Associados</h1>
        {contracts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Selecionar</th> {/* Coluna para checkboxes */}
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>Telefone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(cliente => (
                <tr key={cliente.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(cliente.id)}
                      onChange={() => handleSelectClient(cliente.id)}
                    />
                  </td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.cpf_cnpj}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum contrato encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ClienteListForm;
