import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { useAuth } from "../contexts/AuthContext";
import LoginPage from "../pages/LoginPage";
import { PostProvider } from "../contexts/PostContext";
import MainLayout from "../components/MainLayout";
import HomePage from "../pages/HomePage";
import ExplorePage from "../pages/ExplorePage";
import CreatePostPage from "../pages/CreatePostPage";
import NotificationsPage from "../pages/NotificationsPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

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
      <Route
        path="/login"
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <PostProvider>
              <MainLayout />
            </PostProvider>
          </ProtectedRoute>
        }>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/notifications" element={<NotificationsPage />}></Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
