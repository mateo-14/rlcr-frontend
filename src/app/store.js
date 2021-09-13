import { configureStore } from '@reduxjs/toolkit';
import { devToolsEnhancer } from 'redux-devtools-extension';

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    preloadedState,
    reducer: {},
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(devToolsEnhancer()),
  });

  return store;
}
