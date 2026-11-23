const images = import.meta.glob(
    "../assets/images/**/*.{png,jpg,jpeg,webp,svg}",
    { eager: true, import: "default" }
);

const findImage = (test) => {
    const key = Object.keys(images).find((path) => test(path.toLowerCase()));
    return key ? images[key] : null;
};

const logoSrc = findImage(
    (p) => p.includes("logo big") || p.includes("logo_big") || p.includes("logo-big")
);

function Logo({ collapsed = false }) {
    if (logoSrc) {
        return (
            <img
                src={logoSrc}
                alt="VAR L'assureur"
                className={`logo-img ${collapsed ? "collapsed" : ""}`}
            />
        );
    }

    return (
        <div className="logo-text">
            VAR {!collapsed && <small>L'assureur</small>}
        </div>
    );
}

export default Logo;