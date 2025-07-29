"use client"
// hooks/useFavorites.ts
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

// 1. تعريف شكل بيانات الـ Context
interface FavoritesContextType {
  favorites: number[];
  addFavorite: (movieId: number) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

// 2. إنشاء الـ Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = 'movie-app-favorites';

// 3. إنشاء مكون الـ Provider الذي سيحتوي على الحالة والمنطق
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: number[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }, []);

  const addFavorite = useCallback((movieId: number) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(movieId)) {
        return prevFavorites; // الفيلم موجود بالفعل، لا تفعل شيئًا
      }
      const newFavorites = [...prevFavorites, movieId];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const removeFavorite = useCallback((movieId: number) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter((id) => id !== movieId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const isFavorite = useCallback((movieId: number) => {
    return favorites.includes(movieId);
  }, [favorites]);

  // تمرير الحالة والدوال عبر الـ Provider
  const value = { favorites, addFavorite, removeFavorite, isFavorite };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// 4. إنشاء الـ hook المخصص الذي سيستخدمه باقي التطبيق للوصول إلى الحالة
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
