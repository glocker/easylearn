import { Suspense } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import CourseListWrapper from "../components/courses/CourseListWrapper";

export default function HomePage({ courses }: { courses: any[] }) {
  const coursesPromise = getDocs(
    query(collection(db, "courses"), orderBy("createdAt", "desc"))
  );

  return (
    <Suspense fallback={<p>Загрузка курсов...</p>}>
      <CourseListWrapper promise={coursesPromise} />
    </Suspense>
  );
}
