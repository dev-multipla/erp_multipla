<<<<<<< HEAD
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
=======
// src/components/CadastroContasFinanceiras.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { GrClearOption } from 'react-icons/gr';
import { IoMdArrowBack, IoIosSave } from 'react-icons/io';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BounceLoader } from 'react-spinners';
import api from '../api';
import { useCompany } from '../CompanyContext';
import Sidebar from './SideBar';
import './CadastroContasFinanceiras.css';

const CadastroContasFinanceiras = () => {
  const { selectedCompanyId } = useCompany();
  const [mascara, setMascara] = useState('');
  const [descricao, setDescricao] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [contas, setContas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load contas apenas após selecionar empresa
  useEffect(() => {
    if (!selectedCompanyId || selectedCompanyId === 'all') {
      setLoading(false);
      return;
    }
    const fetchContas = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(
        '/api/contas-financeiras/',
        { headers: { 'X-Company-Id': selectedCompanyId } }
      );
              setContas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao carregar contas:', err);
        toast.error('Erro ao carregar contas financeiras.');
      } finally {
        setLoading(false);
      }
    };
    fetchContas();
  }, [selectedCompanyId]);

  const handleMascaraChange = e => {
    const v = e.target.value;
    const re = /^\d\.\d{2}\.\d{3}\.\d{4}$/;
    setErrorMessage(v && !re.test(v) ? 'Máscara deve ser 1.11.111.1111.' : '');
    setMascara(v);
  };

  const handleDescricaoChange = e => {
    const v = e.target.value;
    setErrorMessage(v.length > 100 ? 'Máx. 100 caracteres.' : '');
    setDescricao(v);
  };

  const handleClear = () => {
    setMascara('');
    setDescricao('');
    setErrorMessage('');
    setEditingId(null);
  };

  const handleCancel = () => navigate(-1);

  const handleEdit = conta => {
    setMascara(conta.mascara_conta);
    setDescricao(conta.descricao);
    setEditingId(conta.id);
  };

  const handleDelete = async id => {
    try {
      console.log(`Deleting conta ${id} on tenant ${selectedCompanyId}`);
      await api.delete(
   `/api/contas-financeiras/${id}/`,
   { headers: { 'X-Company-Id': selectedCompanyId } }
 );
      setContas(prev => prev.filter(c => c.id !== id));
      toast.success('Excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir:', err);
>>>>>>> e62255e (Atualizações no projeto)
      toast.error('Erro ao excluir conta financeira.');
    }
  };

<<<<<<< HEAD
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
=======
  const handleSubmit = async e => {
    e.preventDefault();

    if (!selectedCompanyId || selectedCompanyId === 'all') {
      return toast.error('Selecione uma empresa antes de salvar.');
    }

    const payload = { mascara_conta: mascara, descricao };
    console.log('Submitting ContaFinanceira with payload:', payload);
    console.log('Selected tenant (X-Company-ID):', selectedCompanyId);

    try {
      let response;
      if (editingId) {
        console.log(`PUT /api/contas-financeiras/${editingId}/`);
        response = await api.put(`/api/contas-financeiras/${editingId}/`, payload);
        setContas(prev => prev.map(c => c.id === editingId ? response.data : c));
        toast.success('Editado com sucesso!');
      } else {
        console.log('POST /api/contas-financeiras/');
        response = await api.post('/api/contas-financeiras/',
        payload,
        { headers: { 'X-Company-Id': selectedCompanyId } }
      );
        setContas(prev => [...prev, response.data]);
        toast.success('Cadastrado com sucesso!');
      }
      handleClear();
    } catch (err) {
      console.error('Erro no submit:', err);
      console.log('Response headers:', err.response?.config?.headers);
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(', ')
        : 'Erro na requisição.';
      toast.error(msg);
    }
  };

  // Filtrar e ordenar
  const filtered = contas.filter(c =>
    c.descricao.toLowerCase().includes(filterText.toLowerCase()) ||
    c.mascara_conta.includes(filterText)
  );
  const sorted = [...filtered].sort((a, b) =>
    sortOrder === 'asc'
      ? a.descricao.localeCompare(b.descricao)
      : b.descricao.localeCompare(a.descricao)
  );

  return (
    <div className="cadastro-layout">
      <Sidebar />
      <div className="cadastro-main-content">
        {loading ? (
          <div className="loader-container">
            <BounceLoader size={50} />
          </div>
        ) : (
          <>
            <div className="cadastro-cp-header">
              <h1>Contas Financeiras</h1>
            </div>

            <form onSubmit={handleSubmit} className="cadastro-form">
              <div className="cadastro-form-group">
                <label>Máscara:</label>
                <input
                  type="text"
                  value={mascara}
                  onChange={handleMascaraChange}
                  placeholder="1.11.111.1111"
                  className="cadastro-form-control"
                />
                {errorMessage && (
                  <p className="cadastro-error-message">{errorMessage}</p>
                )}
              </div>
              <div className="cadastro-form-group">
                <label>Descrição:</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={handleDescricaoChange}
                  maxLength={100}
                  placeholder="Máx. 100 caracteres"
                  className="cadastro-form-control"
                />
              </div>
              <div className="cadastro-actions">
                <button
                  type="submit"
                  className="icon-button"
                  title="Salvar"
                  disabled={!selectedCompanyId || selectedCompanyId === 'all'}
                >
                  <IoIosSave className="icon save" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="icon-button"
                  title="Limpar"
                >
                  <GrClearOption className="icon clear" />
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="icon-button"
                  title="Voltar"
                >
                  <IoMdArrowBack className="icon back" />
                </button>
              </div>
            </form>

            <div className="filtros-container">
              <input
                type="text"
                placeholder="Filtrar..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="filtro-input"
              />
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="filtro-select"
              >
                <option value="asc">Ordem Ascendente</option>
                <option value="desc">Ordem Descendente</option>
              </select>
            </div>

            <div className="contas-lista">
              {sorted.length > 0 ? (
                sorted.map(conta => (
                  <div key={conta.id} className="conta-item">
                    <p>
                      <strong>Máscara:</strong> {conta.mascara_conta}
                    </p>
                    <p>
                      <strong>Descrição:</strong> {conta.descricao}
                    </p>
                    <div className="conta-actions">
                      <MdEdit
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
                <p>Nenhuma conta cadastrada.</p>
              )}
            </div>

            <ToastContainer />
          </>
        )}
>>>>>>> e62255e (Atualizações no projeto)
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default CadastroContasFinanceiras;
=======
export default CadastroContasFinanceiras;
>>>>>>> e62255e (Atualizações no projeto)
