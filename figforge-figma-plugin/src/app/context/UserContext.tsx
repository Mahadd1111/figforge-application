import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VerifyUserKeyResponse } from '../pages/Login/Auth'; // Import the interface

// You can extend the VerifyUserKeyResponse with additional properties if needed
type UserType = VerifyUserKeyResponse;

type UserContextType = {
  userData: UserType | null;
  setUserData: React.Dispatch<React.SetStateAction<UserType | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserType | null>(null);

  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
