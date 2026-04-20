import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const storageKey = user ? `favorites_${user.id}` : null;

  // Load from localStorage when user changes
  useEffect(() => {
    if (storageKey) {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setFavorites(saved);
    } else {
      setFavorites([]);
    }
  }, [storageKey]);

  const save = (updated) => {
    setFavorites(updated);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const toggleFavorite = (product) => {
    if (!isAuthenticated) return false; // caller can show login prompt
    const exists = favorites.some(f => f.id === product.id);
    if (exists) {
      save(favorites.filter(f => f.id !== product.id));
    } else {
      save([...favorites, product]);
    }
    return !exists; // returns true if added
  };

  const isFavorite = (productId) => favorites.some(f => f.id === productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
