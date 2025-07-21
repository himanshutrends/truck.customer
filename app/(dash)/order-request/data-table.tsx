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
  IconPackageExport,
  IconSearch,
  IconFilter,
  IconCalendar,
  IconArrowUp,
  IconShip,
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
import { ModalForm } from "@/components/modal-form";
import { AddOrderRequestForm } from "./add-form";

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
  route: z.object({
    from: z.string(),
    to: z.string(),
  }),
  pickup: z.string(),
  arrival: z.string(),
  weight: z.string(),
  fee: z.string(),
  vehicle: z.string(),
  status: z.string(),
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
    accessorKey: "route",
    header: () => (
      <div className="flex items-center gap-1">
        ROUTE
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => (
      <Link 
        href={`/order-request/${row.original.id}`}
        className="font-medium hover:underline"
      >
        <div className="flex items-center gap-2">
          <span>{row.original.route.from}</span>
          <IconArrowRight className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.route.to}</span>
        </div>
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "pickup",
    header: () => (
      <div className="flex items-center gap-1">
        PICKUP
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.pickup}</div>
    ),
  },
  {
    accessorKey: "arrival",
    header: () => (
      <div className="flex items-center gap-1">
        ARRIVAL
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.arrival}</div>
    ),
  },
  {
    accessorKey: "weight",
    header: () => (
      <div className="flex items-center gap-1">
        WT.
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.weight}</div>
    ),
  },
  {
    accessorKey: "fee",
    header: () => (
      <div className="flex items-center gap-1">
        FEE
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.fee}</div>
    ),
  },
  {
    accessorKey: "vehicle",
    header: () => (
      <div className="flex items-center gap-1">
        VEHICLE
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.vehicle}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center gap-1">
        STATUS
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status
      
      if (status === "2 REQUESTS") {
        return (
          <Badge variant="outline" className="px-2 py-1 bg-green-50 text-green-600 border-green-200 dark:bg-green-900 dark:text-green-300">
            {status}
          </Badge>
        )
      } else if (status === "Pending") {
        return (
          <Badge variant="outline" className="px-2 py-1 bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900 dark:text-orange-300">
            {status}
          </Badge>
        )
      } else if (status === "-") {
        return <div className="font-medium">-</div>
      } else {
        return (
          <Badge variant="outline" className="px-2 py-1 bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-300">
            {status}
          </Badge>
        )
      }
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
          <DropdownMenuItem>Edit Request</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [data, setData] = React.useState(() =>
    initialData.length > 0
      ? initialData
      : [
          {
            id: "00112233HEM",
            route: {
              from: "Jaipur, Rajasthan",
              to: "New Delhi"
            },
            pickup: "26 Jan 2024",
            arrival: "26 Jan 2024",
            weight: "12 tn",
            fee: "₹28,000",
            vehicle: "TATA Ace",
            status: "2 REQUESTS"
          },
          {
            id: "order002",
            route: {
              from: "Chinnwara, MP",
              to: "New Delhi"
            },
            pickup: "29 Jan 2024",
            arrival: "29 Jan 2024",
            weight: "740 tn",
            fee: "₹1,64,000",
            vehicle: "TATA Ace",
            status: "Pending"
          },
          {
            id: "order003",
            route: {
              from: "Guwahati, Assam",
              to: "Chandigarh"
            },
            pickup: "31 Jan 2024",
            arrival: "31 Jan 2024",
            weight: "120 tn",
            fee: "₹1,10,700",
            vehicle: "TATA Ace",
            status: "-"
          },
          {
            id: "order004",
            route: {
              from: "Pune, Maharashtra",
              to: "Mumbai"
            },
            pickup: "3 Mar 2024",
            arrival: "3 Mar 2024",
            weight: "60 tn",
            fee: "₹75,000",
            vehicle: "Ashok Leyland",
            status: "-"
          },
          {
            id: "order005",
            route: {
              from: "Bhopal, MP",
              to: "Indore"
            },
            pickup: "21 Mar 2024",
            arrival: "21 Mar 2024",
            weight: "90 tn",
            fee: "-",
            vehicle: "-",
            status: "-"
          },
          {
            id: "order006",
            route: {
              from: "Kolkata, West Bengal",
              to: "Bhubaneswar"
            },
            pickup: "10 Sep 2024",
            arrival: "10 Sep 2024",
            weight: "45 tn",
            fee: "-",
            vehicle: "-",
            status: "-"
          },
          {
            id: "order007",
            route: {
              from: "Surat, Gujarat",
              to: "Ahmedabad"
            },
            pickup: "16 Sep 2024",
            arrival: "16 Sep 2024",
            weight: "12 tn",
            fee: "-",
            vehicle: "-",
            status: "-"
          },
          {
            id: "order008",
            route: {
              from: "Lucknow, UP",
              to: "Noida"
            },
            pickup: "30 Dec 2024",
            arrival: "30 Dec 2024",
            weight: "56 tn",
            fee: "₹1,50,000",
            vehicle: "TATA Ace",
            status: "-"
          },
          {
            id: "order009",
            route: {
              from: "Hyderabad, Telangana",
              to: "Bengaluru"
            },
            pickup: "01 Jan 2025",
            arrival: "01 Jan 2025",
            weight: "109 tn",
            fee: "-",
            vehicle: "-",
            status: "-"
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

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [timeFilter, setTimeFilter] = React.useState("This Week");

  // Handle form submission
  const handleOrderRequestSubmit = (formData: any) => {
    // Generate a new order request ID
    const newId = `order${String(data.length + 1).padStart(3, '0')}`;
    
    // Create new order request from form data
    const newOrderRequest = {
      id: newId,
      route: {
        from: formData.pickup_location,
        to: formData.destination
      },
      pickup: formData.pickup_date,
      arrival: formData.arrival_date,
      weight: formData.weight,
      fee: formData.price ? `₹${formData.price}` : "-",
      vehicle: formData.vehicle_type || "-",
      status: "Pending"
    };
    
    // Add to the data array
    setData(prevData => [newOrderRequest, ...prevData]);
  };

  // Filtered data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.route.from.toLowerCase().includes(searchLower) ||
        item.route.to.toLowerCase().includes(searchLower) ||
        item.vehicle.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchQuery]);

  const table = useReactTable({
    data: filteredData,
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
            <IconPackageExport className="size-6 text-primary" />
          </div>
          <div className="">
            <CardTitle>Order Requests</CardTitle>
          </div>
        </div>
        <CardAction className="flex items-center gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <IconSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search"
                  className="h-8 w-[197px] pl-8"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <IconFilter className="h-4 w-4" />
                <span className="hidden lg:inline">Filter</span>
              </Button>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="max-h-8 w-fit">
                  <div className="flex items-center gap-2">
                    <IconCalendar className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                  <SelectItem value="Last Month">Last Month</SelectItem>
                  <SelectItem value="This Year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <IconFileExport className="h-4 w-4" />
                <span className="hidden lg:inline">Export</span>
              </Button>
              <Button variant="default" size="sm" onClick={() => setIsModalOpen(true)}>
                <IconPlus className="h-4 w-4" />
                Create New Request
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
      <ModalForm
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Create New Shipment Request"
        showBackButton={true}
      >
        <AddOrderRequestForm 
          onSubmit={handleOrderRequestSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </ModalForm>
    </Card>
  );
}
