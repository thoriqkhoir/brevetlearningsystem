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
import { X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface DataTableBankProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTableBank<TData, TValue>({
    columns,
    data,
}: DataTableBankProps<TData, TValue>) {
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

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-center py-4 gap-2 flex-wrap">
                <Input
                    placeholder="Cari nama bank..."
                    value={
                        (table
                            .getColumn("bank_name")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("bank_name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-[200px] bg-primary-foreground text-sm placeholder:text-sm"
                />
                <Input
                    placeholder="Cari nomor rekening..."
                    value={
                        (table
                            .getColumn("account_number")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("account_number")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-[200px] bg-primary-foreground text-sm placeholder:text-sm"
                />
                <Select
                    value={
                        (table
                            .getColumn("account_type")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onValueChange={(value) =>
                        table
                            .getColumn("account_type")
                            ?.setFilterValue(value === "all" ? "" : value)
                    }
                >
                    <SelectTrigger className="w-[180px] bg-primary-foreground">
                        <SelectValue placeholder="Jenis Rekening" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Jenis</SelectItem>
                        <SelectItem value="tabungan">Tabungan</SelectItem>
                        <SelectItem value="giro">Giro</SelectItem>
                        <SelectItem value="deposito">Deposito</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
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

                <div className="lg:ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <div className="rounded-md border overflow-x-auto w-full">
                <Table className="min-w-[800px] w-full table-fixed">
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
                                                      header.getContext(),
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
                                                cell.getContext(),
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
            <div className="py-4">
                <DataTablePagination table={table} />
            </div>
        </>
    );
}
