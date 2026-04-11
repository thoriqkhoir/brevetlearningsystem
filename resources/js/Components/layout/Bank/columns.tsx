"use client";

import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { router } from "@inertiajs/react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Edit, Trash2, Star } from "lucide-react";
import { Badge } from "@/Components/ui/badge";

export type BankColumns = {
    id: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    account_type: "tabungan" | "giro" | "deposito";
    is_primary: boolean;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
};

const accountTypeLabel: Record<string, string> = {
    tabungan: "Tabungan",
    giro: "Giro",
    deposito: "Deposito",
};

export const columns: ColumnDef<BankColumns>[] = [
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p className="w-10 text-center">{row.index + 1}</p>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "bank_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Bank" />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2 min-w-[100px] max-w-[150px]">
                {row.original.is_primary && (
                    <Star className="h-4 w-4 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                )}
                <p className="truncate whitespace-nowrap">
                    {row.original.bank_name}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "account_number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nomor Rekening" />
        ),
        cell: ({ row }) => (
            <p className="min-w-[100px] max-w-[140px] truncate whitespace-nowrap">
                {row.original.account_number}
            </p>
        ),
    },
    {
        accessorKey: "account_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Pemilik" />
        ),
        cell: ({ row }) => (
            <p className="min-w-[100px] max-w-[160px] truncate whitespace-nowrap">
                {row.original.account_name}
            </p>
        ),
    },
    {
        accessorKey: "account_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jenis Rekening" />
        ),
        cell: ({ row }) => (
            <Badge variant="outline" className="whitespace-nowrap">
                {accountTypeLabel[row.original.account_type] ||
                    row.original.account_type}
            </Badge>
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Keterangan" />
        ),
        cell: ({ row }) => (
            <p className="min-w-[80px] max-w-[120px] truncate whitespace-nowrap">
                {row.original.description ?? "-"}
            </p>
        ),
    },
    {
        accessorKey: "start_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Mulai" />
        ),
        cell: ({ row }) => {
            const date = row.original.start_date;
            if (!date) return <p>-</p>;
            return (
                <p className="min-w-[90px] whitespace-nowrap">
                    {new Date(date).toLocaleDateString("id-ID")}
                </p>
            );
        },
    },
    {
        accessorKey: "end_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Berakhir" />
        ),
        cell: ({ row }) => {
            const date = row.original.end_date;
            if (!date) return <p>-</p>;
            return (
                <p className="min-w-[90px] whitespace-nowrap">
                    {new Date(date).toLocaleDateString("id-ID")}
                </p>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const bank = row.original;

            return (
                <div className="flex items-center justify-center gap-1 min-w-[80px]">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            router.visit(route("banks.edit", bank.id))
                        }
                        title="Edit"
                    >
                        <Edit />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                            if (!confirm("Hapus bank ini?")) return;
                            router.delete(route("banks.destroy", bank.id));
                        }}
                        title="Hapus"
                    >
                        <Trash2 />
                    </Button>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];
