import React, { useState, useEffect } from 'react';
import './Header.css';
import { useAuth } from '../AuthContext';
import { FaBars, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { CgOptions } from "react-icons/cg";
import { useNavigate } from 'react-router-dom'; // Para navegação

function Header({ pageTitle }) {
    const { isLoggedIn, userName, logout } = useAuth();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [currentUserName, setCurrentUserName] = useState(localStorage.getItem('userName') || '');
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca
    const [filteredRoutes, setFilteredRoutes] = useState([]); // Estado para rotas filtradas
    const navigate = useNavigate(); // Hook para navegar entre rotas
    
    const routes = [
        { name: 'Contas a Pagar', path: '/contas-pagar' },
        { name: 'Contas a Receber', path: '/contas-receber' },
        { name: 'Relatório Financeiro', path: '/relatorio-financeiro' },
        { name: 'Cadastro de Contrato', path: '/cadastro-contrato' },
        { name: 'Cadastro de Projeto', path: '/cadastro-projeto' },
        { name: 'Contas Pagar Avulso', path: '/contas-pagar-avulso' },
        { name: 'Contas Receber Avulso', path: '/contas-receber-avulso' },
        { name: 'Lista de Contratos', path: '/contratos-lista' },
        { name: 'Lista de Projetos', path: '/projeto-listar' },
        { name: 'Lista de Clientes', path: '/cliente-listar' },
        { name: 'Lista de Fornecedores', path: '/fornecedor-listar' },
        { name: 'Cadastro de Fornecedor', path: '/cadastro-fornecedor' },
        { name: 'Cadastro de Cliente', path: '/cadastro-cliente' },
        { name: 'Lista de Pagamentos', path: '/pagamento-listar' },
        { name: 'Cadastro de Pagamento', path: '/cadastro-pagamento' }
    ];

    useEffect(() => {
        if (userName) {
            setCurrentUserName(userName);
            localStorage.setItem('userName', userName);
        }
    }, [userName]);

    useEffect(() => {
        // Filtra as rotas com base no termo de pesquisa
        if (searchTerm) {
            const filtered = routes.filter(route =>
                route.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRoutes(filtered);
        } else {
            setFilteredRoutes([]); // Limpa os resultados se não houver termo de busca
        }
    }, [searchTerm]);

    const handleUserInfoClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleOverlayClick = () => {
        setDropdownVisible(false);
    };

    const handleLogout = () => {
        logout();
        setDropdownVisible(false);
        localStorage.removeItem('userName');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Atualiza o termo de busca
    };

    const handleRouteClick = (path) => {
        navigate(path); // Navega para a rota clicada
        setSearchTerm(''); // Limpa o campo de busca após a navegação
    };

    return (
        <>
            <div className="header">
                <div className="header-left">
                    <FaBars className="menu-icon" aria-label="Menu" />
                    <input 
                        type="text" 
                        className="h-search-bar" 
                        placeholder="Pesquisar" 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                    />
                    <FaSearch className="search-icon" />
                    {filteredRoutes.length > 0 && (
                        <ul className="search-results">
                            {filteredRoutes.map((route) => (
                                <li key={route.path} onClick={() => handleRouteClick(route.path)}>
                                    {route.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="header-center">
                    <h1 className="page-title">{pageTitle}</h1>
                </div>

                <div className="header-right">
                    <div className="user-info" onClick={handleUserInfoClick}>
                        <div className="user-icon">
                            {currentUserName.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{currentUserName || 'Nome do Usuário'}</span>
                    </div>
                    {dropdownVisible && (
                        <>
                            <div className="dropdown-overlay" onClick={handleOverlayClick}></div>
                            <div className="dropdown-menu">
                                <span className="dropdown-username">{currentUserName || 'Nome do Usuário'}</span>

                                <button className="option-button" onClick={handleLogout}>
                                    <CgOptions /> Opções
                                </button>

                                <button className="logout-button" onClick={handleLogout}>
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Header;
