// FuncionarioList.js

import React, { useState, useEffect } from 'react';
import api from '../api'; // Importa a instância configurada do axios
import { BounceLoader } from 'react-spinners';
import SideBar from './SideBar';
import './FuncionarioList.css';
import { useNavigate } from 'react-router-dom';
import { GrAdd, GrEdit, GrTrash } from "react-icons/gr";

const FuncionarioList = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFuncionarios, setSelectedFuncionarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await api.get('/api/funcionarios/'); // Caminho relativo
        if (Array.isArray(response.data)) {
          setFuncionarios(response.data);
        } else {
          throw new Error('Dados recebidos não estão no formato esperado.');
        }
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        setError(error.message || 'Erro ao carregar funcionários');
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
  }, []);

  const handleDeleteFuncionarios = async () => {
    try {
      await api.post('/api/funcionarios/soft-delete/', { ids: selectedFuncionarios }); // Caminho relativo
      setFuncionarios(prev => prev.filter(f => !selectedFuncionarios.includes(f.id)));
      setSelectedFuncionarios([]);
    } catch (error) {
      console.error('Erro ao deletar funcionários:', error);
      alert('Erro ao excluir funcionários. Tente novamente.');
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
    <div className="funcionario-list-container">
      <SideBar />
      <div className="funcionario-list">
        <div className="actions">
          <input
            type="text"
            placeholder="Pesquisar Funcionário..."
            onChange={(e) => {
              // Implementar busca aqui se necessário
            }}
          />
          <button className="add-button" onClick={() => navigate('/cadastro-funcionario')}>
            <GrAdd /> Incluir Funcionário
          </button>

          {selectedFuncionarios.length > 0 && (
            <button className="delete-button" onClick={handleDeleteFuncionarios}>
              <GrTrash /> Excluir Selecionados
            </button>
          )}
        </div>

        <h1>Funcionários Cadastrados</h1>

        {funcionarios.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Selecionar</th>
                <th>Nome Completo</th>
                <th>CPF</th>
                <th>Matrícula</th>
                <th>Cargo</th>
                <th>Admissão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map(funcionario => (
                <tr key={funcionario.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedFuncionarios.includes(funcionario.id)}
                      onChange={() => setSelectedFuncionarios(prev =>
                        prev.includes(funcionario.id)
                          ? prev.filter(id => id !== funcionario.id)
                          : [...prev, funcionario.id]
                      )}
                    />
                  </td>
                  <td>{funcionario.nome_completo}</td>
                  <td>{funcionario.cpf}</td>
                  <td>{funcionario.matricula}</td>
                  <td>{funcionario.cargo_funcao}</td>
                  <td>{new Date(funcionario.data_admissao).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="button-custom-edit"
                      onClick={() => navigate(`/editar-funcionario/${funcionario.id}`)}
                    >
                      <GrEdit /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum funcionário cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default FuncionarioList;