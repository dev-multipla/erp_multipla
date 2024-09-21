import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { ToastContainer, toast } from 'react-toastify';  // Importar Toastify
import 'react-toastify/dist/ReactToastify.css';  // Importar os estilos do Toastify
import './PagamentoForm.css';
import SideBar from './SideBar';

const PagamentoForm = () => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        descricao: '',
        tipo: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Token:', token);
        console.log('Enviando dados:', formData);

        axios.post('http://127.0.0.1:8000/api/formas-pagamento/', formData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            // Notifica sucesso
            toast.success('Pagamento cadastrado com sucesso!');

            // Limpar formulário
            setFormData({
                descricao: '',
                tipo: ''
            });
        }).catch(error => {
            console.error('Erro ao cadastrar pagamento', error);
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                Object.keys(errorData).forEach(key => {
                    toast.error(`Erro: ${errorData[key].join(', ')}`);
                });
            } else {
                toast.error('Erro ao cadastrar pagamento. Tente novamente!', { position: "top-right" });
            }
        });
    };

    return (
        <div className="pg-layout-container">
            <SideBar />

            <main className="pg-main-content">
                <div className="pagamento-form-container">
                    <h2>Cadastrar Nova Forma de Pagamento</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Descrição do Pagamento:</label>
                                <input
                                    type="text"
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Tipo de Pagamento:</label>
                                <input
                                    type="text"
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="pg-btn-primary">Cadastrar Pagamento</button>
                            <button type="reset" className="pg-btn-secondary" onClick={() => setFormData({
                                descricao: '',
                                tipo: ''
                            })}>Limpar</button>
                        </div>
                    </form>
                </div>
            </main>
            <aside className="cliente-form-sidebar">
            
                    <h3>Cadastro de Projetos</h3>
                    <br></br>
                    <p>
                        Preencha os campos abaixo para criar um novo projeto. Certifique-se de fornecer informações claras e precisas para facilitar o acompanhamento do progresso e garantir o sucesso do seu projeto.
                    </p>
                
            </aside>
            <ToastContainer /> {/* Container do Toastify */}
        </div>
    );
};

export default PagamentoForm;
