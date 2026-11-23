import { useEffect, useMemo, useState } from "react";
import { getDevis } from "../services/devisService";
import DevisModal from "../components/DevisModal";
import "../styles/devis.css";

const Svg = ({ children, size = 20, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
    >
        {children}
    </svg>
);

const IconGrid = (p) => (
    <Svg {...p}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Svg>
);
const IconList = (p) => (
    <Svg {...p}>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </Svg>
);
const IconSearch = (p) => (
    <Svg {...p}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </Svg>
);
const IconPlus = (p) => (
    <Svg {...p}>
        <path d="M12 5v14M5 12h14" />
    </Svg>
);
const IconCar = (p) => (
    <Svg {...p}>
        <path d="M5 17h14M6 17v2M18 17v2" />
        <path d="M4 17v-4l2-5a2 2 0 0 1 1.9-1.4h8.2A2 2 0 0 1 18 8l2 5v4" />
        <path d="M4 13h16" />
        <circle cx="7.5" cy="14.5" r=".6" fill="currentColor" />
        <circle cx="16.5" cy="14.5" r=".6" fill="currentColor" />
    </Svg>
);
const IconHome = (p) => (
    <Svg {...p}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-5h4v5" />
    </Svg>
);
const IconHeart = (p) => (
    <Svg {...p}>
        <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1Z" />
        <path d="M6 12h3l1.5-3 3 6 1.5-3H18" />
    </Svg>
);
const IconShield = (p) => (
    <Svg {...p}>
        <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
    </Svg>
);
const IconClock = (p) => (
    <Svg {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
    </Svg>
);
const IconCheck = (p) => (
    <Svg {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </Svg>
);
const IconX = (p) => (
    <Svg {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6M15 9l-6 6" />
    </Svg>
);
const IconCalendar = (p) => (
    <Svg {...p}>
        <rect x="3" y="5" width="18" height="16" rx="2.5" />
        <path d="M3 10h18M8 3v4M16 3v4" />
    </Svg>
);
const IconCoins = (p) => (
    <Svg {...p}>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </Svg>
);
const IconChevron = (p) => (
    <Svg {...p}>
        <path d="m9 6 6 6-6 6" />
    </Svg>
);

const getStatusInfo = (statut) => {
    const s = (statut || "").toLowerCase();
    if (s.includes("accept")) return { className: "status-accepte", Icon: IconCheck };
    if (s.includes("refus")) return { className: "status-refuse", Icon: IconX };
    return { className: "status-attente", Icon: IconClock };
};

const getProductInfo = (produit) => {
    const p = (produit || "").toLowerCase();
    if (p.includes("auto")) return { className: "product-auto", Icon: IconCar };
    if (p.includes("habitation")) return { className: "product-habitation", Icon: IconHome };
    if (p.includes("sant")) return { className: "product-sante", Icon: IconHeart };
    return { className: "product-autre", Icon: IconShield };
};

const formatMontant = (montant) => {
    const n = Number(montant);
    return Number.isNaN(n) ? montant : n.toLocaleString("en-US");
};

function Devis() {
    const [devis, setDevis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [view, setView] = useState("cards");
    const [search, setSearch] = useState("");

    const chargerDevis = async (initial = false) => {
        if (initial) setLoading(true);
        setError("");

        try {
            const data = await getDevis();
            setDevis(data);
        } catch (err) {
            console.error("Erreur lors du chargement des devis :", err);
            setError("Impossible de charger les devis pour le moment.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerDevis(true);
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return devis;
        return devis.filter((d) =>
            [d.numero, d.produit, d.statut, d.date]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q))
        );
    }, [devis, search]);

    const voirDevis = (item) =>
        alert(
            `Détails du devis ${item.numero} :\nProduit : ${item.produit}\nMontant : ${item.montant} MAD\nStatut : ${item.statut}`
        );

    const renderEmpty = () => (
        <div className="devis-empty">
            {devis.length === 0 ? (
                <>
                    Aucun devis disponible pour le moment. Cliquez sur{" "}
                    <strong>« Demander un devis »</strong> pour en créer un.
                    <div>
                        <button
                            type="button"
                            className="devis-request-button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Demander un devis
                        </button>
                    </div>
                </>
            ) : (
                <>Aucun devis ne correspond à votre recherche.</>
            )}
        </div>
    );

    return (
        <div className="devis-page">
            <div className="devis-header">
                <div>
                    <h1>Mes devis</h1>
                    <p>Consultez et gérez l'ensemble de vos devis d'assurance</p>
                </div>

                <button
                    type="button"
                    className="devis-request-button"
                    onClick={() => setIsModalOpen(true)}
                >
                    <IconPlus size={17} />
                    Demander un devis
                </button>
            </div>

            {error && (
                <div className="devis-error">
                    <span>{error}</span>
                    <button type="button" onClick={() => chargerDevis(true)}>
                        Réessayer
                    </button>
                </div>
            )}

            <section className="devis-panel">
                <div className="devis-toolbar">
                    <div className="devis-toggle">
                        <button
                            type="button"
                            className={`devis-toggle-btn ${view === "cards" ? "active" : ""}`}
                            onClick={() => setView("cards")}
                            aria-pressed={view === "cards"}
                            aria-label="Vue en cartes"
                        >
                            <IconGrid size={18} />
                            <span>Vue en cartes</span>
                        </button>
                        <button
                            type="button"
                            className={`devis-toggle-btn ${view === "table" ? "active" : ""}`}
                            onClick={() => setView("table")}
                            aria-pressed={view === "table"}
                            aria-label="Vue en tableau"
                        >
                            <IconList size={18} />
                            <span>Vue en tableau</span>
                        </button>
                    </div>

                    <label className="devis-search">
                        <IconSearch size={17} />
                        <input
                            type="search"
                            placeholder="Rechercher un devis..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                </div>

                {loading ? (
                    <div className="devis-empty">Chargement de vos devis en cours...</div>
                ) : filtered.length === 0 ? (
                    renderEmpty()
                ) : view === "cards" ? (
                    <div className="devis-cards">
                        {filtered.map((item) => {
                            const status = getStatusInfo(item.statut);
                            const product = getProductInfo(item.produit);
                            const StatusIcon = status.Icon;
                            const ProductIcon = product.Icon;

                            return (
                                <article className="devis-card" key={item.id}>
                                    <div className="devis-card-top">
                                        <span className={`devis-card-icon ${product.className}`}>
                                            <ProductIcon size={26} />
                                        </span>
                                        <span className={`devis-status ${status.className}`}>
                                            <StatusIcon size={14} />
                                            {item.statut}
                                        </span>
                                    </div>

                                    <div className="devis-card-title">
                                        <h3>{item.produit}</h3>
                                        <span className="devis-card-number">{item.numero}</span>
                                    </div>

                                    <div className="devis-card-info">
                                        <div className="devis-info-row">
                                            <IconCalendar size={20} className="devis-info-icon" />
                                            <span className="devis-info-label">Date de création</span>
                                            <span className="devis-info-value">{item.date}</span>
                                        </div>

                                        <div className="devis-info-row">
                                            <IconCoins size={20} className="devis-info-icon" />
                                            <span className="devis-info-label">Montant</span>
                                            <span className="devis-info-value devis-amount">
                                                {formatMontant(item.montant)} MAD
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="devis-card-button"
                                        onClick={() => voirDevis(item)}
                                    >
                                        Voir <IconChevron size={16} />
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="devis-table-container">
                        <table className="devis-table">
                            <thead>
                                <tr>
                                    <th>Numéro</th>
                                    <th>Produit</th>
                                    <th>Date</th>
                                    <th>Montant</th>
                                    <th>Statut</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => {
                                    const status = getStatusInfo(item.statut);
                                    const StatusIcon = status.Icon;
                                    return (
                                        <tr key={item.id}>
                                            <td><strong>{item.numero}</strong></td>
                                            <td>{item.produit}</td>
                                            <td>{item.date}</td>
                                            <td>{formatMontant(item.montant)} MAD</td>
                                            <td>
                                                <span className={`devis-status ${status.className}`}>
                                                    <StatusIcon size={14} />
                                                    {item.statut}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="devis-view-button"
                                                    onClick={() => voirDevis(item)}
                                                >
                                                    Voir
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <DevisModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDevisCreated={() => chargerDevis(false)}
            />
        </div>
    );
}

export default Devis;