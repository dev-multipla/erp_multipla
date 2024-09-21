import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Importa o CSS do react-datepicker
import './ContasReceberAvulsoForm.css'; // Crie o arquivo CSS se necessário
import SideBar from './SideBar';
import Header from './Header';

function ContasReceberAvulsoForm() {
    const [clientes, setClientes] = useState([]);
    const [projetos, setProjetos] = useState([]);
    const [formData, setFormData] = useState({
        descricao: '',
        valor_total: 0,
        data_recebimento: '',
        competencia: '',
        cliente: '',
        projetos: [],
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Token não encontrado.');
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [clientesResponse, projetosResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/select/clientes/', { headers }),
                    axios.get('http://127.0.0.1:8000/api/select/projetos/', { headers }),
                ]);

                console.log('Clientes Response:', clientesResponse.data);
                console.log('Projetos Response:', projetosResponse.data);

                setClientes(clientesResponse.data);
                setProjetos(projetosResponse.data);
            } catch (error) {
                setError('Erro ao buscar dados da API.');
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Atualizar valor total quando os projetos mudam
        const total = formData.projetos.reduce((acc, projeto) => acc + parseFloat(projeto.valor || 0), 0);
        setFormData(prevFormData => ({ ...prevFormData, valor_total: total }));
    }, [formData.projetos]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleProjetoChange = (event, index) => {
        const { name, value } = event.target;
        const updatedProjetos = [...formData.projetos];
        updatedProjetos[index] = { ...updatedProjetos[index], [name]: value };
        setFormData(prevFormData => ({
            ...prevFormData,
            projetos: updatedProjetos,
        }));
    };

    const addProjeto = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            projetos: [...prevFormData.projetos, { projeto: '', valor: 0 }],
        }));
    };

    const removeProjeto = (index) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            projetos: prevFormData.projetos.filter((_, i) => i !== index),
        }));
    };

    const handleDateChange = (date) => {
        // Atualiza a competência com o formato MM/YYYY
        const formattedDate = date ? `${date.getMonth() + 1}/${date.getFullYear()}` : '';
        setFormData(prevFormData => ({
            ...prevFormData,
            competencia: formattedDate,
        }));
    };

    const handleDataRecebimentoChange = (event) => {
        const date = event.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            data_recebimento: date,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token não encontrado.');
                return;
            }
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const payload = {
                descricao: formData.descricao,
                valor: parseFloat(formData.valor_total), // Enviando como valor
                data_recebimento: formData.data_recebimento, // No formato YYYY-MM-DD
                competencia: formData.competencia,
                cliente: parseInt(formData.cliente, 10),
                projetos: formData.projetos.map(projeto => parseInt(projeto.projeto, 10)), // Enviando apenas IDs dos projetos
            };
            console.log('Enviando dados:', payload);
            const response = await axios.post('http://127.0.0.1:8000/api/contas-a-receber-avulso/', payload, { headers });
            console.log('Conta a receber avulso criada:', response.data);
            setSuccessMessage('Conta a receber avulso criada com sucesso!');
            setFormData({
                descricao: '',
                valor_total: 0,
                data_recebimento: '',
                competencia: '',
                cliente: '',
                projetos: [],
            });

        } catch (error) {
            setError('Erro ao criar conta a receber avulso.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cpa-main-form-container">
            <SideBar />
            <main className="cpa-main-content">
                <Header />
                <div className="cpa-cliente-form-container">
                    <h2>Faturamento de Contrato avulso</h2>
                    <form onSubmit={handleSubmit} className="conta-receber-avulso-form">
                        <div className="form-group">
                            <label htmlFor="descricao">Descrição:</label>
                            <input
                                type="text"
                                id="descricao"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cliente">Cliente:</label>
                            <select
                                id="cliente"
                                name="cliente"
                                value={formData.cliente}
                                onChange={handleChange}
                            >
                                <option value="">Selecione um cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="data_recebimento">Data de Recebimento:</label>
                            <input
                                type="date"
                                id="data_recebimento"
                                name="data_recebimento"
                                value={formData.data_recebimento}
                                onChange={handleDataRecebimentoChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="competencia">Competência:</label>
                            <DatePicker
                                selected={formData.competencia ? new Date(`01/${formData.competencia}`) : null}
                                onChange={handleDateChange}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                            />
                        </div>
                        <div className="projetos-section">
                            <h3>Projetos:</h3>
                            {formData.projetos.map((projetoItem, index) => (
                                <div key={index} className="projeto-item">
                                    <select
                                        name="projeto"
                                        value={projetoItem.projeto}
                                        onChange={(event) => handleProjetoChange(event, index)}
                                    >
                                        <option value="">Selecione um projeto</option>
                                        {projetos.map(projeto => (
                                            <option key={projeto.id} value={projeto.id}>{projeto.nome}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        name="valor"
                                        value={projetoItem.valor}
                                        onChange={(event) => handleProjetoChange(event, index)}
                                        step="0.01"
                                    />
                                    <button type="button" onClick={() => removeProjeto(index)}>Remover</button>
                                </div>
                            ))}
                            <button type="button" onClick={addProjeto}>Adicionar Projeto</button>
                        </div>
                        <div className="form-group">
                            <label htmlFor="valor_total">Valor Total:</label>
                            <input
                                type="text"
                                id="valor_total"
                                name="valor_total"
                                value={formData.valor_total}
                                readOnly
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                        {error && typeof error === 'string' && <p className="error">{error}</p>}
                        {successMessage && <p className="success">{successMessage}</p>}
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ContasReceberAvulsoForm;
