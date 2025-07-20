import { useState, useEffect } from "react";
import { useAuthStore } from "@/entities/user/store";
import { db } from "@/shared/utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Course, CourseProgress } from "@/entities/course/types";

export const Profile = () => {
  const { user } = useAuthStore();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Get user courses
        const coursesQuery = query(
          collection(db, "courses"),
          where("createdBy", "==", user.id)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData = coursesSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Course)
        );

        // Get user progress
        const progressQuery = query(
          collection(db, "progress"),
          where("userId", "==", user.id)
        );
        const progressSnapshot = await getDocs(progressQuery);
        const progressData = progressSnapshot.docs.reduce(
          (acc, doc) => ({
            ...acc,
            [doc.data().courseId]: doc.data(),
          }),
          {}
        );

        setMyCourses(coursesData);
        setProgress(progressData);
      } catch (error) {
        console.error("Error during data loading occured:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl">
              {user?.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Роль: {user?.role === "admin" ? "Admin" : "User"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-6">My courses</h3>

        {myCourses.length === 0 ? (
          <p className="text-gray-500">You don't have any created cards yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => {
              const courseProgress = progress[course.id];
              const progressPercentage = courseProgress
                ? (courseProgress.correctAnswers /
                    courseProgress.totalAttempts) *
                  100
                : 0;

              return (
                <div
                  key={course.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <h4 className="text-lg font-medium mb-2">{course.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {course.cards.length} cards
                    </span>
                    {courseProgress && (
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {progressPercentage.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
