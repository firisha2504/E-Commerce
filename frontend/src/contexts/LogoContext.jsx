import React, { createContext, useContext, useState, useEffect } from 'react';

const LogoContext = createContext();

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};

export const LogoProvider = ({ children }) => {
  // Use empty string so the img onError fallback triggers immediately
  const [logoUrl, setLogoUrl] = useState('');

  // Load logo from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('restaurantLogo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  const updateLogo = (newLogoUrl) => {
    setLogoUrl(newLogoUrl);
    localStorage.setItem('restaurantLogo', newLogoUrl);
  };

  const resetLogo = () => {
    setLogoUrl('');
    localStorage.removeItem('restaurantLogo');
  };

  return (
    <LogoContext.Provider value={{
      logoUrl,
      updateLogo,
      resetLogo
    }}>
      {children}
    </LogoContext.Provider>
  );
};