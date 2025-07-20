import { Timestamp } from "firebase/firestore";
import { Card } from "@/entities/card/types";

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
