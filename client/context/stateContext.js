import React, { createContext, useContext, useState } from 'react';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [brandAddress, setBrandAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  return (
    <Context.Provider
      value={{
        brandAddress,
        setBrandAddress,
        contractAddress,
        setContractAddress,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
