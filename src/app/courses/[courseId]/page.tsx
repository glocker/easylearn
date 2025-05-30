"use client";
import { useParams } from "next/navigation";
import { CourseDetails } from "@/components/courses/CourseDetails";

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params?.courseId;

  if (!courseId || typeof courseId !== "string") return <CourseDetails />;

  return <CourseDetails courseId={courseId} />;
}
