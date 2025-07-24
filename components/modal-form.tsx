"use client"

import * as React from "react"
import { IconArrowLeft, IconX } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ModalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  onBack?: () => void
  showBackButton?: boolean
}

export function ModalForm({
  open,
  onOpenChange,
  title,
  children,
  onBack,
  showBackButton = true,
}: ModalFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="fixed top-6 right-6 left-auto translate-x-0 translate-y-0 max-w-lg w-full max-h-[calc(100vh-3rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        showCloseButton={false}
      >
        <DialogHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onBack || (() => onOpenChange(false))}
                  className="h-8 w-8"
                >
                  <IconArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
