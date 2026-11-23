import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  User,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Logo from "./Logo";
import "../styles/sidebar.css";

const menuItems = [
  { path: "/dashboard", icon: Home, label: "Tableau de bord" },
  { path: "/devis", icon: FileText, label: "Mes devis" },
  { path: "/contrats", icon: ShieldCheck, label: "Mes contrats" },
  { path: "/documents", icon: AlertTriangle, label: "Mes documents" },
  { path: "/paiements", icon: CreditCard, label: "Mes paiements" },
  { path: "/profil", icon: User, label: "Mon profil" },

];



const bottomItems = [
  { path: "/dashboard", icon: Home, label: "Accueil" },
  { path: "/devis", icon: FileText, label: "Devis" },
  { path: "/contrats", icon: ShieldCheck, label: "Contrats" },
  { path: "/documents", icon: AlertTriangle, label: "Documents" },
  { path: "/paiements", icon: CreditCard, label: "Paiements" },
  { path: "/profil", icon: User, label: "Profil" },
];

function NavItem({ path, icon: Icon, label, collapsed }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `nav-item ${collapsed ? "collapsed" : ""} ${isActive ? "active" : ""}`
      }
      title={collapsed ? label : undefined}
    >
      <span className="nav-icon-wrap">
        <Icon size={20} strokeWidth={1.9} className="nav-icon" />
      </span>
      {!collapsed && <span className="nav-label">{label}</span>}
    </NavLink>
  );
}

function BottomNav() {
  const { pathname } = useLocation();

  const activeIndex = bottomItems.findIndex(
    (item) => pathname === item.path || pathname.startsWith(item.path + "/")
  );

  return (
    <nav
      className={`bottom-nav ${activeIndex === -1 ? "no-active" : ""}`}
      style={{ "--i": Math.max(activeIndex, 0), "--n": bottomItems.length }}
      aria-label="Navigation principale"
    >
      <div className="bn-bg" aria-hidden="true">
        <span className="bn-bar" />
        <svg
          className="bn-notch"
          viewBox="0 0 120 40"
          width="96"
          height="40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 26H18C30 26 32 2 60 2C88 2 90 26 102 26H120V40H0Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="bn-items">
        {bottomItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `bn-item ${isActive ? "active" : ""}`}
          >
            <span className="bn-icon">
              <Icon size={22} strokeWidth={1.9} className="bn-svg" />
            </span>
            <span className="bn-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="collapse-btn"
          aria-label={collapsed ? "Développer le menu" : "Réduire le menu"}
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>

        <div className="sidebar-header">
          <Logo collapsed={collapsed} />
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavItem key={item.path} {...item} collapsed={collapsed} />
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/login"
            className={`nav-item logout ${collapsed ? "collapsed" : ""}`}
            title={collapsed ? "Déconnexion" : undefined}
          >
            <span className="nav-icon-wrap">
              <LogOut size={20} strokeWidth={1.9} className="nav-icon" />
            </span>
            {!collapsed && <span className="nav-label">Déconnexion</span>}
          </NavLink>
        </div>
      </aside>

      <BottomNav />
    </>
  );
}