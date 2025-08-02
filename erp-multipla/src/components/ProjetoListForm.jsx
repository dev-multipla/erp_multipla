import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import axios from 'axios';
=======
import api from '../api';
>>>>>>> e62255e (Atualizações no projeto)
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './ProjetoListForm.css'; // Importa o CSS específico para ProjectsList
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionamento
import { GrEdit } from "react-icons/gr";
<<<<<<< HEAD

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
=======
import { useCompany } from '../CompanyContext'

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const { selectedCompanyId } = useCompany(); 
>>>>>>> e62255e (Atualizações no projeto)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]); // Estado para armazenar projetos selecionados
  const navigate = useNavigate(); // Hook para redirecionamento

  useEffect(() => {
<<<<<<< HEAD
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de acesso não encontrado.');
        }

        const response = await axios.get('http://127.0.0.1:8000/api/projeto-list/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response:', response.data); // Verifica a resposta

        // Verifica se a resposta contém projetos
        if (Array.isArray(response.data)) {
          setProjects(response.data);
        } else {
          throw new Error('Dados recebidos não estão no formato esperado.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
=======
    // não faz nada até que o tenant seja selecionado
    if (!selectedCompanyId) return;

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/projeto-list/');
        if (Array.isArray(res.data)) {
          setProjects(res.data);
        } else {
          throw new Error('Dados em formato inesperado');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
>>>>>>> e62255e (Atualizações no projeto)
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
<<<<<<< HEAD
  }, []);
=======
  }, [selectedCompanyId]);
>>>>>>> e62255e (Atualizações no projeto)

  const handleButtonClick = () => {
    navigate('/cadastro-projeto'); // Redireciona para a nova página
  };

  // Função para lidar com a seleção de projetos
  const handleCheckboxChange = (id) => {
    setSelectedProjects((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Função para excluir (soft-delete) os projetos selecionados
  const handleDelete = async () => {
    try {
<<<<<<< HEAD
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de acesso não encontrado.');
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/projetos/soft-delete/',
        { ids: selectedProjects },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Delete response:', response.data);
=======

      await api.post('/api/projetos/soft-delete/', { ids: selectedProjects });

>>>>>>> e62255e (Atualizações no projeto)

      // Filtra os projetos excluídos do estado
      setProjects((prevProjects) =>
        prevProjects.filter((project) => !selectedProjects.includes(project.id))
      );

      // Limpa a seleção após a exclusão
      setSelectedProjects([]);
    } catch (error) {
      console.error('Erro ao excluir projetos:', error);
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
    <div className="projects-list-container"> {/* Novo contêiner flex */}
      <Sidebar style={{ width: '550px', backgroundColor: '#343a40' }} />
      <div className="projects-list">
        <div className="actions">
          <input
            type="text"
            placeholder="Pesquisar Projetos ..."
            value={""}
            onChange={""}
          />
          <button className="add-button" onClick={handleButtonClick}>
            Incluir Projeto
          </button>
          {selectedProjects.length > 0 && (
            <button className="delete-button" onClick={handleDelete}>
              Excluir Selecionados
            </button>
          )}
        </div>
        <h1>Projetos Associados</h1>
        {projects.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Selecionar</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Data de Início</th>
                <th>Data de Fim</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleCheckboxChange(project.id)}
                    />
                  </td>
                  <td>{project.nome}</td>
                  <td>{project.descricao}</td>
                  <td>{project.data_inicio}</td>
                  <td>{project.data_termino}</td>
                  <td>{project.status}</td>
                  <td>
        <button className="button-custom-edit" onClick={() => navigate(`/editar-projeto/${project.id}`)}>
          <GrEdit /> Editar
        </button>
      </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum projeto encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
