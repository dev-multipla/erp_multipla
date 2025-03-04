import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useParams } from 'react-router-dom'; // Para obter o ID do cliente da URL
import './ClientForm.css';
import SideBar from './SideBar';
import Header from './Header';
import Footer from './Footer';
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjetoForm = () => {
    const { token } = useAuth();
    const { id } = useParams(); // Obtém o ID do cliente da URL
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
            axios.get(`http://127.0.0.1:8000/api/clientes/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                setFormData(response.data);
            }).catch(error => {
                console.error('Erro ao carregar dados do cliente', error);
                toast.error('Erro ao carregar dados do cliente');
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

        // Verifique se todos os campos obrigatórios estão preenchidos
        if (!formData.nome || !formData.cpf_cnpj || !formData.endereco || !formData.cidade || !formData.estado || !formData.cep || !formData.telefone || !formData.email) {
            toast.error('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const url = id ? `http://127.0.0.1:8000/api/clientes/${id}/` : 'http://127.0.0.1:8000/api/clientes/';
        const method = id ? 'put' : 'post';

        axios({
            method: method,
            url: url,
            data: formData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            toast.success(id ? 'Cliente atualizado com sucesso!' : 'Novo cliente cadastrado com sucesso!');
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
            console.error('Erro ao cadastrar/atualizar cliente', error);
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.cpf_cnpj) {
                    toast.error(`Erro: ${errorData.cpf_cnpj.join(', ')}`);
                }
                if (errorData.email) {
                    toast.error(`Erro: ${errorData.email.join(', ')}`);
                }
            } else {
                toast.error('Erro ao cadastrar/atualizar cliente');
            }
        });
    };

    return (
        <div className="cliente-form-container">
            <SideBar />
            <main className="c-main-content">
                <div className="c-cliente-form-container">
                    <h2>{id ? 'Editar Cliente' : 'Cadastro de Cliente'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="c-form-row">
                            <div className="c-form-group">
                                <label>Nome do Fornecedor:</label>
                                <input
                                    type="text"
                                    name="nome"
                                    className="input-grande"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="c-form-group">
                                <label>CPF/CNPJ:</label>
                                <input
                                    type="text"
                                    name="cpf_cnpj"
                                    className="input-grande"
                                    value={formData.cpf_cnpj}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="c-form-row">
                            <div className="c-form-group">
                                <label>Endereço:</label>
                                <input
                                    type="endereco"
                                    name="endereco"
                                    className="input-grande"
                                    value={formData.endereco}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="c-form-group">
                                <label>Cidade:</label>
                                <input
                                    type="text"
                                    name="cidade"
                                    className="input-grande"
                                    value={formData.cidade}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="c-form-row">
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

                            <div className="c-form-group">
                                <label>CEP:</label>
                                <InputMask
                                    mask="99999-999"
                                    type="text"
                                    name="cep"
                                    className="input-pequeno"
                                    value={formData.cep}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="c-form-group">
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
                        </div>

                        <div className="c-form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                className="input-grande"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="c-form-actions">
                            <button type="submit" className="c-btn-primary">Cadastrar Cliente</button>
                            <button type="reset" className="c-btn-secondary" onClick={() => setFormData({
                                nome: '',
                                cpf_cnpj: '',
                                endereco: '',
                                cidade: '',
                                estado: '',
                                cep: '',
                                telefone: '',
                                email: ''
                            })}>Limpar</button>
                        </div>
                    </form>
                </div>
            </main>
            <ToastContainer />
            <aside className="cliente-form-sidebar">
            
                    <h3>Cadastro de Clientes</h3>
                    <br></br>
                    <p>
                        Preencha os campos abaixo para criar um novo cliente. Certifique-se de fornecer informações claras e precisas para facilitar o acompanhamento do progresso e garantir o sucesso do seu projeto.
                    </p>
                
            </aside>
        </div>
    );
};

export default ProjetoForm;
