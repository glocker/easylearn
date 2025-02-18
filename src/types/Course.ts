export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  cards: Card[];
  createdBy: string;
  createdAt: Date;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedCards: string[];
  correctAnswers: number;
  totalAttempts: number;
}
