"use client";

import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { router } from "@inertiajs/react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Edit, Trash2 } from "lucide-react";

export type BusinessEntityColumns = {
    id: string;
    name: string;
    npwp: string;
    address?: string | null;
};

export const columns: ColumnDef<BusinessEntityColumns>[] = [
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p>{row.index + 1}</p>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama" />
        ),
        cell: ({ row }) => <p className="w-[260px]">{row.original.name}</p>,
    },
    {
        accessorKey: "npwp",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="NPWP" />
        ),
        cell: ({ row }) => <p>{row.original.npwp}</p>,
    },
    {
        accessorKey: "address",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Alamat" />
        ),
        cell: ({ row }) => (
            <p className="w-[320px] truncate">{row.original.address ?? "-"}</p>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const entity = row.original;

            return (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            router.visit(
                                route("business-entities.edit", entity.id),
                            )
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
                            if (!confirm("Hapus badan usaha ini?")) return;
                            router.delete(
                                route("business-entities.destroy", entity.id),
                            );
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
