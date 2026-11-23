import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Car,
    Home,
    HeartPulse,
    CalendarDays,
    Wallet,
    ChevronRight,
    X,
    Download,
    FileText,
    Check,
    ShieldCheck,
    AlertTriangle,
    Clock,
    Repeat,
    Layers,
    MapPin,
    FilePlus2,
} from "lucide-react";
import "../styles/contrats.css";

const contracts = [
    {
        id: 1,
        type: "auto",
        name: "Assurance Auto",
        number: "CT-2026-AUTO-001",
        formule: "Tous risques",
        start: "2026-01-01",
        end: "2027-01-01",
        prime: 4500,
        paiement: "Mensuel",
        asset: { label: "Véhicule assuré", value: "Dacia Logan · 12345-A-6", icon: Car },
        garanties: [
            "Responsabilité civile",
            "Dommages tous accidents",
            "Vol et incendie",
            "Bris de glace",
            "Assistance 24h/24",
            "Protection du conducteur",
        ],
        documents: ["Attestation d'assurance", "Conditions générales", "Échéancier de paiement"],
    },
    {
        id: 2,
        type: "habitation",
        name: "Assurance Habitation",
        number: "CT-2026-HAB-002",
        formule: "Multirisque confort",
        start: "2026-06-01",
        end: "2027-06-01",
        prime: 2300,
        paiement: "Annuel",
        asset: { label: "Bien assuré", value: "123 Rue de l'Assurance, Casablanca", icon: MapPin },
        garanties: [
            "Incendie et explosion",
            "Dégâts des eaux",
            "Vol et vandalisme",
            "Bris de glace",
            "Responsabilité civile",
            "Catastrophes naturelles",
        ],
        documents: ["Attestation d'assurance", "Conditions générales"],
    },
    {
        id: 3,
        type: "sante",
        name: "Mutuelle Santé",
        number: "CT-2025-SAN-003",
        formule: "Famille essentielle",
        start: "2025-03-01",
        end: "2026-03-01",
        prime: 1800,
        paiement: "Trimestriel",
        asset: { label: "Bénéficiaires", value: "Titulaire + 2 ayants droit", icon: ShieldCheck },
        garanties: ["Hospitalisation", "Consultations", "Pharmacie", "Dentaire", "Optique"],
        documents: ["Attestation de couverture", "Conditions générales"],
    },
];

const typeIcons = { auto: Car, habitation: Home, sante: HeartPulse };

const parseDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
};

const formatDate = (iso, short = false) =>
    parseDate(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: short ? "short" : "long",
        year: "numeric",
    });

const formatMoney = (n) => `${n.toLocaleString("fr-FR")} MAD`;

const DAY = 24 * 60 * 60 * 1000;

function getStatus(contract) {
    const now = new Date();
    const start = parseDate(contract.start);
    const end = parseDate(contract.end);
    const total = end - start;
    const elapsed = Math.min(Math.max(now - start, 0), total);
    const daysLeft = Math.ceil((end - now) / DAY);

    if (daysLeft <= 0) {
        return { key: "expire", label: "Expiré", progress: 100, daysLeft: 0 };
    }
    if (daysLeft <= 60) {
        return {
            key: "bientot",
            label: "Expire bientôt",
            progress: (elapsed / total) * 100,
            daysLeft,
        };
    }
    return { key: "actif", label: "Actif", progress: (elapsed / total) * 100, daysLeft };
}

function StatusBadge({ status }) {
    const Icon = status.key === "actif" ? Check : status.key === "bientot" ? Clock : AlertTriangle;
    return (
        <span className={`ct-badge ${status.key}`}>
            <Icon size={12} /> {status.label}
        </span>
    );
}

