import { useState } from "react";
import {
    CreditCard,
    Wallet,
    CalendarDays,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Download,
    Receipt,
    TrendingUp,
    Search,
    ChevronRight,
    ShieldCheck,
    Car,
    Home,
    HeartPulse,
    ArrowUpRight,
} from "lucide-react";
import "../styles/paiements.css";

const payments = [
    {
        id: 1,
        name: "Assurance Auto",
        ref: "CT-2026-AUTO-001",
        icon: Car,
        tone: "blue",
        amount: "4 500 MAD",
        date: "2026-10-01",
        dueDate: "2026-11-01",
        method: "Carte bancaire •••• 4242",
        status: "a_venir",
    },
    {
        id: 2,
        name: "Assurance Habitation",
        ref: "CT-2026-HAB-002",
        icon: Home,
        tone: "green",
        amount: "2 300 MAD",
        date: "2026-09-01",
        method: "Virement bancaire",
        status: "paye",
    },
    {
        id: 3,
        name: "Mutuelle Santé",
        ref: "CT-2026-SAN-003",
        icon: HeartPulse,
        tone: "pink",
        amount: "1 800 MAD",
        date: "2026-08-01",
        method: "Carte bancaire •••• 4242",
        status: "paye",
    },
    {
        id: 4,
        name: "Assurance Auto",
        ref: "CT-2026-AUTO-001",
        icon: Car,
        tone: "blue",
        amount: "4 500 MAD",
        date: "2026-09-01",
        method: "Carte bancaire •••• 4242",
        status: "paye",
    },
    {
        id: 5,
        name: "Assurance Habitation",
        ref: "CT-2026-HAB-002",
        icon: Home,
        tone: "green",
        amount: "2 300 MAD",
        date: "2026-08-01",
        method: "Virement bancaire",
        status: "paye",
    },
];

const formatDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const statusMap = {
    paye: { label: "Payé", tone: "green", icon: CheckCircle2 },
    a_venir: { label: "À venir", tone: "orange", icon: Clock },
    retard: { label: "En retard", tone: "red", icon: AlertTriangle },
};

function Paiements() {
    const [filter, setFilter] = useState("tous");
    const [query, setQuery] = useState("");

    const filters = [
        { key: "tous", label: "Tous" },
        { key: "paye", label: "Payés" },
        { key: "a_venir", label: "À venir" },
        { key: "retard", label: "En retard" },
    ];

    const counts = (key) =>
        key === "tous"
            ? payments.length
            : payments.filter((p) => p.status === key).length;

    const visible = payments
        .filter((p) => filter === "tous" || p.status === filter)
        .filter((p) => {
            const q = query.trim().toLowerCase();
            if (!q) return true;
            return (
                p.name.toLowerCase().includes(q) ||
                p.ref.toLowerCase().includes(q)
            );
        });

    const totalPaye = payments
        .filter((p) => p.status === "paye")
        .reduce((sum, p) => sum + parseInt(p.amount.replace(/\D/g, ""), 10), 0);

    const totalAVenir = payments
        .filter((p) => p.status === "a_venir")
        .reduce((sum, p) => sum + parseInt(p.amount.replace(/\D/g, ""), 10), 0);

    const formatMAD = (n) =>
        `${n.toLocaleString("fr-FR").replace(/\u202f/g, " ")} MAD`;

    return (
        <div className="pm-page">
            <header className="pm-header">
                <div>
                    <h1 className="pm-title">Mes paiements</h1>
                    <p className="pm-subtitle">
                        Suivez vos paiements, téléchargez vos reçus et réglez vos échéances
                    </p>
                </div>
            </header>

            <div className="pm-stats">
                <div className="pm-stat tone-blue">
                    <span className="pm-stat-icon">
                        <Wallet size={19} />
                    </span>
                    <div>
                        <span className="pm-stat-label">Total payé</span>
                        <strong className="pm-stat-value">{formatMAD(totalPaye)}</strong>
                    </div>
                </div>
                <div className="pm-stat tone-orange">
                    <span className="pm-stat-icon">
                        <Clock size={19} />
                    </span>
                    <div>
                        <span className="pm-stat-label">À venir</span>
                        <strong className="pm-stat-value">{formatMAD(totalAVenir)}</strong>
                    </div>
                </div>
                <div className="pm-stat tone-green">
                    <span className="pm-stat-icon">
                        <Receipt size={19} />
                    </span>
                    <div>
                        <span className="pm-stat-label">Reçus disponibles</span>
                        <strong className="pm-stat-value">
                            {payments.filter((p) => p.status === "paye").length}
                        </strong>
                    </div>
                </div>
            </div>

            {payments.find((p) => p.status === "a_venir") && (
                <div className="pm-next">
                    <span className="pm-next-icon">
                        <AlertTriangle size={20} />
                    </span>
                    <div className="pm-next-text">
                        <strong>Prochaine échéance</strong>
                        <span>
                            Assurance Auto · <b>4 500 MAD</b> · à régler avant le 01 nov. 2026
                        </span>
                    </div>
                    <button className="pm-next-btn">
                        Payer <ArrowUpRight size={15} />
                    </button>
                </div>
            )}

            <div className="pm-toolbar">
                <div className="pm-search">
                    <Search size={17} />
                    <input
                        type="text"
                        placeholder="Rechercher un paiement ou un contrat..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="pm-filters" role="tablist">
                {filters.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={filter === key}
                        className={`pm-filter ${filter === key ? "active" : ""}`}
                        onClick={() => setFilter(key)}
                    >
                        {label} <span className="pm-filter-count">{counts(key)}</span>
                    </button>
                ))}
            </div>

            {visible.length === 0 ? (
                <div className="pm-empty">
                    <CreditCard size={36} />
                    <p>Aucun paiement trouvé</p>
                </div>
            ) : (
                <div className="pm-list">
                    {visible.map((p) => {
                        const s = statusMap[p.status];
                        const StatusIcon = s.icon;
                        const ToneIcon = p.icon;
                        return (
                            <article
                                key={p.id}
                                className={`pm-card tone-${p.tone} status-${p.status}`}
                            >
                                <span className="pm-card-icon">
                                    <ToneIcon size={22} />
                                </span>

                                <div className="pm-card-body">
                                    <div className="pm-card-top">
                                        <h2 className="pm-card-name">{p.name}</h2>
                                        <span className={`pm-badge ${s.tone}`}>
                                            <StatusIcon size={12} /> {s.label}
                                        </span>
                                    </div>
                                    <p className="pm-card-ref">{p.ref}</p>
                                    <p className="pm-card-meta">
                                        <CalendarDays size={13} />
                                        {p.status === "a_venir" ? (
                                            <>Échéance : {formatDate(p.dueDate)}</>
                                        ) : (
                                            <>Payé le {formatDate(p.date)}</>
                                        )}
                                        <span className="dot" />
                                        <CreditCard size={13} />
                                        {p.method}
                                    </p>
                                </div>

                                <div className="pm-card-end">
                                    <strong className="pm-card-amount">{p.amount}</strong>
                                    {p.status === "paye" ? (
                                        <button className="pm-icon-btn" title="Télécharger le reçu">
                                            <Download size={15} />
                                        </button>
                                    ) : (
                                        <button className="pm-pay-btn">
                                            Payer <ChevronRight size={14} />
                                        </button>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Paiements;