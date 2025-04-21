import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  notificationsEnabled?: boolean;
}

export const fetchUserCourses = async (userId: string): Promise<Course[]> => {
  try {
    // Firstly get all courses
    const coursesRef = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesRef);

    // Then get user's course settings
    const userCoursesRef = collection(db, "users", userId, "courseSettings");
    const userCoursesSnapshot = await getDocs(userCoursesRef);

    // Create a map of user's course settings
    const userCourseSettings = new Map(
      userCoursesSnapshot.docs.map((doc) => [
        doc.id,
        { notificationsEnabled: doc.data().notificationsEnabled },
      ])
    );

    // Combine course data with user settings
    const courses = coursesSnapshot.docs.map((doc) => {
      const courseData = doc.data();
      const userSettings = userCourseSettings.get(doc.id);

      return {
        id: doc.id,
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        notificationsEnabled: userSettings?.notificationsEnabled ?? false,
      };
    });

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

// Add function to update course notification settings
export const updateCourseNotifications = async (
  userId: string,
  courseId: string,
  enabled: boolean
): Promise<boolean> => {
  try {
    const courseRef = collection(db, "users", userId, "courseSettings");
    await setDoc(
      doc(courseRef, courseId),
      {
        notificationsEnabled: enabled,
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error updating course notifications:", error);
    return false;
  }
};
