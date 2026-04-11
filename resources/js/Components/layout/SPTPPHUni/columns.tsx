"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";

// Updated type definition to match your bupot data structure
export type SPTPPHUniColumns = {
    name: string;  // Changed from number to string
    npwp: string;
    doc_no: string;  // Changed from number to doc_no
    doc_date: string;  // Changed from date to doc_date
    tax_type: string;  // Added
    tax_code: string;  // Added
    tax_name: string;  // Added
    dpp: number;
    tarif: number;  // Added
    tax: number;  // Added
};

export const columns: ColumnDef<SPTPPHUniColumns>[] = [
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Wajib Pajak" />
        ),
    },
    {
        accessorKey: "npwp",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="NPWP" />
        ),
    },
    {
        accessorKey: "doc_no",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="No. Dokumen"
            />
        ),
    },
    {
        accessorKey: "doc_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal" />
        ),
    },
    {
        accessorKey: "tax_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jenis Pajak" />
        ),
    },
    {
        accessorKey: "tax_code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kode Pajak" />
        ),
    },
    {
        accessorKey: "tax_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Pajak" />
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
        accessorKey: "tarif",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tarif (%)" />
        ),
        cell: ({ row }) => {
            const rate = row.getValue<number>("tarif");
            return <div>{rate * 100}%</div>;
        },
    },
    {
        accessorKey: "tax",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="PPh (Rupiah)" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("tax");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
            return <div>{formatted}</div>;
        },
    }
];