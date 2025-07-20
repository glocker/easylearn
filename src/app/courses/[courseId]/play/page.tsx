"use client";
import { useParams } from "next/navigation";
import { CoursePlayer } from "@/features/course/CoursePlayer";
import { CourseList } from "@/widgets/CourseList";

export default function CoursePlayerPage() {
  const params = useParams();
  const courseId = params?.courseId;

  if (!courseId || typeof courseId !== "string") return <CourseList />;

  return <CoursePlayer courseId={courseId} />;
}
