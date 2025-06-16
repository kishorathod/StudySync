import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

useEffect(() => {
  console.log("🔄 useEffect triggered - token is:", token);

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("✅ Decoded token:", decoded);
      setUser(decoded);
    } catch (err) {
      console.error("❌ Error decoding token:", err);
      setUser(null);
    }
  } else {
    setUser(null);
  }
}, [token]);


  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // this will trigger useEffect to decode
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
