import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import axios from 'axios';
=======
import api from '../api';
>>>>>>> e62255e (Atualizações no projeto)
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
<<<<<<< HEAD
=======

    // Adicionamos a propriedade indeterminado no state
>>>>>>> e62255e (Atualizações no projeto)
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        data_inicio: '',
        data_termino: '',
        status: ''
    });
<<<<<<< HEAD

    useEffect(() => {
        if (id) {
            // Se houver um ID, estamos em modo de edição
            axios.get(`http://127.0.0.1:8000/api/projetos/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                setFormData(response.data);
=======
    const [indeterminado, setIndeterminado] = useState(false);

    useEffect(() => {
        if (id) {
            api.get(`/api/projetos/${id}/`)
              .then(response => {
                setFormData(response.data);
                // Se a data_termino for null, considera prazo indeterminado
                if (response.data.data_termino === null) {
                    setIndeterminado(true);
                }
>>>>>>> e62255e (Atualizações no projeto)
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

<<<<<<< HEAD
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
=======
    // Trata a mudança do checkbox para prazo indeterminado
    const handleIndeterminadoChange = (e) => {
        const checked = e.target.checked;
        setIndeterminado(checked);
        if (checked) {
            // Quando marcado, limpa data_termino
            setFormData({
                ...formData,
                data_termino: ''
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();  // não esqueça!

        // Prepara o payload
        const submitData = {
            ...formData,
            // se indeterminado, envie null; caso contrário, a data do form
            data_termino: indeterminado ? null : formData.data_termino
        };

        // Método HTTP conforme se estamos editando ou criando
        const method = id ? 'put' : 'post';
        const url = id ? `/api/projetos/${id}/` : '/api/projetos/';

        api({
            method,
            url,
            data: submitData,
        })
        .then(response => {
            toast.success(id
            ? 'Projeto atualizado com sucesso!'
            : 'Projeto cadastrado com sucesso!',
            { position: "top-right" });

            // limpa o form
>>>>>>> e62255e (Atualizações no projeto)
            setFormData({
                nome: '',
                descricao: '',
                data_inicio: '',
                data_termino: '',
                status: ''
            });
<<<<<<< HEAD
        }).catch(error => {
=======
            setIndeterminado(false);
        })
        .catch(error => {
>>>>>>> e62255e (Atualizações no projeto)
            console.error('Erro ao cadastrar/atualizar projeto', error);
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                Object.keys(errorData).forEach(key => {
                    toast.error(`Erro: ${errorData[key].join(', ')}`);
                });
            } else {
<<<<<<< HEAD
                toast.error('Erro ao cadastrar/atualizar projeto. Tente novamente!', { position: "top-right" });
=======
                toast.error(
                'Erro ao cadastrar/atualizar projeto. Tente novamente!',
                { position: "top-right" }
                );
>>>>>>> e62255e (Atualizações no projeto)
            }
        });
    };

<<<<<<< HEAD
=======

>>>>>>> e62255e (Atualizações no projeto)
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
<<<<<<< HEAD
                                    required
=======
                                    disabled={indeterminado} // Desabilita quando indeterminado
                                    required={!indeterminado} // Torna o campo obrigatório apenas se não estiver indeterminado
>>>>>>> e62255e (Atualizações no projeto)
                                />
                            </div>
                        </div>
                        <div className="p-form-row">
                            <div className="p-form-group">
<<<<<<< HEAD
=======
                                <label>
                                    <input
                                        type="checkbox"
                                        name="indeterminado"
                                        checked={indeterminado}
                                        onChange={handleIndeterminadoChange}
                                    />
                                    Prazo Indeterminado
                                </label>
                            </div>
                        </div>
                        <div className="p-form-row">
                            <div className="p-form-group">
>>>>>>> e62255e (Atualizações no projeto)
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
<<<<<<< HEAD
                        <div className="p-form-actions">
                            <button type="submit" className="p-btn-primary">{id ? 'Atualizar Projeto' : 'Cadastrar Projeto'}</button>
                            <button type="reset" className="p-btn-secondary" onClick={() => setFormData({
                                nome: '',
                                descricao: '',
                                data_inicio: '',
                                data_termino: '',
                                status: ''
                            })}>Limpar</button>
=======
        
                        <div className="p-form-actions">
                            
                            <button type="reset" className="p-btn-secondary" onClick={() => {
                                setFormData({
                                    nome: '',
                                    descricao: '',
                                    data_inicio: '',
                                    data_termino: '',
                                    status: ''
                                });
                                setIndeterminado(false);
                            }}>Limpar</button>
                            <button type="submit" className="p-btn-primary">{id ? 'Atualizar Projeto' : 'Cadastrar Projeto'}</button>
>>>>>>> e62255e (Atualizações no projeto)
                        </div>
                    </form>
                </div>
            </main>
            <aside className="projeto-form-sidebar">
                <h3>Cadastro de Projetos</h3>
<<<<<<< HEAD
                <br></br>
=======
                <br />
>>>>>>> e62255e (Atualizações no projeto)
                <p>
                    Preencha os campos abaixo para criar um novo projeto. Certifique-se de fornecer informações claras e precisas para facilitar o acompanhamento do progresso e garantir o sucesso do seu projeto.
                </p>
            </aside>
        </div>
    );
};

export default ProjetoForm;
