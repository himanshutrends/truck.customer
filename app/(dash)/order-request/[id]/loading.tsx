import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrderRequestDetailLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Details Skeleton */}
          <div>
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Details Skeleton */}
          <div>
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Quotations Table Skeleton */}
          <div>
            <Skeleton className="h-4 w-24 mb-4" />
            <div className="border rounded-lg p-4">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
