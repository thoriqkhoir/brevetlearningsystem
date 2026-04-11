"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import React from "react";
import { Input } from "@/Components/ui/input";
import { DataTablePagination } from "../DataTablePagination";
import { DataTableViewOptions } from "../DataTableViewOption";
import { X, Search } from "lucide-react";

interface DataTableParticipantProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setSelectedIds?: (ids: string[]) => void; // Make optional
}

export function DataTableParticipant<TData extends { id: string }, TValue>({
    columns,
    data,
    setSelectedIds,
}: DataTableParticipantProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    const isFiltered = table.getState().columnFilters.length > 0;

    React.useEffect(() => {
        if (setSelectedIds) {
            const selectedIds = table
                .getSelectedRowModel()
                .rows.map((row) => row.original.id);
            setSelectedIds(selectedIds);
        }
    }, [table.getSelectedRowModel().rows, setSelectedIds]);

    return (
        <>
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                        <Input
                            placeholder="Cari nama peserta..."
                            value={
                                (table
                                    .getColumn("user_name")
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn("user_name")
                                    ?.setFilterValue(event.target.value)
                            }
                            className="pl-10 max-w-lg bg-primary-foreground text-sm placeholder:text-sm"
                        />
                    </div>

                    {isFiltered && (
                        <Button
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3"
                            variant="outline"
                        >
                            Reset
                            <X size={14} />
                        </Button>
                    )}
                </div>
                <DataTableViewOptions table={table} />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
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
                                    Belum ada peserta yang terdaftar.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </>
    );
}
