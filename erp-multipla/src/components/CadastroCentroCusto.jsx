import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CadastroCentroCusto.css';
import SideBar from './SideBar';
import { MdOutlineSaveAlt, MdClearAll, MdEdit, MdDelete } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CadastroCentroCusto = () => {
  const [descricao, setDescricao] = useState('');
  const [centrosCusto, setCentrosCusto] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCentrosCusto();
  }, []);

  const fetchCentrosCusto = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/centros-custos/');
      setCentrosCusto(response.data);
    } catch (error) {
      toast.error('Erro ao carregar centros de custo.');
    }
  };

  const handleDescricaoChange = (e) => {
    const value = e.target.value;
    if (value.length > 100) {
      setErrorMessage('A descrição deve ter no máximo 100 caracteres.');
    } else {
      setErrorMessage('');
    }
    setDescricao(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:8000/api/centros-custos/', { descricao });
      setSuccessMessage('Centro de Custo cadastrado com sucesso!');
      toast.success('Centro de Custo cadastrado com sucesso!');
      setDescricao('');
      fetchCentrosCusto(); // Atualiza a lista após o cadastro
    } catch (error) {
      setErrorMessage('Erro ao cadastrar Centro de Custo. Tente novamente.');
      toast.error('Erro ao cadastrar Centro de Custo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setDescricao('');
    setErrorMessage('');
  };

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
    } catch (error) {
      toast.error('Erro ao excluir o centro de custo.');
      console.error(error);
    }
  };
  
  

  return (
    <div className="cadastro-centro-layout">
      <SideBar />

      <div className="cadastro-centro-main-content">
        <div className="cadastro-centro-header">
          <h1>Cadastro de Centros de Custo</h1>
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
            <button type="submit" className="icon-button" disabled={isSubmitting} title="Salvar">
              <MdOutlineSaveAlt className="icon save" />
            </button>
            <button type="button" onClick={handleClear} className="icon-button" title="Limpar">
              <MdClearAll className="icon clear" />
            </button>
            <button type="button" onClick={() => window.history.back()} className="icon-button" title="Voltar">
              <IoMdArrowBack className="icon back" />
            </button>
          </div>

          {successMessage && <p className="cadastro-centro-success-message">{successMessage}</p>}
        </form>

        {/* Lista de Centros de Custo */}
        <div className="centros-lista">
          <h2>Centros de Custo Cadastrados</h2>
          <div className="centros-lista-container">
            {centrosCusto.length > 0 ? (
              centrosCusto.map((centro) => (
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

export default CadastroCentroCusto;
