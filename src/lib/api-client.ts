const BASE_URL = "https://mbpproperties.com";

const STORAGE_KEY = "mbpp_at";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

let accessToken: string | null = getStoredToken();
let refreshPromise: Promise<string | null> | null = null;

export function initAccessToken() {
  if (!accessToken) {
    const stored = getStoredToken();
    if (stored) accessToken = stored;
  }
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  setStoredToken(token);
}

export function getAccessToken() {
  return accessToken;
}

export async function refreshAccessToken(): Promise<string | null> {
  const stored = getStoredToken();
  if (stored && stored !== accessToken) {
    accessToken = stored;
    return accessToken;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        accessToken = null;
        setStoredToken(null);
      }
      return null;
    }
    const data = await res.json();
    accessToken = data.accessToken;
    setStoredToken(data.accessToken);
    return accessToken;
  } catch {
    return null;
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      accessToken = e.newValue || null;
    }
  });
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
    signal: options.signal || controller.signal,
  });
  clearTimeout(timeout);

  if (res.status === 401) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken();
    }
    const newToken = await refreshPromise;
    refreshPromise = null;

    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });
    }
  }

  const body = await res.text();
  try {
    const json = JSON.parse(body);
    return { data: json, status: res.status };
  } catch {
    return { data: undefined as T, status: res.status, error: body };
  }
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
