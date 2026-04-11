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
import { Check, Pencil, Plus, Trash, X } from "lucide-react";

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

interface DataTableBupotA2Props<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setSelectedIds: (ids: string[]) => void;
}

export function DataTableBupotA2<TData extends { id: string }, TValue>({
    columns,
    data,
    setSelectedIds,
}: DataTableBupotA2Props<TData, TValue>) {
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
        <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Cari nama..."
                        value={
                            (table
                                .getColumn("customer_name")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("customer_name")
                                ?.setFilterValue(event.target.value)
                        }
                        className="h-10 w-[150px] lg:w-[250px] bg-white"
                    />
                    {table.getColumn("status") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("status")}
                            title="Status"
                            options={status}
                        />
                    )}
                    {isFiltered && (
                        <Button
                            variant="ghost"
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
            <div className="rounded-md border bg-white overflow-auto">
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
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}