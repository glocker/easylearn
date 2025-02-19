import { Timestamp } from "firebase/firestore";

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  cards: Array<{
    question: string;
    answer: string;
  }>;
  createdAt: Timestamp;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedCards: string[];
  correctAnswers: number;
  totalAttempts: number;
}
