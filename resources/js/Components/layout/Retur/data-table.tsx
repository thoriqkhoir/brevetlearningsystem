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
import { DataTableFacetedFilter } from "../DataTableFacetedFIlter";
import {
    Banknote,
    Check,
    HandCoins,
    Pencil,
    Plus,
    Trash,
    X,
} from "lucide-react";

export const status = [
    {
        value: "created",
        label: "Created",
        icon: Plus,
    },
    {
        value: "approved",
        label: "Approved",
        icon: Check,
    },
    {
        value: "canceled",
        label: "Canceled",
        icon: X,
    },
    {
        value: "deleted",
        label: "Deleted",
        icon: Trash,
    },
    {
        value: "amanded",
        label: "Amanded",
        icon: Pencil,
    },
];

interface DataTableReturProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setSelectedIds: (ids: string[]) => void;
}

export function DataTableRetur<TData extends { id: string }, TValue>({
    columns,
    data,
    setSelectedIds,
}: DataTableReturProps<TData, TValue>) {
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
        const selectedIds = table
            .getSelectedRowModel()
            .rows.map((row) => row.original.id);
        setSelectedIds(selectedIds);
    }, [table.getSelectedRowModel().rows, setSelectedIds]);

    return (
        <>
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Cari Nomor Retur..."
                    value={
                        (table
                            .getColumn("retur_number")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("retur_number")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-primary-foreground text-sm placeholder:text-sm"
                />
                <div className="flex items-center gap-2">
                    {table.getColumn("status") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("status")}
                            title="Status"
                            options={status}
                        />
                    )}
                    {isFiltered && (
                        <Button
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <X />
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
                                    Belum ada data.
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
