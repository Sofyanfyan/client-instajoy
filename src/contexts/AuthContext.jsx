import React, { createContext, useContext, useState, useEffect } from "react";
import { dummyUsers } from "../data/dummyData";

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
  const [users, setUsers] = useState(dummyUsers);

  useEffect(() => {
    const storedUser = localStorage.getItem("instaapp_user");
    if (storedUser) {
      // eslint-disable-next-line
      setUser(JSON.parse(storedUser));
    }

    const storedUsers = localStorage.getItem("instaapp_users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem("instaapp_users", JSON.stringify(dummyUsers));
    }
  }, []);

  const login = async (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("instaapp_user", JSON.stringify(foundUser));
      return { success: true };
    }

    return { success: false, error: "Email atau password salah" };
  };

  const register = async (username, email, password, fullName) => {
    const existingUser = users.find(
      (u) => u.email === email || u.username === username,
    );

    if (existingUser) {
      if (existingUser.email === email) {
        return { success: false, error: "Email sudah terdaftar" };
      }
      return { success: false, error: "Username sudah digunakan" };
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      fullName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: "",
      followers: 0,
      following: 0,
      posts: 0,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("instaapp_users", JSON.stringify(updatedUsers));

    setUser(newUser);
    localStorage.setItem("instaapp_user", JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("instaapp_user");
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("instaapp_user", JSON.stringify(updatedUser));

      const updatedUsers = users.map((u) =>
        u.id === user.id ? updatedUser : u,
      );
      setUsers(updatedUsers);
      localStorage.setItem("instaapp_users", JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
