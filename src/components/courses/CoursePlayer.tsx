import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../cards/Card";
import { useCourseStore } from "../../store/courseStore";
import { useAuthStore } from "../../store/authStore";

interface CoursePlayerProps {
  courseId: string;
}

export const CoursePlayer = ({ courseId }: CoursePlayerProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { currentCourse, progress, loadCourse, updateProgress } =
    useCourseStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadCourse(courseId);
  }, [courseId]);

  if (!currentCourse || !user) return null;

  const handleAnswer = (correct: boolean) => {
    updateProgress(correct);
    setTimeout(() => {
      setCurrentCardIndex((prev) =>
        prev < currentCourse.cards.length - 1 ? prev + 1 : prev
      );
    }, 1000);
  };

  const progressPercentage = progress
    ? (progress.correctAnswers / progress.totalAttempts) * 100
    : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentCourse.title}
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-gray-600 mt-2">
          Прогресс: {progressPercentage.toFixed(1)}%
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCardIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card
            card={currentCourse.cards[currentCardIndex]}
            onAnswer={handleAnswer}
          />
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => handleAnswer(true)}
          className="px-6 py-2 bg-green-500 text-white rounded-lg"
        >
          Yes, I know it
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="px-6 py-2 bg-red-500 text-white rounded-lg"
        >
          Don't know it
        </button>
      </div>
    </div>
  );
};
