import { useRef, useState } from "react";
import {
    Camera,
    ImagePlus,
    Trash2,
    Mail,
    Phone,
    MapPin,
    User,
    Pencil,
    Check,
    X,
} from "lucide-react";
import "../styles/profil.css";

const AVATAR_KEY = "profil_avatar";
const BANNER_KEY = "profil_banner";
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

const AVATAR_DIM = { w: 400, h: 400 };
const BANNER_DIM = { w: 1200, h: 360 };

const initialData = {
    nom: "Client Test",
    email: "client@email.com",
    telephone: "06 12 34 56 78",
    adresse: "123 Rue de l'Assurance, Casablanca",
};

const fields = [
    { key: "nom", label: "Nom complet", icon: User, type: "text", tone: "blue" },
    { key: "email", label: "Email", icon: Mail, type: "email", tone: "indigo" },
    { key: "telephone", label: "Téléphone", icon: Phone, type: "tel", tone: "green" },
    { key: "adresse", label: "Adresse", icon: MapPin, type: "text", tone: "orange", full: true },
];

function resizeImage(file, { w, h }) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                const targetRatio = w / h;
                let sw = img.width;
                let sh = img.height;

                if (img.width / img.height > targetRatio) {
                    sw = img.height * targetRatio;
                } else {
                    sh = img.width / targetRatio;
                }

                const sx = (img.width - sw) / 2;
                const sy = (img.height - sh) / 2;

                const canvas = document.createElement("canvas");
                canvas.width = w;
                canvas.height = h;
                canvas.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
                resolve(canvas.toDataURL("image/jpeg", 0.85));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

function readStored(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStored(key, value) {
    try {
        if (value) localStorage.setItem(key, value);
        else localStorage.removeItem(key);
    } catch {
    }
}

function getInitials(name) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");
}

function Profil() {
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const [avatar, setAvatar] = useState(() => readStored(AVATAR_KEY));
    const [banner, setBanner] = useState(() => readStored(BANNER_KEY));
    const [mediaError, setMediaError] = useState("");

    const [data, setData] = useState(initialData);
    const [draft, setDraft] = useState(initialData);
    const [editing, setEditing] = useState(false);

    const handleImage = async (e, { dim, setter, storageKey }) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // permet de re-choisir la même image
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMediaError("Veuillez choisir une image (JPG, PNG, WEBP).");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setMediaError("L'image est trop lourde (5 Mo maximum).");
            return;
        }

        try {
            const dataUrl = await resizeImage(file, dim);
            setter(dataUrl);
            setMediaError("");
            writeStored(storageKey, dataUrl);
        } catch {
            setMediaError("Impossible de lire cette image.");
        }
    };

    const handleAvatarChange = (e) =>
        handleImage(e, { dim: AVATAR_DIM, setter: setAvatar, storageKey: AVATAR_KEY });

    const handleBannerChange = (e) =>
        handleImage(e, { dim: BANNER_DIM, setter: setBanner, storageKey: BANNER_KEY });

    const removeAvatar = () => {
        setAvatar(null);
        setMediaError("");
        writeStored(AVATAR_KEY, null);
    };

    const removeBanner = () => {
        setBanner(null);
        setMediaError("");
        writeStored(BANNER_KEY, null);
    };

    const startEdit = () => {
        setDraft(data);
        setEditing(true);
    };

    const cancelEdit = () => {
        setDraft(data);
        setEditing(false);
    };

    const saveEdit = (e) => {
        e.preventDefault();
        setData(draft);
        setEditing(false);
    };

    return (
        <div className="pf-page">
           

            <div className="pf-grid">
                <section className="pf-card pf-identity">
                    <div
                        className={`pf-banner ${banner ? "has-image" : ""}`}
                        style={banner ? { backgroundImage: `url(${banner})` } : undefined}
                    >
                        <div className="pf-banner-actions">
                            <button
                                type="button"
                                className="pf-banner-btn"
                                onClick={() => bannerInputRef.current?.click()}
                                aria-label="Changer la bannière"
                                title="Changer la bannière"
                            >
                                <ImagePlus size={16} />
                            </button>

                            {banner && (
                                <button
                                    type="button"
                                    className="pf-banner-btn danger"
                                    onClick={removeBanner}
                                    aria-label="Supprimer la bannière"
                                    title="Supprimer la bannière"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            className="pf-file-input"
                            onChange={handleBannerChange}
                        />
                    </div>

                    <div className="pf-avatar-wrap">
                        <button
                            type="button"
                            className="pf-avatar"
                            onClick={() => avatarInputRef.current?.click()}
                            aria-label="Changer la photo de profil"
                        >
                            {avatar ? (
                                <img src={avatar} alt="Photo de profil" />
                            ) : (
                                <span className="pf-avatar-initials">
                                    {getInitials(data.nom) || <User size={40} />}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            className="pf-avatar-camera"
                            onClick={() => avatarInputRef.current?.click()}
                            aria-label="Changer la photo"
                            title="Changer la photo"
                        >
                            <Camera size={16} />
                        </button>

                        {avatar && (
                            <button
                                type="button"
                                className="pf-avatar-delete"
                                onClick={removeAvatar}
                                aria-label="Supprimer la photo"
                                title="Supprimer la photo"
                            >
                                <Trash2 size={15} />
                            </button>
                        )}

                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            className="pf-file-input"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <h2 className="pf-name">{data.nom}</h2>
                    <p className="pf-email">{data.email}</p>
                    <span className="pf-badge">Compte client</span>

                    {mediaError ? (
                        <p className="pf-error" role="alert">
                            {mediaError}
                        </p>
                    ) : (
                        <p className="pf-hint">JPG, PNG ou WEBP</p>
                    )}
                </section>

                <section className="pf-card pf-info">
                    <div className="pf-info-head">
                        <div>
                            <h2 className="pf-card-title">Informations personnelles</h2>
                            <p className="pf-card-sub">
                                Vos coordonnées utilisées pour vos devis et contrats
                            </p>
                        </div>

                        {!editing && (
                            <button
                                type="button"
                                className="pf-icon-btn"
                                onClick={startEdit}
                                aria-label="Modifier mes informations"
                                title="Modifier mes informations"
                            >
                                <Pencil size={17} />
                            </button>
                        )}
                    </div>

                    <form onSubmit={saveEdit}>
                        <div className="pf-fields">
                            {fields.map(({ key, label, icon: Icon, type, tone, full }) => (
                                <div
                                    key={key}
                                    className={`pf-tile tone-${tone} ${full ? "full" : ""} ${
                                        editing ? "is-editing" : ""
                                    }`}
                                >
                                    <span className="pf-tile-icon">
                                        <Icon size={19} />
                                    </span>

                                    <div className="pf-tile-body">
                                        <label htmlFor={`pf-${key}`}>{label}</label>

                                        {editing ? (
                                            <input
                                                id={`pf-${key}`}
                                                type={type}
                                                value={draft[key]}
                                                required
                                                onChange={(e) =>
                                                    setDraft({ ...draft, [key]: e.target.value })
                                                }
                                            />
                                        ) : (
                                            <p className="pf-tile-value">{data[key]}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {editing && (
                            <div className="pf-form-actions">
                                <button
                                    type="button"
                                    className="pf-btn pf-btn-ghost"
                                    onClick={cancelEdit}
                                >
                                    <X size={16} /> Annuler
                                </button>
                                <button type="submit" className="pf-btn pf-btn-primary">
                                    <Check size={16} /> Enregistrer
                                </button>
                            </div>
                        )}
                    </form>
                </section>
            </div>
        </div>
    );
}

export default Profil;