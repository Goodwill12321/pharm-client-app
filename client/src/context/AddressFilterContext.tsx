import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AddressFilterContextType = {
  selectedAddresses: string[];
  setSelectedAddresses: (addresses: string[]) => void;
};

const AddressFilterContext = createContext<AddressFilterContextType | undefined>(undefined);

export const AddressFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedAddresses, setSelectedAddressesState] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedAddresses');
    return saved ? JSON.parse(saved) : [];
  });

  const setSelectedAddresses = (addresses: string[]) => {
    setSelectedAddressesState(addresses);
    localStorage.setItem('selectedAddresses', JSON.stringify(addresses));
  };

  return (
    <AddressFilterContext.Provider value={{ selectedAddresses, setSelectedAddresses }}>
      {children}
    </AddressFilterContext.Provider>
  );
};

export const useAddressFilter = () => {
  const ctx = useContext(AddressFilterContext);
  if (!ctx) throw new Error('useAddressFilter must be used within AddressFilterProvider');
  return ctx;
};
