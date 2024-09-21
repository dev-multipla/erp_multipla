// FornecedorListForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './FornecedorListForm.css'; // Importa o CSS específico para ContractsList
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionamento
import { GrAdd, GrTrash } from "react-icons/gr"; // Ícones para os botões

const FornecedorListForm = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFornecedores, setSelectedFornecedores] = useState([]); // IDs dos fornecedores selecionados
  const navigate = useNavigate(); // Hook para redirecionamento

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de acesso não encontrado.');
        }

        const response = await axios.get('http://127.0.0.1:8000/api/fornecedor-list/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Response:', response.data); // Verifica a resposta

        // Verifica se a resposta contém fornecedores
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
    navigate('/cadastro-fornecedor'); // Redireciona para a nova página
  };

  const handleSelectFornecedor = (id) => {
    setSelectedFornecedores(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(fornecedorId => fornecedorId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteFornecedores = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de acesso não encontrado.');
      }

      // Faz a requisição para o soft delete
      await axios.post('http://127.0.0.1:8000/api/fornecedores/soft-delete/', {
        ids: selectedFornecedores  // Envia a lista de IDs dos fornecedores selecionados
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove os fornecedores deletados da lista no frontend
      const updatedContracts = contracts.filter(
        (fornecedor) => !selectedFornecedores.includes(fornecedor.id)
      );
      setContracts(updatedContracts);
      setSelectedFornecedores([]);  // Limpa a seleção após a exclusão

    } catch (error) {
      console.error('Erro ao deletar fornecedores:', error);
    }
  };

  if (loading) {
    return <div className="loader-container"><BounceLoader color="#009C95" size={50} /></div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="contracts-list-container"> {/* Novo contêiner flex */}
      <Sidebar /> {/* Renderiza a Sidebar */}
      <div className="fornecedor-list">
        <div className="actions">
          <input
            type="text"
            placeholder="Pesquisar Fornecedor ..."
            value={""}
            onChange={""}
          />
          <button className="add-button" onClick={handleButtonClick}>
            <GrAdd /> Incluir Fornecedor
          </button>
          <button
            className="delete-button"
            onClick={handleDeleteFornecedores}
            disabled={selectedFornecedores.length === 0}
          >
            <GrTrash /> Excluir Selecionados
          </button>
        </div>
        <h1>Fornecedores Associados</h1>
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
              {contracts.map(fornecedor => (
                <tr key={fornecedor.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedFornecedores.includes(fornecedor.id)}
                      onChange={() => handleSelectFornecedor(fornecedor.id)}
                    />
                  </td>
                  <td>{fornecedor.nome}</td>
                  <td>{fornecedor.cpf_cnpj}</td>
                  <td>{fornecedor.telefone}</td>
                  <td>{fornecedor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum fornecedor encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default FornecedorListForm;
