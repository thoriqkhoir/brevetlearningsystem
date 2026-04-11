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
import {
    Banknote,
    CalendarIcon,
    CreditCard,
    FileCheck2,
    FileInput,
    FileOutput,
    FilePen,
    FileSpreadsheet,
    FileText,
    Mails,
    ScrollText,
    X,
} from "lucide-react";
import { DataTableFacetedFilter } from "../DataTableFacetedFIlter";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/Components/ui/calendar";

export const accountingType = [
    {
        value: "pembayaran",
        label: "Pembayaran",
        icon: Banknote,
    },
    {
        value: "surat pemberitahuan",
        label: "Surat Pemberitahuan",
        icon: Mails,
    },
    {
        value: "ketetapan pajak",
        label: "Ketetapan Pajak",
        icon: FileSpreadsheet,
    },
    {
        value: "kewajiban pajak lain",
        label: "Kewajiban Pajak Lain",
        icon: FileText,
    },
    {
        value: "pengembalian",
        label: "Pengembalian",
        icon: FileOutput,
    },
    {
        value: "penyesuaian",
        label: "Penyesuaian",
        icon: FilePen,
    },
];

export const accountingTypeDetail = [
    {
        value: "pembayaran tunai",
        label: "Pembayaran Tunai",
        icon: Banknote,
    },
    {
        value: "spt normal",
        label: "SPT normal",
        icon: FileCheck2,
    },
    {
        value: "spt pembetulan",
        label: "SPT Pembetulan",
        icon: FileInput,
    },
    {
        value: "surat tagihan pajak",
        label: "Surat Tagihan Pajak",
        icon: ScrollText,
    },
];

export const transactionType = [
    {
        value: "debit",
        label: "Debit",
        icon: Banknote,
    },
    {
        value: "credit",
        label: "Kredit",
        icon: CreditCard,
    },
];

interface DataTableLedgerProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTableLedger<TData, TValue>({
    columns,
    data,
}: DataTableLedgerProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [selectedDate, setSelectedDate] = React.useState<Date>();
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

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
            <div className="flex items-center py-4 gap-2">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                            )}
                            onClick={() => setIsCalendarOpen(true)}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                                format(selectedDate, "dd MMMM yyyy", {
                                    locale: id,
                                })
                            ) : (
                                <span>Pilih Tanggal Transaksi</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                table
                                    .getColumn("transaction_date")
                                    ?.setFilterValue(
                                        date ? format(date, "yyyy-MM-dd") : ""
                                    );
                                setIsCalendarOpen(false);
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <div className="flex flex-col lg:flex-row items-center gap-2">
                    {table.getColumn("accounting_type") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("accounting_type")}
                            title="Jenis Pencatatan"
                            options={accountingType}
                        />
                    )}
                    {table.getColumn("accounting_type_detail") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("accounting_type_detail")}
                            title="Rincian Jenis Pencatatan"
                            options={accountingTypeDetail}
                        />
                    )}
                    {table.getColumn("transaction_type") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("transaction_type")}
                            title="Jenis Transaksi"
                            options={transactionType}
                        />
                    )}
                    {isFiltered && (
                        <Button
                            onClick={() => {
                                table.resetColumnFilters();
                                setSelectedDate(undefined);
                            }}
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
