// RouterContext.ts
import { createContext, useContext } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const extractParams = (path: string): Record<string, string> => {
  const params: Record<string, string> = {};

  //console.log('path: ', path);

  const pathParts = path.split('/').filter((part) => part);

  //console.log('pathParts: ', pathParts);

  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i].startsWith(':')) {
      const paramName = pathParts[i].substring(1);
      //console.log('paramName: ', paramName);

      //return paramName;
      if (pathParts[i + 1]) {
        params[paramName] = pathParts[i + 1];
        i++; // Skip the value
      }
    }
  }

  //console.log('params: ', params);

  return params;
};

export default RouterContext;
