'use client';

import React, { useState, useMemo } from 'react';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconFileExport,
  IconPlus,
  IconArrowRight,
  IconPackageExport,
  IconSearch,
  IconFilter,
  IconCalendar,
  IconArrowUp,
} from '@tabler/icons-react';
import Link from 'next/link';
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
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ModalForm } from '@/components/modal-form';
import { AddOrderRequestForm } from './add-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderRequest } from '../server/actions/order-request';

// Updated schema to match API response
export const schema = z.object({
  id: z.string(),
  origin_city: z.string(),
  destination_city: z.string(),
  pickup_date: z.string(),
  drop_date: z.string(),
  weight: z.string(),
  weight_unit: z.string(),
  urgency_level: z.string(),
  status: z.string(),
  quotations_count: z.number(),
  total_amount_range: z.object({
    min: z.number(),
    max: z.number(),
  }).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const columns: ColumnDef<OrderRequest>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    accessorKey: 'route',
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
          <span>{row.original.origin_city}</span>
          <IconArrowRight className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.destination_city}</span>
        </div>
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'pickup_date',
    header: () => (
      <div className="flex items-center gap-1">
        PICKUP
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {new Date(row.original.pickup_date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}
      </div>
    ),
  },
  {
    accessorKey: 'drop_date',
    header: () => (
      <div className="flex items-center gap-1">
        DELIVERY
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {new Date(row.original.drop_date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}
      </div>
    ),
  },
  {
    accessorKey: 'weight',
    header: () => (
      <div className="flex items-center gap-1">
        WEIGHT
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.weight} {row.original.weight_unit}
      </div>
    ),
  },
  {
    accessorKey: 'quotations_count',
    header: () => (
      <div className="flex items-center gap-1">
        QUOTES
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.quotations_count === 0 ? '-' : `${row.original.quotations_count} quotes`}
      </div>
    ),
  },
  {
    accessorKey: 'total_amount_range',
    header: () => (
      <div className="flex items-center gap-1">
        PRICE RANGE
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => {
      const range = row.original.total_amount_range;
      if (!range) {
        return <div className="font-medium text-gray-500">-</div>;
      }
      if (range.min === range.max) {
        return <div className="font-medium">₹{range.min.toLocaleString()}</div>;
      }
      return (
        <div className="font-medium">
          ₹{range.min.toLocaleString()} - ₹{range.max.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'urgency_level',
    header: () => (
      <div className="flex items-center gap-1">
        URGENCY
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => {
      const urgency = row.original.urgency_level;
      let className = 'px-2 py-1 border';
      
      if (urgency === 'urgent') {
        className += ' bg-red-50 text-red-600 border-red-200 dark:bg-red-900 dark:text-red-300';
      } else if (urgency === 'express') {
        className += ' bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900 dark:text-orange-300';
      } else {
        className += ' bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900 dark:text-blue-300';
      }
      
      return (
        <Badge variant="outline" className={className}>
          {urgency.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: () => (
      <div className="flex items-center gap-1">
        STATUS
        <IconArrowUp className="h-3 w-3" />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      let className = 'px-2 py-1 border';
      
      if (status === 'completed' || status === 'delivered') {
        className += ' bg-green-50 text-green-600 border-green-200 dark:bg-green-900 dark:text-green-300';
      } else if (status === 'pending' || status === 'in_transit') {
        className += ' bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900 dark:text-orange-300';
      } else if (status === 'cancelled') {
        className += ' bg-red-50 text-red-600 border-red-200 dark:bg-red-900 dark:text-red-300';
      } else {
        className += ' bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-300';
      }
      
      return (
        <Badge variant="outline" className={className}>
          {status.replace('_', ' ').toUpperCase()}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/order-request/${row.original.id}`}>
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            Cancel Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface DataTableProps {
  data: OrderRequest[];
}

export function DataTable({ data: initialData }: DataTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('This Week');

  // Handle form submission
  const handleOrderRequestSubmit = (formData: unknown) => {
    console.log('Order request submitted:', formData);
    setIsModalOpen(false);
    // TODO: Implement actual form submission
  };

  // Filtered data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return initialData;
    
    return initialData.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.origin_pincode.toLowerCase().includes(searchLower) ||
        item.destination_pincode.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower) ||
        item.urgency_level.toLowerCase().includes(searchLower)
      );
    });
  }, [initialData, searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
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
    <Card className="w-full">
      <CardHeader className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Order Requests</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track your shipment requests
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <IconFileExport className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <IconPlus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[120px]">
                <IconCalendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="All Time">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <IconFilter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs font-medium text-muted-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
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
                    <div className="flex flex-col items-center gap-2">
                      <IconPackageExport className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No order requests found
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <IconPlus className="mr-2 h-4 w-4" />
                        Create Your First Request
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-2 pt-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm">
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
            Page {table.getState().pagination.pageIndex + 1} of{' '}
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
