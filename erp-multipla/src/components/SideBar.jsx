import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FaChevronDown, FaTruck, FaChevronRight, FaFileContract, FaProjectDiagram, FaMoneyBill, FaFileInvoiceDollar, FaChartPie, FaBars } from 'react-icons/fa';
import { HiUser } from 'react-icons/hi';
import { MdPayments, MdOutlineMenuOpen, MdHome } from "react-icons/md";
import './SideBar.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaUserPlus, FaDollarSign } from 'react-icons/fa';
import { LuMinimize2 } from "react-icons/lu";
import { useAuth } from '../AuthContext';

function SideBar() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isFinanceiroOpen, setIsFinanceiroOpen] = useState(false);

    const toggleSidebar = () => {
        // Inverte o estado da sidebar
        const newSidebarState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newSidebarState);
    };

    const toggleCadastro = () => setIsCadastroOpen(!isCadastroOpen);
    const toggleFinanceiro = () => setIsFinanceiroOpen(!isFinanceiroOpen);

    const navigate = useNavigate(); // Initialize useNavigate

    const handleHome = () => {
        navigate('/'); // Navigate to the home page
    };


    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        if (isSidebarCollapsed) {
            setIsCadastroOpen(false);
            setIsFinanceiroOpen(false);
        }
    }, [isSidebarCollapsed]);

    return (
        <>
            {/* Renderize o overlay apenas quando a sidebar NÃO estiver colapsada */}
            {!isSidebarCollapsed && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
            <div className={`sidebar-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="toggle-button-container">
                    <button
                        className="toggle-button"
                        onClick={toggleSidebar}
                        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isSidebarCollapsed ? <FaBars /> : <LuMinimize2 />}
                    </button>
                </div>
                <h2 className={`sidebar-container-title ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <MdOutlineMenuOpen />
                </h2>
                <button
                    className="home-button"
                    aria-label="home"
                    onClick={handleHome}
                >
                    <MdHome />
                </button>
                <ul>
                    <li>
                        <div onClick={toggleCadastro} className={`menu-item ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                            {isCadastroOpen ? <FaChevronDown /> : <FaChevronRight />}
                            {isSidebarCollapsed ? <FaUserPlus /> : <span>Cadastro</span>}
                        </div>
                        {isCadastroOpen && !isSidebarCollapsed && (
                            <div className="submenu">
                                <ul>
                                    <li>
                                        <Link to="/cliente-listar"><HiUser /> Clientes</Link>
                                    </li>
                                    <li>
                                        <Link to="/fornecedor-listar"><FaTruck /> Fornecedores</Link>
                                    </li>
                                    <li>
                                        <Link to="/contratos-lista"><FaFileContract /> Contratos</Link>
                                    </li>
                                    <li>
                                        <Link to="/projeto-listar"><FaProjectDiagram /> Projetos</Link>
                                    </li>
                                    <li>
                                        <Link to="/pagamento-listar"><MdPayments /> Forma Pagamento</Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>
                    <li>
                        <div onClick={toggleFinanceiro} className={`menu-item ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                            {isFinanceiroOpen ? <FaChevronDown /> : <FaChevronRight />}
                            {isSidebarCollapsed ? <FaDollarSign /> : <span>Financeiro</span>}
                        </div>
                        {isFinanceiroOpen && !isSidebarCollapsed && (
                            <div className="submenu">
                                <ul>
                                    <li>
                                        <Link to="/contas-pagar"><FaMoneyBill /> Contas a Pagar</Link>
                                    </li>
                                    <li>
                                        <Link to="/contas-receber"><FaFileInvoiceDollar /> Faturamento de Contrato</Link>
                                    </li>
                                    <li>
                                        <Link to="/contas-pagar-avulso"><FaMoneyBill /> Contas a Pagar Avulso</Link>
                                    </li>
                                    <li>
                                        <Link to="/contas-receber-avulso"><FaFileInvoiceDollar /> Faturamento de Contrato Avulso</Link>
                                    </li>
                                    <li>
                                        <Link to="/relatorio-financeiro"><FaChartPie /> Relatório Financeiro</Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>
                </ul>
                <button
                    className="logout-button"
                    aria-label="Logout"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                </button>
            </div>
        </>
    );
}

export default SideBar;
