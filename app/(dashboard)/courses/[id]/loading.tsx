import { Skeleton } from "@/components/ui/skeleton"

export default function CourseDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-4 md:px-6">
      <Skeleton className="mb-4 h-10 w-72" />
      <Skeleton className="mb-4 h-24 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
