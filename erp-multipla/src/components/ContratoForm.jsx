import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContratoForm.css';
import SideBar from './SideBar';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const initialState = {
    numero: '',
    descricao: '',
    data_inicio: '',
    data_termino: '',
    valor_total: '',
    valor_parcela: '',
    status: 'andamento',
    tipo: 'cliente',
    cliente: null,
    fornecedor: null,
    periodicidade_vencimento: 'mensal',
    data_primeiro_vencimento: '',
    projetos: []
};

const ContratoForm = () => {
    const { token } = useAuth();
    const [formData, setFormData] = useState(initialState);
    const [clientes, setClientes] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [projetosDisponiveis, setProjetosDisponiveis] = useState([]);
    const [projetoSelecionado, setProjetoSelecionado] = useState(null);
    const [valorProjeto, setValorProjeto] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [porcentagemProjeto, setPorcentagemProjeto] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesRes, fornecedoresRes, projetosRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/select/clientes/', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8000/api/select/fornecedores/', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8000/api/projeto-list/', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                
                setClientes(clientesRes.data);
                setFornecedores(fornecedoresRes.data);
                setProjetosDisponiveis(projetosRes.data);
            } catch (error) {
                toast.error('Erro ao carregar dados: ' + (error.response?.data?.message || error.message));
            }
        };
        fetchData();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (selectedOption, field) => {
        setFormData({
            ...formData,
            // Limpa o campo alternativo quando um tipo é selecionado
            ...(field === 'cliente' ? { fornecedor: null } : { cliente: null }),
            [field]: selectedOption?.value || null
        });
    };

    const validarCampos = () => {
        const camposObrigatorios = [
            { campo: formData.numero, mensagem: 'Número do contrato é obrigatório' },
            { campo: formData.descricao, mensagem: 'Descrição é obrigatória' },
            { campo: formData.data_inicio, mensagem: 'Data de início é obrigatória' },
            { campo: formData.data_termino, mensagem: 'Data de término é obrigatória' },
            { campo: formData.valor_total, mensagem: 'Valor total é obrigatório' },
            { campo: formData.valor_parcela, mensagem: 'Valor da parcela é obrigatório' },
            { campo: formData.data_primeiro_vencimento, mensagem: 'Primeiro vencimento é obrigatório' }
        ];
        const tipoContrato = formData.tipo;
        const entidadeId = tipoContrato === 'cliente' 
            ? formData.cliente 
            : formData.fornecedor;

        if (!entidadeId || isNaN(entidadeId)) {
            toast.error(`${tipoContrato === 'cliente' ? 'Cliente' : 'Fornecedor'} é obrigatório`);
            return false;
        }
        for (const { campo, mensagem } of camposObrigatorios) {
            if (!campo?.toString().trim()) {
                toast.error(mensagem);
                return false;
            }
        }

        if (new Date(formData.data_inicio) > new Date(formData.data_termino)) {
            toast.error('Data de término deve ser posterior à data de início');
            return false;
        }

        if (new Date(formData.data_primeiro_vencimento) < new Date(formData.data_inicio) || 
            new Date(formData.data_primeiro_vencimento) > new Date(formData.data_termino)) {
            toast.error('Primeiro vencimento deve estar dentro do período do contrato');
            return false;
        }

        if (isNaN(formData.valor_total) || isNaN(formData.valor_parcela)) {
            toast.error('Valores devem ser numéricos');
            return false;
        }

        if (formData.projetos.length === 0) {
            toast.error('Adicione pelo menos um projeto');
            return false;
        }

        return true;
    };

    const validarTotalProjetos = () => {
        const totalProjetos = formData.projetos.reduce(
            (sum, projeto) => sum + parseFloat(projeto.valor_projeto || 0),
            0
        );
        return Math.abs(totalProjetos - parseFloat(formData.valor_total)).toFixed(2) === '0.00';
    };
    const adicionarProjeto = () => {
        if (!projetoSelecionado) {
            toast.error('Selecione um projeto');
            return;
        }
    
        const porcentagem = parseFloat(porcentagemProjeto);
        
        // Validações
        if (isNaN(porcentagem) || porcentagem <= 0 || porcentagem > 100) {
            toast.error('Porcentagem inválida (deve ser entre 0.01 e 100)');
            return;
        }
    
        if (!formData.valor_total || isNaN(formData.valor_total)) {
            toast.error('Valor total do contrato é necessário para calcular');
            return;
        }
    
        // Calcula valor com base na porcentagem
        const valorCalculado = (porcentagem / 100) * parseFloat(formData.valor_total);
    
        const novoProjeto = {
            projeto: projetoSelecionado.value,
            valor_projeto: valorCalculado.toFixed(2)
        };
    
        setFormData({
            ...formData,
            projetos: [...formData.projetos, novoProjeto]
        });
        
        setProjetoSelecionado(null);
        setPorcentagemProjeto('');
    };

    const removerProjeto = (index) => {
        const novosProjetos = formData.projetos.filter((_, i) => i !== index);
        setFormData({ ...formData, projetos: novosProjetos });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validarCampos() || !validarTotalProjetos()) {
            if (!validarTotalProjetos()) {
                toast.error('A soma dos projetos não corresponde ao valor total');
            }
            return;
        }
    
        try {
            const payload = {
                ...formData,
                // Garante que apenas o campo correto seja enviado
                ...(formData.tipo === 'cliente' 
                    ? { cliente: formData.cliente }
                    : { fornecedor: formData.fornecedor }),
                valor_total: parseFloat(formData.valor_total).toFixed(2),
                valor_parcela: parseFloat(formData.valor_parcela).toFixed(2),
                projetos: formData.projetos.map(p => ({
                    projeto: p.projeto,
                    valor_projeto: parseFloat(p.valor_projeto).toFixed(2)
                }))
            };
    
            // Remove o campo oposto
            delete payload[formData.tipo === 'cliente' ? 'fornecedor' : 'cliente'];
    
            const response = await axios.post(
                'http://localhost:8000/api/contratos/preview/',
                payload,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            
            setPreviewData(response.data);
            setModalIsOpen(true);
        } catch (error) {
            if (error.response?.data) {
                Object.values(error.response.data).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error('Erro ao processar requisição');
            }
        }
    };

    const confirmarContrato = async () => {
        try {
            const payload = {
                ...previewData.contrato,
                projetos: previewData.projetos,
                confirmado: true
            };
    
            const response = await axios.post(
                'http://localhost:8000/api/contratos/',
                payload,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            
            toast.success('Contrato salvo com sucesso!');
            setModalIsOpen(false);
            setFormData(initialState);
        } catch (error) {
            console.error('Erro na confirmação:', error);
            
            if (error.response?.data) {
                // Tratamento genérico para diferentes formatos de erro
                const errorData = error.response.data;
                
                if (Array.isArray(errorData)) {
                    errorData.forEach(msg => toast.error(msg));
                } else if (typeof errorData === 'object') {
                    Object.entries(errorData).forEach(([campo, erros]) => {
                        const mensagens = Array.isArray(erros) ? erros : [erros];
                        mensagens.forEach(erro => toast.error(`${campo}: ${erro}`));
                    });
                } else {
                    toast.error(errorData.message || 'Erro desconhecido');
                }
            } else {
                toast.error('Erro de conexão com o servidor');
            }
        }
    };
    return (
        <div className="contrato-form-container">
            <ToastContainer position="top-right" autoClose={5000} />
            <SideBar />
            
            <main className="ctr-main-content">
                <div className="ctr-contrato-form-container">
                    <h2>Novo Contrato</h2>
                    
                    <form onSubmit={handleSubmit}>
                        {/* Campos básicos */}
                        <div className="ctr-form-row">
                            <div className="ctr-form-group">
                                <label>Número do Contrato</label>
                                <input
                                    type="text"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="c-form-group">
                                <label>Descrição:</label>
                                <textarea
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="input-descricao"
                                />
                            </div>
                            
                            <div className="ctr-form-group">
                                <label>Tipo de Contrato</label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="cliente">Cliente</option>
                                    <option value="fornecedor">Fornecedor</option>
                                </select>
                            </div>
                        </div>

                        {/* Seleção de Cliente/Fornecedor */}
                        <div className="ctr-form-row">
                            <div className="ctr-form-group">
                                <label>{formData.tipo === 'cliente' ? 'Cliente' : 'Fornecedor'}</label>
                                <Select
                                    options={
                                        formData.tipo === 'cliente' 
                                        ? clientes.map(c => ({ value: c.id, label: c.nome }))
                                        : fornecedores.map(f => ({ value: f.id, label: f.nome }))
                                    }
                                    onChange={option => handleSelectChange(option, formData.tipo)}
                                    value={
                                        formData.tipo === 'cliente'
                                        ? clientes.find(c => c.id === formData.cliente)
                                        : fornecedores.find(f => f.id === formData.fornecedor)
                                    }
                                    isSearchable
                                    placeholder={`Selecione ${formData.tipo === 'cliente' ? 'um cliente' : 'um fornecedor'}`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Datas e Valores */}
                        <div className="ctr-form-row">
                            <div className="ctr-form-group">
                                <label>Data de Início</label>
                                <input
                                    type="date"
                                    name="data_inicio"
                                    value={formData.data_inicio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="ctr-form-group">
                                <label>Data de Término</label>
                                <input
                                    type="date"
                                    name="data_termino"
                                    value={formData.data_termino}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Seção de Parcelas */}
                        <div className="ctr-form-section">
                            <h3>Configuração de Parcelas</h3>
                            <div className="ctr-form-row">
                                <div className="ctr-form-group">
                                    <label>Valor Total</label>
                                    <input
                                        type="number"
                                        name="valor_total"
                                        value={formData.valor_total}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="ctr-form-group">
                                    <label>Valor da Parcela</label>
                                    <input
                                        type="number"
                                        name="valor_parcela"
                                        value={formData.valor_parcela}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="ctr-form-row">
                                <div className="ctr-form-group">
                                    <label>Periodicidade</label>
                                    <select
                                        name="periodicidade_vencimento"
                                        value={formData.periodicidade_vencimento}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="mensal">Mensal</option>
                                        <option value="trimestral">Trimestral</option>
                                        <option value="semestral">Semestral</option>
                                        <option value="anual">Anual</option>
                                    </select>
                                </div>
                                
                                <div className="ctr-form-group">
                                    <label>Primeiro Vencimento</label>
                                    <input
                                        type="date"
                                        name="data_primeiro_vencimento"
                                        value={formData.data_primeiro_vencimento}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            {/* Seção de Projetos Vinculados */}
                            <div className="ctr-form-section">
                                <h3>Projetos Vinculados</h3>
                                
                                <div className="ctr-form-row">
                                    <div className="ctr-form-group">
                                        <label>Selecionar Projeto</label>
                                        <Select
                                            options={projetosDisponiveis.map(p => ({
                                                value: p.id,
                                                label: p.nome
                                            }))}
                                            value={projetoSelecionado}
                                            onChange={setProjetoSelecionado}
                                        />
                                    </div>
                                    
                                    <div className="ctr-form-group">
                                        <label>Porcentagem do Projeto (%)</label>
                                        <input
                                            type="number"
                                            value={porcentagemProjeto}
                                            onChange={(e) => setPorcentagemProjeto(e.target.value)}
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            placeholder="Ex: 30"
                                        />
                                        <small className="hint">
                                            {formData.valor_total && `Valor calculado: ${
                                                parseFloat(formData.valor_total) * 
                                                (parseFloat(porcentagemProjeto || 0) / 100
                                            ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                                        </small>
                                    </div>
                                    
                                    <div className="ctr-form-group">
                                        <button 
                                            type="button" 
                                            onClick={adicionarProjeto}
                                            className="ctr-btn-add"
                                        >
                                            Adicionar Projeto
                                        </button>
                                    </div>
                                </div>

                                {/* Lista de projetos adicionados */}
                                {formData.projetos.length > 0 && (
                                    <div className="projetos-list">
                                        <h4>Projetos Vinculados</h4>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Projeto</th>
                                                    <th>Valor</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.projetos.map((proj, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {projetosDisponiveis.find(p => p.id === proj.projeto)?.nome || 'Projeto não encontrado'}
                                                        </td>
                                                        <td>
                                                            {parseFloat(proj.valor_projeto).toLocaleString('pt-BR', {
                                                                style: 'currency',
                                                                currency: 'BRL'
                                                            })}
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                onClick={() => removerProjeto(index)}
                                                                className="ctr-btn-remove"
                                                            >
                                                                Remover
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                        </div>

                        <button type="submit" className="ctr-btn-primary">
                            Pré-visualizar Contrato
                        </button>
                    </form>
                </div>
            </main>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h2>Pré-visualização do Contrato</h2>
                {previewData && (
                    <div className="preview-content">
                        <div className="projecoes-list">
                            <h3>Projeções de Pagamento ({previewData.projecoes.length} parcelas)</h3>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Data de Vencimento</th>
                                            <th>Valor da Parcela</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.projecoes.map((projecao, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {new Date(projecao.data_vencimento).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td>
                                                    {parseFloat(projecao.valor_parcela).toLocaleString('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="modal-actions">
                            <button className="ctr-btn-confirm" onClick={confirmarContrato}>
                                Confirmar e Salvar
                            </button>
                            <button className="ctr-btn-cancel" onClick={() => setModalIsOpen(false)}>
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ContratoForm;