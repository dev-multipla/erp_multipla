<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useParams } from 'react-router-dom'; // Para obter o ID do fornecedor da URL
=======
// FornecedorForm.js

import React, { useState, useEffect } from 'react';
import api from '../api'; // Importa a instância configurada do axios
import { useAuth } from '../AuthContext';
import { useParams, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
>>>>>>> e62255e (Atualizações no projeto)
import './FornecedorForm.css';
import SideBar from './SideBar';
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FornecedorForm = () => {
<<<<<<< HEAD
    const { token } = useAuth();
    const { id } = useParams(); // Obtém o ID do fornecedor da URL
    const [formData, setFormData] = useState({
        nome: '',
        cpf_cnpj: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        telefone: '',
        email: ''
    });

    useEffect(() => {
        if (id) {
            // Se houver um ID, estamos em modo de edição
            axios.get(`http://127.0.0.1:8000/api/fornecedores/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                setFormData(response.data);
            }).catch(error => {
                console.error('Erro ao carregar dados do fornecedor', error);
                toast.error('Erro ao carregar dados do fornecedor');
            });
        }
    }, [id, token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const preparedData = {
            ...formData,
            cpf_cnpj: formData.cpf_cnpj ? formData.cpf_cnpj : null,
            cep: formData.cep ? formData.cep : null,
            email: formData.email ? formData.email : null
        };
    
        const url = id ? `http://127.0.0.1:8000/api/fornecedores/${id}/` : 'http://127.0.0.1:8000/api/fornecedores/';
        const method = id ? 'put' : 'post';
    
        axios({
            method: method,
            url: url,
            data: preparedData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            toast.success(id ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor cadastrado com sucesso!', { position: "top-right" });
            setFormData({
                nome: '',
                cpf_cnpj: '',
                endereco: '',
                cidade: '',
                estado: '',
                cep: '',
                telefone: '',
                email: ''
            });
        }).catch(error => {
            console.error('Erro ao cadastrar/atualizar fornecedor', error);
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.cpf_cnpj) {
                    toast.error(`Erro: ${errorData.cpf_cnpj.join(', ')}`);
                }
                if (errorData.email) {
                    toast.error(`Erro: ${errorData.email.join(', ')}`);
                }
            } else {
                toast.error('Erro ao cadastrar/atualizar fornecedor. Tente novamente!', { position: "top-right" });
            }
        });
    };
    

    return (
        <div className="for-main-container">
            <ToastContainer />  {/* Contêiner para exibir as notificações */}
            <SideBar />
            <main className="for-main-content">
                <div className="right-panel">
                    <h2>{id ? 'Editar Fornecedor' : 'Cadastro de Fornecedor'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nome do Fornecedor:</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>CPF/CNPJ:</label>
                                <input
                                    type="text"
                                    name="cpf_cnpj"
                                    value={formData.cpf_cnpj}
                                    onChange={handleChange}
                                    
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Endereço:</label>
                            <input
                                type="text"
                                name="endereco"
                                value={formData.endereco}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Cidade:</label>
                                <input
                                    type="text"
                                    name="cidade"
                                    className="input-medio"
                                    value={formData.cidade}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Estado:</label>
                                <select
                                    name="estado"
                                    className="input-pequeno"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    {/* Adicionar todos os estados brasileiros */}
                                    <option value="AC">AC</option>
                                    <option value="AL">AL</option>
                                    <option value="AP">AP</option>
                                    <option value="AM">AM</option>
                                    <option value="BA">BA</option>
                                    <option value="CE">CE</option>
                                    <option value="DF">DF</option>
                                    <option value="ES">ES</option>
                                    <option value="GO">GO</option>
                                    <option value="MA">MA</option>
                                    <option value="MT">MT</option>
                                    <option value="MS">MS</option>
                                    <option value="MG">MG</option>
                                    <option value="PA">PA</option>
                                    <option value="PB">PB</option>
                                    <option value="PR">PR</option>
                                    <option value="PE">PE</option>
                                    <option value="PI">PI</option>
                                    <option value="RJ">RJ</option>
                                    <option value="RN">RN</option>
                                    <option value="RS">RS</option>
                                    <option value="RO">RO</option>
                                    <option value="RR">RR</option>
                                    <option value="SC">SC</option>
                                    <option value="SP">SP</option>
                                    <option value="SE">SE</option>
                                    <option value="TO">TO</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>CEP:</label>
                                <InputMask
                                    mask="99999-999"
                                    type="text"
                                    name="cep"
                                    className="input-medio"
                                    value={formData.cep}
                                    onChange={handleChange}
                                    
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Telefone:</label>
                            <InputMask
                                mask="(99) 99999-9999"
                                type="text"
                                name="telefone"
                                className="input-medio"
                                value={formData.telefone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                
                            />
                        </div>
                        <div className="for-form-actions">
                            <button type="submit" className="for-btn-primary">Cadastrar Fornecedor</button>
                            <button
                                type="reset"
                                className="for-btn-secondary"
                                onClick={() => setFormData({
                                    nome: '',
                                    cpf_cnpj: '',
                                    endereco: '',
                                    cidade: '',
                                    estado: '',
                                    cep: '',
                                    telefone: '',
                                    email: ''
                                })}
                            >
                                Limpar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <aside className="left-panel">
            
                    <h3>Cadastro de Fornecedores</h3>
                    <br></br>
                    <p>
                        Preencha os campos abaixo para criar um novo fornecedor. Certifique-se de fornecer informações claras e precisas para facilitar o acompanhamento do progresso e garantir o sucesso do seu projeto.
                    </p>
                
            </aside>
        </div>
    );
};

export default FornecedorForm;
=======
  const { token } = useAuth();
  const { id } = useParams(); // Obtém o ID do fornecedor da URL
  const navigate = useNavigate(); // Hook para navegação
  const [formData, setFormData] = useState({
    nome: '',
    cpf_cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: ''
  });

  useEffect(() => {
    if (id) {
      // Se houver um ID, estamos em modo de edição
      api.get(`/api/fornecedores/${id}/`)
        .then(response => {
          setFormData(response.data);
        })
        .catch(error => {
          console.error('Erro ao carregar dados do fornecedor', error);
          toast.error('Erro ao carregar dados do fornecedor');
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const requiredFields = ['nome', 'cpf_cnpj', 'endereco', 'cidade', 'estado', 'cep', 'telefone', 'email'];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        toast.error(`O campo ${field.replace('_', ' ')} é obrigatório.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const preparedData = {
      ...formData,
      cpf_cnpj: formData.cpf_cnpj || null,
      cep: formData.cep || null,
      email: formData.email || null
    };

    const url = id ? `/api/fornecedores/${id}/` : '/api/fornecedores/';
    const method = id ? 'put' : 'post';

    api({
      method,
      url,
      data: preparedData
    })
      .then(response => {
        toast.success(id ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor cadastrado com sucesso!', { position: "top-right" });
        setFormData({
          nome: '',
          cpf_cnpj: '',
          endereco: '',
          cidade: '',
          estado: '',
          cep: '',
          telefone: '',
          email: ''
        });
        // Redireciona para a lista após sucesso
        navigate('/fornecedor-listar');
      })
      .catch(error => {
        console.error('Erro ao cadastrar/atualizar fornecedor', error);
        if (error.response?.data) {
          const errorData = error.response.data;
          if (errorData.cpf_cnpj) {
            toast.error(`CPF/CNPJ: ${errorData.cpf_cnpj.join(', ')}`);
          }
          if (errorData.email) {
            toast.error(`Email: ${errorData.email.join(', ')}`);
          }
        } else {
          toast.error('Erro ao cadastrar/atualizar fornecedor. Tente novamente!', { position: "top-right" });
        }
      });
  };

  return (
    <div className="for-main-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast-container"
        toastClassName="custom-toast"
        progressClassName="custom-progress"
      />
      <SideBar />
      <main className="for-main-content">
        <div className="right-panel">
          <h2>{id ? 'Editar Fornecedor' : 'Cadastro de Fornecedor'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome do Fornecedor:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>CPF/CNPJ:</label>
                <input
                  type="text"
                  name="cpf_cnpj"
                  value={formData.cpf_cnpj}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Endereço:</label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Cidade:</label>
                <input
                  type="text"
                  name="cidade"
                  className="input-medio"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Estado:</label>
                <select
                  name="estado"
                  className="input-pequeno"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  {/* Estados brasileiros */}
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>
              <div className="form-group">
                <label>CEP:</label>
                <InputMask
                  mask="99999-999"
                  type="text"
                  name="cep"
                  className="input-medio"
                  value={formData.cep}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Telefone:</label>
              <InputMask
                mask="(99) 99999-9999"
                type="text"
                name="telefone"
                className="input-medio"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="for-form-actions">
              <button
                type="reset"
                className="for-btn-secondary"
                onClick={() => setFormData({
                  nome: '',
                  cpf_cnpj: '',
                  endereco: '',
                  cidade: '',
                  estado: '',
                  cep: '',
                  telefone: '',
                  email: ''
                })}
              >
                Limpar
              </button>
              <button type="submit" className="for-btn-primary">
                {id ? 'Atualizar Fornecedor' : 'Cadastrar Fornecedor'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <aside className="left-panel">
        <h3>Cadastro de Fornecedores</h3>
        <br />
        <p>
          Preencha os campos abaixo para criar um novo fornecedor. Certifique-se de fornecer informações claras e precisas para facilitar o acompanhamento do progresso e garantir o sucesso do seu projeto.
        </p>
      </aside>
    </div>
  );
};

export default FornecedorForm;
>>>>>>> e62255e (Atualizações no projeto)
