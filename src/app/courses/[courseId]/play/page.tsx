"use client";
import { useParams } from "next/navigation";
import { CoursePlayer } from "../../../../components/courses/CoursePlayer";
import { CourseList } from "../../../../components/courses/CourseList";

export default function CoursePlayerPage() {
  const params = useParams();
  const courseId = params?.courseId;

  if (!courseId || typeof courseId !== "string") return <CourseList />;

  return <CoursePlayer courseId={courseId} />;
}
