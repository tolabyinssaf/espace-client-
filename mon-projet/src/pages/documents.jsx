import { useEffect, useMemo, useRef, useState } from "react";
import {
    Search,
    Download,
    Eye,
    Trash2,
    UploadCloud,
    FileText,
    ShieldCheck,
    BadgeCheck,
    Receipt,
    User,
    FolderOpen,
    HardDrive,
    Paperclip,
    CalendarDays,
    Check,
} from "lucide-react";
import "../styles/documents.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; 
const ALLOWED_EXT = ["pdf", "jpg", "jpeg", "png", "webp", "doc", "docx"];

const categories = [
    { key: "contrat", label: "Contrats", icon: ShieldCheck },
    { key: "attestation", label: "Attestations", icon: BadgeCheck },
    { key: "facture", label: "Factures", icon: Receipt },
    { key: "devis", label: "Devis", icon: FileText },
    { key: "piece", label: "Mes pièces", icon: User },
];

const categoryMap = Object.fromEntries(categories.map((c) => [c.key, c]));

const seedDocuments = [
    { id: 1, name: "Contrat Assurance Auto", category: "contrat", date: "2026-01-01", size: 482000, ext: "pdf", ref: "CT-2026-AUTO-001" },
    { id: 2, name: "Attestation d'assurance Auto", category: "attestation", date: "2026-01-01", size: 118000, ext: "pdf", ref: "CT-2026-AUTO-001" },
    { id: 3, name: "Contrat Assurance Habitation", category: "contrat", date: "2026-06-01", size: 536000, ext: "pdf", ref: "CT-2026-HAB-002" },
    { id: 4, name: "Attestation d'assurance Habitation", category: "attestation", date: "2026-06-01", size: 121000, ext: "pdf", ref: "CT-2026-HAB-002" },
    { id: 5, name: "Facture Assurance Auto · Octobre 2026", category: "facture", date: "2026-10-01", size: 86000, ext: "pdf", ref: "CT-2026-AUTO-001" },
    { id: 6, name: "Facture Assurance Auto · Septembre 2026", category: "facture", date: "2026-09-01", size: 85000, ext: "pdf", ref: "CT-2026-AUTO-001" },
    { id: 7, name: "Devis Assurance Auto", category: "devis", date: "2026-09-05", size: 94000, ext: "pdf", ref: "DEV-2026-001" },
    { id: 8, name: "Devis Assurance Habitation", category: "devis", date: "2026-09-02", size: 91000, ext: "pdf", ref: "DEV-2026-002" },
];



const formatDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
};

const todayISO = () => {
    const n = new Date();
    const pad = (v) => String(v).padStart(2, "0");
    return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
};

