import { createContext, useEffect, useState } from 'react';
import * as usersService from '../services/UsersService';
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const login = async (code) => {
    if (user && isReady) return;

    setIsReady(false);
    try {
      const user = await usersService.login(code);
      setUser(user);
    } catch {}
    setIsReady(true);
  };

  const logout = () => usersService.logout().then(() => setUser(null));

  useEffect(() => {
    const auth = async () => {
      try {
        const user = await usersService.auth();
        setUser(user);
      } catch {}
      setIsReady(true);
    };
    auth();
  }, []);

  return <UserContext.Provider value={{ login, logout, data: user, isReady }}>{children}</UserContext.Provider>;
}
