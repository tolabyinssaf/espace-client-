import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) {
            setError("Veuillez entrer une adresse email valide.");
            return;
        }
        setError("");
        setSubmitted(true);
    };

    return (
        <AuthLayout>
            <div className="login-header">
                <h1>Mot de passe oublié</h1>
                <p>Entrez votre email pour réinitialiser votre mot de passe</p>
            </div>

            {submitted ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <p style={{ color: "#0d9488", fontWeight: 600, marginBottom: "16px" }}>
                        ✓ Un email de réinitialisation a été envoyé si le compte existe.
                    </p>
                    <Link to="/login" style={{ color: "#0d9488", fontWeight: 600 }}>
                        Retour à la connexion
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Adresse email"
                        type="email"
                        placeholder="exemple@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={error}
                    />
                    <Button type="submit">Envoyer le lien</Button>
                    <div className="login-footer">
                        <Link to="/login">Retour à la connexion</Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}

export default ForgotPassword;
