"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SessionUser } from "@/lib/types";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
  user: SessionUser | null;
}

// Function to get page title based on pathname
function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0) return "Dashboard"
  
  // Handle vehicle detail pages (e.g., /vehicle/MH05R6788)
  if (segments.length === 2 && segments[0] === 'vehicle') {
    return "Vehicle Details"
  }
  
  // Handle driver detail pages (e.g., /driver/ID050)
  if (segments.length === 2 && segments[0] === 'driver') {
    return "Driver Details"
  }
  
  // Handle order-request detail pages (e.g., /order-request/00112233HEM)
  if (segments.length === 2 && segments[0] === 'order-request') {
    return "My Orders Requests/Detail"
  }
  
  // Handle order-request list page
  if (segments.length === 1 && segments[0] === 'order-request') {
    return "My Orders Requests"
  }
  
  // Handle order detail pages (e.g., /order/00112233HEM)
  if (segments.length === 2 && segments[0] === 'order') {
    return "Order Details"
  }
  
  const lastSegment = segments[segments.length - 1]
  
  // Convert kebab-case to Title Case
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function DashboardClientWrapper({ children, user }: DashboardClientWrapperProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem", // 72 * 0.25rem = 18rem
          "--header-height": "3rem",  // 12 * 0.25rem = 3rem
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={pageTitle} user={user} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
