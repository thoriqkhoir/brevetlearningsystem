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
import { X } from "lucide-react";

interface DataTableSPTPPHUniProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

// Updated interface to match your bupots data structure
interface SPTPPHUniData {
    npwp: string;
    name: string;
    doc_no: string;
    doc_date: string;
    tax_type: string;
    tax_code: string;
    tax_name: string;
    dpp: number;
    tarif: number;
    tax: number;
    facility?: string; 
    [key: string]: any;
}

export function DataTableSPTPPHUni<TData extends SPTPPHUniData, TValue>({
    columns,
    data,
}: DataTableSPTPPHUniProps<TData, TValue>) {
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
// Updated totals to match the new data structure and exclude "pph ditanggung pemerintah" from calculations
const totalDpp = data.reduce((sum, row) => 
    row?.facility === "pph ditanggung pemerintah" ? sum : sum + (row.dpp || 0), 0);

const filteredRows = data.filter(row => row?.facility !== "pph ditanggung pemerintah");
const totalTarif = filteredRows.length > 0
    ? filteredRows.reduce((sum, row) => sum + (row.tarif || 0), 0) / filteredRows.length
    : 0;

const totalTax = data.reduce((sum, row) => 
    row?.facility === "pph ditanggung pemerintah" ? sum : sum + (row.tax || 0), 0);

// Fix the console.log to display the objects properly
console.log("Filtered rows:", filteredRows);

    return (
        <>
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
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="font-bold text-right"
                            >
                                Total
                            </TableCell>
                            <TableCell className="font-bold">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(totalDpp)}
                            </TableCell>
                            <TableCell className="font-bold">
                                {totalTarif.toFixed(2)}%
                            </TableCell>
                            <TableCell className="font-bold">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(totalTax)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </>
    );
}