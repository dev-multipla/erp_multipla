import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import Sidebar from './SideBar';
import './PagamentoListForm.css'; // Importa o CSS específico para ContractsList
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionamento

const PagamentoList = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPagamentos, setSelectedPagamentos] = useState([]); // Estado para armazenar pagamentos selecionados
  const navigate = useNavigate(); // Hook para redirecionamento

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de acesso não encontrado.');
        }

        const response = await axios.get('http://127.0.0.1:8000/api/formas-pagamento/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response:', response.data); // Verifica a resposta

        // Verifica se a resposta contém pagamentos
        if (Array.isArray(response.data)) {
          setPagamentos(response.data);
        } else {
          throw new Error('Dados recebidos não estão no formato esperado.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPagamentos();
  }, []);

  const handleButtonClick = () => {
    navigate('/cadastro-pagamento'); // Redireciona para a nova página
  };

  // Função para lidar com a seleção de pagamentos
  const handleCheckboxChange = (id) => {
    setSelectedPagamentos((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Função para excluir (soft-delete) os pagamentos selecionados
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de acesso não encontrado.');
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/formas-pagamento/soft-delete/',
        { ids: selectedPagamentos },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Delete response:', response.data);

      // Filtra os pagamentos excluídos do estado
      setPagamentos((prevPagamentos) =>
        prevPagamentos.filter((pagamento) => !selectedPagamentos.includes(pagamento.id))
      );

      // Limpa a seleção após a exclusão
      setSelectedPagamentos([]);
    } catch (error) {
      console.error('Erro ao excluir pagamentos:', error);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <BounceLoader color="#009C95" size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="pagamento-list-container"> {/* Novo contêiner flex */}
      <Sidebar /> {/* Renderiza a Sidebar */}
      <div className="pagamento-list">
        <div className="actions">
          <input
            type="text"
            placeholder="Pesquisar Formas Pagamento ..."
            value={""}
            onChange={""}
          />
          <button className="add-button" onClick={handleButtonClick}>
            Incluir Pagamento
          </button>
          {selectedPagamentos.length > 0 && (
            <button className="delete-button" onClick={handleDelete}>
              Excluir Selecionados
            </button>
          )}
        </div>
        <h1>Pagamentos Associados</h1>
        {pagamentos.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Selecionar</th>
                <th>Descrição</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((pagamento) => (
                <tr key={pagamento.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedPagamentos.includes(pagamento.id)}
                      onChange={() => handleCheckboxChange(pagamento.id)}
                    />
                  </td>
                  <td>{pagamento.descricao}</td>
                  <td>{pagamento.tipo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhuma forma de pagamento encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default PagamentoList;