function Documents() {
    const fileInputRef = useRef(null);

    const [docs, setDocs] = useState(seedDocuments);
    const [filter, setFilter] = useState("tous");
    const [query, setQuery] = useState("");
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    useEffect(() => {
        if (!toast) return undefined;
        const t = setTimeout(() => setToast(""), 2600);
        return () => clearTimeout(t);
    }, [toast]);

    const addFiles = (fileList) => {
        const files = Array.from(fileList || []);
        if (!files.length) return;

        const added = [];
        let problem = "";

        files.forEach((file, i) => {
            const ext = file.name.split(".").pop().toLowerCase();
            if (!ALLOWED_EXT.includes(ext)) {
                problem = `« ${file.name} » : format non accepté (PDF, JPG, PNG, WEBP, DOC, DOCX).`;
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                problem = `« ${file.name} » est trop lourd (10 Mo maximum).`;
                return;
            }
            added.push({
                id: Date.now() + i,
                name: file.name.replace(/\.[^.]+$/, ""),
                category: "piece",
                date: todayISO(),
                size: file.size,
                ext,
                ref: "Ajouté par vous",
                uploaded: true,
                url: URL.createObjectURL(file),
            });
        });

        setError(problem);
        if (added.length) {
            setDocs((prev) => [...added, ...prev]);
            setToast(
                added.length > 1
                    ? `${added.length} documents ajoutés`
                    : "Document ajouté"
            );
        }
    };

    const handleInputChange = (e) => {
        addFiles(e.target.files);
        e.target.value = ""; 
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const previewDoc = (doc) => {
        if (doc.url) {
            window.open(doc.url, "_blank", "noopener,noreferrer");
        } else {
            setToast("Aperçu indisponible : document de démonstration");
        }
    };

    const downloadDoc = (doc) => {
        if (doc.url) {
            const a = document.createElement("a");
            a.href = doc.url;
            a.download = `${doc.name}.${doc.ext}`;
            a.click();
            setToast("Téléchargement lancé");
        } else {
            setToast("Téléchargement indisponible : document de démonstration");
        }
    };

    const deleteDoc = (doc) => {
        if (doc.url) URL.revokeObjectURL(doc.url);
        setDocs((prev) => prev.filter((d) => d.id !== doc.id));
        setToast("Document supprimé");
        
    };

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return docs
            .filter((d) => filter === "tous" || d.category === filter)
            .filter(
                (d) =>
                    !q ||
                    d.name.toLowerCase().includes(q) ||
                    d.ref.toLowerCase().includes(q)
            )
            .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id));
    }, [docs, filter, query]);

    const uploadedCount = docs.filter((d) => d.uploaded).length;
    const totalSize = docs.reduce((sum, d) => sum + d.size, 0);

    const stats = [
        { icon: FolderOpen, label: "Documents", value: docs.length, tone: "blue" },
        { icon: Paperclip, label: "Pièces ajoutées", value: uploadedCount, tone: "green" },
        { icon: HardDrive, label: "Taille totale", value: formatSize(totalSize), tone: "orange" },
    ];

    const counts = (key) =>
        key === "tous" ? docs.length : docs.filter((d) => d.category === key).length;

    return (
        <div className="dc-page">
            <header className="dc-header">
                <h1 className="dc-title">Mes documents</h1>
                <p className="dc-subtitle">
                    Retrouvez vos contrats, attestations, factures et vos pièces justificatives
                </p>
            </header>

            <div className="dc-stats">
                {stats.map(({ icon: Icon, label, value, tone }) => (
                    <div className={`dc-stat tone-${tone}`} key={label}>
                        <span className="dc-stat-icon">
                            <Icon size={19} />
                        </span>
                        <div>
                            <span className="dc-stat-label">{label}</span>
                            <strong className="dc-stat-value">{value}</strong>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className={`dc-drop ${dragging ? "dragging" : ""}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                <span className="dc-drop-icon">
                    <UploadCloud size={26} />
                </span>
                <div className="dc-drop-text">
                    <strong>Glissez vos fichiers ici</strong>
                    <span>PDF, JPG, PNG, WEBP, DOC ou DOCX · 10 Mo maximum</span>
                </div>
                <button
                    type="button"
                    className="dc-btn"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadCloud size={17} /> Parcourir
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ALLOWED_EXT.map((e) => `.${e}`).join(",")}
                    className="dc-file-input"
                    onChange={handleInputChange}
                />
            </div>

            {error && (
                <p className="dc-error" role="alert">
                    {error}
                </p>
            )}

            <div className="dc-toolbar">
                <div className="dc-search">
                    <Search size={17} />
                    <input
                        type="text"
                        placeholder="Rechercher un document ou un contrat..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="dc-filters" role="tablist">
                {[{ key: "tous", label: "Tous" }, ...categories].map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={filter === key}
                        className={`dc-filter ${filter === key ? "active" : ""}`}
                        onClick={() => setFilter(key)}
                    >
                        {label} <span className="dc-filter-count">{counts(key)}</span>
                    </button>
                ))}
            </div>

            {/* Liste */}
            {visible.length === 0 ? (
                <div className="dc-empty">
                    <FolderOpen size={36} />
                    <p>Aucun document trouvé</p>
                </div>
            ) : (
                <div className="dc-grid">
                    {visible.map((doc) => {
                        const cat = categoryMap[doc.category];
                        const CatIcon = cat.icon;
                        return (
                            <article className={`dc-card cat-${doc.category}`} key={doc.id}>
                                <span className="dc-file-icon">
                                    <CatIcon size={22} />
                                    <em>{doc.ext.toUpperCase()}</em>
                                </span>

                                <div className="dc-card-body">
                                    <h2 className="dc-card-name" title={doc.name}>
                                        {doc.name}
                                    </h2>
                                    <span className="dc-cat-badge">{cat.label}</span>
                                    <p className="dc-card-meta">
                                        <CalendarDays size={13} /> {formatDate(doc.date)}
                                        <span className="dot" />
                                        {formatSize(doc.size)}
                                    </p>
                                    <p className="dc-card-ref">{doc.ref}</p>
                                </div>

                                <div className="dc-actions">
                                    <button
                                        type="button"
                                        className="dc-icon-btn"
                                        onClick={() => previewDoc(doc)}
                                        aria-label={`Aperçu de ${doc.name}`}
                                        title="Aperçu"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className="dc-icon-btn"
                                        onClick={() => downloadDoc(doc)}
                                        aria-label={`Télécharger ${doc.name}`}
                                        title="Télécharger"
                                    >
                                        <Download size={16} />
                                    </button>
                                    {doc.uploaded && (
                                        <button
                                            type="button"
                                            className="dc-icon-btn danger"
                                            onClick={() => deleteDoc(doc)}
                                            aria-label={`Supprimer ${doc.name}`}
                                            title="Supprimer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

             {toast && (
                <div className="dc-toast" role="status">
                    <Check size={16} /> {toast}
                </div>
            )}
        </div>
    );
}

export default Documents;