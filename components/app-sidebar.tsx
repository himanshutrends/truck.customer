"use client"

import * as React from "react"
import {
  IconCamera,
  IconTruck,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
  IconBox,
  IconLayout,
  IconLayoutDashboard,
  IconTicket,
  IconChartArcs3,
  IconReceipt,
} from "@tabler/icons-react"

import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
 
  navGroups: [
    {
      label: "MAIN MENU",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconLayoutDashboard,
          notificationCount: 2,
        },
        {
          title: "Orders",
          url: "/order",
          icon: IconBox,
        },
        {
          title: "Search Shipments",
          url: "/search-shipments",
          icon: IconSearch,
        },
        {
          title: "Quote Requests",
          url: "/quote",
          icon: IconTicket,
        },
      ],
    },
    {
      label: "VEHICLES & DRIVERS",
      items: [
        {
          title: "Vehicles",
          url: "/vehicle",
          icon: IconTruck,
        },
        {
          title: "Drivers",
          url: "/driver",
          icon: IconUser,
        },
      ],
    },
    {
      label: "FINANCES",
      items: [
        {
          title: "Analytics",
          url: "/analytic",
          icon: IconChartArcs3,
        },
        {
          title: "Customers",
          url: "/customer",
          icon: IconUsers,
        },
        {
          title: "Invoices",
          url: "/invoice",
          icon: IconReceipt,
        },
      ],
    },
  ],
 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconTruck className="!size-5" />
                <span className="text-base font-semibold">Trucking Trucks</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group, index) => (
          <NavSecondary key={index} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  )
}
