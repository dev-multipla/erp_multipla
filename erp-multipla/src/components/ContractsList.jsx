<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './ContractsList.css'; // Importa o CSS específico para ContractsList
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionamento
=======
// src/components/ContractsList.js

import React, { useState, useEffect } from 'react';
import api from '../api';                     // importa a instância centralizada
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './ContractsList.css';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../CompanyContext';
>>>>>>> e62255e (Atualizações no projeto)

const ContractsList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [selectedContracts, setSelectedContracts] = useState([]); // Estado para armazenar contratos selecionados
  const navigate = useNavigate(); // Hook para redirecionamento

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de acesso não encontrado.');
        }

        const response = await axios.get('http://127.0.0.1:8000/api/contratos-list/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
  const [selectedContracts, setSelectedContracts] = useState([]);
  const { selectedCompanyId } = useCompany();
  const navigate = useNavigate();
  

  useEffect(() => {
    // só busca contratos depois que o tenant estiver selecionado
    if (!selectedCompanyId || selectedCompanyId === 'all') {
      setLoading(false);
      return;
    }
    const fetchContracts = async () => {
      try {
        // não precisa buscar token ou headers aqui:
        const response = await api.get('/api/contratos-list/');
        if (Array.isArray(response.data)) {
          setContracts(response.data);
        } else {
          throw new Error('Formato de dados inesperado.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Erro ao carregar contratos.');
>>>>>>> e62255e (Atualizações no projeto)
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
<<<<<<< HEAD
  }, []);

  const handleButtonClick = () => {
    navigate('/cadastro-contrato'); // Redireciona para a nova página
  };

  // Função para lidar com a seleção de contratos
  const handleCheckboxChange = (id) => {
    setSelectedContracts((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const getContractType = (contract) => {
  switch (contract.tipo) {
    case 'cliente':
      return 'Cliente';
    case 'fornecedor':
      return 'Fornecedor';
    default:
      return 'Desconhecido';
  }
};

  // Função para excluir (soft-delete) os contratos selecionados
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de acesso não encontrado.');
      }
  
      // Itera sobre os contratos selecionados e faz a requisição de exclusão individual para cada um
      for (const contractId of selectedContracts) {
        const response = await axios.delete(
          `http://127.0.0.1:8000/api/contratos/${contractId}/soft_delete/`,  // Cada contrato tem seu ID na URL
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log('Delete response:', response.data);
      }
  
      // Filtra os contratos excluídos do estado
      setContracts((prevContracts) =>
        prevContracts.filter((contract) => !selectedContracts.includes(contract.id))
      );
  
      // Limpa a seleção após a exclusão
      setSelectedContracts([]);
    } catch (error) {
      console.error('Erro ao excluir contratos:', error);
    }
  };
  

=======
    // reexecuta sempre que mudar selectedCompanyId
  }, [selectedCompanyId]);

  const handleButtonClick = () => {
    navigate('/cadastro-contrato');
  };

  const handleCheckboxChange = id => {
    setSelectedContracts(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      // chama DELETE para cada contrato através da instância api:
      await Promise.all(
        selectedContracts.map(id =>
          api.delete(`/api/contratos/${id}/soft_delete/`)
        )
      );
      setContracts(prev =>
        prev.filter(contract => !selectedContracts.includes(contract.id))
      );
      setSelectedContracts([]);
    } catch (err) {
      console.error('Erro ao excluir contratos:', err);
      setError('Falha ao excluir contratos.');
    }
  };
>>>>>>> e62255e (Atualizações no projeto)

  if (loading) {
    return (
      <div className="loader-container">
<<<<<<< HEAD
        <BounceLoader color="#009C95" size={50} />
=======
        <BounceLoader size={50} />
>>>>>>> e62255e (Atualizações no projeto)
      </div>
    );
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
<<<<<<< HEAD
    <div className="contracts-list-container"> {/* Novo contêiner flex */}
      <Sidebar /> {/* Renderiza a Sidebar */}
      <div className="contracts-list">
        <div className="actions">
          <input
            type="text"
            placeholder="Pesquisar Contrato ..."
            value={""}
            onChange={""}
          />
=======
    <div className="contracts-list-container">
      <Sidebar />
      <div className="contracts-list">
        <div className="actions">
>>>>>>> e62255e (Atualizações no projeto)
          <button className="add-button" onClick={handleButtonClick}>
            Incluir Contrato
          </button>
          {selectedContracts.length > 0 && (
            <button className="delete-button" onClick={handleDelete}>
              Excluir Selecionados
            </button>
          )}
        </div>
<<<<<<< HEAD
=======

>>>>>>> e62255e (Atualizações no projeto)
        <h1>Contratos Associados</h1>
        {contracts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Selecionar</th>
                <th>Número</th>
                <th>Descrição</th>
<<<<<<< HEAD
                <th>Data de Início</th>
                <th>Data de Fim</th>
                <th>Tipo</th>
=======
                <th>Tipo</th>
                <th>Status</th>
>>>>>>> e62255e (Atualizações no projeto)
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
              {contracts.map((contract) => (
=======
              {contracts.map(contract => (
>>>>>>> e62255e (Atualizações no projeto)
                <tr key={contract.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedContracts.includes(contract.id)}
                      onChange={() => handleCheckboxChange(contract.id)}
                    />
<<<<<<< HEAD

                  </td>
                  <td>{contract.numero}</td>
                  <td>{contract.descricao}</td>
                  <td>{contract.data_inicio}</td>
                  <td>{contract.data_termino}</td>
                  <td>{getContractType(contract)}</td>
                  <td>
                    <button className="button-custom-edit" onClick={() => navigate(`/editar-contrato/${contract.id}`)}>
=======
                  </td>
                  <td>{contract.numero}</td>
                  <td>{contract.descricao}</td>
                  <td>
                    {contract.tipo === 'cliente'
                      ? 'Cliente'
                      : contract.tipo === 'fornecedor'
                      ? 'Fornecedor'
                      : 'Desconhecido'}
                  </td>
                  <td>{contract.status}</td>
                  <td>
                    <button
                      className="button-custom-edit"
                      onClick={() => navigate(`/editar-contrato/${contract.id}`)}
                    >
>>>>>>> e62255e (Atualizações no projeto)
                      Editar
                    </button>
                  </td>
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

export default ContractsList;
