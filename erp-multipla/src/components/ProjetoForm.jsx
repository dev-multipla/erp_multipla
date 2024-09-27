import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useParams } from 'react-router-dom'; // Para obter o ID do projeto da URL
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProjetoForm.css';
import Sidebar from './SideBar';
import Header from './Header';

const ProjetoForm = () => {
    const { token } = useAuth();
    const { id } = useParams(); // Obtém o ID do projeto da URL
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        data_inicio: '',
        data_termino: '',
        status: ''
    });

    useEffect(() => {
        if (id) {
            // Se houver um ID, estamos em modo de edição
            axios.get(`http://127.0.0.1:8000/api/projetos/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                setFormData(response.data);
            }).catch(error => {
                console.error('Erro ao carregar dados do projeto', error);
                toast.error('Erro ao carregar dados do projeto');
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

        const url = id ? `http://127.0.0.1:8000/api/projetos/${id}/` : 'http://127.0.0.1:8000/api/projetos/';
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
            toast.success(id ? 'Projeto atualizado com sucesso!' : 'Projeto cadastrado com sucesso!', { position: "top-right" });
            setFormData({
                nome: '',
                descricao: '',
                data_inicio: '',
                data_termino: '',
                status: ''
            });
        }).catch(error => {
            console.error('Erro ao cadastrar/atualizar projeto', error);
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                Object.keys(errorData).forEach(key => {
                    toast.error(`Erro: ${errorData[key].join(', ')}`);
                });
            } else {
                toast.error('Erro ao cadastrar/atualizar projeto. Tente novamente!', { position: "top-right" });
            }
        });
    };

    return (
        <div className="projeto-form-container">
            <ToastContainer />  {/* Contêiner do Toastify */}
            <Sidebar />
            
            <main className="p-main-content">
                <div className="p-projeto-form-container">
                    <h2>{id ? 'Editar Projeto' : 'Cadastro de Projeto'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="p-form-row">
                            <div className="p-form-group">
                                <label>Nome do Projeto:</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="p-form-group">
                                <label>Descrição:</label>
                                <input
                                    type="text"
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="p-form-row">
                            <div className="p-form-group">
                                <label>Data de Início:</label>
                                <input
                                    type="date"
                                    name="data_inicio"
                                    value={formData.data_inicio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="p-form-group">
                                <label>Data de Término:</label>
                                <input
                                    type="date"
                                    name="data_termino"
                                    value={formData.data_termino}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="p-form-row">
                            <div className="p-form-group">
                                <label>Status:</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="andamento">Em andamento</option>
                                    <option value="concluido">Concluído</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-form-actions">
                            <button type="submit" className="p-btn-primary">{id ? 'Atualizar Projeto' : 'Cadastrar Projeto'}</button>
                            <button type="reset" className="p-btn-secondary" onClick={() => setFormData({
                                nome: '',
                                descricao: '',
                                data_inicio: '',
                                data_termino: '',
                                status: ''
                            })}>Limpar</button>
                        </div>
                    </form>
                </div>
            </main>
            <aside className="projeto-form-sidebar">
                <h3>Cadastro de Projetos</h3>
                <br></br>
                <p>
                    Preencha os campos abaixo para criar um novo projeto. Certifique-se de fornecer informações claras e precisas para facilitar o acompanhamento do progresso e garantir o sucesso do seu projeto.
                </p>
            </aside>
        </div>
    );
};

export default ProjetoForm;
