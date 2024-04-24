import React, { ReactNode } from 'react';
import { useRouter } from '../context/RouterContext';

interface RouteProps {
  path: string;
  children: ReactNode;
}

export default function Route({ path, children }: RouteProps) {
  const { currentPath } = useRouter();

  if (path !== currentPath) return null;

  return <>{children}</>;
}
