import { useRouter } from "next/router";
import { CoursePlayer } from "../../components/courses/CoursePlayer";
import { CourseList } from "../../components/courses/CourseList";

export default function CoursePlayerPage() {
  const router = useRouter();
  const { courseId } = router.query;

  if (!courseId || typeof courseId !== "string") return <CourseList />;

  return <CoursePlayer courseId={courseId} />;
}
