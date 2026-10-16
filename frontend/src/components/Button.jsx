export default function Button({ type = 'button', onClick, children, disabled, variante }) {
  const classe = variante === 'perigo' ? 'btn btn--perigo' : 'btn';

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classe}>
      {children}
    </button>
  );
}
