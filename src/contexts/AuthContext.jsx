import React, { createContext, useContext, useState, useEffect } from "react";
import { store } from "../stores/index";
import { login as loginAction } from "../services/authService";
import { logout as logoutAction, setUserFromStorage } from "../reducers/authReducer";

// Membuat AuthContext tanpa menggunakan tipe TypeScript
const AuthContext = createContext(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Membuat AuthProvider tanpa menggunakan tipe TypeScript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem("instaapp_user");
    const storedToken = localStorage.getItem("api_token");
    
    if (storedUser && storedToken && storedUser !== "undefined" && storedToken !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Set user in Redux store
        store.dispatch(setUserFromStorage({ user: parsedUser, token: storedToken }));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("instaapp_user");
        localStorage.removeItem("api_token");
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      const result = await store.dispatch(loginAction({ name: username, password }));
      
      if (loginAction.fulfilled.match(result)) {
        const { user: loggedInUser } = result.payload.data;
        setUser(loggedInUser);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        // Get error message from Redux state
        const state = store.getState();
        const errorMessage = state.auth.error || "Login gagal";
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      return { success: false, error: error.message || "Terjadi kesalahan" };
    }
  };

  const register = async (username, email, password, fullName) => {
    // Register functionality can be implemented similarly with Redux
    // For now, returning a placeholder response
    return { success: false, error: "Registrasi belum diimplementasikan" };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    store.dispatch(logoutAction());
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("instaapp_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
