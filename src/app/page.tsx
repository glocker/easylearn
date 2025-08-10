import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchCourses } from "@/entities/course/api/fetchCourses";
import { CourseList } from "@/widgets/CourseList";
import { getQueryClient } from "./get-query-client";

export default async function HomePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CourseList />
    </HydrationBoundary>
  );
}
