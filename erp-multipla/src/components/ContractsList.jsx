import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './ContractsList.css'; // Importa o CSS específico para ContractsList
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionamento

const ContractsList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
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
  


  if (loading) {
    return (
      <div className="loader-container">
        <BounceLoader color="#009C95" size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
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
          <button className="add-button" onClick={handleButtonClick}>
            Incluir Contrato
          </button>
          {selectedContracts.length > 0 && (
            <button className="delete-button" onClick={handleDelete}>
              Excluir Selecionados
            </button>
          )}
        </div>
        <h1>Contratos Associados</h1>
        {contracts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Selecionar</th>
                <th>Número</th>
                <th>Descrição</th>
                <th>Data de Início</th>
                <th>Data de Fim</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedContracts.includes(contract.id)}
                      onChange={() => handleCheckboxChange(contract.id)}
                    />
                  </td>
                  <td>{contract.numero}</td>
                  <td>{contract.descricao}</td>
                  <td>{contract.data_inicio}</td>
                  <td>{contract.data_termino}</td>
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
