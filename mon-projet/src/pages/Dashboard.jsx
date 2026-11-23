import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FileText,
    ShieldCheck,
    FolderOpen,
    CreditCard,
    AlertTriangle,
    TrendingUp,
    CalendarDays,
    ArrowRight,
    Plus,
    Clock,
    CheckCircle2,
    Car,
    Home,
    HeartPulse,
    Bell,
    ChevronRight,
    Wallet,
} from "lucide-react";
import DevisModal from "../components/DevisModal";
import "../styles/dashboard.css";
import "../styles/devis.css"; 

const stats = [
    { key: "devis", icon: FileText, label: "Devis en cours", value: 2, link: "/devis" },
    { key: "contrats", icon: ShieldCheck, label: "Contrats actifs", value: 2, link: "/contrats" },
    { key: "documents", icon: FolderOpen, label: "Documents", value: 8, link: "/documents" },
    { key: "paiements", icon: CreditCard, label: "Paiements à venir", value: 1, link: "/paiements" },
];

const contrats = [
    { id: 1, icon: Car, name: "Assurance Auto", ref: "CT-2026-AUTO-001", echeance: "01 janv. 2027", prime: "4 500 MAD" },
    { id: 2, icon: Home, name: "Assurance Habitation", ref: "CT-2026-HAB-002", echeance: "01 juin 2027", prime: "2 300 MAD" },
];

const devis = [
    { id: 1, name: "Assurance Auto", ref: "DEV-2026-001", date: "05 sept. 2026", montant: "4 500 MAD", statut: "attente", icon: Car },
    { id: 2, name: "Assurance Habitation", ref: "DEV-2026-002", date: "02 sept. 2026", montant: "2 300 MAD", statut: "accepte", icon: Home },
    { id: 3, name: "Mutuelle Santé", ref: "DEV-2026-003", date: "28 août 2026", montant: "1 800 MAD", statut: "refuse", icon: HeartPulse },
];

const notifications = [
    { id: 1, icon: CheckCircle2, title: "Devis accepté", desc: "Assurance Habitation · DEV-2026-002", time: "Il y a 2 jours" },
    { id: 2, icon: Clock, title: "Échéance proche", desc: "Prime Auto dans 12 jours", time: "Il y a 3 jours" },
    { id: 3, icon: Bell, title: "Nouveau document disponible", desc: "Attestation d'assurance Auto", time: "Il y a 5 jours" },
];

const statutLabel = { actif: "Actif", attente: "En attente", accepte: "Accepté", refuse: "Refusé" };

function Dashboard() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="db-page">
            <header className="db-header">
                <button
                    type="button"
                    className="db-cta"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={17} /> Nouveau devis
                </button>
            </header>

            <section className="db-stats">
                {stats.map(({ key, icon: Icon, label, value, link }) => (
                    <Link to={link} key={key} className="db-stat">
                        <span className="db-stat-icon">
                            <Icon size={20} />
                        </span>
                        <div className="db-stat-body">
                            <span className="db-stat-label">{label}</span>
                            <strong className="db-stat-value">{value}</strong>
                        </div>
                        <ChevronRight size={16} className="db-stat-arrow" />
                    </Link>
                ))}
            </section>

            <section className="db-alert">
                <span className="db-alert-icon">
                    <AlertTriangle size={20} />
                </span>
                <div className="db-alert-text">
                    <strong>Une échéance approche</strong>
                    <span>Votre prime Auto de <b>4 500 MAD</b> est due le 01 nov. 2026.</span>
                </div>
                <Link to="/paiements" className="db-alert-btn">
                    Payer <ArrowRight size={15} />
                </Link>
            </section>

            <div className="db-grid">
                <div className="db-col">
                    <section className="db-card">
                        <header className="db-card-head">
                            <h2>Mes contrats actifs</h2>
                            <Link to="/contrats" className="db-card-link">
                                Tout voir <ChevronRight size={14} />
                            </Link>
                        </header>

                        <ul className="db-list">
                            {contrats.map((c) => (
                                <li key={c.id} className="db-row">
                                    <span className="db-row-icon">
                                        <c.icon size={20} />
                                    </span>
                                    <div className="db-row-body">
                                        <strong>{c.name}</strong>
                                        <span>{c.ref}</span>
                                    </div>
                                    <div className="db-row-end">
                                        <span className="db-row-amount">{c.prime}</span>
                                        <span className="db-row-date">
                                            <CalendarDays size={12} /> {c.echeance}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="db-card">
                        <header className="db-card-head">
                            <h2>Mes derniers devis</h2>
                            <Link to="/devis" className="db-card-link">
                                Tout voir <ChevronRight size={14} />
                            </Link>
                        </header>

                        <ul className="db-list">
                            {devis.map((d) => (
                                <li key={d.id} className="db-row">
                                    <span className="db-row-icon">
                                        <d.icon size={18} />
                                    </span>
                                    <div className="db-row-body">
                                        <strong>{d.name}</strong>
                                        <span>{d.ref} · {d.date}</span>
                                    </div>
                                    <div className="db-row-end">
                                        <span className="db-row-amount">{d.montant}</span>
                                        <span className={`db-badge ${d.statut}`}>
                                            {statutLabel[d.statut]}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="db-col">
                    <section className="db-card db-pay">
                        <header className="db-card-head">
                            <h2>Prochain paiement</h2>
                            <Link to="/paiements" className="db-card-link">
                                Détails <ChevronRight size={14} />
                            </Link>
                        </header>

                        <div className="db-pay-amount">
                            <span className="db-pay-icon">
                                <Wallet size={20} />
                            </span>
                            <div>
                                <strong>4 500 MAD</strong>
                                <span>Prime Auto · Octobre 2026</span>
                            </div>
                        </div>

                        <div className="db-pay-date">
                            <CalendarDays size={14} /> À régler avant le 01 nov. 2026
                        </div>

                        <Link to="/paiements" className="db-pay-btn">
                            Payer maintenant <ArrowRight size={15} />
                        </Link>
                    </section>

                    <section className="db-card">
                        <header className="db-card-head">
                            <h2>Notifications</h2>
                            <span className="db-count">{notifications.length}</span>
                        </header>

                        <ul className="db-notifs">
                            {notifications.map((n) => (
                                <li key={n.id} className="db-notif">
                                    <span className="db-notif-icon">
                                        <n.icon size={16} />
                                    </span>
                                    <div className="db-notif-body">
                                        <strong>{n.title}</strong>
                                        <span>{n.desc}</span>
                                        <em>{n.time}</em>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="db-card">
                        <header className="db-card-head">
                            <h2>Accès rapides</h2>
                        </header>
                        <div className="db-shortcuts">
                            <Link to="/documents" className="db-shortcut">
                                <FolderOpen size={18} />
                                <span>Documents</span>
                            </Link>
                            <Link to="/contrats" className="db-shortcut">
                                <ShieldCheck size={18} />
                                <span>Contrats</span>
                            </Link>
                            <Link to="/devis" className="db-shortcut">
                                <FileText size={18} />
                                <span>Devis</span>
                            </Link>
                            <Link to="/profil" className="db-shortcut">
                                <TrendingUp size={18} />
                                <span>Profil</span>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>

            <DevisModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDevisCreated={() => {
                    setIsModalOpen(false);
                    navigate("/devis");
                }}
            />
        </div>
    );
}

export default Dashboard;