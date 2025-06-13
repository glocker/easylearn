import { Timestamp } from "firebase/firestore";
import { Card } from "@/types/Card";

export interface Course {
  title: string;
  description: string;
  category: string;
  createdAt: Timestamp;
  cards: Card[];
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedCards: string[];
  correctAnswers: number;
  totalAttempts: number;
}
