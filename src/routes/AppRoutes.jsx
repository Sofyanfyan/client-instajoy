import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import LoginPage from "../pages/LoginPage";

const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
