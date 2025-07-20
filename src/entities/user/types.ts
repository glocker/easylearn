import { Timestamp } from "firebase/firestore";

export type AccountType = "Teacher" | "Student";

export interface User {
  uid: string;
  email: string;
  accountType: AccountType;
  avatar: string;
  username: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: {
    language: string;
    notifications: {
      studyReminders: string;
    };
    theme: string;
  };
  timezone: string;
}
