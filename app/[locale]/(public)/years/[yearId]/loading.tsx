import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-73px)]">
      {/* Sidebar placeholder */}
      <div className="hidden md:flex flex-col w-64 bg-surface-container-low p-4 space-y-4 border-e border-surface-variant">
        <Skeleton className="h-10 w-full rounded-lg" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>

      {/* Content placeholder */}
      <div className="flex-1 p-margin-mobile md:p-margin-desktop max-w-[1280px] mx-auto w-full">
        <Skeleton className="h-5 w-56 mb-8" />
        <Skeleton className="h-8 w-72 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
