import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>Portal Hospitalar</h2>
                <span>Triagem Inteligente</span>
            </div>

            <nav className="sidebar-menu">
                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/patients">
                    Pacientes
                </NavLink>

                <NavLink to="/consultations">
                    Histórico de Atendimentos
                </NavLink>

                <NavLink to="/settings">
                    Configurações
                </NavLink>
            </nav>
        </aside>
    );
}