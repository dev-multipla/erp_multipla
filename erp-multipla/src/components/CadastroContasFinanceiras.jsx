import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineSaveAlt, MdOutlineCancelPresentation, MdClearAll, MdEdit, MdDelete} from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CadastroContasFinanceiras.css';
import SideBar from './SideBar';

const CadastroContasFinanceiras = () => {
  const [mascaraConta, setMascaraConta] = useState('');
  const [descricao, setDescricao] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [contasFinanceiras, setContasFinanceiras] = useState([]); // Novo estado para armazenar contas financeiras
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Fetch das contas financeiras ao carregar o componente
  useEffect(() => {
    const fetchContasFinanceiras = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contas-financeiras/');
        setContasFinanceiras(response.data); // Atualiza o estado com os dados recebidos
      } catch (error) {
        toast.error('Erro ao carregar contas financeiras.');
      }
    };
    fetchContasFinanceiras();
  }, []);

  // Validação e atualização do campo máscara
  const handleMascaraChange = (e) => {
    const value = e.target.value;
    const mascaraRegex = /^\d\.\d{2}\.\d{3}\.\d{4}$/;
    if (!mascaraRegex.test(value) && value !== '') {
      setErrorMessage('A máscara deve seguir o formato 1.11.111.1111.');
    } else {
      setErrorMessage('');
    }
    setMascaraConta(value);
  };

  // Validação e atualização do campo descrição
  const handleDescricaoChange = (e) => {
    const value = e.target.value;
    if (value.length > 100) {
      setErrorMessage('A descrição deve ter no máximo 100 caracteres.');
    } else {
      setErrorMessage('');
    }
    setDescricao(value);
  };

  // Envio do formulário para a API
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        // Se estamos editando, faça uma requisição PUT
        const response = await axios.put(`http://localhost:8000/api/contas-financeiras/${editingId}/`, {
          mascara_conta: mascaraConta,
          descricao: descricao,
        });

        if (response.status === 200) {
          toast.success('Conta financeira editada com sucesso!');
          setContasFinanceiras((prevContas) =>
            prevContas.map((conta) =>
              conta.id === editingId ? response.data : conta
            )
          );
          setEditingId(null); // Limpe o estado de edição após a atualização
        }
      } else {
        // Caso contrário, faça uma requisição POST para criar uma nova conta
        const response = await axios.post('http://localhost:8000/api/contas-financeiras/', {
          mascara_conta: mascaraConta,
          descricao: descricao,
        });

        if (response.status === 201) {
          toast.success('Conta financeira cadastrada com sucesso!');
          setContasFinanceiras([...contasFinanceiras, response.data]);
        }
      }
      handleClear();
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessages = Object.values(error.response.data).flat().join(', ');
        toast.error(`Erro: ${errorMessages}`);
      } else {
        toast.error('Erro ao processar a requisição. Por favor, tente novamente.');
      }
    }
  };

  // Função para cancelar e voltar para a página anterior
  const handleCancel = () => {
    navigate(-1);
  };

  // Função para limpar os campos do formulário
  const handleClear = () => {
    setMascaraConta('');
    setDescricao('');
    setErrorMessage('');
  };

  const handleEdit = (conta) => {
    setMascaraConta(conta.mascara_conta);
    setDescricao(conta.descricao);
    setEditingId(conta.id); // Define o ID da conta que está sendo editada
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/contas-financeiras/${id}/`);
      setContasFinanceiras(contasFinanceiras.filter(conta => conta.id !== id));
      toast.success('Conta financeira excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir conta financeira.');
    }
  };

  return (
    <div className="cadastro-layout">
      {/* Sidebar */}
      <SideBar />

      {/* Main content */}
      <div className="cadastro-main-content">
        <div className="cadastro-cp-header">
          <h1>Cadastro de Contas Financeiras</h1>
          <div className="cadastro-user-info">
            <img src="https://via.placeholder.com/40" alt="Usuário" />
            <span>Usuário Logado</span>
          </div>
        </div>

        {/* Formulário de Cadastro */}
        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="cadastro-form-group">
            <label>Máscara da Conta Financeira:</label>
            <input
              type="text"
              value={mascaraConta}
              onChange={handleMascaraChange}
              placeholder="1.11.111.1111"
              className="cadastro-form-control"
            />
            {errorMessage && <p className="cadastro-error-message">{errorMessage}</p>}
          </div>

          <div className="cadastro-form-group">
            <label>Descrição:</label>
            <input
              type="text"
              value={descricao}
              onChange={handleDescricaoChange}
              maxLength={100}
              placeholder="Máximo 100 caracteres"
              className="cadastro-form-control"
            />
          </div>

          <div className="cadastro-actions">
            <button type="submit" className="icon-button" title="Salvar"><MdOutlineSaveAlt className="icon save" /></button>
            <button type="button" onClick={handleCancel} className="icon-button" title="Cancelar"><MdOutlineCancelPresentation className="icon cancel" /></button>
            <button type="button" onClick={handleClear} className="icon-button" title="Limpar"><MdClearAll className="icon clear" /></button>
            <button type="button" onClick={handleCancel} className="icon-button" title="Voltar"><IoMdArrowBack className="icon back" /></button>
          </div>
        </form>

        {/* Lista de Contas Financeiras */}
        <div className="contas-lista">
          <h2>Contas Financeiras Cadastradas</h2>
          <div className="contas-lista-container">
            {contasFinanceiras.length > 0 ? (
              contasFinanceiras.map((conta) => (
                <div key={conta.id} className="conta-item">
                  <p><strong>Máscara:</strong> {conta.mascara_conta}</p>
                  <p><strong>Descrição:</strong> {conta.descricao}</p>
                  <div className="conta-actions">
                    <FaEdit
                      className="icon edit-icon"
                      title="Editar"
                      onClick={() => handleEdit(conta)}
                    />
                    <MdDelete
                      className="icon delete-icon"
                      title="Excluir"
                      onClick={() => handleDelete(conta.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhuma conta financeira cadastrada.</p>
            )}
          </div>
        </div>


        <ToastContainer />
      </div>
    </div>
  );
};

export default CadastroContasFinanceiras;
