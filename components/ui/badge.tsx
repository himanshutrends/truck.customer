import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "cheapest"
}

const badgeVariants = {
  default: "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80",
  secondary: "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80",
  destructive: "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80",
  outline: "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 text-neutral-950",
  success: "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 border-transparent bg-green-50 text-green-600",
  cheapest: "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 border-transparent bg-blue-50 text-blue-600"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants[variant], className)} {...props} />
  )
}

export { Badge }
