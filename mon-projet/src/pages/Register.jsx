import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import "../styles/register.css";
import gaby from "../assets/images/register3.png";

const ASSURANCES = [
    { value: "assurance_auto", label: "Auto" },
    { value: "assurance_moto", label: "Moto" },
    { value: "assurance_habitation", label: "Habitation" },
    { value: "assurance_emprunteur", label: "Emprunteur" },
    { value: "mutuelle_sante", label: "Mutuelle santé" },
];

function Field({ label, name, type = "text", placeholder, value, onChange, error }) {
    return (
        <div className="field">
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={error ? "input-error" : ""}
            />
            {error && <small className="error">{error}</small>}
        </div>
    );
}

function Register() {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        assurances: [],
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAssuranceChange = (e) => {
        const { value, checked } = e.target;

        setFormData({
            ...formData,
            assurances: checked
                ? [...formData.assurances, value]
                : formData.assurances.filter((a) => a !== value),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.nom.trim()) newErrors.nom = "Le nom est obligatoire.";
        if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire.";

        if (!formData.email.trim()) {
            newErrors.email = "L'adresse email est obligatoire.";
        } else if (!formData.email.includes("@")) {
            newErrors.email = "Veuillez entrer une adresse email valide.";
        }

        if (formData.assurances.length === 0) {
            newErrors.assurances = "Veuillez sélectionner au moins une assurance.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        console.log("Données du client :", formData);
        alert("Inscription réussie !");
    };

    return (
        <div className="login-page">
            <div className="login-frame register-frame">
                <div className="login-right">
                    <span className="cloud c4" />
                    <span className="cloud c5" />
                    <span className="cloud c6" />

                    <div className="login-form-wrap">
                        <h1>Créez votre espace</h1>
                        <p className="login-subtitle">
                            Quelques informations et c'est parti.
                        </p>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="field-row">
                                <Field
                                    label="Nom"
                                    name="nom"
                                    placeholder="Votre nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    error={errors.nom}
                                />
                                <Field
                                    label="Prénom"
                                    name="prenom"
                                    placeholder="Votre prénom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    error={errors.prenom}
                                />
                            </div>

                            <Field
                                label="Adresse e-mail"
                                name="email"
                                type="email"
                                placeholder="vous@exemple.fr"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />

                            <div className="insurance-section">
                                <span className="insurance-title">
                                    Quels produits vous intéressent ?
                                </span>

                                <div className="insurance-options">
                                    {ASSURANCES.map((a) => {
                                        const checked = formData.assurances.includes(a.value);
                                        return (
                                            <label
                                                key={a.value}
                                                className={`insurance-option ${checked ? "checked" : ""}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={a.value}
                                                    checked={checked}
                                                    onChange={handleAssuranceChange}
                                                />
                                                <span>{a.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>

                                {errors.assurances && (
                                    <small className="error">{errors.assurances}</small>
                                )}
                            </div>

                            <button type="submit" className="btn-login">
                                Créer mon compte
                            </button>
                        </form>

                        <p className="login-footer">
                            Vous avez déjà un compte ?
                            <Link to="/login">Se connecter</Link>
                        </p>
                    </div>
                </div>

                <div className="register-visual">
                    <img
                        src={gaby}
                        alt="Gaby, mascotte L'assureur du Var"
                    />
                </div>

                <svg
                    className="login-waves"
                    viewBox="0 0 1440 220"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        d="M0 90 C 200 40, 380 40, 560 90 S 900 130, 1100 80 S 1350 30, 1440 60 L1440 220 L0 220 Z"
                        fill="#b9e3fb"
                    />
                    <path
                        d="M0 120 C 220 70, 420 70, 620 120 S 980 160, 1200 110 S 1380 70, 1440 90 L1440 220 L0 220 Z"
                        fill="#0161B9"
                    />
                    <path
                        d="M820 220 C 1000 190, 1200 130, 1440 20 L1440 70 C 1300 130, 1100 190, 960 220 Z"
                        fill="#ff7a00"
                    />
                </svg>
            </div>
        </div>
    );
}

export default Register;