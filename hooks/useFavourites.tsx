import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

const FAVOURITES_STORAGE_KEY = 'pickmeup_favourites';

interface FavouritesState {
  favouriteIds: string[];
}

interface FavouritesContextType extends FavouritesState {
  addFavourite: (productId: string) => void;
  removeFavourite: (productId: string) => void;
  isFavourite: (productId: string) => boolean;
  getFavouriteProductIds: () => string[];
  toggleFavourite: (productId: string) => void;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

const loadFavouritesFromStorage = (): string[] => {
  try {
    const storedFavourites = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    return storedFavourites ? JSON.parse(storedFavourites) : [];
  } catch (error) {
    console.error("Error loading favourites from localStorage:", error);
    return [];
  }
};

const saveFavouritesToStorage = (favouriteIds: string[]) => {
  try {
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favouriteIds));
  } catch (error) {
    console.error("Error saving favourites to localStorage:", error);
  }
};

export const FavouritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FavouritesState>({
    favouriteIds: loadFavouritesFromStorage(),
  });

  useEffect(() => {
    saveFavouritesToStorage(state.favouriteIds);
  }, [state.favouriteIds]);

  const addFavourite = useCallback((productId: string) => {
    setState(prevState => {
      if (!prevState.favouriteIds.includes(productId)) {
        return { ...prevState, favouriteIds: [...prevState.favouriteIds, productId] };
      }
      return prevState;
    });
  }, []);

  const removeFavourite = useCallback((productId: string) => {
    setState(prevState => ({
      ...prevState,
      favouriteIds: prevState.favouriteIds.filter(id => id !== productId),
    }));
  }, []);

  const isFavourite = useCallback((productId: string): boolean => {
    return state.favouriteIds.includes(productId);
  }, [state.favouriteIds]);

  const getFavouriteProductIds = useCallback((): string[] => {
    return [...state.favouriteIds];
  }, [state.favouriteIds]);

  const toggleFavourite = useCallback((productId: string) => {
    if (state.favouriteIds.includes(productId)) {
        removeFavourite(productId);
    } else {
        addFavourite(productId);
    }
  }, [state.favouriteIds, addFavourite, removeFavourite]);


  return (
    <FavouritesContext.Provider
      value={{
        favouriteIds: state.favouriteIds,
        addFavourite,
        removeFavourite,
        isFavourite,
        getFavouriteProductIds,
        toggleFavourite,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = (): FavouritesContextType => {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};