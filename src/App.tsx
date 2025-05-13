import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { CourseList } from "./components/courses/CourseList";
import { CourseDetails } from "./components/courses/CourseDetails";
import { CoursePlayer } from "./components/courses/CoursePlayer";
import { Settings } from "./components/settings/index";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { Navbar } from "./components/layout/NavBar";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";

// Create a wrapper component for CoursePlayer to handle params
const CoursePlayerWrapper = () => {
  const { courseId } = useParams();

  if (!courseId) {
    return <CourseList />;
  }

  return <CoursePlayer courseId={courseId} />;
};

export const withAuth = (Component: React.FC) => {
  return function ProtectedPage(props: any) {
    const router = useRouter();

    useEffect(() => {
      if (!auth.currentUser) {
        router.push("/auth/signin");
      }
    }, []);

    return <Component {...props} />;
  };
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
