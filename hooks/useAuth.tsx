
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  // userRole: string | null; // Could be 'customer' if needed later
}

interface AuthContextType extends AuthState {
  login: (username?: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Synchronous check for initial state
const getInitialAuthState = (): AuthState => {
  try {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      // Future: Could also load userRole if stored
      return { isAuthenticated: true };
    }
  } catch (e) {
    console.error("Error reading auth state from localStorage", e);
  }
  return { isAuthenticated: false };
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState);

  const login = useCallback(async (username?: string, password?: string): Promise<boolean> => {
    // Admin login (username === 'admin' && password === 'password') removed.

    // Simulated Google User Login (or any generic user)
    if (username === 'google_user' && password === 'google_password') {
      setAuthState({ isAuthenticated: true /*, userRole: 'customer' */ });
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    
    // Simulate general user login for non-Google (any non-empty credentials, not 'admin')
    // This part ensures that if 'admin' is entered, it won't match this block either.
    if (username && username.trim() !== '' && password && password.trim() !== '' && username !== 'google_user' && username !== 'admin') {
        setAuthState({ isAuthenticated: true /*, userRole: 'customer' */ });
        localStorage.setItem('isAuthenticated', 'true');
        return true;
    }

    // If no criteria met, login fails
    setAuthState({ isAuthenticated: false /*, userRole: null */ });
    localStorage.removeItem('isAuthenticated');
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthState({ isAuthenticated: false /*, userRole: null */ });
    localStorage.removeItem('isAuthenticated');
  }, []);
  
  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};