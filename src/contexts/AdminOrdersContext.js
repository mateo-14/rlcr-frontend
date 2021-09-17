import { createContext, useState } from 'react';

export const OrdersContext = createContext();
export default function OrdersProvider({ children }) {
  const [showingUserOrderID, setShowingUserOrderID] = useState();
  const [showingOptionsOrderID, setShowingOptionsOrderID] = useState();

  const showUser = (id) => {
    if (id) {
      setShowingUserOrderID(id);
    } else {
      setShowingUserOrderID(null);
    }
  };

  const showOptions = (id) => {
    if (id) {
      setShowingOptionsOrderID(id);
    } else {
      setShowingOptionsOrderID(null);
    }
  };

  return (
    <OrdersContext.Provider value={{ showUser, showOptions, showingUserOrderID, showingOptionsOrderID }}>
      {children}
    </OrdersContext.Provider>
  );
}
