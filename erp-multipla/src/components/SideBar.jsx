import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { FaChevronDown, FaTruck, FaChevronRight, FaFileContract, FaProjectDiagram, FaMoneyBill, FaFileInvoiceDollar, FaChartPie, FaBars } from 'react-icons/fa';
=======
import { FaChevronDown, FaTruck, FaChevronRight, FaFileContract, FaProjectDiagram, FaMoneyBill, FaFileInvoiceDollar, FaChartPie, FaBars, FaUsers } from 'react-icons/fa';
>>>>>>> e62255e (Atualizações no projeto)
import { HiUser } from 'react-icons/hi';
import { MdPayments, MdOutlineMenuOpen, MdHome } from "react-icons/md";
import './SideBar.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaUserPlus, FaDollarSign } from 'react-icons/fa';
<<<<<<< HEAD
=======
import { FaMoneyBillTrendUp } from "react-icons/fa6";
>>>>>>> e62255e (Atualizações no projeto)
import { LuMinimize2 } from "react-icons/lu";
import { useAuth } from '../AuthContext';

function SideBar() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isFinanceiroOpen, setIsFinanceiroOpen] = useState(false);
    const [isRelatorioOpen, setIsRelatorioOpen] = useState(false);

    const toggleSidebar = () => {
        // Inverte o estado da sidebar
        const newSidebarState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newSidebarState);
    };

    const toggleCadastro = () => setIsCadastroOpen(!isCadastroOpen);
    const toggleFinanceiro = () => setIsFinanceiroOpen(!isFinanceiroOpen);
    const toggleRelatorio = () => setIsRelatorioOpen(!isRelatorioOpen);

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
            setIsRelatorioOpen(false);
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
<<<<<<< HEAD
=======
                                        <Link to="/funcionario-listar"><FaUsers /> Funcionario</Link>
                                    </li>
                                    <li>
>>>>>>> e62255e (Atualizações no projeto)
                                        <Link to="/contratos-lista"><FaFileContract /> Contratos</Link>
                                    </li>
                                    <li>
                                        <Link to="/projeto-listar"><FaProjectDiagram /> Projetos</Link>
                                    </li>
                                    <li>
                                        <Link to="/pagamento-listar"><MdPayments /> Forma Pagamento</Link>
                                    </li>
<<<<<<< HEAD
=======
                                    <li>
                                        <Link to="/cadastro-contas-financeiras"><FaMoneyBill /> Cadastro de Contas Financeiras </Link>
                                    </li>
                                    <li>
                                        <Link to="/cadastro-centro-custos"><FaMoneyBill /> Cadastro Centro de Custos </Link>
                                    </li>
>>>>>>> e62255e (Atualizações no projeto)
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
<<<<<<< HEAD
                                        <Link to="/contas-pagar"><FaMoneyBill /> Contas a Pagar</Link>
                                    </li>
                                    <li>
                                        <Link to="/contas-receber"><FaFileInvoiceDollar /> Faturamento de Contrato</Link>
=======
                                        <Link to="/contas-pagar"><FaMoneyBill /> Contas a Pagar (Contratos)</Link>
                                    </li>
                                    <li>
                                        <Link to="/contas-receber"><FaFileInvoiceDollar /> Contas a Receber (Contratos)</Link>
>>>>>>> e62255e (Atualizações no projeto)
                                    </li>
                                    <li>
                                        <Link to="/contas-pagar-avulso"><FaMoneyBill /> Contas a Pagar Avulso</Link>
                                    </li>
                                    <li>
<<<<<<< HEAD
                                        <Link to="/contas-receber-avulso"><FaFileInvoiceDollar /> Faturamento de Contrato Avulso</Link>
                                    </li>
                                    <li>
                                        <Link to="/cadastro-contas-financeiras"><FaMoneyBill /> Cadastro de Contas Financeiras </Link>
                                    </li>
                                    <li>
                                        <Link to="/cadastro-centro-custos"><FaMoneyBill /> Cadastro Centro de Custos </Link>
                                    </li>
=======
                                        <Link to="/contas-receber-avulso"><FaFileInvoiceDollar /> Contas a Receber Avulso</Link>
                                    </li>
                                    <li>
                                        <Link to="/movimentacao-financeira"><FaMoneyBillTrendUp /> Movimentação Financeira</Link>
                                    </li>
                                    
>>>>>>> e62255e (Atualizações no projeto)
                                </ul>
                            </div>
                        )}
                    </li>
                    
                    <li>
                        <div onClick={toggleRelatorio} className={`menu-item ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                            {isRelatorioOpen ? <FaChevronDown /> : <FaChevronRight />}
                            {isSidebarCollapsed ? <FaDollarSign /> : <span>Relatorio</span>}
                        </div>
                        {isRelatorioOpen && !isSidebarCollapsed && (
                            <div className="submenu">
                                <ul>
                                    <li>
<<<<<<< HEAD
                                        <Link to="/relatorio-projecoes"><FaMoneyBill /> Relatório de Projeções</Link>
                                    </li>
                                    
                                    
                                    <li>
                                        <Link to="/relatorio-financeiro"><FaChartPie /> Relatório Financeiro</Link>
                                    </li>
=======
                                        <Link to="/relatorio-dinamico"><FaFileContract /> Relatório Dinamico </Link>
                                    </li>
                                    <li>
                                        <Link to="/relatorio-contrato"><FaFileContract /> Relatório de Contratos</Link>
                                    </li>
                                    <li>
                                        <Link to="/relatorio-projetos"><FaFileContract /> Relatório Resultado Projetos</Link>
                                    </li>

                                    
                                   { <li>
                                        <Link to="/relatorio-projecoes"><FaMoneyBill /> Relatório de Projeções</Link>
                                    </li>              
                                    
                                    /*
                                    <li>
                                        <Link to="/relatorio-financeiro"><FaChartPie /> Relatório Financeiro</Link>
                                    </li> */}
>>>>>>> e62255e (Atualizações no projeto)
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
