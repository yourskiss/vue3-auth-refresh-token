# Vue 3 + TypeScript + Vite

Vue 3 + TypeScript + Pinia auth setup with:

url - https://dummyjson.com/auth

✅ Token-based login
✅ Auto-refresh + localStorage sync
✅ Axios interceptors for secure session handling
✅ Auto redirect on token expiration

Detects a 401 Unauthorized response.
Clears auth state and local storage.
Redirects the user to /login.
Auth token stored and restored from localStorage
Type-safe Pinia store
Global Axios auth header
Persistent auth even after refresh