// RouterProvider.tsx
import React, { useState, ReactNode } from 'react';
import RouterContext, { extractParams } from './RouterContext';

interface RouterProviderProps {
  children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  const [currentPath, setCurrentPath] = useState<string>('/'); // default to root path

  const params = extractParams(currentPath);

  return (
    <RouterContext.Provider value={{ currentPath, navigate: setCurrentPath, params }}>
      {children}
    </RouterContext.Provider>
  );
}
