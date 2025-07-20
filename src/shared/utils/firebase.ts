import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
  cards: any[]; // Assuming 'cards' is of type 'any[]'
}

export const fetchUserCourses = async (): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesRef);

    return coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      category: doc.data().category,
    }));
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

interface UserProfile {
  uid: string;
  email: string;
  username: string;
  accountType: "Student" | "Teacher";
  settings: {
    theme: "auto" | "light" | "dark";
    language: "en" | "de" | "ru";
    timezone: string;
    notifications: {
      studyReminders: string; // time in format "HH:00"
    };
  };
  createdAt: number;
  updatedAt: number;
}

// Function to create/update user profile
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        ...profileData,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

// Function to get user profile
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) return null;

    return {
      uid: userDoc.id,
      ...userDoc.data(),
    } as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Change user profile picture in settings
export const updateUserAvatar = async (uid: string, seed: string) => {
  const userRef = doc(db, "users", uid);

  await setDoc(
    userRef,
    {
      settings: {
        avatar: seed,
      },
    },
    { merge: true }
  );
};
