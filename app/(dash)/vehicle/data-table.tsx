"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconBox,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDots,
  IconDotsVertical,
  IconFileExport,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
  IconWallet,
  IconArrowRight,
  IconTruck,
  IconAdjustments,
  IconAdjustmentsFilled,
} from "@tabler/icons-react"
import Link from "next/link"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const schema = z.object({
  id: z.string(),
  vehicleNumber: z.string(),
  type: z.string(),
  maxWeight: z.string(),
  status: z.enum(["Available", "Unavailable", "Shipping"]),
  currentLocation: z.string(),
  driver: z.object({
    name: z.string(),
    avatar: z.string(),
  }),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "vehicleNumber",
    header: "VEHICLE NUMBER",
    cell: ({ row }) => {
      return (
        <Link 
          href={`/vehicle/${row.original.vehicleNumber}`}
          className="font-medium text-primary hover:underline"
        >
          {row.original.vehicleNumber}
        </Link>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "TYPE",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.type}
      </div>
    ),
  },
  {
    accessorKey: "maxWeight",
    header: "MAX WT.",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.maxWeight}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status
      let badgeClass = ""
      let icon = null
      
      switch (status) {
        case "Available":
          badgeClass = "bg-green-50 text-green-600 border-green-200"
          icon = <IconCircleCheckFilled className="h-3 w-3" />
          break
        case "Unavailable":
          badgeClass = "bg-red-50 text-red-600 border-red-200"
          icon = <IconLoader className="h-3 w-3" />
          break
        case "Shipping":
          badgeClass = "bg-blue-50 text-blue-600 border-blue-200"
          icon = <IconTrendingUp className="h-3 w-3" />
          break
        default:
          badgeClass = "bg-gray-50 text-gray-600 border-gray-200"
          icon = <IconBox className="h-3 w-3" />
      }
      
      return (
        <Badge variant="outline" className={`px-3 py-1 flex items-center gap-1.5 ${badgeClass}`}>
          {icon}
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "currentLocation",
    header: "CURRENT LOCATION",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.currentLocation}</div>
    ),
  },
  {
    accessorKey: "driver",
    header: "DRIVER",
    cell: ({ row }) => {
      const driver = row.original.driver
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={driver.avatar} alt={driver.name} />
            <AvatarFallback>
              {driver.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{driver.name}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit Vehicle</DropdownMenuItem>
          <DropdownMenuItem>Track Vehicle</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
  onAddClick,
}: {
  data: z.infer<typeof schema>[]
  onAddClick?: () => void
}) {
  const [data, setData] = React.useState(() => initialData.length > 0 ? initialData : [
    {
      id: "vehicle001",
      vehicleNumber: "MH05R6788",
      type: "Heavy Truck",
      maxWeight: "80 tn",
      status: "Shipping" as const,
      currentLocation: "Jaipur, Rajasthan",
      driver: {
        name: "Raj Singh",
        avatar: "/avatars/raj-singh.jpg",
      },
    },
    {
      id: "vehicle002",
      vehicleNumber: "MH04A1234",
      type: "Light Truck",
      maxWeight: "740 kg",
      status: "Available" as const,
      currentLocation: "Chinnwara, MP",
      driver: {
        name: "Ayesha Patel",
        avatar: "/avatars/ayesha-patel.jpg",
      },
    },
    {
      id: "vehicle003",
      vehicleNumber: "MH07B4567",
      type: "Light Truck",
      maxWeight: "120 tn",
      status: "Shipping" as const,
      currentLocation: "Guwahati, Assam",
      driver: {
        name: "Carlos Ramirez",
        avatar: "/avatars/carlos-ramirez.jpg",
      },
    },
    {
      id: "vehicle004",
      vehicleNumber: "MH09C8901",
      type: "Heavy Truck",
      maxWeight: "60 tn",
      status: "Shipping" as const,
      currentLocation: "Pune, Maharashtra",
      driver: {
        name: "Sofia Chen",
        avatar: "/avatars/sofia-chen.jpg",
      },
    },
    {
      id: "vehicle005",
      vehicleNumber: "MH02D2345",
      type: "Heavy Truck",
      maxWeight: "90 tn",
      status: "Unavailable" as const,
      currentLocation: "Bhopal, MP",
      driver: {
        name: "Liam Johnson",
        avatar: "/avatars/liam-johnson.jpg",
      },
    },
  ])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
        <Card className="@container/card mx-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center rounded-lg bg-primary/10 p-2">
                <IconTruck className="size-6 text-primary" />
              </div>
              <div className="">
            <CardTitle>Vehicle Details</CardTitle>

            </div>
            </div>
            <CardAction className="flex items-center gap-2">
              <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <Input 
            type="text" 
            placeholder="Search..." 
            className="h-8 w-[197px]" 
            value={(table.getColumn("vehicleNumber")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("vehicleNumber")?.setFilterValue(event.target.value)
            }
          />
          <Button variant="outline" size="sm">
            <IconAdjustmentsFilled />
            <span className="hidden lg:inline">Filter</span>
            <span className="lg:hidden">Filter</span>
          </Button>
          <Button variant="outline" size="sm">
            <IconFileExport />
            <span className="hidden lg:inline">Export</span>
          </Button>
          <Button variant="default" size="sm" onClick={onAddClick}>
            <IconPlus />
            <span className="hidden lg:inline">Add new vehicle</span>
            <span className="lg:hidden">Add</span>
          </Button>
          <Button
                variant="outline"
                size="icon"
                className="size-8"
              >
                <IconDots/>
              </Button>
        </div>
      </div>
              
            </CardAction>
          </CardHeader>
          <CardContent className="">
            <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-primary/10 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
          </CardContent>
        </Card>

  )
}
