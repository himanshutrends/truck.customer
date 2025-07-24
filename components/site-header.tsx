import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { IconBell, IconPlus, IconSearch } from "@tabler/icons-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"

const data = {
  user: {
    name: "Himanshu",
    position: "Administrator",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function SiteHeader({ title = "Dashboard" }: { title?: string }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          
          <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search for anything here..." className="pl-10 w-80" />
                <Button size="sm" variant="secondary" className="bg-primary/10 text-primary text-xs absolute right-2 top-1/2 transform -translate-y-1/2 h-6">
                  Ctrl+K
                </Button>
              </div>

              <Select defaultValue="eng">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng">ENG</SelectItem>
                  <SelectItem value="hin">HIN</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <IconBell className="h-5 w-5" />
              </Button>

              <Button variant="outline" size="icon">
                <IconPlus className="h-5 w-5" />
              </Button>
          <NavUser user={data.user} /> 
        </div>
      </div>
    </header>
  )
}
