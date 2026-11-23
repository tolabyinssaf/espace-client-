import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bell, ChevronDown, User, CreditCard, Settings, LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Logo from "../components/Logo";
import "../styles/client-layout.css";

function ClientLayout({ children, userName = "Client" }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="client-layout">
            <Sidebar />

            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-logo">
                        <Logo />
                    </div>

                    <div className="topbar-right">
                        <button className="topbar-bell" aria-label="Notifications">
                            <Bell size={20} />
                            <span className="topbar-bell-dot" />
                        </button>

                        <div className="topbar-user-wrap">
                            <button
                                className="topbar-user"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <span className="topbar-avatar">
                                    <User size={18} />
                                </span>
                                <span className="topbar-user-name">
                                    Bonjour, <strong>{userName}</strong>
                                </span>
                                <ChevronDown size={14} />
                            </button>

                            {menuOpen && (
                                <>
                                    <div
                                        className="topbar-menu-backdrop"
                                        onClick={() => setMenuOpen(false)}
                                    />
                                    <div className="topbar-menu">
                                        <NavLink to="/paiements" onClick={() => setMenuOpen(false)}>
                                            <CreditCard size={16} /> Mes paiements
                                        </NavLink>
                                    
                                        <NavLink to="/login" className="danger" onClick={() => setMenuOpen(false)}>
                                            <LogOut size={16} /> Déconnexion
                                        </NavLink>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="page-content">{children}</main>
            </div>
        </div>
    );
}

export default ClientLayout;