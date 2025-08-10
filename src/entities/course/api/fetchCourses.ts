import { db } from "@/shared/utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function fetchCourses() {
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
