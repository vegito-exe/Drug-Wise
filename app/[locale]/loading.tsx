import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
      {/* Hero placeholder */}
      <Skeleton className="h-72 md:h-64 rounded-2xl w-full" />

      {/* Year grid placeholder */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-56" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Content grid placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 rounded-2xl w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-40 rounded-2xl w-full" />
          <Skeleton className="h-40 rounded-2xl w-full" />
        </div>
      </div>
    </div>
  );
}
