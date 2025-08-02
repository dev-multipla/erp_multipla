// src/components/TenantSelector.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';

// onChange( idSelecionado )
export function TenantSelector({ onChange }) {
  const { user } = useContext(AuthContext);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (!user?.perfilusuario?.empresa) return;

    const matrId = user.perfilusuario.empresa.id;
    const matrNome = user.perfilusuario.empresa.nome;
    const filiais   = user.perfilusuario.empresa.filiais || [];

    // monta opções: primeiro a matriz, depois cada filial
    const opts = [
      { id: matrId, nome: matrNome, type: 'matriz' },
      ...filiais.map(f => ({ id: f.id, nome: f.nome, type: 'filial' }))
    ];
    setOptions(opts);
    setSelected(opts[0].id);        // seleciona matriz por padrão
    onChange(opts[0].id);           // avisa o pai
  }, [user]);

  const handle = e => {
    setSelected(e.target.value);
    onChange(e.target.value);
  };

  return (
    <select value={selected} onChange={handle}>
      {options.map(o => (
        <option key={`${o.type}-${o.id}`} value={o.id}>
          {o.type === 'matriz'
            ? `Matriz: ${o.nome}`
            : `Filial: ${o.nome}`}
        </option>
      ))}
    </select>
  );
}
