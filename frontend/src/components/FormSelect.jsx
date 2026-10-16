export default function FormSelect({ label, erro, children, ...propsSelect }) {
  const idErro = `${propsSelect.name}-erro`;

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={propsSelect.name}>
        {label}
        {propsSelect.required && <span className="obrigatorio"> *</span>}
      </label>
      <select
        id={propsSelect.name}
        className={erro ? 'form-input form-input--erro' : 'form-input'}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? idErro : undefined}
        {...propsSelect}
      >
        {children}
      </select>
      {erro && (
        <span id={idErro} className="form-erro" role="alert">
          {erro}
        </span>
      )}
    </div>
  );
}
