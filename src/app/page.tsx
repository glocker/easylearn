"use client";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/shared/utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { CourseList } from "@/widgets/CourseList";

async function fetchCourses() {
  const snapshot = await getDocs(
    query(collection(db, "courses"), orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map((doc) => {
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
}

export default function HomePage() {
  const {
    data: coursesData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading courses</div>;

  return <CourseList coursesData={coursesData} />;
}
