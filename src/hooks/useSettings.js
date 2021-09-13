import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';

export default function useSettings() {
  return useContext(SettingsContext);
}
