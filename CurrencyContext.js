import React, { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState([]);

  const setCurrency = (currency) => {
    setSelectedCurrency(currency);
  };

  const setCountries = (countries) => {
    setSelectedCountries(countries);
  };

  const setCryptos = (cryptos) => {
    setSelectedCryptos(cryptos);
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setCurrency,
        selectedCountries,
        setCountries,
        selectedCryptos,
        setCryptos,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
