import { useState } from "react";
import { createDevis } from "../services/devisService";

function DevisModal({ isOpen, onClose, onDevisCreated }) {
    const [formData, setFormData] = useState({
        produit: "",
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        message: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.produit) {
            setError("Veuillez sélectionner un produit d'assurance.");
            return;
        }

        setSubmitting(true);
        setError("");

        const libellesProduits = {
            auto: "Assurance Auto",
            moto: "Assurance Moto",
            habitation: "Assurance Habitation",
            emprunteur: "Assurance Emprunteur",
            sante: "Mutuelle Santé"
        };

        const tarifsEstimes = {
            auto: 4500,
            moto: 2800,
            habitation: 2300,
            emprunteur: 3200,
            sante: 1800
        };

        const randomNum = Math.floor(100 + Math.random() * 900);
        const annee = new Date().getFullYear();

        const nouveauDevis = {
            numero: `DEV-${annee}-${randomNum}`,
            produit: libellesProduits[formData.produit] || formData.produit,
            date: new Date().toISOString().split("T")[0],
            montant: tarifsEstimes[formData.produit] || 2500,
            statut: "En attente",
            contact: {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                telephone: formData.telephone,
                message: formData.message
            }
        };

        try {
            await createDevis(nouveauDevis);
            if (onDevisCreated) {
                await onDevisCreated(nouveauDevis);
            }
            setFormData({
                produit: "",
                nom: "",
                prenom: "",
                email: "",
                telephone: "",
                message: ""
            });
            onClose();
        } catch (err) {
            console.error("Erreur création devis :", err);
            setError("Une erreur est survenue lors de l'enregistrement du devis.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="devis-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <div>
                        <h2>Demander un devis</h2>
                        <p>Remplissez les informations de votre demande.</p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Fermer"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="produit">
                            Produit d'assurance *
                        </label>

                        <select
                            id="produit"
                            name="produit"
                            value={formData.produit}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Sélectionner un produit
                            </option>
                            <option value="auto">Assurance Auto</option>
                            <option value="moto">Assurance Moto</option>
                            <option value="habitation">
                                Assurance Habitation
                            </option>
                            <option value="emprunteur">
                                Assurance Emprunteur
                            </option>
                            <option value="sante">
                                Mutuelle Santé
                            </option>
                        </select>
                    </div>

                    <div className="modal-row">
                        <div className="form-group">
                            <label htmlFor="nom">Nom</label>

                            <input
                                id="nom"
                                name="nom"
                                type="text"
                                placeholder="Votre nom"
                                value={formData.nom}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="prenom">Prénom</label>

                            <input
                                id="prenom"
                                name="prenom"
                                type="text"
                                placeholder="Votre prénom"
                                value={formData.prenom}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-row">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Votre email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="telephone">Téléphone</label>

                            <input
                                id="telephone"
                                name="telephone"
                                type="tel"
                                placeholder="Votre téléphone"
                                value={formData.telephone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">
                            Informations complémentaires
                        </label>

                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            placeholder="Décrivez votre demande..."
                            value={formData.message}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="modal-cancel"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="modal-submit"
                            disabled={submitting}
                        >
                            {submitting ? "Envoi en cours..." : "Envoyer la demande"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DevisModal;