export default function FormInput({ label, erro, ...propsInput }) {
  const idErro = `${propsInput.name}-erro`;

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={propsInput.name}>
        {label}
        {propsInput.required && <span className="obrigatorio"> *</span>}
      </label>
      <input
        id={propsInput.name}
        className={erro ? 'form-input form-input--erro' : 'form-input'}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? idErro : undefined}
        {...propsInput}
      />
      {erro && (
        <span id={idErro} className="form-erro" role="alert">
          {erro}
        </span>
      )}
    </div>
  );
}
