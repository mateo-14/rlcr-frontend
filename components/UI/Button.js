const Button = ({ children, className = '', onClick, disabled }) => (
  <button
    className={`bg-purple-500 text-white px-4 py-2 font-medium rounded-xl uppercase ${className} disabled:opacity-50`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
export default Button;
