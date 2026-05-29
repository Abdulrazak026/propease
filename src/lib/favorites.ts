const STORAGE_KEY = "propease-favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): boolean {
  const faves = getFavorites();
  const idx = faves.indexOf(id);
  if (idx >= 0) { faves.splice(idx, 1); localStorage.setItem(STORAGE_KEY, JSON.stringify(faves)); return false; }
  else { faves.push(id); localStorage.setItem(STORAGE_KEY, JSON.stringify(faves)); return true; }
}
