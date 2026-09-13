import { createContext, useContext, useEffect, useState } from 'react';
import { nhost } from './host.ts';

const AuthContext = createContext(null);
let authCallbackPromise = null;

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => nhost.getUserSession());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const unsubscribe = nhost.sessionStorage.onChange(() => {
      if (active) setSession(nhost.getUserSession());
    });

    async function initializeSession() {
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.slice(1));
      const refreshToken = url.searchParams.get('refreshToken') || hash.get('refreshToken');

      if (refreshToken && !authCallbackPromise) {
        url.searchParams.delete('refreshToken');
        hash.delete('refreshToken');
        url.hash = hash.toString();
        window.history.replaceState(null, '', url);

        authCallbackPromise = nhost.auth.refreshToken({ refreshToken }).catch((error) => {
          console.error('Could not complete authentication:', error);
        });
      }

      if (authCallbackPromise) await authCallbackPromise;

      if (active) {
        setSession(nhost.getUserSession());
        setIsLoading(false);
      }
    }

    initializeSession();
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
