<<<<<<< HEAD
// FornecedorListForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './FornecedorListForm.css'; // Importa o CSS específico para ContractsList
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionamento
import { GrAdd, GrTrash, GrEdit } from "react-icons/gr"; // Ícones para os botões

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
=======
// src/components/FornecedorListForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './FornecedorListForm.css';
import { useNavigate } from 'react-router-dom';
import { GrAdd, GrTrash, GrEdit } from 'react-icons/gr';
import { useCompany } from '../CompanyContext';

const FornecedorListForm = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFornecedores, setSelectedFornecedores] = useState([]);
  const { selectedCompanyId } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    // Só buscar depois que o tenant estiver selecionado
    if (!selectedCompanyId || selectedCompanyId === 'all') {
      setLoading(false);
      return;
    }

    const fetchFornecedores = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/fornecedor-list/');
        if (Array.isArray(response.data)) {
          setFornecedores(response.data);
        } else {
          throw new Error('Dados recebidos não estão no formato esperado.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Erro ao carregar fornecedores.');
>>>>>>> e62255e (Atualizações no projeto)
      } finally {
        setLoading(false);
      }
    };

<<<<<<< HEAD
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
=======
    fetchFornecedores();
  }, [selectedCompanyId]);

  const handleAdd = () => {
    navigate('/cadastro-fornecedor');
  };

  const handleSelect = id => {
    setSelectedFornecedores(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      // Supondo endpoint RESTful soft-delete em cada fornecedor
      await Promise.all(
        selectedFornecedores.map(id =>
          api.delete(`/api/fornecedores/${id}/soft_delete/`)
        )
      );
      setFornecedores(prev =>
        prev.filter(f => !selectedFornecedores.includes(f.id))
      );
      setSelectedFornecedores([]);
    } catch (err) {
      console.error('Erro ao excluir fornecedores:', err);
      setError('Falha ao excluir fornecedores.');
>>>>>>> e62255e (Atualizações no projeto)
    }
  };

  if (loading) {
<<<<<<< HEAD
    return <div className="loader-container"><BounceLoader color="#009C95" size={50} /></div>;
  }

=======
    return (
      <div className="loader-container">
        <BounceLoader size={50} />
      </div>
    );
  }
>>>>>>> e62255e (Atualizações no projeto)
  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
<<<<<<< HEAD
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
           {/* Mostrar o botão de excluir apenas quando houver fornecedores selecionados */}
        {selectedFornecedores.length > 0 && (
          <button className="delete-button" onClick={handleDeleteFornecedores}>
            <GrTrash /> Excluir Selecionados
          </button>
        )}

        </div>
        <h1>Fornecedores Associados</h1>
        {contracts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Selecionar</th> {/* Coluna para checkboxes */}
=======
    <div className="fornecedor-list-container">
      <Sidebar />
      <div className="fornecedor-list">
        <div className="actions">
          <button className="add-button" onClick={handleAdd}>
            <GrAdd /> Incluir Fornecedor
          </button>
          {selectedFornecedores.length > 0 && (
            <button className="delete-button" onClick={handleDelete}>
              <GrTrash /> Excluir Selecionados
            </button>
          )}
        </div>

        <h1>Fornecedores Associados</h1>
        {fornecedores.length > 0 ? (
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
      <td>
        <button className="button-custom-edit" onClick={() => navigate(`/editar-fornecedor/${fornecedor.id}`)}>
          <GrEdit /> Editar
        </button>
      </td>
    </tr>
  ))}
</tbody>
=======
              {fornecedores.map(forn => (
                <tr key={forn.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedFornecedores.includes(forn.id)}
                      onChange={() => handleSelect(forn.id)}
                    />
                  </td>
                  <td>{forn.nome}</td>
                  <td>{forn.cpf_cnpj}</td>
                  <td>{forn.telefone}</td>
                  <td>{forn.email}</td>
                  <td>
                    <button
                      className="button-custom-edit"
                      onClick={() => navigate(`/editar-fornecedor/${forn.id}`)}
                    >
                      <GrEdit /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
>>>>>>> e62255e (Atualizações no projeto)
          </table>
        ) : (
          <p>Nenhum fornecedor encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default FornecedorListForm;
