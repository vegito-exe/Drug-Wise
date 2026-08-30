import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
      <aside className="lg:w-60 shrink-0 bg-surface-container-low border-e border-surface-variant p-4">
        <Skeleton className="h-10 w-full rounded-lg mb-2" />
        <Skeleton className="h-10 w-full rounded-lg mb-2" />
        <Skeleton className="h-10 w-full rounded-lg mb-2" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </aside>
      <div className="flex-1 p-margin-mobile md:p-margin-desktop max-w-[1280px] mx-auto w-full space-y-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    </div>
  );
}
