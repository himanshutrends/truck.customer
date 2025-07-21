"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDots,
  IconDotsVertical,
  IconFileExport,
  IconLayoutColumns,
  IconPlus,
  IconWallet,
  IconArrowRight,
  IconTruck,
  IconAdjustments,
  IconAdjustmentsFilled,
  IconBox,
  IconCircleCheckFilled,
  IconTrendingUp,
  IconAlertCircle,
  IconAlertCircleFilled,
} from "@tabler/icons-react";
import Link from "next/link";
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
} from "@tanstack/react-table";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const schema = z.object({
  id: z.string(),
  orderId: z.string(),
  companyName: z.string(),
  arrival: z.string(),
  weight: z.string(),
  route: z.object({
    from: z.string(),
    to: z.string(),
  }),
  fee: z.string(),
  status: z.enum(["Delivered", "Pending", "Shipping"]),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
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
    accessorKey: "orderId",
    header: "ORDER ID",
    cell: ({ row }) => {
      return (
        <Link 
          href={`/order/${row.original.orderId}`}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
        >
          {row.original.orderId}
        </Link>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "companyName",
    header: "COMPANY NAME",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.companyName}</div>
    ),
  },
  {
    accessorKey: "arrival",
    header: "ARRIVAL",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.arrival}</div>
    ),
  },
  {
    accessorKey: "weight",
    header: "WT.",
    cell: ({ row }) => <div className="font-medium">{row.original.weight}</div>,
  },
  {
    accessorKey: "route",
    header: "ROUTE",
    cell: ({ row }) => {
      const route = row.original.route;
      return (
        <div className="flex items-center gap-2 font-medium">
          <span>{route.from}</span>
          <IconArrowRight className="h-4 w-4" />
          <span>{route.to}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "fee",
    header: "FEE",
    cell: ({ row }) => <div className="font-medium">{row.original.fee}</div>,
  },
 {
     accessorKey: "status",
     header: "STATUS",
     cell: ({ row }) => {
       const status = row.original.status
       let badgeClass = ""
       let icon = null
       
       switch (status) {
         case "Delivered":
           badgeClass = "bg-green-50 text-green-600 border-green-200 dark:bg-green-900 dark:text-green-300"
           icon = <IconCircleCheckFilled className="h-3 w-3" />
           break
         case "Pending":
           badgeClass = "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300"
           icon = <IconAlertCircleFilled className="h-3 w-3" />
           break
         case "Shipping":
           badgeClass = "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900 dark:text-blue-300"
           icon = <IconTrendingUp className="h-3 w-3" />
           break
         default:
           badgeClass = "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-300"
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
];

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() =>
    initialData.length > 0
      ? initialData
      : [
          {
            id: "order001",
            orderId: "00112233HEM",
            companyName: "Mearsk Shipping",
            arrival: "Jan 26, 2025",
            weight: "12 tons",
            route: {
              from: "Chinnwara, MP",
              to: "New Delhi, MP",
            },
            fee: "₹1,64,000",
            status: "Shipping" as const,
          },
          {
            id: "shipment001",
            orderId: "TRK-2024-001",
            companyName: "Tech Solutions Inc.",
            arrival: "Dec 15, 2024",
            weight: "2.5 tons",
            route: {
              from: "New York",
              to: "Boston",
            },
            fee: "$1,250",
            status: "Shipping" as const,
          },
          {
            id: "shipment002",
            orderId: "TRK-2024-002",
            companyName: "Global Logistics Co.",
            arrival: "Dec 14, 2024",
            weight: "1.8 tons",
            route: {
              from: "Chicago",
              to: "Detroit",
            },
            fee: "$890",
            status: "Delivered" as const,
          },
          {
            id: "shipment003",
            orderId: "TRK-2024-003",
            companyName: "Metro Supplies Ltd.",
            arrival: "Dec 16, 2024",
            weight: "3.2 tons",
            route: {
              from: "Los Angeles",
              to: "San Francisco",
            },
            fee: "$1,650",
            status: "Pending" as const,
          },
          {
            id: "shipment004",
            orderId: "TRK-2024-004",
            companyName: "Coast Manufacturing",
            arrival: "Dec 13, 2024",
            weight: "4.1 tons",
            route: {
              from: "Miami",
              to: "Tampa",
            },
            fee: "$980",
            status: "Delivered" as const,
          },
          {
            id: "shipment005",
            orderId: "TRK-2024-005",
            companyName: "Premier Industries",
            arrival: "Dec 17, 2024",
            weight: "2.9 tons",
            route: {
              from: "Seattle",
              to: "Portland",
            },
            fee: "$1,120",
            status: "Shipping" as const,
          },
        ]
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
  });

  return (
    <Card className="@container/card mx-6">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center rounded-lg bg-primary/10 p-2">
            <IconBox className="size-6 text-primary" />
          </div>
          <div className="">
            <CardTitle>Current Shipping</CardTitle>
          </div>
        </div>
        <CardAction className="flex items-center gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search orders..."
                className="h-8 w-[197px]"
                value={
                  (table.getColumn("orderId")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("orderId")?.setFilterValue(event.target.value)
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
              <Button variant="outline" size="icon" className="size-8">
                <IconDots />
              </Button>
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="">
        <div className="overflow-hidden rounded-lg border">
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
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
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
                  table.setPageSize(Number(value));
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
  );
}
