import { Timestamp } from "firebase/firestore";
import { Card } from "@/entities/card/types";

export type CourseId = string;
export interface Course {
  id: CourseId;
  title: string;
  description: string;
  category: string;
  createdAt: Timestamp;
  cards: Card[];
}

export type NewCourseInput = {
  title: string;
  description: string;
  category: string;
};

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedCards: string[];
  correctAnswers: number;
  totalAttempts: number;
}
