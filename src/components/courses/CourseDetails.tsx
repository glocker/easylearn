import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Course } from "../../types/Course";
import { CardCreator } from "../cards/CardCreator";
import { PlayIcon } from "@heroicons/react/24/solid";

export const CourseDetails = () => {
  const router = useRouter();
  const courseId = router.query;
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

  const handleCardCreated = async () => {
    // Refresh course data to show new card
    if (courseId) {
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        setCourse({
          id: courseSnap.id,
          ...courseSnap.data(),
        } as Course);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error || "Course not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>

          <Link
            href={`/courses/${course.id}/play`}
            className="inline-flex items-center px-4 py-2 bg-green-300 text-white rounded-lg hover:bg-green-500 transition-colors gap-2"
          >
            <div className="flex items-center justify-between">
              <PlayIcon className="h-5 w-5" />
              <span>Learn</span>
            </div>
          </Link>
        </div>

        <div className="text-center mb-12">
          <p className="text-gray-600 mb-4">{course.description}</p>
          <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm">
            {course.category}
          </span>
        </div>

        <div className="mb-12 flex justify-center w-full">
          <CardCreator courseId={course.id} onCardCreated={handleCardCreated} />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">
            Cards ({course.cards.length})
          </h2>

          {course.cards.length === 0 ? (
            <div className="text-center text-gray-500">
              No cards yet. Create your first card!
            </div>
          ) : (
            <div className="space-y-6">
              {course.cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Front side:
                    </h3>
                    <p className="text-gray-900">{card.question}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Back side:
                    </h3>
                    <p className="text-gray-900">{card.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
