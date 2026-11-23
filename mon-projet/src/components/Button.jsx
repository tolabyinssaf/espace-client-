function Button({ children, type = "submit", loading = false }) {
    return (
        <button
            type={type}
            className="login-button"
            disabled={loading}
        >
            {loading ? "Connexion..." : children}
        </button>
    );
}

export default Button;