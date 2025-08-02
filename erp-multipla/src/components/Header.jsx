// src/components/Header.js
import React, { useState, useEffect } from 'react';
import './Header.css';
import { useAuth } from '../AuthContext';
import { FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { CgOptions } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { TbCashRegister } from 'react-icons/tb';
import NotificationBell from './NotificationBell';
import { useCompany } from '../CompanyContext';

function Header({ pageTitle }) {
  const { isLoggedIn, userName, logout } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(localStorage.getItem('userName') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const { companies, selectedCompanyId, switchCompany } = useCompany(); // Obtenha do contexto
  const navigate = useNavigate();

  // Atualiza o username
  useEffect(() => {
    // 1. Prioriza o userName do contexto quando disponível
    if (userName && userName !== currentUserName) {
      setCurrentUserName(userName);
      localStorage.setItem('userName', userName);
    } 
    // 2. Fallback para localStorage quando contexto estiver vazio
    else if (!userName && !currentUserName) {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setCurrentUserName(storedName);
      }
    }
    // 3. Mantém o último nome conhecido se ambos estiverem vazios
  }, [userName, currentUserName]);
  
  // Handlers
  const handleUserInfoClick = () => setDropdownVisible(v => !v);
  const handleOverlayClick  = () => setDropdownVisible(false);
  const handleLogout = () => {
    logout(); 
    setCurrentUserName('');
    localStorage.removeItem('userName');
    setDropdownVisible(false);
  };
  const handleSearchChange  = e => setSearchTerm(e.target.value);
  const handleRouteClick    = path => { navigate(path); setSearchTerm(''); };

   // Encontre a empresa selecionada
  const selectedCompany = companies.find(c => c.id.toString() === selectedCompanyId);


  useEffect(() => {
    const routes = [
      { name: 'Contas a Pagar', path: '/contas-pagar' },
      /* ... suas outras rotas ... */
    ];
    if (searchTerm) {
      setFilteredRoutes(
        routes.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else {
      setFilteredRoutes([]);
    }
  }, [searchTerm]);

  
  
  return (
    <div className="header">
      <div className="header-left">
        

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
            {filteredRoutes.map(route => (
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
        <NotificationBell />

        {/* Exiba a empresa atual aqui */}
        {selectedCompany && (
          <div className="current-company">
            {selectedCompany.nome}
          </div>
        )}

        <div className="user-info" onClick={handleUserInfoClick}>
          <div className="user-icon">
            {currentUserName.charAt(0).toUpperCase()}
          </div>
          <span className="user-name">{currentUserName || 'Usuário'}</span>
        </div>

        {dropdownVisible && (
          <>
            <div className="dropdown-overlay" onClick={handleOverlayClick} />
            <div className="dropdown-menu">
              <span className="dropdown-username">{currentUserName}</span>
              {/* Seletor de Empresas */}
                <div className="company-selector">
                  <div className="dropdown-label">Empresas:</div>
                  {companies.map(company => (
                    <div 
                      key={company.id}
                      className={`company-item ${selectedCompanyId === company.id.toString() ? 'selected' : ''}`}
                      onClick={() => {
                        switchCompany(company.id.toString());
                        setDropdownVisible(false);
                      }}
                    >
                      {company.nome}
                    </div>
                  ))}
                </div>
              <button className="option-button" onClick={handleLogout}>
                <CgOptions /> Opções
              </button>
              <button
                className="option-button"
                onClick={() => navigate('/admin-empresas')}
              >
                <TbCashRegister /> Painel de Empresas
              </button>
              <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
