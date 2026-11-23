import Logo from "../components/Logo";

function AuthLayout({ children }) {
    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    <Logo />
                </div>

                {children}

            </div>

        </div>
    );
}

export default AuthLayout;