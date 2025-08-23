"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Home, Search, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function NotFound() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push("/dashboard")
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleSearch = () => {
    router.push("/search-shipments")
  }

  return (
    <div className="p-4 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          {/* Error Image */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <Image
                src="/no-activity.png"
                alt="Page not found"
                fill
                className="object-contain opacity-60"
                priority
              />
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">404</h1>
              <h2 className="text-2xl font-semibold text-foreground">
                Page Not Found
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved, deleted, or you might have entered an incorrect URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              
              <Button 
                onClick={handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              
              <Button 
                onClick={handleSearch}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search Shipments
              </Button>
              
              <Button 
                onClick={handleRefresh}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Additional Help */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team or check out our{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm underline"
                onClick={() => router.push("/dashboard")}
              >
                dashboard
              </Button>{" "}
              for more options.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
