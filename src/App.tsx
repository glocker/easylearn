import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginForm } from "./components/auth/LoginForm";
import { CoursePlayer } from "./components/courses/CoursePlayer";
import { CourseCreator } from "./components/courses/CourseCreator";
import { CourseList } from "./components/courses/CourseList";
import { Profile } from "./components/Profile";
import { CourseDetails } from "./components/courses/CourseDetails";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
