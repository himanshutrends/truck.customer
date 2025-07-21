"use client";

import * as React from "react";
import { IconChevronDown, type Icon } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "./ui/badge";

export function NavSecondary({
  label,
  items,
  ...props
}: {
  label: string;
  items: {
    title: string;
    url: string;
    icon: Icon;
    isActive?: boolean;
    notificationCount?: number;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  // Function to check if a menu item is active
  const isItemActive = (itemUrl: string) => {
    // Exact match for root paths
    if (itemUrl === "/" && pathname === "/") return true;
    
    // For non-root paths, check if the pathname starts with the item URL
    if (itemUrl !== "/" && pathname.startsWith(itemUrl)) return true;
    
    return false;
  };

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup {...props}>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            {label}
            <IconChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = isItemActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild isActive={isActive} className={isActive ? "bg-primary/10! text-primary!" : ""}>
                      <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                          {item.notificationCount && item.notificationCount > 0 && (
                            <Badge variant="destructive" className="ml-auto rounded-full">
                              {item.notificationCount}
                            </Badge>
                          )}
                      </a>
                    </SidebarMenuButton>
                    
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
