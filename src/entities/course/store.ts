import { create } from "zustand";
import { Course, CourseProgress } from "@/entities/course/types";
import { db } from "@/shared/utils/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

interface CourseState {
  currentCourse: Course | null;
  progress: CourseProgress | null;
  isLoading: boolean;
  error: string | null;
  setCurrentCourse: (course: Course) => void;
  updateProgress: (correct: boolean) => void;
  loadCourse: (courseId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  currentCourse: null,
  progress: null,
  isLoading: false,
  error: null,

  setCurrentCourse: (course) => set({ currentCourse: course }),

  updateProgress: (correct) => {
    const { progress } = get();
    if (!progress) return;

    set({
      progress: {
        ...progress,
        correctAnswers: progress.correctAnswers + (correct ? 1 : 0),
        totalAttempts: progress.totalAttempts + 1,
      },
    });
  },

  loadCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const courseRef = collection(db, "courses");
      const q = query(courseRef, where("id", "==", courseId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const courseData = snapshot.docs[0].data() as Course;
        set({ currentCourse: courseData });
      } else {
        set({ error: "Course not found" });
      }
    } catch (error) {
      set({ error: "Error while loading course occured" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
