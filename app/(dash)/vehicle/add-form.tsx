"use client"

import * as React from "react"
import { IconFileTypePdf, IconUpload, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface VehicleFormData {
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  maxLoad: string;
  gpsNumber: string;
}

interface AddVehicleFormProps {
  onSubmit: (data: VehicleFormData) => void
  onCancel?: () => void
}

export function AddVehicleForm({ onSubmit, onCancel }: AddVehicleFormProps) {
  const [formData, setFormData] = React.useState({
    vehicleType: "",
    vehicleModel: "",
    vehicleNumber: "",
    maxLoad: "",
    gpsNumber: "",
  })
  
  const [attachedFiles, setAttachedFiles] = React.useState<string[]>([
    "registration-details",
    "pollution-regulations"
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const removeFile = (fileName: string) => {
    setAttachedFiles(files => files.filter(f => f !== fileName))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vehicle Details Section */}
      <div>
        <h3 className="text-sm font-medium mb-2">VEHICLE DETAILS</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please provide the truck&apos;s essential details, including registration, pollution compliance, and state permits for our records.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type*</Label>
            <Select  value={formData.vehicleType} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Heavy Truck" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heavy-truck">Heavy Truck</SelectItem>
                <SelectItem value="light-truck">Light Truck</SelectItem>
                <SelectItem value="medium-truck">Medium Truck</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleModel">Vehicle Model*</Label>
            <Input
              id="vehicleModel"
              placeholder="Mercedes SK"
              value={formData.vehicleModel}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle Number*</Label>
            <Input
              id="vehicleNumber"
              placeholder="MH05R6788"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxLoad">Max load*</Label>
            <div className="flex">
              <Input
                id="maxLoad"
                placeholder="120"
                value={formData.maxLoad}
                onChange={(e) => setFormData(prev => ({ ...prev, maxLoad: e.target.value }))}
                className="rounded-r-none"
              />
              <Select defaultValue="tonnes">
                <SelectTrigger className="w-24 rounded-l-none border-l-0 bg-primary/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tonnes">Tonnes</SelectItem>
                  <SelectItem value="kg">KG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="gpsNumber">GPS Number*</Label>
            <Input
              id="gpsNumber"
              placeholder="GPS Number e.g. #3455H3"
              value={formData.gpsNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, gpsNumber: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Attach Documents Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">ATTACH DOCUMENTS</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Attach the following documents to keep a record</p>
          <p>1) Registration Details</p>
          <p>2) Pollution Regulations</p>
          <p>3) State Permits</p>
        </div>

        {/* File Upload Area */}
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <IconUpload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm">
                Drag and drop file here or{" "}
                <button type="button" className="text-blue-600 underline">
                  Choose File
                </button>
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Supported formats : PDF, XLS, XLSX
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum File Size: 25 MB
          </p>
        </div>

        {/* Attached Files */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((fileName) => (
              <div
                key={fileName}
                className="flex items-center gap-2 bg-white border rounded px-3 py-2 text-sm"
              >
                <IconFileTypePdf className="h-4 w-4 text-red-500" />
                <span>{fileName}</span>
                <button
                  type="button"
                  onClick={() => removeFile(fileName)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <IconX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Save New Vehicle
      </Button>
    </form>
  )
}
