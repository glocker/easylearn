"use client";

import { use } from "react";
import { CourseList } from "./CourseList";
import { QuerySnapshot, DocumentData } from "firebase/firestore";
import { Course } from "../../types/Course";

type Props = {
  promise: Promise<QuerySnapshot<DocumentData>>;
};

export default function CourseListWrapper({ promise }: Props) {
  const snapshot = use(promise);

  const coursesData: Course[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Course, "id">),
  }));

  return <CourseList coursesData={coursesData} />;
}
