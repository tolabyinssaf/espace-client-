function Input({
    label,
    type = "text",
    name,
    placeholder,
    value,
    onChange,
    error
}) {
    return (
        <div className="form-group">
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

            {error && (
                <small className="error-message">
                    {error}
                </small>
            )}
        </div>
    );
}

export default Input;