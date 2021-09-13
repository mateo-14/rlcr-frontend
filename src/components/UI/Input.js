const Input = ({
  value,
  max,
  min,
  onChange,
  onBlur,
  label,
  type,
  id,
  step,
  disabled,
  className,
  required,
  errors,
  maxLength,
  minLength,
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-lg text-white">
        {label}
      </label>
      <div className="mt-1 ">
        <input
          type={type}
          id={id}
          className={`bg-gray-600 border-none focus:outline-none rounded-xl w-full text-lg px-4 py-2 ${
            disabled ? 'text-gray-400' : 'text-gray-300 focus:text-white'
          }`}
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          step={step}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
        />
        <p className="text-red-500 font-semibold">{errors?.[id]?.msg}</p>
      </div>
    </div>
  );
};
export default Input;
