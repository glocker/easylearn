import { useState, useEffect } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Course } from "../../types/Course";
import { CreateCourseForm } from "./CreateCourseForm";
import { PlayIcon } from "@heroicons/react/24/solid";

export const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesQuery = query(
          collection(db, "courses"),
          orderBy("createdAt", "desc")
        );

        // Add check for collection existence
        const snapshot = await getDocs(coursesQuery);
        if (snapshot.empty) {
          console.log("No courses available");
          setCourses([]);
          setCategories([]);
          return;
        }

        const coursesData = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Course)
        );

        // Get uniq category
        const uniqueCategories = Array.from(
          new Set(coursesData.map((course) => course.category))
        );

        setCourses(coursesData);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error during course loading occurred:", error);
        setCourses([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const createCourse = async (courseData: Omit<Course, "id">) => {
    try {
      const courseRef = collection(db, "courses");
      const newCourse = {
        ...courseData,
        createdAt: Timestamp.now(),
        cards: [],
      };

      const docRef = await addDoc(courseRef, newCourse);

      // Add new course to the state
      setCourses((prevCourses) => [
        { ...newCourse, id: docRef.id } as Course,
        ...prevCourses,
      ]);

      return docRef.id;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  };

  const handleCreateCourse = async (
    courseData: Omit<Course, "id" | "createdAt" | "cards">
  ) => {
    setIsCreating(true);
    try {
      await createCourse({
        ...courseData,
        cards: [],
      });
      setShowCreateForm(false);
      // Show success message
      alert("Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Courses for learning
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Course
        </button>
      </div>

      {showCreateForm && (
        <CreateCourseForm
          onSubmit={handleCreateCourse}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isCreating}
        />
      )}

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Searching courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Courses not found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}/play`}
                      className="px-4 py-2 bg-green-300 text-black rounded-lg hover:bg-green-500"
                    >
                      <div className="flex items-center justify-between">
                        <PlayIcon className="h-5 w-5" />
                        <span>Learn</span>
                      </div>
                    </Link>
                  </div>
                  <p className="mt-2 text-gray-600">{course.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {course.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.cards.length} cards
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
