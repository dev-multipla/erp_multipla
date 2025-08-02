<<<<<<< HEAD
// ClientList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './ClienteListForm.css'; // Importa o CSS específico para ContractsList
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionamento
import { GrAdd, GrEdit, GrTrash } from "react-icons/gr"; // Importa o ícone de lixeira

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
=======
// src/components/ClienteListForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './ClienteListForm.css';
import { useNavigate } from 'react-router-dom';
import { GrAdd, GrEdit, GrTrash } from 'react-icons/gr';
import { useCompany } from '../CompanyContext';

const ClienteListForm = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]);
  const { selectedCompanyId } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    // Só busca quando o tenant estiver selecionado (não vazio e não 'all')
    if (!selectedCompanyId || selectedCompanyId === 'all') {
      setLoading(false);
      return;
    }

    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/cliente-list/');
        if (Array.isArray(response.data)) {
          setClients(response.data);
        } else {
          throw new Error('Dados recebidos não estão no formato esperado.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Erro ao carregar clientes.');
>>>>>>> e62255e (Atualizações no projeto)
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
<<<<<<< HEAD
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
=======
  }, [selectedCompanyId]);

  const handleAdd = () => {
    navigate('/cadastro-cliente');
  };

  const handleSelectClient = id => {
    setSelectedClients(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      // Supondo endpoint RESTful com soft_delete em cada cliente
      await Promise.all(
        selectedClients.map(id =>
          api.delete(`/api/clientes/${id}/soft_delete/`)
        )
      );
      setClients(prev => prev.filter(c => !selectedClients.includes(c.id)));
      setSelectedClients([]);
    } catch (err) {
      console.error('Erro ao excluir clientes:', err);
      setError('Falha ao excluir clientes.');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <BounceLoader size={50} />
      </div>
    );
>>>>>>> e62255e (Atualizações no projeto)
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
<<<<<<< HEAD
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

          {/* Mostrar o botão de excluir apenas quando houver clientes selecionados */}
        {selectedClients.length > 0 && (
          <button className="delete-button" onClick={handleDeleteClients}>
            <GrTrash /> Excluir Selecionados
          </button>
        )}

        </div>
        <h1>Clientes Associados</h1>
        {contracts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Selecionar</th> {/* Coluna para checkboxes */}
=======
    <div className="client-list-container">
      <Sidebar />
      <div className="client-list">
        <div className="actions">
          <button className="add-button" onClick={handleAdd}>
            <GrAdd /> Incluir Cliente
          </button>
          {selectedClients.length > 0 && (
            <button className="delete-button" onClick={handleDelete}>
              <GrTrash /> Excluir Selecionados
            </button>
          )}
        </div>

        <h1>Clientes Associados</h1>
        {clients.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Selecionar</th>
>>>>>>> e62255e (Atualizações no projeto)
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
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
      <td>
        <button className="button-custom-edit" onClick={() => navigate(`/editar-cliente/${cliente.id}`)}>
          <GrEdit /> Editar
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        ) : (
          <p>Nenhum contrato encontrado.</p>
=======
              {clients.map(cliente => (
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
                  <td>
                    <button
                      className="button-custom-edit"
                      onClick={() => navigate(`/editar-cliente/${cliente.id}`)}
                    >
                      <GrEdit /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum cliente encontrado.</p>
>>>>>>> e62255e (Atualizações no projeto)
        )}
      </div>
    </div>
  );
};

export default ClienteListForm;
