import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define JWT payload structure
interface JwtPayload {
  sub: string;
  role: "student" | "professor" | "admin";
  full_name: string;
  exp?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string | null;
  userName: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = parseJwt(token);
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            handleLogout(); // Token expired
          } else {
            setUserId(payload.sub);
            setUserRole(payload.role);
            setUserName(payload.full_name);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const parseJwt = (token: string): JwtPayload => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid login");

      const data = await response.json();
      const token = data.access_token;

      localStorage.setItem("token", token);

      const payload = parseJwt(token);
      setUserId(payload.sub);
      setUserRole(payload.role);
      setUserName(payload.full_name);
      setIsAuthenticated(true);

      navigateByRole(payload.role);
      toast.success("Login successful");
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      setLoading(false);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Registration failed");

      const data = await response.json();
      const token = data.access_token;

      localStorage.setItem("token", token);

      const payload = parseJwt(token);
      setUserId(payload.sub);
      setUserRole(payload.role);
      setUserName(payload.full_name);
      setIsAuthenticated(true);

      navigateByRole(payload.role);
      toast.success("Registration successful");
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
      setLoading(false);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserId(null);
    setUserRole(null);
    setUserName(null);
    navigate("/login");
  };

  const navigateByRole = (role: string) => {
    switch (role) {
      case "student":
        navigate("/dashboard");
        break;
      case "professor":
        navigate("/professor");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        userRole,
        userName,
        login,
        register,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
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
