import React from 'react';
import { useRouter } from '../context/RouterContext';

interface LinkProps {
  to: string;
  children: React.ReactNode;
}

export default function Link({ to, children }: LinkProps) {
  const { navigate } = useRouter();

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
