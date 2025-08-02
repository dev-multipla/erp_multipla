// FuncionarioForm.js

import React, { useState, useEffect } from 'react';
import api from '../api'; // Importa a instância configurada do axios
import { useAuth } from '../AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import './FuncionarioForm.css';
import SideBar from './SideBar';
import InputMask from 'react-input-mask';
import { NumericFormat } from 'react-number-format';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  cpf: '',
  nome_completo: '',
  data_nascimento: '',
  sexo: '',
  nacionalidade: 'Brasileira',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  estado_civil: '',
  grau_instrucao: '',
  data_admissao: '',
  matricula: '',
  cargo_funcao: '',
  tipo_contrato: '',
  jornada_trabalho: '44 horas semanais',
  categoria: 'TEC',
  salario: '',
  forma_pagamento: ''
};

const FuncionarioForm = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para navegação
  const [formData, setFormData] = useState(initialState);

  // Choices para dropdowns
  const CHOICES = {
    SEXO: [
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Feminino' },
      { value: 'O', label: 'Outro' }
    ],
    ESTADO_CIVIL: [
      { value: 'S', label: 'Solteiro' },
      { value: 'C', label: 'Casado' },
      { value: 'D', label: 'Divorciado' },
      { value: 'V', label: 'Viúvo' },
      { value: 'U', label: 'União Estável' }
    ],
    GRAU_INSTRUCAO: [
      { value: 'FI', label: 'Fundamental Incompleto' },
      { value: 'FC', label: 'Fundamental Completo' },
      { value: 'MI', label: 'Médio Incompleto' },
      { value: 'MC', label: 'Médio Completo' },
      { value: 'SI', label: 'Superior Incompleto' },
      { value: 'SC', label: 'Superior Completo' },
      { value: 'PG', label: 'Pós-Graduação' },
      { value: 'ME', label: 'Mestrado' },
      { value: 'DO', label: 'Doutorado' }
    ],
    TIPO_CONTRATO: [
      { value: 'C', label: 'CLT' },
      { value: 'P', label: 'Pessoa Jurídica' },
      { value: 'T', label: 'Temporário' },
      { value: 'E', label: 'Estágio' }
    ],
    CATEGORIA: [
      { value: 'ADM', label: 'Administrativo' },
      { value: 'TEC', label: 'Técnico' },
      { value: 'GES', label: 'Gestão' },
      { value: 'OPE', label: 'Operacional' }
    ],
    FORMA_PAGAMENTO: [
      { value: 'D', label: 'Dinheiro' },
      { value: 'T', label: 'Transferência Bancária' },
      { value: 'P', label: 'Pix' },
      { value: 'C', label: 'Cheque' }
    ]
  };

  useEffect(() => {
    if (id) {
      // Se houver um ID, estamos em modo de edição
      api.get(`/api/funcionarios/${id}/`)
        .then(response => {
          // Ajuste para formatar datas de volta para DD/MM/YYYY
          const formattedData = {
            ...response.data,
            data_nascimento: formatDateToBrazilian(response.data.data_nascimento),
            data_admissao: formatDateToBrazilian(response.data.data_admissao)
          };
          setFormData(formattedData);
        })
        .catch(error => {
          console.error('Erro ao carregar dados do funcionário', error);
          toast.error('Erro ao carregar dados do funcionário');
        });
    }
  }, [id]);

  // Função para formatar data de YYYY-MM-DD para DD/MM/YYYY
  const formatDateToBrazilian = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      'cpf', 'nome_completo', 'data_nascimento', 'sexo',
      'endereco', 'numero', 'bairro', 'cidade', 'estado', 'cep',
      'estado_civil', 'grau_instrucao', 'data_admissao', 'matricula',
      'cargo_funcao', 'tipo_contrato', 'categoria', 'salario', 'forma_pagamento'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      const isEmpty = value === '' || value === null || value === undefined;
      return isEmpty;
    });

    if (missingFields.length > 0) {
      toast.error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      return;
    }

    // Função para converter datas
    const convertDate = (dateStr) => {
      if (!dateStr) return '';
      // Remove possíveis caracteres extras da máscara
      const cleanDate = dateStr.replace(/[^0-9]/g, '');
      if (cleanDate.length !== 8) return ''; // DDMMYYYY deve ter 8 dígitos
      const day = cleanDate.substring(0, 2);
      const month = cleanDate.substring(2, 4);
      const year = cleanDate.substring(4, 8);
      return `${year}-${month}-${day}`;
    };

    // Prepara dados para envio
    const postData = {
      ...formData,
      data_nascimento: convertDate(formData.data_nascimento),
      data_admissao: convertDate(formData.data_admissao),
      salario: parseFloat(formData.salario.toString().replace(/[^0-9,]/g, '').replace(',', '.'))
    };

    const url = id ? `/api/funcionarios/${id}/` : '/api/funcionarios/';
    const method = id ? 'put' : 'post';

    api({
      method,
      url,
      data: postData
    })
      .then(response => {
        toast.success(id ? 'Funcionário atualizado!' : 'Funcionário cadastrado!');
        if (!id) setFormData(initialState);
        navigate('/funcionario-listar'); // Redireciona após sucesso
      })
      .catch(error => {
        console.error('Erro completo:', error);
        if (error.response?.data) {
          Object.entries(error.response.data).forEach(([field, messages]) => {
            toast.error(`${field}: ${messages.join(', ')}`);
          });
        } else {
          toast.error(`Erro: ${error.message}`);
        }
      });
  };

  // Renderização dos campos de select com base nas escolhas
  const renderSelect = (name, choices, label) => (
    <div className="f-form-group">
      <label>{label}:</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
      >
        <option value="">Selecione</option>
        {choices.map(choice => (
          <option key={choice.value} value={choice.value}>
            {choice.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="funcionario-form-container">
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
      <main className="f-main-content">
        <div className="f-funcionario-form-container">
          <h2>{id ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
          <form className="formulario-funcionario" onSubmit={handleSubmit}>
            {/* Linha 1 - Nome e CPF */}
            <div className="f-form-row">
              <div className="f-form-group">
                <label>Nome Completo:</label>
                <input
                  type="text"
                  name="nome_completo"
                  value={formData.nome_completo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="f-form-group">
                <label>CPF:</label>
                <InputMask
                  mask="999.999.999-99"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Linha 2 - Nascimento e Sexo */}
            <div className="f-form-row">
              <div className="f-form-group">
                <label>Data Nascimento:</label>
                <InputMask
                  mask="99/99/9999"
                  name="data_nascimento"
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  required
                  placeholder="DD/MM/AAAA"
                  pattern="\d{2}/\d{2}/\d{4}"
                />
              </div>
              {renderSelect('sexo', CHOICES.SEXO, 'Sexo')}
            </div>
            {/* Linha 3 - Estado Civil e Instrução */}
            <div className="f-form-row">
              {renderSelect('estado_civil', CHOICES.ESTADO_CIVIL, 'Estado Civil')}
              {renderSelect('grau_instrucao', CHOICES.GRAU_INSTRUCAO, 'Grau de Instrução')}
            </div>
            {/* Linha 4 - Endereço */}
            <div className="f-form-row">
              <div className="f-form-group full-width">
                <label>Endereço:</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="f-form-group">
                <label>Número:</label>
                <input
                  type="text"
                  name="numero"
                  className="input-pequeno-fun"
                  value={formData.numero}
                  onChange={handleChange}
                  style={{ width: "350px" }}
                  required
                />
              </div>
              <div className="f-form-group">
                <label>Bairro:</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Linha 5 - Detalhes do Endereço */}
            <div className="f-form-row">
              <div className="f-form-group">
                <label>Cidade:</label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Estado:</label>
                <select
                  name="estado"
                  className="input-pequeno-fun"
                  value={formData.estado}
                  onChange={handleChange}
                  style={{ width: "350px" }}
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
              <div className="f-form-group">
                <label>CEP:</label>
                <InputMask
                  mask="99999-999"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Linha 6 - Admissão e Matrícula */}
            <div className="f-form-row">
              <div className="f-form-group">
                <label>Data Admissão:</label>
                <InputMask
                  mask="99/99/9999"
                  name="data_admissao"
                  value={formData.data_admissao}
                  onChange={handleChange}
                  required
                  placeholder="DD/MM/AAAA"
                  pattern="\d{2}/\d{2}/\d{4}"
                />
              </div>
              <div className="f-form-group">
                <label>Matrícula:</label>
                <input
                  type="text"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Linha 7 - Cargo e Salário */}
            <div className="f-form-row">
              <div className="f-form-group">
                <label>Cargo/Função:</label>
                <input
                  type="text"
                  name="cargo_funcao"
                  value={formData.cargo_funcao}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="f-form-group">
                <label>Salário:</label>
                <NumericFormat
                  value={formData.salario}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale={true}
                  onValueChange={(values) => {
                    setFormData({
                      ...formData,
                      salario: values.floatValue,
                    });
                  }}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
            </div>
            {/* Linha 8 - Contrato e Pagamento */}
            <div className="f-form-row">
              {renderSelect('tipo_contrato', CHOICES.TIPO_CONTRATO, 'Tipo Contrato')}
              {renderSelect('forma_pagamento', CHOICES.FORMA_PAGAMENTO, 'Forma Pagamento')}
            </div>
            {/* Botões */}
            <div className="f-form-actions">
              <button type="submit" className="f-btn-primary">
                {id ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button
                type="button"
                className="f-btn-secondary"
                onClick={() => setFormData(initialState)}
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </main>
      <aside className="funcionario-form-sidebar">
        <h3>Cadastro de Funcionários</h3>
        <p>
          Preencha todos os campos obrigatórios para registrar um novo funcionário. Certifique-se de verificar as informações antes de enviar.
        </p>
        <div className="form-legend">
          <h4>Legenda:</h4>
          <ul>
            <li>Jornada Padrão: 44h semanais</li>
            <li>Pagamento: Conforme forma selecionada</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default FuncionarioForm;