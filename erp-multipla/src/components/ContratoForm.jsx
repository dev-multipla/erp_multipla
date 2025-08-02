import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import axios from 'axios';
=======
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
>>>>>>> e62255e (Atualizações no projeto)
import Select from 'react-select';
import { useAuth } from '../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContratoForm.css';
import SideBar from './SideBar';
import Modal from 'react-modal';
<<<<<<< HEAD
=======
import { NumericFormat } from 'react-number-format';
import { useCompany } from '../CompanyContext';
import { BounceLoader } from 'react-spinners';

>>>>>>> e62255e (Atualizações no projeto)

Modal.setAppElement('#root');

const initialState = {
<<<<<<< HEAD
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
=======
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
  funcionario: null,
  periodicidade_vencimento: 'mensal',
  data_primeiro_vencimento: '',
  horizonte_projecao: '',
  projetos: []
};

const ContratoForm = () => {
  const { selectedCompanyId } = useCompany();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [projetosDisponiveis, setProjetosDisponiveis] = useState([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [porcentagemProjeto, setPorcentagemProjeto] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  // Estado para o arquivo selecionado para upload (usado tanto na criação quanto na edição)
  const [selectedFile, setSelectedFile] = useState(null);
  // Estado para armazenar os dados do contrato já criado (caso seja edição)
  const [contratoExistente, setContratoExistente] = useState(null);

  // Função para tratar datas sem timezone (para exibir preview)
  function parseDateWithoutTimezone(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  useEffect(() => {
    // só busca dados depois que o tenant for selecionado
    if (!selectedCompanyId || selectedCompanyId === 'all') {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        console.log("Iniciando fetchData...");
        
        // Usando a instância do API em vez do axios diretamente
        const [clientesRes, fornecedoresRes, funcionariosRes, projetosRes] = await Promise.all([
          api.get('/api/select/clientes/'),
          api.get('/api/select/fornecedores/'),
          api.get('/api/funcionarios/'),
          api.get('/api/projetos/')
        ]);

        const clientesData = clientesRes.data;
        const fornecedoresData = fornecedoresRes.data;
        const funcionariosData = funcionariosRes.data;
        const projetosData = projetosRes.data;

        setClientes(clientesData);
        setFornecedores(fornecedoresData);
        setFuncionarios(funcionariosData);
        setProjetosDisponiveis(projetosData);

        if (id) {
          const contratoRes = await api.get(`/api/contratos/${id}/`);
          const contrato = contratoRes.data;
          setContratoExistente(contrato);
          console.log("Dados do contrato recebido:", contrato);

          const tipo = contrato.tipo || 'cliente';
          let clienteId = null, fornecedorId = null, funcionarioId = null;
          
          if (contrato.cliente) {
            clienteId = typeof contrato.cliente === 'object' ? contrato.cliente.id : contrato.cliente;
          }
          if (contrato.fornecedor) {
            fornecedorId = typeof contrato.fornecedor === 'object' ? contrato.fornecedor.id : contrato.fornecedor;
          }
          if (contrato.funcionario) {
            funcionarioId = typeof contrato.funcionario === 'object' ? contrato.funcionario.id : contrato.funcionario;
          }

          if (tipo === 'cliente' && clienteId) {
            const cliente = clientesData.find(c => c.id === clienteId);
            if (cliente) {
              setSelectedOption({ value: clienteId, label: cliente.nome });
            }
          } else if (tipo === 'fornecedor' && fornecedorId) {
            const fornecedor = fornecedoresData.find(f => f.id === fornecedorId);
            if (fornecedor) {
              setSelectedOption({ value: fornecedorId, label: fornecedor.nome });
            }
          } else if (tipo === 'funcionario' && funcionarioId) {
            const funcionario = funcionariosData.find(f => f.id === funcionarioId);
            if (funcionario) {
              setSelectedOption({ value: funcionarioId, label: funcionario.nome_completo });
            }
          }

          setFormData({
            numero: contrato.numero || '',
            descricao: contrato.descricao || '',
            data_inicio: contrato.data_inicio || '',
            data_termino: contrato.data_termino || '',
            valor_total: contrato.valor_total || '',
            valor_parcela: contrato.valor_parcela || '',
            status: contrato.status || 'andamento',
            tipo: tipo,
            cliente: clienteId,
            fornecedor: fornecedorId,
            funcionario: funcionarioId,
            periodicidade_vencimento: contrato.periodicidade_vencimento || 'mensal',
            data_primeiro_vencimento: contrato.data_primeiro_vencimento || '',
            horizonte_projecao: contrato.horizonte_projecao !== null && contrato.horizonte_projecao !== undefined 
              ? String(contrato.horizonte_projecao) 
              : '',
            projetos: contrato.projetos?.map(p => ({
              projeto: typeof p.projeto === 'object' ? p.projeto.id : p.projeto,
              valor_projeto: p.valor_projeto
            })) || []
          });
          
          if (contrato.projetos && contrato.projetos.length > 0 && contrato.valor_total) {
            const valorProjetoCalc = parseFloat(contrato.projetos[0].valor_projeto);
            const valorTotalCalc = parseFloat(contrato.valor_total);
            if (!isNaN(valorProjetoCalc) && !isNaN(valorTotalCalc) && valorTotalCalc > 0) {
              const porcentagem = (valorProjetoCalc / valorTotalCalc) * 100;
              setPorcentagemProjeto(porcentagem.toFixed(2));
            }
          }
        }
      } catch (error) {
        console.error("Erro completo no fetchData:", error);
        toast.error('Erro ao carregar dados: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCompanyId, id]);

  useEffect(() => {
    if (formData.tipo === 'cliente') {
      const cliente = clientes.find(c => c.id === formData.cliente);
      setSelectedOption(cliente ? { value: cliente.id, label: cliente.nome } : null);
    } else if (formData.tipo === 'fornecedor') {
      const fornecedor = fornecedores.find(f => f.id === formData.fornecedor);
      setSelectedOption(fornecedor ? { value: fornecedor.id, label: fornecedor.nome } : null);
    } else if (formData.tipo === 'funcionario') {
      const funcionario = funcionarios.find(f => f.id === formData.funcionario);
      setSelectedOption(funcionario ? { value: funcionario.id, label: funcionario.nome_completo } : null);
    }
  }, [formData.tipo, formData.cliente, formData.fornecedor, formData.funcionario, clientes, fornecedores, funcionarios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("handleChange:", name, value);
    setFormData({ ...formData, [name]: value });
  };
  const handleCurrencyChange = (name, values) => {
    // 'values' é um objeto com {formattedValue, value, floatValue}
    // value: valor sem formatação (string), floatValue: número
    setFormData({ ...formData, [name]: values.value });
  };

  const handleSelectChange = (selectedOption, field) => {
    console.log("handleSelectChange:", field, selectedOption);
    const updatedFormData = { ...formData };
    updatedFormData[field] = selectedOption ? selectedOption.value : null;
    
    if (field === 'cliente') {
      updatedFormData.fornecedor = null;
      updatedFormData.funcionario = null;
    } else if (field === 'fornecedor') {
      updatedFormData.cliente = null;
      updatedFormData.funcionario = null;
    } else if (field === 'funcionario') {
      updatedFormData.cliente = null;
      updatedFormData.fornecedor = null;
    }
    
    setFormData(updatedFormData);
    setSelectedOption(selectedOption);
  };

  // Manipulação do arquivo para preview ou criação (já existente no modal)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const validarCampos = () => {
    const camposObrigatorios = [
      { campo: formData.numero, mensagem: 'Número do contrato é obrigatório' },
      { campo: formData.descricao, mensagem: 'Descrição é obrigatória' },
      { campo: formData.data_inicio, mensagem: 'Data de início é obrigatória' },
      { campo: formData.valor_total, mensagem: 'Valor total é obrigatório' },
      { campo: formData.valor_parcela, mensagem: 'Valor da parcela é obrigatório' },
      { campo: formData.data_primeiro_vencimento, mensagem: 'Primeiro vencimento é obrigatório' }
    ];
  
    for (const { campo, mensagem } of camposObrigatorios) {
      if (!campo?.toString().trim()) {
        toast.error(mensagem);
        return false;
      }
    }
  
    if (formData.tipo === 'cliente') {
      if (!formData.cliente || isNaN(formData.cliente)) {
        toast.error('Cliente é obrigatório');
        return false;
      }
    } else if (formData.tipo === 'fornecedor') {
      if (!formData.fornecedor || isNaN(formData.fornecedor)) {
        toast.error('Fornecedor é obrigatório');
        return false;
      }
    } else if (formData.tipo === 'funcionario') {
      if (!formData.funcionario || isNaN(formData.funcionario)) {
        toast.error('Funcionário é obrigatório');
        return false;
      }
    }
  
    if (!formData.data_termino && !formData.horizonte_projecao) {
      toast.error('Informe a Data de Término ou o Horizonte de Projeção');
      return false;
    }
  
    const dataInicio = new Date(formData.data_inicio);
    const dataPrimeiroVencimento = new Date(formData.data_primeiro_vencimento);
  
    if (formData.data_termino) {
      const dataTermino = new Date(formData.data_termino);
      if (dataInicio > dataTermino) {
        toast.error('Data de término deve ser posterior à data de início');
        return false;
      }
      if (dataPrimeiroVencimento < dataInicio || dataPrimeiroVencimento > dataTermino) {
        toast.error('Primeiro vencimento deve estar dentro do período do contrato');
        return false;
      }
    } else {
      const horizonte = parseInt(formData.horizonte_projecao, 10);
      if (isNaN(horizonte) || horizonte <= 0) {
        toast.error('Horizonte de projeção deve ser um número maior que zero');
        return false;
      }
      const dataTerminoVirtual = new Date(dataPrimeiroVencimento);
      dataTerminoVirtual.setMonth(dataTerminoVirtual.getMonth() + horizonte);
      if (dataInicio > dataTerminoVirtual) {
        toast.error('Horizonte de projeção inválido: a data de início é posterior ao término virtual');
        return false;
      }
      if (dataPrimeiroVencimento < dataInicio || dataPrimeiroVencimento > dataTerminoVirtual) {
        toast.error('Primeiro vencimento deve estar dentro do período do contrato');
        return false;
      }
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
    if (isNaN(porcentagem) || porcentagem <= 0 || porcentagem > 100) {
      toast.error('Porcentagem inválida (deve ser entre 0.01 e 100)');
      return;
    }

    if (!formData.valor_total || isNaN(formData.valor_total)) {
      toast.error('Valor total do contrato é necessário para calcular');
      return;
    }

    const valorCalculado = (porcentagem / 100) * parseFloat(formData.valor_total);
    const novoProjeto = {
      projeto: projetoSelecionado.value,
      valor_projeto: valorCalculado.toFixed(2)
    };

    console.log("Adicionando projeto:", novoProjeto);
    setFormData({
      ...formData,
      projetos: [...formData.projetos, novoProjeto]
    });

    setProjetoSelecionado(null);
    setPorcentagemProjeto('');
  };

  const removerProjeto = (index) => {
    console.log("Removendo projeto no índice:", index);
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
        ...(formData.tipo === 'cliente'
          ? { cliente: formData.cliente }
          : formData.tipo === 'fornecedor'
          ? { fornecedor: formData.fornecedor }
          : { funcionario: formData.funcionario }),
        valor_total: parseFloat(formData.valor_total).toFixed(2),
        valor_parcela: parseFloat(formData.valor_parcela).toFixed(2),
        horizonte_projecao: formData.horizonte_projecao && formData.horizonte_projecao.trim() !== ""
          ? parseInt(formData.horizonte_projecao, 10)
          : null,
        projetos: formData.projetos.map(p => ({
          projeto: p.projeto,
          valor_projeto: parseFloat(p.valor_projeto).toFixed(2)
        }))
      };

      if (!formData.data_termino || formData.data_termino.trim() === '') {
        delete payload.data_termino;
      } else {
        payload.data_termino = formData.data_termino;
      }
      
      if (formData.tipo === 'cliente') {
        delete payload.fornecedor;
        delete payload.funcionario;
      } else if (formData.tipo === 'fornecedor') {
        delete payload.cliente;
        delete payload.funcionario;
      } else if (formData.tipo === 'funcionario') {
        delete payload.cliente;
        delete payload.fornecedor;
      }
      console.log("Payload da submissão:", payload);

      const url = id
        ? `/api/contratos/${id}/`
        : '/api/contratos/preview/';
      const method = id ? 'put' : 'post';

      const response = await api[method](url, payload);

      console.log("Resposta da submissão:", response.data);
      if (id) {
        toast.success('Contrato atualizado com sucesso!');
        navigate('/contratos-lista');
      } else {
        setPreviewData(response.data);
        setModalIsOpen(true);
      }
    } catch (error) {
      console.error("Erro na submissão:", error);
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          Object.entries(error.response.data).forEach(([campo, mensagens]) => {
            if (Array.isArray(mensagens)) {
              mensagens.forEach(msg => toast.error(`${campo}: ${msg}`));
            } else {
              toast.error(`${campo}: ${mensagens}`);
            }
          });
        } else {
          toast.error(String(error.response.data));
        }
      } else {
        toast.error('Erro ao processar requisição');
      }
    }
  };

  // Função exclusiva para confirmação do contrato na criação (para envio do arquivo via modal)
 const confirmarContrato = async () => {
  try {
    // 1) Monta o payload para criar de vez o contrato
    const payload = {
      ...previewData.contrato,
      projetos: previewData.projetos,
      confirmado: true,
    };

    // 2) Cria o contrato (POST /api/contratos/)
    const { data: createdContrato } = await api.post('/api/contratos/', payload);
    console.log('Contrato confirmado, resposta:', createdContrato);

    // 3) Se o usuário selecionou um arquivo, faz o upload
    if (selectedFile) {
      const formDataUpload = new FormData();
      formDataUpload.append('arquivo', selectedFile);

      // Atenção: aqui usamos exatamente a rota registrada em urls.py
      // path('api/contratos/<int:pk>/upload/', ... as 'upload_arquivo')
      await api.patch(
        `/api/contratos/${createdContrato.id}/upload/`,
        formDataUpload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log('Upload realizado para contrato', createdContrato.id);
    }

    toast.success('Contrato salvo com sucesso!');
    setModalIsOpen(false);
    setFormData(initialState);
    setSelectedFile(null);

    // redireciona após 2 segundos para a lista de contratos
    setTimeout(() => navigate('/contratos-lista'), 2000);
  } catch (error) {
    console.error('Erro na confirmação:', error);

    // tratamento de erros HTTP / campos da API
    if (error.response?.data) {
      const errData = error.response.data;
      if (typeof errData === 'object') {
        Object.entries(errData).forEach(([field, messages]) => {
          (Array.isArray(messages) ? messages : [messages])
            .forEach(msg => toast.error(`${field}: ${msg}`));
        });
      } else {
        toast.error(errData);
      }
    } else {
      toast.error('Erro de conexão com o servidor');
    }
  }
};

  // Função exclusiva para atualizar o arquivo do contrato em modo de edição
  const handleFileUpdate = async () => {
    if (!selectedFile) {
      toast.error('Nenhum arquivo selecionado para atualização.');
      return;
    }

    try {
      const uploadUrl = `/api/contratos/${id}/arquivo/`;
      const formDataUpload = new FormData();
      formDataUpload.append('arquivo', selectedFile);
      // Utiliza PATCH para atualizar o anexo
      const response = await api.patch(uploadUrl, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Arquivo atualizado com sucesso!');
      // Atualiza os dados do contrato no estado, se necessário
      setContratoExistente(response.data);
    } catch (error) {
      console.error('Erro ao atualizar arquivo:', error);
      toast.error('Erro ao atualizar arquivo.');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <BounceLoader size={50} />
      </div>
    );
  }

  return (
    <div className="contrato-form-container">
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
      <main className="ctr-main-content">
        <div className="ctr-contrato-form-container">
          <h2>{id ? 'Editar Contrato' : 'Novo Contrato'}</h2>
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
                  <option value="funcionario">Funcionário</option>
                </select>
              </div>
            </div>

            {/* Seleção de Cliente/Fornecedor */}
            <div className="ctr-form-row">
              <div className="ctr-form-group">
                <label>
                  {formData.tipo === 'cliente'
                    ? 'Cliente'
                    : formData.tipo === 'fornecedor'
                    ? 'Fornecedor'
                    : 'Funcionário'}
                </label>
                <Select
                  options={
                    formData.tipo === 'cliente'
                      ? clientes.map(c => ({ value: c.id, label: c.nome }))
                      : formData.tipo === 'fornecedor'
                      ? fornecedores.map(f => ({ value: f.id, label: f.nome }))
                      : funcionarios.map(u => ({ value: u.id, label: u.nome_completo }))
                  }
                  value={selectedOption}
                  onChange={(option) => {
                    handleSelectChange(option, formData.tipo);
                  }}
                  isSearchable
                  placeholder={`Selecione ${
                    formData.tipo === 'cliente'
                      ? 'um cliente'
                      : formData.tipo === 'fornecedor'
                      ? 'um fornecedor'
                      : 'um funcionário'
                  }`}
                  key={formData.tipo}
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
                />
                <small className="hint">
                  Deixe em branco para contratos indeterminados.
                </small>
              </div>
              {(!formData.data_termino || formData.data_termino === '') && (
                <div className="ctr-form-group">
                  <label>Horizonte de Projeção (meses)</label>
                  <input
                    type="number"
                    name="horizonte_projecao"
                    value={formData.horizonte_projecao}
                    onChange={handleChange}
                    min="1"
                    placeholder="Ex: 12"
                    required={!formData.data_termino}
                  />
                  <small className="hint">
                    Informe o número de meses para gerar as projeções.
                  </small>
                </div>
              )}
            </div>

            {/* Seção de Parcelas e Projetos */}
            <div className="ctr-form-section">
              <h3>Configuração de Parcelas</h3>
              <div className="ctr-form-row">
                <div className="ctr-form-group">
                  <label>Valor Total</label>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    name="valor_total"
                    value={formData.valor_total}
                    onValueChange={(values) => handleCurrencyChange('valor_total', values)}
                    className="input-currency"
                    required
                  />
                </div>
                <div className="ctr-form-group">
                  <label>Valor da Parcela</label>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    name="valor_parcela"
                    value={formData.valor_parcela}
                    onValueChange={(values) => handleCurrencyChange('valor_parcela', values)}
                    className="input-currency"
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
                      {formData.valor_total && !isNaN(formData.valor_total) && porcentagemProjeto
                        ? `Valor calculado: ${(
                            parseFloat(formData.valor_total) *
                            (parseFloat(porcentagemProjeto) / 100)
                          ).toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}`
                        : 'Valor calculado: R$ 0,00'}
                    </small>
                  </div>
                  <div className="ctr-form-group">
                    <button
                      type="button"
                      onClick={adicionarProjeto}
                      className="ctr-btn ctr-btn-add"
                    >
                      Adicionar Projeto
                    </button>
                  </div>
                </div>

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
                        {formData.projetos.map((proj, index) => {
                          const projetoObj = projetosDisponiveis.find(p =>
                            p.id === proj.projeto ||
                            (proj.projeto && p.id === proj.projeto.id)
                          );
                          return (
                            <tr key={index}>
                              <td>{projetoObj?.nome || 'Projeto não encontrado'}</td>
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
                                  className="ctr-btn ctr-btn-danger"
                                >
                                  Remover
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            
            <button type="submit" className="ctr-btn ctr-btn-primary">
              {id ? 'Atualizar Contrato' : 'Pré-visualizar Contrato'}
            </button>
          </form>
        </div>

        {/* Seção para atualização do arquivo apenas em modo de edição */}
        {id && (
          <div className="file-upload-update">
            <h3>Atualizar/Alterar Arquivo do Contrato</h3>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <button type="button" onClick={handleFileUpdate} className="ctr-btn ctr-btn-secondary">
              Atualizar Arquivo
            </button>
            {contratoExistente && contratoExistente.arquivo && (
              <div>
                <p>
                  Arquivo atual:{' '}
                  <a href={contratoExistente.arquivo} target="_blank" rel="noopener noreferrer">
                    Visualizar
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal para preview e confirmação na criação */}
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
                        <td>{parseDateWithoutTimezone(projecao.data_vencimento).toLocaleDateString('pt-BR')}</td>
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
            {/* Seção para upload do arquivo no modal (para criação) */}
            <div className="file-upload-section">
              <label>Upload do Arquivo (PDF):</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {selectedFile && <p>Arquivo selecionado: {selectedFile.name}</p>}
            </div>
            <div className="modal-actions">
              <button className="ctr-btn ctr-btn-success" onClick={confirmarContrato}>
                Confirmar e Salvar
              </button>
              <button className="ctr-btn ctr-btn-secondary" onClick={() => setModalIsOpen(false)}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
>>>>>>> e62255e (Atualizações no projeto)
};

export default ContratoForm;