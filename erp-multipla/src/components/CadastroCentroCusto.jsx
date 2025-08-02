<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CadastroCentroCusto.css';
import SideBar from './SideBar';
import { MdOutlineSaveAlt, MdClearAll, MdEdit, MdDelete } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
=======
// CadastroCentroCusto.js

import React, { useState, useEffect } from 'react';
import api from '../api'; // Importa a instância configurada do axios
import './CadastroCentroCusto.css';
import SideBar from './SideBar';
import { MdEdit, MdDelete } from "react-icons/md";
import { GrClearOption } from "react-icons/gr";
import { IoMdArrowBack, IoIosSave } from "react-icons/io";
>>>>>>> e62255e (Atualizações no projeto)
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CadastroCentroCusto = () => {
  const [descricao, setDescricao] = useState('');
  const [centrosCusto, setCentrosCusto] = useState([]);
<<<<<<< HEAD
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

=======
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para filtro e ordenação
  const [filterText, setFilterText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' ou 'desc'

  // Carrega os centros de custo ao montar o componente
>>>>>>> e62255e (Atualizações no projeto)
  useEffect(() => {
    fetchCentrosCusto();
  }, []);

<<<<<<< HEAD
  const fetchCentrosCusto = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/centros-custos/');
=======
  // Busca os centros de custo
  const fetchCentrosCusto = async () => {
    try {
      const response = await api.get('/api/centros-custos/');
>>>>>>> e62255e (Atualizações no projeto)
      setCentrosCusto(response.data);
    } catch (error) {
      toast.error('Erro ao carregar centros de custo.');
    }
  };

<<<<<<< HEAD
=======
  // Manipula mudança no campo de descrição
>>>>>>> e62255e (Atualizações no projeto)
  const handleDescricaoChange = (e) => {
    const value = e.target.value;
    if (value.length > 100) {
      setErrorMessage('A descrição deve ter no máximo 100 caracteres.');
    } else {
      setErrorMessage('');
    }
    setDescricao(value);
  };

<<<<<<< HEAD
=======
  // Submissão do formulário
>>>>>>> e62255e (Atualizações no projeto)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
<<<<<<< HEAD
      await axios.post('http://localhost:8000/api/centros-custos/', { descricao });
      setSuccessMessage('Centro de Custo cadastrado com sucesso!');
      toast.success('Centro de Custo cadastrado com sucesso!');
      setDescricao('');
=======
      if (editingId) {
        // Atualiza
        await api.put(`/api/centros-custos/${editingId}/`, { descricao });
      } else {
        // Cria
        await api.post('/api/centros-custos/', { descricao });
      }
      setSuccessMessage('Centro de Custo cadastrado com sucesso!');
      toast.success('Centro de Custo cadastrado com sucesso!');
      setDescricao('');
      setEditingId(null);
>>>>>>> e62255e (Atualizações no projeto)
      fetchCentrosCusto(); // Atualiza a lista após o cadastro
    } catch (error) {
      setErrorMessage('Erro ao cadastrar Centro de Custo. Tente novamente.');
      toast.error('Erro ao cadastrar Centro de Custo.');
    } finally {
      setIsSubmitting(false);
    }
  };

<<<<<<< HEAD
=======
  // Limpa os campos e mensagens
>>>>>>> e62255e (Atualizações no projeto)
  const handleClear = () => {
    setDescricao('');
    setErrorMessage('');
  };

