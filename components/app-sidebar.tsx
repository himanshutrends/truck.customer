"use client";

import * as React from "react";
import {
  IconTruck,
  IconLayoutDashboard,
  IconUser,
  IconUsers,
  IconBox,
  IconTicket,
  IconChartArcs3,
  IconReceipt,
  IconPackageExport,
  IconChevronRight,
  IconTruckDelivery,
  IconSearch,
  type Icon,
} from "@tabler/icons-react";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCurrentUserAction } from "@/app/(auth)/login/server/actions/auth";
import { UserRole, SessionUser } from "@/lib/types";

type NavItem = {
  title: string;
  url: string;
  icon: Icon;
  notificationCount?: number;
  roles?: UserRole[]; // Roles that can see this item
};

type NavGroup = {
  label: string;
  items: NavItem[];
  roles?: UserRole[]; // Roles that can see this group
};

// Define navigation structure with role-based content
const getNavigationData = (userRole: UserRole): { navGroups: NavGroup[] } => {
  const navGroups: NavGroup[] = [
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
          title: userRole === 'customer' ? "My Orders" : "Orders",
          url: "/order",
          icon: IconBox,
        },
        {
          title: "My Order Requests",
          url: "/order-request",
          icon: IconPackageExport,
          roles: ['customer']
        },
        {
          title: "Search Shipments",
          url: "/search-shipments",
          icon: IconSearch,
          roles: ['admin', 'manager'], // Only admin and manager can see this
        },
        {
          title: userRole === 'customer' ? "My Quote Requests" : "Quote Requests",
          url: "/quote",
          icon: IconTicket,
        },
      ],
    },
    {
      label: "VEHICLES & DRIVERS",
      items: [
        {
          title: userRole === 'vendor' ? "My Vehicles" : "Vehicles",
          url: "/vehicle",
          icon: IconTruck,
        },
        {
          title: userRole === 'vendor' ? "My Drivers" : "Drivers",
          url: "/driver",
          icon: IconUser,
        },
      ],
      roles: ['admin', 'manager', 'vendor'], // Only these roles can see this section
    },
    {
      label: "FINANCES",
      items: [
        {
          title: userRole === 'vendor' ? "My Analytics" : "Analytics",
          url: "/analytics",
          icon: IconChartArcs3,
          roles: ['admin', 'manager', 'vendor'],
        },
        {
          title: "Customers",
          url: "/customer",
          icon: IconUsers,
          roles: ['admin', 'manager'], // Only admin and manager can see customers
        },
        {
          title: userRole === 'customer' ? "My Invoices" : "Invoices",
          url: "/invoice",
          icon: IconReceipt,
        },
      ],
    },
  ];

  // Filter groups and items based on user role
  return {
    navGroups: navGroups
      .filter(group => !group.roles || group.roles.includes(userRole))
      .map(group => ({
        ...group,
        items: group.items.filter(item => !item.roles || item.roles.includes(userRole))
      }))
      .filter(group => group.items.length > 0) // Remove empty groups
  };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userRole, setUserRole] = React.useState<UserRole>('customer');
  const [userData, setUserData] = React.useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await getCurrentUserAction();
        if (user) {
          setUserRole(user.role as UserRole);
          setUserData(user);
        }
      } catch (error) {
        console.error('Error getting user role:', error);
        // Default to customer role if error
        setUserRole('customer');
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // Show loading state or default navigation while fetching user data
  const navigationData = React.useMemo(() => {
    if (isLoading) {
      // Return minimal navigation during loading
      return {
        navGroups: [
          {
            label: "MAIN MENU",
            items: [
              {
                title: "Dashboard",
                url: "/dashboard",
                icon: IconLayoutDashboard,
              },
            ],
          },
        ],
      };
    }
    return getNavigationData(userRole);
  }, [userRole, isLoading]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconTruckDelivery className="!size-5 text-primary" />
                <span className="text-base font-semibold">Trucking Trucks</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigationData.navGroups.map((group, index) => (
          <NavSecondary key={index} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* Only show Search Shipments footer for admin and manager */}
        {(userRole === 'admin' || userRole === 'manager') && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Search Shipments"
                className="data-[slot=sidebar-menu-button]:!p-1.5 data-[slot=sidebar-menu-button]:!bg-accent"
              >
                <a href="/search-shipments">
                  <IconSearch className="!size-5" />
                  <span className="font-semibold">Search Shipments</span>
                  <IconChevronRight className="!size-5 ml-auto" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        {userData && (
          <NavUser 
            user={{
              name: userData.email, // Use email as name since name doesn't exist
              position: userData.role || 'User',
              avatar: '/profile.png' // Default avatar since avatar doesn't exist
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
