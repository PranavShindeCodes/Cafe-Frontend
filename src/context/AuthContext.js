import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'cafeAuth';
const LEGACY_USER_KEY = 'hotelUser';

const AuthContext = createContext(null);

const isValidUser = (user) => {
  return Boolean(user) && typeof user === 'object' && !Array.isArray(user) && typeof user._id === 'string' && user._id.trim() !== '';
};

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.isAuthenticated === true && isValidUser(parsed.user)) {
        return { isAuthenticated: true, user: parsed.user };
      }
    }

    // Backward-compatible migration from legacy key.
    const legacyRaw = localStorage.getItem(LEGACY_USER_KEY);
    if (legacyRaw) {
      const legacyUser = JSON.parse(legacyRaw);
      if (isValidUser(legacyUser)) {
        const migrated = { isAuthenticated: true, user: legacyUser };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch {
    // Invalid storage data is treated as logged out.
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
  return { isAuthenticated: false, user: null };
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ isAuthenticated: false, user: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredAuth();
    setAuthState(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback((user) => {
    if (!isValidUser(user)) {
      throw new Error('Invalid user data');
    }

    const nextState = { isAuthenticated: true, user };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
    // Keep legacy key for existing code paths that still read it.
    localStorage.setItem(LEGACY_USER_KEY, JSON.stringify(user));
    setAuthState(nextState);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
    setAuthState({ isAuthenticated: false, user: null });
  }, []);

  const updateUser = useCallback((user) => {
    if (!isValidUser(user)) return;
    setAuthState((prev) => {
      if (!prev.isAuthenticated) return prev;
      const nextState = { isAuthenticated: true, user };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
      localStorage.setItem(LEGACY_USER_KEY, JSON.stringify(user));
      return nextState;
    });
  }, []);

  const value = useMemo(() => ({
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  }), [authState, isLoading, login, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AUTH_STORAGE_KEY, LEGACY_USER_KEY };
