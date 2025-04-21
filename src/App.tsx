import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { CourseList } from "./components/courses/CourseList";
import { CourseDetails } from "./components/courses/CourseDetails";
import { CoursePlayer } from "./components/courses/CoursePlayer";
import { Settings } from "./components/pages/Settings";

// Create a wrapper component for CoursePlayer to handle params
const CoursePlayerWrapper = () => {
  const { courseId } = useParams();

  if (!courseId) {
    return <CourseList />;
  }

  return <CoursePlayer courseId={courseId} />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route
            path="/courses/:courseId/play"
            element={<CoursePlayerWrapper />}
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
