import { useEffect, useState, useCallback } from "react";

export type SavedItem = {
  q: string;
  c?: string;
  title?: string;
  savedAt: number;
};

const FAV_KEY = "doguide:favorites";
const RECENT_KEY = "doguide:recents";
const MAX_RECENTS = 8;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(`doguide:${key}`));
  } catch {
    /* ignore */
  }
}

function useStored<T>(key: string, initial: T): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    setValue(read<T>(key, initial));
    const onChange = () => setValue(read<T>(key, initial));
    window.addEventListener(`doguide:${key}`, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(`doguide:${key}`, onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T) => {
      setValue(next);
      write(key, next);
    },
    [key],
  );

  return [value, set];
}

function sameItem(a: SavedItem, b: { q: string; c?: string }) {
  return a.q.toLowerCase() === b.q.toLowerCase() && (a.c ?? "") === (b.c ?? "");
}

export function useFavorites() {
  const [items, setItems] = useStored<SavedItem[]>(FAV_KEY, []);

  const isFavorite = useCallback(
    (q: string, c?: string) => items.some((i) => sameItem(i, { q, c })),
    [items],
  );

  const toggle = useCallback(
    (item: Omit<SavedItem, "savedAt">) => {
      const exists = items.some((i) => sameItem(i, item));
      const next = exists
        ? items.filter((i) => !sameItem(i, item))
        : [{ ...item, savedAt: Date.now() }, ...items];
      setItems(next);
      return !exists;
    },
    [items, setItems],
  );

  const remove = useCallback(
    (item: { q: string; c?: string }) => {
      setItems(items.filter((i) => !sameItem(i, item)));
    },
    [items, setItems],
  );

  return { favorites: items, isFavorite, toggle, remove };
}

export function useRecents() {
  const [items, setItems] = useStored<SavedItem[]>(RECENT_KEY, []);

  const push = useCallback(
    (item: Omit<SavedItem, "savedAt">) => {
      const filtered = items.filter((i) => !sameItem(i, item));
      const next = [{ ...item, savedAt: Date.now() }, ...filtered].slice(0, MAX_RECENTS);
      setItems(next);
    },
    [items, setItems],
  );

  const clear = useCallback(() => setItems([]), [setItems]);

  return { recents: items, push, clear };
}
