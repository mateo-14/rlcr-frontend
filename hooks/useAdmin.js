import axios from 'axios';
import { useEffect, useState } from 'react';

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin`, { withCredentials: true })
      .then(({ data }) => {
        if (data?.isAdmin) setIsAdmin(true);
      })
      .catch(() => setIsAdmin(false));
  }, []);

  return isAdmin;
};

export default useAdmin;
