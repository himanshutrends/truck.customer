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

interface AddDriverFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function AddDriverForm({ onSubmit, onCancel }: AddDriverFormProps) {
  const [formData, setFormData] = React.useState({
    driverName: "",
    dateOfBirth: "",
    aadhaarNumber: "",
    maxLoad: "",
    phoneNumber: "",
  })
  
  const [attachedFiles, setAttachedFiles] = React.useState<string[]>([
    "drivers-licence",
    "aadhaar-card"
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
      {/* Driver Details Section */}
      <div>
        <h3 className="text-sm font-medium mb-2">DRIVER DETAILS</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please provide the driver's essential details, including name, ID Proofs - Aadhar Card and Driver's Licence for our records.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="driverName">Driver Name*</Label>
            <Input
              id="driverName"
              placeholder="Mercedes SK"
              value={formData.driverName}
              onChange={(e) => setFormData(prev => ({ ...prev, driverName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth*</Label>
            <Input
              id="dateOfBirth"
              type="date"
              placeholder="26 / 01 / 2000"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aadhaarNumber">Aadhaar Number*</Label>
            <Input
              id="aadhaarNumber"
              placeholder="4554 4552 2121 1120"
              value={formData.aadhaarNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, aadhaarNumber: e.target.value }))}
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
            <Label htmlFor="phoneNumber">Phone Number*</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                <span className="text-sm">+91</span>
              </div>
              <Input
                id="phoneNumber"
                placeholder="Mobile Number e.g. #34555 33342"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attach Documents Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">ATTACH DOCUMENTS</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Attach the following documents to keep a record</p>
          <p>1) Aadhar Details</p>
          <p>2) Driver Permit</p>
          <p>3) Drivers Licence</p>
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
        Save New Driver
      </Button>
    </form>
  )
}
