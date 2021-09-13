import React from 'react';

const LinkButton = ({ onClick, href, children }, ref) => (
  <a
    href={href}
    onClick={onClick}
    ref={ref}
    className="bg-purple-500 text-white px-4 py-2 font-medium mt-6 rounded-xl uppercase w-full block text-center"
  >
    {children}
  </a>
);

export default React.forwardRef(LinkButton);
