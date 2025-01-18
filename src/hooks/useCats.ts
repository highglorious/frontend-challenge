import useSWRInfinite from "swr/infinite";
import { useEffect, useState, useCallback } from "react";
import type { Cat } from "../types/catApi";

const API_KEY = "DEMO-API-KEY";
const API_URL = "https://api.thecatapi.com/v1";
const LOCAL_STORAGE_KEY = "Favorites";
const CAT_LIMIT = 10;

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
  });
  if (!response.ok) throw new Error("Не могу загрузить котов");
  return response.json();
};

export function useCats() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const getKey = (pageIndex: number, previousPageData: Cat[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_URL}/images/search?limit=${CAT_LIMIT}&page=${pageIndex + 1}`;
  };

  const { data, error, size, setSize, isLoading } = useSWRInfinite<Cat[]>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      persistSize: true,
    }
  );

  const toggleFavorite = useCallback((catId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(catId)) {
        newFavorites.delete(catId);
      } else {
        newFavorites.add(catId);
      }

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([...newFavorites])
      );

      return newFavorites;
    });
  }, []);

  const cats = data ? data.flat() : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < CAT_LIMIT);

  const loadMoreCats = useCallback(() => {
    if (!isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  }, [isLoadingMore, isReachingEnd, setSize, size]);

  return {
    cats,
    favorites,
    isLoadingMore,
    isError: error,
    toggleFavorite,
    isReachingEnd,
    loadMoreCats,
  };
}
