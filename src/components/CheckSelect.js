import { useEffect, useRef, useState } from 'react';

export default function CheckSelect({ placeholder = '', options = [], onChange, containerClass, className }) {
  const ref = useRef();
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsShowing(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [ref]);

  const handleClick = () => setIsShowing(!isShowing);
  const handleChecked = (option) => typeof onChange === 'function' && onChange(option.id, !option.checked);

  return (
    <div className={`relative ${containerClass || ''}`} ref={ref}>
      <button
        className={`rounded-xl bg-gray-600 flex justify-between items-center ${
          isShowing ? 'text-white' : options.some((option) => option.checked) ? 'text-gray-300' : 'text-gray-300'
        } p-2 ${className || ''}`}
        onClick={handleClick}
      >
        {options.some((option) => option.checked)
          ? options
              .filter((option) => option.checked)
              .map((option) => option.text)
              .join(', ')
          : placeholder}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isShowing && (
        <ul className="absolute rounded-xl bg-gray-600 top-full mt-1 text-gray-300 shadow-xl">
          {options.map((option) => (
            <li className="hover:text-white cursor-pointer px-2 py-1" key={option.id}>
              <button className="flex items-center justify-between w-full" onClick={() => handleChecked(option)}>
                <span className="mr-2">{option.text}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${!option.checked ? 'invisible' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
