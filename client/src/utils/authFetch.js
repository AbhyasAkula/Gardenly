export const AUTH_TOKEN_KEY = "gardenly_auth_token";

export function installAuthFetchInterceptor() {
  if (typeof window === "undefined" || window.__gardenlyAuthFetchInstalled) {
    return;
  }

  const backendUrl = (import.meta.env.VITE_BACKEND_URL || "").trim();
  if (!backendUrl) {
    return;
  }

  const originalFetch = window.fetch.bind(window);
  window.__gardenlyAuthFetchInstalled = true;

  window.fetch = (input, init = {}) => {
    const requestUrl =
      typeof input === "string"
        ? input
        : input instanceof Request
          ? input.url
          : String(input);

    if (!requestUrl.startsWith(backendUrl)) {
      return originalFetch(input, init);
    }

    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    const headers = new Headers(input instanceof Request ? input.headers : undefined);

    if (init.headers) {
      new Headers(init.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const nextInit = {
      ...init,
      headers,
      credentials: init.credentials ?? "include",
    };

    return originalFetch(input, nextInit);
  };
}
