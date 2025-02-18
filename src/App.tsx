import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginForm } from "./components/auth/LoginForm";
import { CoursePlayer } from "./components/courses/CoursePlayer";
import { CourseCreator } from "./components/courses/CourseCreator";
import { CourseList } from "./components/courses/CourseList";
import { Profile } from "./components/Profile";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/courses" element={<CourseList />} />
          <Route
            path="/courses/create"
            element={
              <ProtectedRoute adminOnly>
                <CourseCreator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CoursePlayer courseId="" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<CourseList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
