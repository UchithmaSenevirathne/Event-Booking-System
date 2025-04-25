import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
    role: string;
  };

  type UserContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    setUserDetails: (newUser: User) => void;
  };
  
  const defaultContextValue: UserContextType = {
    user: { role: 'USER' },
    setUser: () => {},
    setUserDetails: () => {},
  };
  
  const UserContext = createContext<UserContextType>(defaultContextValue);

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);

type Props = {
    children: ReactNode;
  };
  

// Provider Component
export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState({ role: 'USER'});

  const setUserDetails = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};