"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";

export type SPTPPNColumns = {
    name: number;
    npwp: string;
    number: string;
    date: string;
    dpp: number;
    dpp_lain: number;
    ppn: number;
    ppnbm: number;
};

export const columns: ColumnDef<SPTPPNColumns>[] = [
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama PKP" />
        ),
    },
    {
        accessorKey: "npwp",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="NPWP" />
        ),
    },
    {
        accessorKey: "number",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="No. Faktur / Dokumen / Retur"
            />
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal" />
        ),
    },
    {
        accessorKey: "dpp",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="DPP (Rupiah)" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("dpp");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "dpp_lain",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="DPP Lain (Rupiah)" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("dpp_lain");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "ppn",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="PPn (Rupiah)" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("ppn");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "ppnbm",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="PPnBM (Rupiah)" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("ppnbm");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
            return <div>{formatted}</div>;
        },
    },
];
