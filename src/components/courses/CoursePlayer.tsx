import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Link } from "react-router-dom";
import { Course } from "../../types/Course";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export const CoursePlayer = () => {
  const { courseId } = useParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllFlipped, setShowAllFlipped] = useState(false);

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

  const handleFlipAll = () => {
    setShowAllFlipped(!showAllFlipped);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-100 p-4 shadow-md border-b border-gray-200">
        <div className="container mx-auto grid grid-cols-3 items-center">
          <div className="flex items-center gap-4">
            <Link
              to={`/courses/${courseId}`}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Course
            </Link>
            <button
              onClick={handleFlipAll}
              className="inline-flex items-center px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 gap-2 border border-gray-200 shadow-sm"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Flip all</span>
            </button>
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            {course.title}
          </h3>
          <div className="text-right">
            <span className="text-gray-600">
              {currentCardIndex + 1} / {course.cards.length}
            </span>
          </div>
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
                className="bg-white rounded-xl p-8 shadow-md cursor-pointer transform transition-transform duration-500 perspective-1000 border border-gray-200"
                style={{
                  transform:
                    isFlipped || showAllFlipped
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                  transformStyle: "preserve-3d",
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className="backface-hidden"
                  style={{
                    opacity: isFlipped || showAllFlipped ? 0 : 1,
                    transition: "opacity 0.15s ease-in-out",
                  }}
                >
                  <h3 className="text-xl text-gray-900 text-center">
                    {course.cards[currentCardIndex].question}
                  </h3>
                </div>
                <div
                  className="backface-hidden absolute inset-0 p-8"
                  style={{
                    transform: "rotateY(180deg)",
                    opacity: isFlipped || showAllFlipped ? 1 : 0,
                    transition: "opacity 0.15s ease-in-out",
                  }}
                >
                  <h3 className="text-xl text-gray-900 text-center">
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
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 border border-gray-200"
          >
            Previous
          </button>
          <button
            onClick={handleNextCard}
            disabled={currentCardIndex === course.cards.length - 1}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
