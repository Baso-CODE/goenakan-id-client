import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Header Skeleton */}
      <section className="pt-32 pb-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
                <Skeleton className="h-3 w-24 mt-2 mx-auto md:mx-0" />
              </div>
            </div>
            <Skeleton className="h-10 w-28 rounded-none" />
          </div>
        </div>
      </section>

      {/* Tabs Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Skeleton */}
            <div className="flex lg:flex-col lg:w-64 gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-none" />
              ))}
            </div>
            {/* Content Area Skeleton */}
            <div className="grow space-y-6">
              <div className="bg-white p-8 space-y-6 shadow-sm border border-gray-100">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-none" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-12 w-32 rounded-none" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
