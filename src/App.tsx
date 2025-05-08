import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { CourseList } from "./components/courses/CourseList";
import { CourseDetails } from "./components/courses/CourseDetails";
import { CoursePlayer } from "./components/courses/CoursePlayer";
import { Settings } from "./components/pages/Settings";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { Navbar } from "./components/layout/NavBar";

// Protected route - redirects to login if user is not authenticated
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    window.location.href = "/auth/signin";
    return null;
  }
  return children;
};

// Redirect to home if user is logged in
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    window.location.href = "/";
    return null;
  }
  return children;
};

// Create a wrapper component for CoursePlayer to handle params
const CoursePlayerWrapper = () => {
  const { courseId } = useParams();

  if (!courseId) {
    return <CourseList />;
  }

  return <CoursePlayer courseId={courseId} />;
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Layout>
            <Routes>
              <Route
                path="/auth/signin"
                element={
                  <PublicRoute>
                    <LoginForm />
                  </PublicRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <CourseList />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
