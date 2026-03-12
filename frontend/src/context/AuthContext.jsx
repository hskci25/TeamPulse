import { createContext, useContext, useState, useEffect } from 'react';

const TOKEN_KEY = 'teampulse_token';
const EMAIL_KEY = 'teampulse_email';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null);
  const [email, setEmail] = useState(() => typeof window !== 'undefined' ? localStorage.getItem(EMAIL_KEY) : null);

  const setToken = (newToken, newEmail) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      if (newEmail != null) localStorage.setItem(EMAIL_KEY, newEmail);
      setTokenState(newToken);
      setEmail(newEmail ?? localStorage.getItem(EMAIL_KEY));
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EMAIL_KEY);
      setTokenState(null);
      setEmail(null);
    }
  };

  const logout = () => setToken(null);

  const value = { token, email, setToken, logout, isAuthenticated: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getStoredToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}
