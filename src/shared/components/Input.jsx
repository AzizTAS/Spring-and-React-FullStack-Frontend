export function Input(props) {
  const { id, label, error, onChange, type, defaultValue } = props;

return (
  <div className="mb-3">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <input
      id={id}
      className={error ? "form-control is-invalid" : "form-control"}
      onChange={onChange}
      type={type}
      defaultValue={defaultValue}
    />
    <div className="invalid-feedback">{error}</div>
  </div>
);
}