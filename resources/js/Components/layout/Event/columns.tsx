"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { router } from "@inertiajs/react";
import ConfirmDialog from "../ConfirmDialog";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DataTableColumnHeader } from "../DataTableColumnHeader";

export type EventColumns = {
    id: number;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
};

export const columns: ColumnDef<EventColumns>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const id = row.original.id;
            const [openDeleteModal, setOpenDeleteModal] = useState(false);

            const handleDelete = () => {
                router.delete(route("admin.destroyEvent", row.original.id), {
                    onSuccess: () => {
                        setOpenDeleteModal(false);
                        router.reload();
                    },
                    preserveScroll: true,
                    preserveState: false,
                });
            };

            return (
                <TooltipProvider>
                    {id !== 1 && (
                        <div className="flex flex-wrap w-16 mx-auto">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-2"
                                        onClick={() => {
                                            router.visit(
                                                route(
                                                    "admin.editEvent",
                                                    row.original.id
                                                )
                                            );
                                        }}
                                    >
                                        <Edit />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit Event</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-2"
                                        onClick={() => {
                                            setOpenDeleteModal(true);
                                        }}
                                    >
                                        <Trash />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Hapus Event</p>
                                </TooltipContent>
                            </Tooltip>
                            <ConfirmDialog
                                title="Hapus Event"
                                description="Apakah Anda yakin ingin menghapus Event ini?"
                                open={openDeleteModal}
                                onClose={() => setOpenDeleteModal(false)}
                                onConfirm={handleDelete}
                            />
                        </div>
                    )}
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p>{row.index + 1}</p>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Event" />
        ),
        cell: ({ row }) => <p>{row.original.name}</p>,
    },
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kode Event" />
        ),
        cell: ({ row }) => <p>{row.original.code}</p>,
    },
    {
        accessorKey: "created_at",
        header: "Tanggal Dibuat",
        cell: ({ row }) => (
            <p className="w-[120px]">
                {row.original.created_at
                    ? format(
                          new Date(row.original.created_at),
                          "dd MMMM yyyy HH:mm:ss",
                          { locale: id }
                      )
                    : "-"}
            </p>
        ),
    },
    {
        accessorKey: "updated_at",
        header: "Tanggal Diperbarui",
        cell: ({ row }) => (
            <p className="w-[120px]">
                {row.original.updated_at
                    ? format(
                          new Date(row.original.updated_at),
                          "dd MMMM yyyy HH:mm:ss",
                          { locale: id }
                      )
                    : "-"}
            </p>
        ),
    },
];