function Progress({ status }) {
    return (
        <div className="ct-progress">
            <div className="ct-progress-bar">
                <span
                    className={`ct-progress-fill ${status.key}`}
                    style={{ width: `${status.progress}%` }}
                />
            </div>
            <p className="ct-progress-text">
                {status.key === "expire"
                    ? "Contrat terminé"
                    : `Il reste ${status.daysLeft} jour${status.daysLeft > 1 ? "s" : ""}`}
            </p>
        </div>
    );
}

function ContractModal({ contract, onClose }) {
    const navigate = useNavigate();
    const status = getStatus(contract);
    const TypeIcon = typeIcons[contract.type];
    const AssetIcon = contract.asset.icon;

    const infos = [
        { icon: Layers, label: "Formule", value: contract.formule },
        { icon: Wallet, label: "Prime annuelle", value: formatDate && formatMoney(contract.prime) },
        { icon: Repeat, label: "Paiement", value: contract.paiement },
        { icon: CalendarDays, label: "Date de début", value: formatDate(contract.start) },
        { icon: CalendarDays, label: "Date d'échéance", value: formatDate(contract.end) },
        { icon: AssetIcon, label: contract.asset.label, value: contract.asset.value },
    ];

    return (
        <div className="ct-overlay" onClick={onClose}>
            <div
                className="ct-modal"
                role="dialog"
                aria-modal="true"
                aria-label={`Détail du contrat ${contract.name}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* En-tête */}
                <div className={`ct-modal-head tone-${contract.type}`}>
                    <button
                        type="button"
                        className="ct-close"
                        onClick={onClose}
                        aria-label="Fermer"
                        title="Fermer"
                    >
                        <X size={18} />
                    </button>

                    <span className="ct-modal-icon">
                        <TypeIcon size={26} />
                    </span>
                    <div className="ct-modal-head-text">
                        <h2>{contract.name}</h2>
                        <p>N° {contract.number}</p>
                    </div>
                    <StatusBadge status={status} />
                </div>

                <div className="ct-modal-body">
                    {/* Progression */}
                    <section className="ct-section">
                        <Progress status={status} />
                    </section>

                    {/* Informations */}
                    <section className="ct-section">
                        <h3 className="ct-section-title">Informations du contrat</h3>
                        <div className="ct-info-grid">
                            {infos.map(({ icon: Icon, label, value }) => (
                                <div className="ct-info" key={label}>
                                    <span className="ct-info-icon">
                                        <Icon size={17} />
                                    </span>
                                    <div>
                                        <span className="ct-info-label">{label}</span>
                                        <strong className="ct-info-value">{value}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="ct-section">
                        <h3 className="ct-section-title">Garanties incluses</h3>
                        <ul className="ct-garanties">
                            {contract.garanties.map((g) => (
                                <li key={g}>
                                    <span className="ct-check">
                                        <Check size={13} strokeWidth={3} />
                                    </span>
                                    {g}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="ct-section">
                        <h3 className="ct-section-title">Documents</h3>
                        <ul className="ct-docs">
                            {contract.documents.map((doc) => (
                                <li key={doc}>
                                    <span className="ct-doc-icon">
                                        <FileText size={18} />
                                    </span>
                                    <span className="ct-doc-name">{doc}</span>
                                    <button
                                        type="button"
                                        className="ct-icon-btn"
                                        aria-label={`Télécharger ${doc}`}
                                        title="Télécharger"
                                        onClick={() => {
                                        }}
                                    >
                                        <Download size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="ct-modal-foot">
                    {status.key === "expire" ? (
                        <button
                            type="button"
                            className="ct-btn ct-btn-primary"
                            onClick={() => navigate("/devis")}
                        >
                            <FilePlus2 size={17} /> Demander un nouveau devis
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="ct-btn ct-btn-primary"
                            onClick={() => navigate("/sinistres")}
                        >
                            <AlertTriangle size={17} /> Déclarer un sinistre
                        </button>
                    )}
                    <button type="button" className="ct-btn ct-btn-ghost" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}

function Contrats() {
    const [filter, setFilter] = useState("tous");
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (!selected) return undefined;
        const onKey = (e) => e.key === "Escape" && setSelected(null);
        const previousOverflow = document.body.style.overflow;
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [selected]);

    const withStatus = useMemo(
        () => contracts.map((c) => ({ ...c, status: getStatus(c) })),
        []
    );

    const actifs = withStatus.filter((c) => c.status.key !== "expire");
    const expires = withStatus.filter((c) => c.status.key === "expire");

    const visible =
        filter === "actifs" ? actifs : filter === "expires" ? expires : withStatus;

    const totalPrime = actifs.reduce((sum, c) => sum + c.prime, 0);
    const nextEnd = actifs.length
        ? actifs.map((c) => c.end).sort()[0]
        : null;

    const stats = [
        { icon: ShieldCheck, label: "Contrats actifs", value: actifs.length, tone: "blue" },
        { icon: Wallet, label: "Prime annuelle", value: formatMoney(totalPrime), tone: "green" },
        {
            icon: CalendarDays,
            label: "Prochaine échéance",
            value: nextEnd ? formatDate(nextEnd, true) : "—",
            tone: "orange",
        },
    ];

    const filters = [
        { key: "tous", label: "Tous", count: withStatus.length },
        { key: "actifs", label: "Actifs", count: actifs.length },
        { key: "expires", label: "Expirés", count: expires.length },
    ];

    return (
        <div className="ct-page">
            <header className="ct-header">
                <h1 className="ct-title">Mes contrats</h1>
                <p className="ct-subtitle">
                    Consultez le détail de vos contrats d'assurance
                </p>
            </header>

            {/* Résumé */}
            <div className="ct-stats">
                {stats.map(({ icon: Icon, label, value, tone }) => (
                    <div className={`ct-stat tone-${tone}`} key={label}>
                        <span className="ct-stat-icon">
                            <Icon size={19} />
                        </span>
                        <div>
                            <span className="ct-stat-label">{label}</span>
                            <strong className="ct-stat-value">{value}</strong>
                        </div>
                    </div>
                ))}
            </div>

            <div className="ct-filters" role="tablist">
                {filters.map(({ key, label, count }) => (
                    <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={filter === key}
                        className={`ct-filter ${filter === key ? "active" : ""}`}
                        onClick={() => setFilter(key)}
                    >
                        {label} <span className="ct-filter-count">{count}</span>
                    </button>
                ))}
            </div>

            {visible.length === 0 ? (
                <div className="ct-empty">
                    <ShieldCheck size={34} />
                    <p>Aucun contrat dans cette catégorie</p>
                </div>
            ) : (
                <div className="ct-grid">
                    {visible.map((contract) => {
                        const TypeIcon = typeIcons[contract.type];
                        return (
                            <article className="ct-card" key={contract.id}>
                                <div className="ct-card-top">
                                    <span className={`ct-type-icon tone-${contract.type}`}>
                                        <TypeIcon size={22} />
                                    </span>
                                    <StatusBadge status={contract.status} />
                                </div>

                                <h2 className="ct-card-name">{contract.name}</h2>
                                <p className="ct-card-number">N° {contract.number}</p>

                                <div className="ct-card-row">
                                    <CalendarDays size={16} />
                                    <span>
                                        {formatDate(contract.start, true)} →{" "}
                                        {formatDate(contract.end, true)}
                                    </span>
                                </div>

                                <Progress status={contract.status} />

                                <div className="ct-card-prime">
                                    <span>Prime annuelle</span>
                                    <strong>{formatMoney(contract.prime)}</strong>
                                </div>

                                <button
                                    type="button"
                                    className="ct-detail-btn"
                                    onClick={() => setSelected(contract)}
                                >
                                    Voir le détail <ChevronRight size={16} />
                                </button>
                            </article>
                        );
                    })}
                </div>
            )}

            {selected && (
                <ContractModal contract={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
}

export default Contrats;