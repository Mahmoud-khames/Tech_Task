import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AuthWrapperProviderProps = {
  children: ReactNode;
};

type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
  token: string;
} | null;

const AuthWrapperContext = createContext<{
  user: User;
  setUser: (user: User) => void;
  login: (userData: User) => void;
  logout: () => void;
} | null>(null);

export default function AuthWrapperProvider({ children }: AuthWrapperProviderProps) {
  const [user, setUser] = useState<User>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user?.token) {
      const tokenExpiration = JSON.parse(atob(user.token.split(".")[1])).exp * 1000; 
      const now = Date.now();

      if (now >= tokenExpiration) {
        logout();
      }
    }
  }, [user]);

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login"; 
  };

  return (
    <AuthWrapperContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthWrapperContext.Provider>
  );
}

// 🔹 Hook مخصص لاستخدام `AuthWrapperContext`
export function useAuth() {
  const context = useContext(AuthWrapperContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthWrapperProvider");
  }
  return context;
}
