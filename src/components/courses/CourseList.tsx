"use client";
import { useState, useEffect, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Course } from "@/types/Course";
import { CreateCourseForm } from "./CreateCourseForm";
import { PlayIcon } from "@heroicons/react/24/solid";

interface CourseListProps {
  coursesData: Course[];
}

export const CourseList: React.FC<CourseListProps> = ({ coursesData }) => {
  const router = useRouter();
  const [courses, setCourses] = useState(coursesData);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!courses) {
      console.log("No courses available");
      setCourses([]);
      setCategories([]);
      setIsLoading(false);
      return;
    } else {
      // Get uniq category
      const uniqueCategories = Array.from(
        new Set(courses.map((course) => course.category))
      );

      setCourses(courses);
      setCategories(uniqueCategories);
      setIsLoading(false);
    }
  }, [courses]);

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

  const handleLearnClick = (e: SyntheticEvent, course: any) => {
    e.stopPropagation();
    router.push(`/courses/${course.id}/play`);
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
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
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
            <div
              key={course.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/courses/${course.id}`)}
            >
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div
                      onClick={(e) => handleLearnClick(e, course)}
                      className="px-4 py-2 bg-green-300 text-black rounded-lg hover:bg-green-500"
                    >
                      <div className="flex items-center justify-between">
                        <PlayIcon className="h-5 w-5" />
                        <span>Learn</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 mt-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {course.cards?.length || 0} cards
                  </span>
                  <span className="text-sm text-gray-500">
                    {course.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
