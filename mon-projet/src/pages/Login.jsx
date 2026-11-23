
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

const images = import.meta.glob(
    "../assets/images/**/*.{png,jpg,jpeg,webp,svg}",
    { eager: true, import: "default" }
);

const findImage = (test) => {
    const key = Object.keys(images).find((path) => test(path.toLowerCase()));
    return key ? images[key] : null;
};

const gabyDesktop = findImage((p) => p.includes("login2")); 
const gabyMobile = findImage((p) => p.includes("login3")); 

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "L'adresse email est obligatoire.";
        } else if (!email.includes("@")) {
            newErrors.email = "Veuillez entrer une adresse email valide.";
        }

        if (!password.trim()) {
            newErrors.password = "Le mot de passe est obligatoire.";
        } else if (password.length < 6) {
            newErrors.password =
                "Le mot de passe doit contenir au moins 6 caractères.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);

        setTimeout(() => {
            console.log("Email :", email);
            setLoading(false);
            alert("Formulaire valide !");
        }, 1000);
    };

    return (
        <div className="login-page">
            <div className="login-frame">
                <div className="login-left">
                    <span className="cloud c1" />
                    <span className="cloud c2" />
                    <span className="cloud c3" />
                    {gabyDesktop && (
                        <img
                            src={gabyDesktop}
                            alt="Gaby, mascotte L'assureur du Var"
                            className="login-gaby"
                        />
                    )}
                </div>

                <header className="login-mobile-top">
                    <h1>Bon retour !</h1>
                    <p className="login-mobile-subtitle">
                        Votre espace, en toute simplicité.
                    </p>
                    {gabyMobile && (
                        <img
                            src={gabyMobile}
                            alt="Gaby, mascotte L'assureur du Var"
                            className="login-gaby-mobile"
                        />
                    )}
                </header>

                <div className="login-right">
                    <span className="cloud c4" />
                    <span className="cloud c5" />

                    <div className="login-form-wrap">
                        <div className="login-head-desktop">
                            <h1>Bon retour !</h1>
                            <p className="login-subtitle">
                                Connectez-vous à votre espace personnel.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="field">
                                <label htmlFor="email">Adresse e-mail</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="vous@exemple.fr"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    className={errors.email ? "input-error" : ""}
                                />
                                {errors.email && (
                                    <small className="error">{errors.email}</small>
                                )}
                            </div>

                            <div className="field">
                                <label htmlFor="password">Mot de passe</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className={errors.password ? "input-error" : ""}
                                />
                                {errors.password && (
                                    <small className="error">{errors.password}</small>
                                )}
                            </div>

                            <div className="login-options">
                                <Link to="/forgot-password">Mot de passe oublié ?</Link>
                            </div>

                            <button type="submit" className="btn-login" disabled={loading}>
                                {loading ? "Connexion..." : "Se connecter"}
                            </button>
                        </form>

                        <p className="login-footer">
                            Première visite ? <Link to="/register">Créer un compte</Link>
                        </p>

                    </div>
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

export default Login;