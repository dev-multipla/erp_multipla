import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../AuthContext';
import { useParams } from 'react-router-dom'; // Para obter o ID do contrato da URL
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContratoForm.css';
import SideBar from './SideBar';
import Modal from 'react-modal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

Modal.setAppElement('#root');
const ContratoForm = () => {
    const { token } = useAuth();
    const { id } = useParams(); // Obtém o ID do contrato da URL
    const [formData, setFormData] = useState({
        numero: '',
        descricao: '',
        data_inicio: '',
        data_termino: '',
        valor_total: '',
        status: '',
        tipo: '',
        cliente: null,
        fornecedor: null,
        valor_parcela_receber: '',
        periodicidade_vencimento_receber: '',
        data_primeiro_vencimento_receber: '',
        valor_parcela_pagar: '',
        periodicidade_vencimento_pagar: '',
        data_primeiro_vencimento_pagar: ''
    });

    const [clientes, setClientes] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [projecoes, setProjecoes] = useState([]);
    const [contratoDraft, setContratoDraft] = useState(null); // Guarda o contrato temporário

    useEffect(() => {
        if (id) {
            // Se houver um ID, estamos em modo de edição
            axios.get(`http://127.0.0.1:8000/api/contratos/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                setFormData(response.data);
            }).catch(error => {
                console.error('Erro ao carregar dados do contrato', error);
                toast.error('Erro ao carregar dados do contrato');
            });
        }
    }, [id, token]);

    useEffect(() => {
        if (formData.tipo === 'cliente') {
            axios.get('http://127.0.0.1:8000/api/select/clientes/', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(response => {
                setClientes(response.data);
            });
        } else if (formData.tipo === 'fornecedor') {
            axios.get('http://127.0.0.1:8000/api/select/fornecedores/', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(response => {
                setFornecedores(response.data);
            });
        }
    }, [formData.tipo, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (selectedOption, field) => {
        setFormData({
            ...formData,
            [field]: selectedOption ? selectedOption.value : null
        });
    };

        // Função para obter as projeções antes de cadastrar o contrato
    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSend = { ...formData };

        // Convertendo valores para números
        dataToSend.valor_total = parseFloat(dataToSend.valor_total);
        if (dataToSend.valor_parcela_receber) {
            dataToSend.valor_parcela_receber = parseFloat(dataToSend.valor_parcela_receber);
        }
        if (dataToSend.valor_parcela_pagar) {
            dataToSend.valor_parcela_pagar = parseFloat(dataToSend.valor_parcela_pagar);
        }

        // Remover campos não necessários de acordo com o tipo
        if (formData.tipo === 'cliente') {
            delete dataToSend.valor_parcela_pagar;
            delete dataToSend.periodicidade_vencimento_pagar;
            delete dataToSend.data_primeiro_vencimento_pagar;
            dataToSend.fornecedor = null;
        } else if (formData.tipo === 'fornecedor') {
            delete dataToSend.valor_parcela_receber;
            delete dataToSend.periodicidade_vencimento_receber;
            delete dataToSend.data_primeiro_vencimento_receber;
            dataToSend.cliente = null;
        }

        // Primeiro, gerar as projeções sem cadastrar o contrato ainda
        axios.post('http://127.0.0.1:8000/api/contratos/gerar_projecoes/', {
            valor_parcela: formData.tipo === 'cliente' ? formData.valor_parcela_receber : formData.valor_parcela_pagar,
            periodicidade: formData.tipo === 'cliente' ? formData.periodicidade_vencimento_receber : formData.periodicidade_vencimento_pagar,
            data_primeiro_vencimento: formData.tipo === 'cliente' ? formData.data_primeiro_vencimento_receber : formData.data_primeiro_vencimento_pagar,
            data_termino: formData.data_termino
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(projecoesResponse => {
            setContratoDraft(dataToSend);
            setProjecoes(projecoesResponse.data);
            setModalIsOpen(true); // Abrir o modal com as projeções
        }).catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                Object.keys(errorData).forEach(key => {
                    toast.error(`Erro: ${errorData[key].join(', ')}`);
                });
            } else {
                toast.error('Erro ao cadastrar contrato. Tente novamente!', { position: "top-right" });
            }
        });
    };

    // Função para salvar o contrato definitivamente após a conferência
    const salvarContrato = () => {
        axios.post('http://127.0.0.1:8000/api/contratos/salvar_contrato/', {
            contrato: contratoDraft,
            projecoes: projecoes
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            toast.success('Contrato cadastrado com sucesso!', { position: "top-right" });
            setFormData({
                numero: '',
                descricao: '',
                data_inicio: '',
                data_termino: '',
                valor_total: '',
                status: '',
                tipo: '',
                cliente: null,
                fornecedor: null,
                valor_parcela_receber: '',
                periodicidade_vencimento_receber: '',
                data_primeiro_vencimento_receber: '',
                valor_parcela_pagar: '',
                periodicidade_vencimento_pagar: '',
                data_primeiro_vencimento_pagar: ''
            });
            setModalIsOpen(false); // Fechar o modal
        }).catch(error => {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                Object.keys(errorData).forEach(key => {
                    toast.error(`Erro: ${errorData[key].join(', ')}`);
                });
            } else {
                toast.error('Erro ao cadastrar contrato. Tente novamente!', { position: "top-right" });
            }
        });
    };

    return (
        <div className="contrato-form-container">
            <ToastContainer />
            <SideBar />
            <main className="ctr-main-content">
                <div className="ctr-contrato-form-container">
                    <h2>{id ? 'Editar Contrato' : 'Cadastro de Contratos'}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="ctr-form-row">
                            <div className="ctr-form-group">
                                <label>Número do Contrato:</label>
                                <input
                                    type="text"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="c-form-group">
                            <label>Descrição:</label>
                            <textarea
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                required
                                rows="5"
                                cols="50"
                                className="input-descricao"
                            />
                        </div>

                        <div className="ctr-form-row">
                            <div className="ctr-form-group">
                                <label>Data de Início:</label>
                                <input
                                    type="date"
                                    name="data_inicio"
                                    value={formData.data_inicio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="ctr-form-group">
                                <label>Data de Término:</label>
                                <input
                                    type="date"
                                    name="data_termino"
                                    value={formData.data_termino}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="ctr-form-group">
                                <label>Valor Total:</label>
                                <input
                                    type="text"
                                    name="valor_total"
                                    value={formData.valor_total}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="ctr-form-row">
                            <div className="ctr-form-group">
                                <label>Status:</label>
                                <select name="status" value={formData.status} onChange={handleChange} required>
                                    <option value="">Selecione</option>
                                    <option value="andamento">Em andamento</option>
                                    <option value="concluido">Concluído</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>
                            <div className="ctr-form-group">
                                <label>Tipo de Contrato:</label>
                                <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                                    <option value="">Selecione</option>
                                    <option value="cliente">Cliente</option>
                                    <option value="fornecedor">Fornecedor</option>
                                </select>
                            </div>
                        </div>

                        {formData.tipo === 'cliente' && (
                            <>
                                <div className="ctr-form-section">
                                    <h3>Conta a receber</h3>
                                </div>
                                <div className="ctr-form-row">
                                    <div className="ctr-form-group">
                                        <label>Cliente:</label>
                                        <Select
                                            options={clientes.map(cliente => ({
                                                value: cliente.id,
                                                label: cliente.nome
                                            }))}
                                            onChange={option => handleSelectChange(option, 'cliente')}
                                            required
                                        />
                                    </div>
                                    <div className="ctr-form-group">
                                        <label>Valor da Parcela:</label>
                                        <input
                                            type="text"
                                            name="valor_parcela_receber"
                                            value={formData.valor_parcela_receber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="ctr-form-group">
                                        <label>Periodicidade de Vencimento:</label>
                                        <select
                                            name="periodicidade_vencimento_receber"
                                            value={formData.periodicidade_vencimento_receber}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecione</option>
                                            <option value="mensal">Mensal</option>
                                            <option value="trimestral">Trimestral</option>
                                            <option value="semestral">Semestral</option>
                                            <option value="anual">Anual</option>
                                        </select>
                                    </div>
                                    <div className="ctr-form-group">
                                        <label>Data do Primeiro Vencimento:</label>
                                        <input
                                            type="date"
                                            name="data_primeiro_vencimento_receber"
                                            value={formData.data_primeiro_vencimento_receber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {formData.tipo === 'fornecedor' && (
                            <>
                                <div className="ctr-form-section">
                                    <h3>Conta a pagar</h3>
                                </div>
                                <div className="ctr-form-row">
                                    <div className="ctr-form-group">
                                        <label>Fornecedor:</label>
                                        <Select
                                            options={fornecedores.map(fornecedor => ({
                                                value: fornecedor.id,
                                                label: fornecedor.nome
                                            }))}
                                            onChange={option => handleSelectChange(option, 'fornecedor')}
                                            required
                                        />
                                    </div>
                                    <div className="ctr-form-group">
                                        <label>Valor da Parcela:</label>
                                        <input
                                            type="text"
                                            name="valor_parcela_pagar"
                                            value={formData.valor_parcela_pagar}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="ctr-form-group">
                                        <label>Periodicidade de Vencimento:</label>
                                        <select
                                            name="periodicidade_vencimento_pagar"
                                            value={formData.periodicidade_vencimento_pagar}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecione</option>
                                            <option value="mensal">Mensal</option>
                                            <option value="trimestral">Trimestral</option>
                                            <option value="semestral">Semestral</option>
                                            <option value="anual">Anual</option>
                                        </select>
                                    </div>
                                    <div className="ctr-form-group">
                                        <label>Data do Primeiro Vencimento:</label>
                                        <input
                                            type="date"
                                            name="data_primeiro_vencimento_pagar"
                                            value={formData.data_primeiro_vencimento_pagar}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button type="submit" className="ctr-btn-primary">Cadastrar Contrato</button>
                    </form>
                </div>
            </main>

            <aside className="contrato-info-bar">
                <div className="additional-info">
                    <h3>Cadastro de Contratos</h3>
                    <br></br>
                    <p>
                        Preencha os campos abaixo para criar um novo projeto. Certifique-se de fornecer informações claras e precisas para facilitar o acompanhamento do progresso e garantir o sucesso do seu projeto.
                    </p>
                </div>
            </aside>

            {/* Modal de projeções */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                overlayClassName="modal-overlay"
                className="modal-content"
                appElement={document.getElementById('root')}
            >
                <h2>Projeções de Faturamento</h2>
                <table className="projecao-table">
                    <thead>
                        <tr>
                            <th>Mês</th>
                            <th>Data de Vencimento</th>
                            <th>Valor da Parcela</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projecoes.map((projecao, index) => {
                            const dataVencimento = new Date(`${projecao.data_vencimento}T00:00:00`); // Força o fuso horário local
                            return (
                                <tr key={index}>
                                    <td>{format(dataVencimento, 'MMMM yyyy', { locale: ptBR })}</td>
                                    <td>{format(dataVencimento, 'dd/MM/yyyy', { locale: ptBR })}</td>
                                    <td>{parseFloat(projecao.valor_parcela).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <button className="modal-close-btn" onClick={() => setModalIsOpen(false)}>Fechar</button>
                <button className="modal-confirm-btn" onClick={salvarContrato}>Confirmar e Salvar Contrato</button>
            </Modal>

        </div>
    );
};

export default ContratoForm;