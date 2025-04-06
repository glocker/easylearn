import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Link } from "react-router-dom";
import { Course } from "../../types/Course";

export const CoursePlayer = () => {
  const { courseId } = useParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        const courseRef = doc(db, "courses", courseId);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          setCourse({
            id: courseSnap.id,
            ...courseSnap.data(),
          } as Course);
        } else {
          setError("Course not found");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !course || !course.cards || course.cards.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 mb-4">
          {error || "No cards found in this course"}
        </div>
        <Link
          to={`/courses/${courseId}`}
          className="text-blue-500 hover:underline"
        >
          Back to course
        </Link>
      </div>
    );
  }

  const handleNextCard = () => {
    if (currentCardIndex < course.cards.length - 1) {
      setIsFlipped(false);
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to={`/courses/${courseId}`}
            className="text-gray-200 hover:text-white"
          >
            ← Back to Course
          </Link>
          <h1 className="text-xl font-bold text-white">{course.title}</h1>
          <span className="text-gray-200">
            {currentCardIndex + 1} / {course.cards.length}
          </span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Card */}
        <div className="flex justify-center items-center min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl"
            >
              <div
                className="bg-gray-800 rounded-xl p-8 shadow-lg cursor-pointer transform transition-transform duration-500 perspective-1000"
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transformStyle: "preserve-3d",
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className="backface-hidden"
                  style={{
                    opacity: isFlipped ? 0 : 1,
                    transition: "opacity 0.15s ease-in-out",
                  }}
                >
                  <h3 className="text-xl text-gray-200 text-center">
                    {course.cards[currentCardIndex].question}
                  </h3>
                </div>
                <div
                  className="backface-hidden absolute inset-0 p-8"
                  style={{
                    transform: "rotateY(180deg)",
                    opacity: isFlipped ? 1 : 0,
                    transition: "opacity 0.15s ease-in-out",
                  }}
                >
                  <h3 className="text-xl text-gray-200 text-center">
                    {course.cards[currentCardIndex].answer}
                  </h3>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            onClick={handleNextCard}
            disabled={currentCardIndex === course.cards.length - 1}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
