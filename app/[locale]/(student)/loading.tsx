import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <Skeleton className="h-10 w-72 mb-2" />
      <Skeleton className="h-5 w-96 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="space-y-stack-md">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
        <div className="lg:col-span-2 space-y-stack-md">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
