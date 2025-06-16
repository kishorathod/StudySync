import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct named import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        return jwtDecode(storedToken); // ✅ Use jwtDecode (not jwt_decode)
      } catch (err) {
        console.error("Invalid token", err);
        return null;
      }
    }
    return null;
  });

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken); // ✅ Use jwtDecode
      console.log("Decoded Token:", decoded); // 👈 Add this line
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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
