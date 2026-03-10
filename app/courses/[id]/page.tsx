import CourseDetailPage from "../ui/course-detail-page"

export default function Page({ params }: { params: { id: string } }) {
  return <CourseDetailPage courseId={params.id} />
}
