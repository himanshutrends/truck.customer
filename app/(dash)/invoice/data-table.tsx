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
  IconReceipt,
  IconFileText,
  IconFileTypePdf,
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
  date: z.string(),
  paymentStatus: z.enum(["Pending", "Advance Paid", "Completed"]),
  fee: z.string(),
  remaining: z.string(),
  invoice: z.string(),
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
      <Link href={`/invoice/${row.original.id}`} className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
        {row.original.companyName}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "DATE",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.date}</div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "PAYMENT STATUS",
    cell: ({ row }) => {
      const status = row.original.paymentStatus
      let badgeClass = ""
      
      switch (status) {
        case "Completed":
          badgeClass = "bg-green-50 text-green-600 border-green-200"
          break
        case "Advance Paid":
          badgeClass = "bg-blue-50 text-blue-600 border-blue-200"
          break
        case "Pending":
          badgeClass = "bg-orange-50 text-orange-600 border-orange-200"
          break
        default:
          badgeClass = "bg-gray-50 text-gray-600 border-gray-200"
      }
      
      return (
        <Badge variant="outline" className={`px-3 py-1 ${badgeClass}`}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "fee",
    header: "FEE",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.fee}</div>
    ),
  },
  {
    accessorKey: "remaining",
    header: "REMAINING",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.remaining}</div>
    ),
  },
  {
    accessorKey: "invoice",
    header: "INVOICE",
    cell: ({ row }) => {
      const invoice = row.original.invoice
      return invoice === "-" ? (
        <div className="font-medium">-</div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded">
            <IconFileTypePdf className="h-4 w-4 text-red-600" />
          </div>
          <span className="font-medium text-sm">{invoice}</span>
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
          <DropdownMenuItem>Download PDF</DropdownMenuItem>
          <DropdownMenuItem>Send Email</DropdownMenuItem>
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
            id: "12344",
            companyName: "Ram Enterprises",
            date: "20 Nov 2024",
            paymentStatus: "Pending" as const,
            fee: "₹28,000",
            remaining: "₹14,000",
            invoice: "invoice_12344_hne",
          },
          {
            id: "12345",
            companyName: "Bharat Logistics",
            date: "22 Nov 2024",
            paymentStatus: "Completed" as const,
            fee: "₹1,64,000",
            remaining: "₹0",
            invoice: "invoice_12345_tkn",
          },
          {
            id: "12346",
            companyName: "Swift Transport",
            date: "25 Nov 2024",
            paymentStatus: "Advance Paid" as const,
            fee: "₹1,10,700",
            remaining: "₹50,700",
            invoice: "invoice_12346_xyz",
          },
          {
            id: "invoice004",
            companyName: "GreenTech Inn.",
            date: "3 Mar 2024",
            paymentStatus: "Advance Paid" as const,
            fee: "₹75,000",
            remaining: "₹25,000",
            invoice: "invoice_gmtraders_15jul",
          },
          {
            id: "invoice005",
            companyName: "HealthSync Tech...",
            date: "21 Mar 2024",
            paymentStatus: "Completed" as const,
            fee: "₹32,000",
            remaining: "-",
            invoice: "invoice_gmtraders_16jul",
          },
          {
            id: "invoice006",
            companyName: "AquaPure Systems",
            date: "10 Sep 2024",
            paymentStatus: "Completed" as const,
            fee: "₹2,00,000",
            remaining: "-",
            invoice: "invoice_gmtraders_17jul",
          },
          {
            id: "invoice007",
            companyName: "NestGen Energy",
            date: "16 Sep 2024",
            paymentStatus: "Completed" as const,
            fee: "₹1,25,000",
            remaining: "-",
            invoice: "invoice_gmtraders_18jul",
          },
          {
            id: "invoice008",
            companyName: "DataSphere Analytics",
            date: "30 Dec 2024",
            paymentStatus: "Completed" as const,
            fee: "₹1,50,000",
            remaining: "-",
            invoice: "invoice_gmtraders_19jul",
          },
          {
            id: "invoice009",
            companyName: "SolarBright Energy",
            date: "01 Jan 2025",
            paymentStatus: "Completed" as const,
            fee: "₹47,500",
            remaining: "-",
            invoice: "invoice_gmtraders_20jul",
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
            <IconReceipt className="size-6 text-primary" />
          </div>
          <div className="">
            <CardTitle>Invoices</CardTitle>
          </div>
        </div>
        <CardAction className="flex items-center gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search invoices..."
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
