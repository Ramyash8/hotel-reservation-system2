
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/lib/types";
import { getUserById, authenticateUser } from "@/lib/data";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  // No signup here, that's a separate action
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // Only run this on the client
      if (typeof window !== 'undefined') {
        setLoading(true);
        try {
          const userId = localStorage.getItem("userId");
          if (userId) {
            const fetchedUser = await getUserById(userId);
            setUser(fetchedUser || null);
          }
        } catch (error) {
          console.error("Failed to fetch user on initial load:", error);
          setUser(null);
          localStorage.removeItem("userId");
        } finally {
          setLoading(false);
        }
      } else {
         setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const authenticatedUser = await authenticateUser(email, password);
      if (authenticatedUser) {
        localStorage.setItem("userId", authenticatedUser.id);
        setUser(authenticatedUser);
        return authenticatedUser;
      }
      // Ensure user is logged out if auth fails
      localStorage.removeItem("userId");
      setUser(null);
      return null;
    } catch (error) {
      console.error("Login failed:", error);
      // Ensure user is logged out in case of error
      localStorage.removeItem("userId");
      setUser(null);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    setUser(null);
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="h-screen w-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : children }
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
