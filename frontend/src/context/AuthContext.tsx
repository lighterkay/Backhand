import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  id:       number;
  name:     string;
  role:     string;
  branchId: number | null;
}

interface AuthContextType {
  user:   AuthUser | null;
  token:  string | null;
  login:  (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('steakzlighter_token');
    const storedUser = localStorage.getItem('steakzlighter_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function login(t: string, u: AuthUser) {
    localStorage.setItem('steakzlighter_token', t);
    localStorage.setItem('steakzlighter_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  }

  function logout() {
    localStorage.removeItem('steakzlighter_token');
    localStorage.removeItem('steakzlighter_user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
