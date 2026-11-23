import React from "react";

function Parametres() {
  return (
    <div className="page-container">
      <h1>Paramètres</h1>
      <p>Préférences et sécurité</p>
      <div style={{ background: "white", padding: "24px", borderRadius: "12px", marginTop: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <h3>Notifications</h3>
        <p>Recevoir des alertes par email</p>
        <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #f1f5f9" }} />
        <h3>Sécurité</h3>
        <p>Changer votre mot de passe</p>
      </div>
    </div>
  );
}

export default Parametres;