<<<<<<< HEAD
  const handleEdit = (centro) => {
    setDescricao(centro.descricao);
    // Aqui você pode implementar a lógica de edição
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Token não encontrado. Faça login novamente.');
        return;
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      // Corrige a URL para /api/centros-custos/
      await axios.delete(`http://localhost:8000/api/centros-custos/${id}/`, { headers });
      toast.success('Centro de Custo excluído com sucesso!');
      fetchCentrosCusto();
=======
  // Função para edição (placeholder - implementar conforme necessidade)
  const handleEdit = (centro) => {
    setDescricao(centro.descricao);
    setEditingId(centro.id);
  };

  // Cancela o modo edição
 const handleCancelEdit = () => {
   setDescricao('');
   setEditingId(null);
   setErrorMessage('');
 };

  // Exclusão de centro de custo
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/centros-custos/${id}/`);
      toast.success('Centro de Custo excluído com sucesso!');
      fetchCentrosCusto(); // Atualiza a lista após a exclusão
>>>>>>> e62255e (Atualizações no projeto)
    } catch (error) {
      toast.error('Erro ao excluir o centro de custo.');
      console.error(error);
    }
  };
<<<<<<< HEAD
  
  
=======

  // Aplica filtro na lista de centros de custo com base na descrição
  const filteredCentros = centrosCusto.filter((centro) =>
    centro.descricao.toLowerCase().includes(filterText.toLowerCase())
  );

  // Ordena os centros filtrados com base na propriedade "descricao"
  const sortedCentros = [...filteredCentros].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.descricao.localeCompare(b.descricao);
    } else {
      return b.descricao.localeCompare(a.descricao);
    }
  });
>>>>>>> e62255e (Atualizações no projeto)

  return (
    <div className="cadastro-centro-layout">
      <SideBar />
<<<<<<< HEAD

      <div className="cadastro-centro-main-content">
        <div className="cadastro-centro-header">
          <h1>Cadastro de Centros de Custo</h1>
=======
      <div className="cadastro-centro-main-content">
        <div className="cadastro-centro-header">
          <h1>{editingId ? 'Editar Centro de Custo' : 'Cadastro de Centros de Custo'}</h1>
>>>>>>> e62255e (Atualizações no projeto)
        </div>

        <form onSubmit={handleSubmit} className="cadastro-centro-form">
          <div className="cadastro-centro-form-group">
            <label>Descrição do Centro de Custo:</label>
            <input
              type="text"
              value={descricao}
              onChange={handleDescricaoChange}
              maxLength={100}
              placeholder="Máximo 100 caracteres"
              className="cadastro-centro-form-control"
              required
            />
            {errorMessage && <p className="cadastro-centro-error-message">{errorMessage}</p>}
          </div>

          <div className="cadastro-centro-actions">
<<<<<<< HEAD
            <button type="submit" className="icon-button" disabled={isSubmitting} title="Salvar">
              <MdOutlineSaveAlt className="icon save" />
            </button>
            <button type="button" onClick={handleClear} className="icon-button" title="Limpar">
              <MdClearAll className="icon clear" />
            </button>
=======
            <button type="submit" className="icon-button" disabled={isSubmitting} title={editingId ? 'Atualizar' : 'Salvar'}>
              <IoIosSave className="icon save" />
            </button>
            <button type="button" onClick={handleClear} className="icon-button" title="Limpar">
              <GrClearOption className="icon clear" />
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="icon-button" title="Cancelar Edição">
                ✖
              </button>
            )}
>>>>>>> e62255e (Atualizações no projeto)
            <button type="button" onClick={() => window.history.back()} className="icon-button" title="Voltar">
              <IoMdArrowBack className="icon back" />
            </button>
          </div>

          {successMessage && <p className="cadastro-centro-success-message">{successMessage}</p>}
        </form>

<<<<<<< HEAD
=======
        {/* Filtros para a lista de centros de custo */}
        <div className="filtros-container" style={{ margin: "20px 0" }}>
          <input
            type="text"
            placeholder="Filtrar por descrição..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginRight: "10px",
              width: "300px"
            }}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          >
            <option value="asc">Ordem Ascendente</option>
            <option value="desc">Ordem Descendente</option>
          </select>
        </div>

>>>>>>> e62255e (Atualizações no projeto)
        {/* Lista de Centros de Custo */}
        <div className="centros-lista">
          <h2>Centros de Custo Cadastrados</h2>
          <div className="centros-lista-container">
<<<<<<< HEAD
            {centrosCusto.length > 0 ? (
              centrosCusto.map((centro) => (
=======
            {sortedCentros.length > 0 ? (
              sortedCentros.map((centro) => (
>>>>>>> e62255e (Atualizações no projeto)
                <div key={centro.id} className="centro-item">
                  <p><strong>Descrição:</strong> {centro.descricao}</p>
                  <div className="centro-actions">
                    <MdEdit
                      className="icon edit-icon"
                      title="Editar"
                      onClick={() => handleEdit(centro)}
                    />
                    <MdDelete
                      className="icon delete-icon"
                      title="Excluir"
                      onClick={() => handleDelete(centro.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhum centro de custo cadastrado.</p>
            )}
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default CadastroCentroCusto;
=======
export default CadastroCentroCusto;
>>>>>>> e62255e (Atualizações no projeto)
