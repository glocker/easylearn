import { Suspense } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { CourseList } from "../components/courses/CourseList";

export default async function HomePage() {
  const snapshot = await getDocs(
    query(collection(db, "courses"), orderBy("createdAt", "desc"))
  );

  const coursesData = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      category: data.category,
      cards: data.cards,
      createdAt: data.createdAt.toDate().toISOString(),
    };
  });

  return <CourseList coursesData={coursesData} />;
}
