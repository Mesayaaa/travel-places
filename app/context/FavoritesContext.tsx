"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Place } from "../data/places";

interface FavoritesContextType {
  favorites: Place[];
  addToFavorites: (place: Place) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Place[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        try {
          const parsedFavorites = JSON.parse(storedFavorites);
          setFavorites(parsedFavorites);
        } catch (error) {
          console.error("Error parsing favorites from localStorage:", error);
          localStorage.removeItem("favorites");
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  const addToFavorites = (place: Place) => {
    setFavorites((prevFavorites) => {
      // Check if the place is already in favorites
      if (prevFavorites.some((fav) => fav.id === place.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, place];
    });
  };

  const removeFromFavorites = (id: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((place) => place.id !== id)
    );
  };

  const isFavorite = (id: number) => {
    return favorites.some((place) => place.id === id);
  };

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        favoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
