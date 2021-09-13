import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import * as _ from 'lodash';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const { data } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/settings`, axios, {
    revalidateOnFocus: false,
    refreshInterval: 30000,
  });

  useEffect(() => {
    if (data?.data && !_.isEqual(settings, data.data)) {
      setSettings(data.data);
    }
  }, [settings, data?.data]);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}
