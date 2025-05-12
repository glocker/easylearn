import { useState, useEffect } from "react";
import { Course, fetchUserCourses, updateCourseNotifications } from "../../../../../utils/firebase";
import { useAuth } from "../../../../../contexts/AuthContext";

interface CourseNotificationsListProps {
  userId: string;
}

const CourseNotificationsList = ({ userId }: CourseNotificationsListProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [courseNotifications, setCourseNotifications] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const coursesSection = document.getElementById("courses-section");

    if (!coursesSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          if (!courses.length && !isLoading) {
            fetchCourses();
          }
        }
      },
      {
        threshold: 0.1,
        root: null,
      }
    );

    observer.observe(coursesSection);

    return () => {
      if (coursesSection) {
        observer.unobserve(coursesSection);
      }
    };
  }, [courses.length, isLoading]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const userCourses = await fetchUserCourses();
      setCourses(userCourses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseNotificationToggle = async (courseId: string) => {
    if (!userId) return;

    const newEnabled = !courseNotifications[courseId];

    // Optimistic update
    setCourseNotifications((prev) => ({
      ...prev,
      [courseId]: newEnabled,
    }));

    try {
      const success = await updateCourseNotifications(
        userId,
        courseId,
        newEnabled
      );
      if (!success) {
        // Revert on failure
        setCourseNotifications((prev) => ({
          ...prev,
          [courseId]: !newEnabled,
        }));
      }
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      // Revert on error
      setCourseNotifications((prev) => ({
        ...prev,
        [courseId]: !newEnabled,
      }));
    }
  };

  return (
    <div id="courses-section" className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Course Updates</h2>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">{course.title}</span>
                {course.description && (
                  <span className="text-gray-500 text-sm">{course.description}</span>
                )}
                {course.category && (
                  <span className="text-gray-500 text-xs">{course.category}</span>
                )}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={courseNotifications[course.id] || false}
                  onChange={() => handleCourseNotificationToggle(course.id)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">No courses available</div>
      )}
    </div>
  );
};

export default CourseNotificationsList;