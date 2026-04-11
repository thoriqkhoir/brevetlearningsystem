"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";

// Updated type definition to match your bupot data structure
export type SPT21Columns = {
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
    facility: string;  // Added
};

export const columns: ColumnDef<SPT21Columns>[] = [
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
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
                title="Nomor Bukti Potong"
            />
        ),
    },
    {
        accessorKey: "doc_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Bukti Pemotongan" />
        ),
    },
    {
        accessorKey: "tax_code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kode Objek Pajak" />
        ),
    },
    {
        accessorKey: "dpp",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Penghasilan Bruto" />
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
            <DataTableColumnHeader column={column} title="Tarif Pajak(%)" />
        ),
        cell: ({ row }) => {
            const rate = row.getValue<number>("tarif");
            return <div>{rate}%</div>;
        },
    },
    {
        accessorKey: "tax",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pajak Penghasilan" />
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
    },
    {
        accessorKey: "facility",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fasilitas Perpajakan " />
        ),
        
    },
    
];