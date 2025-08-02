import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminEmpresas() {
  const initialFormEmp = { nome:'', cnpj:'', endereco_matriz:'', cidade:'', estado:'', cep:'', telefone:'', email:'' };
  const initialFormFil = { empresa:'', nome:'', endereco:'', cidade:'', estado:'', cep:'', telefone:'', email:'' };

  // --- estados ---
  const [empresas, setEmpresas] = useState([]);
  const [filiais, setFiliais]   = useState([]);
  const [formEmp, setFormEmp]   = useState(initialFormEmp);
  const [editingEmpId, setEditingEmpId] = useState(null);
  const [formFil, setFormFil]   = useState(initialFormFil);
  const [editingFilialId, setEditingFilialId] = useState(null);
  const [showFilForm, setShowFilForm] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchEmpresas();
    fetchFiliais();
  }, []);

  // --- Empresa ---
  const fetchEmpresas = async () => {
    try {
      const res = await axios.get('https://financeiro.multipla.tec.br/api/empresas/', { headers });
      setEmpresas(res.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar empresas');
    }
  };

  const handleEmpChange = e => {
    const { name, value } = e.target;
    setFormEmp(f => ({ ...f, [name]: value }));
  };

  const handleEmpSubmit = async e => {
    e.preventDefault();
    try {
      let empRes;
      if (editingEmpId) {
        empRes = await axios.put(
          `https://financeiro.multipla.tec.br/api/empresas/${editingEmpId}/`,
          formEmp,
          { headers }
        );
      } else {
        empRes = await axios.post(
          'https://financeiro.multipla.tec.br/api/empresas/',
          formEmp,
          { headers }
        );
        // Após criar matriz, já prepara formulário de filial
        setShowFilForm(true);
        const newEmp = empRes.data;
        setFormFil({ ...initialFormFil, empresa: newEmp.id.toString() });
      }
      setFormEmp(initialFormEmp);
      setEditingEmpId(null);
      fetchEmpresas();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar empresa');
    }
  };

  const handleEmpEdit = emp => {
    setFormEmp({
      nome: emp.nome,
      cnpj: emp.cnpj,
      endereco_matriz: emp.endereco_matriz,
      cidade: emp.cidade,
      estado: emp.estado,
      cep: emp.cep,
      telefone: emp.telefone,
      email: emp.email
    });
    setEditingEmpId(emp.id);
  };

  const handleEmpDelete = async id => {
    if (!window.confirm('Excluir esta empresa?')) return;
    try {
      await axios.delete(
        `https://financeiro.multipla.tec.br/api/empresas/${id}/`,
        { headers }
      );
      fetchEmpresas();
    } catch (err) {
      console.error(err);
      alert('Não foi possível excluir');
    }
  };

  // --- Filial ---
  const fetchFiliais = async () => {
    try {
      const res = await axios.get('https://financeiro.multipla.tec.br/api/filiais/', { headers });
      setFiliais(res.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar filiais');
    }
  };

  const handleFilChange = e => {
    const { name, value } = e.target;
    setFormFil(f => ({ ...f, [name]: value }));
  };

  const handleFilSubmit = async e => {
    e.preventDefault();
    if (!formFil.empresa) {
      alert('Selecione uma empresa');
      return;
    }
    try {
      const payload = { ...formFil, empresa: parseInt(formFil.empresa, 10) };
      if (editingFilialId) {
        await axios.put(
          `https://financeiro.multipla.tec.br/api/filiais/${editingFilialId}/`,
          payload,
          { headers }
        );
      } else {
        await axios.post(
          'https://financeiro.multipla.tec.br/api/filiais/',
          payload,
          { headers }
        );
      }
      setFormFil(initialFormFil);
      setEditingFilialId(null);
      setShowFilForm(false);
      fetchFiliais();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar filial');
    }
  };

  const handleFilEdit = fil => {
    setFormFil({
      empresa: fil.empresa.toString(),
      nome: fil.nome,
      endereco: fil.endereco,
      cidade: fil.cidade,
      estado: fil.estado,
      cep: fil.cep,
      telefone: fil.telefone,
      email: fil.email
    });
    setEditingFilialId(fil.id);
    setShowFilForm(true);
  };

  const handleFilDelete = async id => {
    if (!window.confirm('Excluir esta filial?')) return;
    try {
      await axios.delete(
        `https://financeiro.multipla.tec.br/api/filiais/${id}/`,
        { headers }
      );
      fetchFiliais();
    } catch (err) {
      console.error(err);
      alert('Não foi possível excluir');
    }
  };

  return (
    <div className="admin-empresas">
      <h2>Empresas</h2>
      <form onSubmit={handleEmpSubmit} style={{ marginBottom: 20 }}>
        <input name="nome" placeholder="Nome" value={formEmp.nome} onChange={handleEmpChange} required />
        <input name="cnpj" placeholder="CNPJ" value={formEmp.cnpj} onChange={handleEmpChange} required />
        <input name="endereco_matriz" placeholder="Endereço Matriz" value={formEmp.endereco_matriz} onChange={handleEmpChange} required />
        <input name="cidade" placeholder="Cidade" value={formEmp.cidade} onChange={handleEmpChange} required />
        <input name="estado" placeholder="Estado" value={formEmp.estado} onChange={handleEmpChange} required />
        <input name="cep" placeholder="CEP" value={formEmp.cep} onChange={handleEmpChange} required />
        <input name="telefone" placeholder="Telefone" value={formEmp.telefone} onChange={handleEmpChange} required />
        <input name="email" type="email" placeholder="Email" value={formEmp.email} onChange={handleEmpChange} required />
        <button type="submit">{editingEmpId ? 'Atualizar' : 'Criar'}</button>
        {editingEmpId && (
          <button
            type="button"
            onClick={() => {
              setEditingEmpId(null);
              setFormEmp(initialFormEmp);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <ul>
        {empresas.map(emp => (
          <li key={emp.id}>
            <strong>{emp.nome}</strong>
            <button onClick={() => handleEmpEdit(emp)}>Editar</button>
            <button onClick={() => handleEmpDelete(emp.id)}>Excluir</button>
            <br />
            {emp.cidade} - {emp.estado} | CEP {emp.cep}
          </li>
        ))}
      </ul>

      <hr style={{ margin: '40px 0' }} />

      <h2>Filiais</h2>
      <button onClick={() => setShowFilForm(v => !v)}>
        {showFilForm ? 'Cancelar Filial' : 'Adicionar Filial'}
      </button>

      {showFilForm && (
        <form onSubmit={handleFilSubmit} style={{ marginTop: 12, marginBottom: 20 }}>
          <select name="empresa" value={formFil.empresa} onChange={handleFilChange} required>
            <option value="">Selecione Empresa</option>
            {empresas.map(e => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>
          <input name="nome" placeholder="Nome da Filial" value={formFil.nome} onChange={handleFilChange} required />
          <input name="endereco" placeholder="Endereço" value={formFil.endereco} onChange={handleFilChange} required />
          <input name="cidade" placeholder="Cidade" value={formFil.cidade} onChange={handleFilChange} required />
          <input name="estado" placeholder="Estado" value={formFil.estado} onChange={handleFilChange} required />
          <input name="cep" placeholder="CEP" value={formFil.cep} onChange={handleFilChange} required />
          <input name="telefone" placeholder="Telefone" value={formFil.telefone} onChange={handleFilChange} required />
          <input name="email" type="email" placeholder="Email" value={formFil.email} onChange={handleFilChange} required />
          <button type="submit">{editingFilialId ? 'Atualizar' : 'Criar'}</button>
        </form>
      )}

      <ul>
        {filiais.map(f => {
          const emp = empresas.find(e => e.id === f.empresa);
          return (
            <li key={f.id}>
              <strong>{f.nome}</strong> (<em>{emp?.nome}</em>)
              <button onClick={() => handleFilEdit(f)}>Editar</button>
              <button onClick={() => handleFilDelete(f.id)}>Excluir</button>
              <br />
              {f.cidade} - {f.estado} | CEP {f.cep}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
