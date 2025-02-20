import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { CourseList } from "./components/courses/CourseList";
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
