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
  IconUsers,
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
  companyName: z.string(),
  contactPerson: z.string(),
  phoneNo: z.string(),
  noOfOrders: z.number(),
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
    accessorKey: "companyName",
    header: "COMPANY NAME",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.companyName}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "contactPerson",
    header: "CONTACT PERSON",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.contactPerson}</div>
    ),
  },
  {
    accessorKey: "phoneNo",
    header: "PHONE NO.",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.phoneNo}</div>
    ),
  },
  {
    accessorKey: "noOfOrders",
    header: "NO. OF ORDERS",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.noOfOrders}</div>
    ),
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
          <DropdownMenuItem>Edit Customer</DropdownMenuItem>
          <DropdownMenuItem>Contact</DropdownMenuItem>
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
            id: "customer001",
            companyName: "Mearsk Shipping",
            contactPerson: "Raj Singh",
            phoneNo: "+91 45564 33443",
            noOfOrders: 35,
          },
          {
            id: "customer002",
            companyName: "TechNova Solutions",
            contactPerson: "Ayesha Patel",
            phoneNo: "+91 89975 78614",
            noOfOrders: 67,
          },
          {
            id: "customer003",
            companyName: "TechWave Solutions",
            contactPerson: "Michael Johnson",
            phoneNo: "+91 12345 67890",
            noOfOrders: 89,
          },
          {
            id: "customer004",
            companyName: "GreenTech Inn.",
            contactPerson: "Emily Chen",
            phoneNo: "+91 98765 43210",
            noOfOrders: 23,
          },
          {
            id: "customer005",
            companyName: "HealthSync Tech...",
            contactPerson: "Carlos Mendoza",
            phoneNo: "+91 55443 22112",
            noOfOrders: 83,
          },
          {
            id: "customer006",
            companyName: "AquaPure Systems",
            contactPerson: "Sofia Kim",
            phoneNo: "+91 11223 44556",
            noOfOrders: 16,
          },
          {
            id: "customer007",
            companyName: "NestGen Energy",
            contactPerson: "Liam O'Connor",
            phoneNo: "+91 33445 66778",
            noOfOrders: 2,
          },
          {
            id: "customer008",
            companyName: "DataSphere Analytics",
            contactPerson: "Ella Russo",
            phoneNo: "+91 99887 66554",
            noOfOrders: 55,
          },
          {
            id: "customer009",
            companyName: "SolarBright Energy",
            contactPerson: "Amir Khan",
            phoneNo: "+91 22112 33445",
            noOfOrders: 48,
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
            <IconUsers className="size-6 text-primary" />
          </div>
          <div className="">
            <CardTitle>Customers</CardTitle>
          </div>
        </div>
        <CardAction className="flex items-center gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search customers..."
                className="h-8 w-[197px]"
                value={
                  (table.getColumn("companyName")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("companyName")?.setFilterValue(event.target.value)
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
