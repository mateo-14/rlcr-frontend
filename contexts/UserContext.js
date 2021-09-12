import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const login = (code) => {
    setIsLogging(true);
    return axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, { code: code }, { withCredentials: true })
      .then(({ data }) => {
        setIsLogging(false);
        setUser(data);
      })
      .catch(() => setIsLogging(false));
  };

  const logout = () => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, null, { withCredentials: true }).then(() => {
      setUser(null);
    });
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users`, { withCredentials: true })
      .then(({ data }) => {
        setUser(data);
        setIsReady(true);
      })
      .catch(() => {
        setIsReady(true);
      });
  }, []);

  return (
    <UserContext.Provider value={{ login, logout, data: user, isReady, isLogging }}>{children}</UserContext.Provider>
  );
};

export { UserProvider, UserContext };
