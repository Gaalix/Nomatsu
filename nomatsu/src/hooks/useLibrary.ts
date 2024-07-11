import { useState, useEffect } from 'react';
import { Manga } from '../types/Manga';

export const useLibrary = () => {
  const [library, setLibrary] = useState<Manga[]>([]);

  useEffect(() => {
    const storedLibrary = localStorage.getItem('mangaLibrary');
    if (storedLibrary) {
      setLibrary(JSON.parse(storedLibrary));
    }
  }, []);

  const addToLibrary = (manga: Manga) => {
    const updatedLibrary = [...library, manga];
    setLibrary(updatedLibrary);
    localStorage.setItem('mangaLibrary', JSON.stringify(updatedLibrary));
  };

  const removeFromLibrary = (mangaId: string) => {
    const updatedLibrary = library.filter((m) => m.id !== mangaId);
    setLibrary(updatedLibrary);
    localStorage.setItem('mangaLibrary', JSON.stringify(updatedLibrary));
  };

  const isInLibrary = (mangaId: string) => {
    return library.some((m) => m.id === mangaId);
  };

  return { library, addToLibrary, removeFromLibrary, isInLibrary };
};