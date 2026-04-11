"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Folder, Trash } from "lucide-react";
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

export type TeacherColumns = {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    role: "admin" | "pengguna" | "pengajar";
    email_verified_at: string | null;
    password: string;
    npwp: string | null;
    address: string | null;
    institution: string | null;
    max_class: number | null;
    access_rights: string | null;
    last_login_at: string | null;
    last_logout_at: string | null;
    created_at: string;
    updated_at: string;
};

export const columns: ColumnDef<TeacherColumns>[] = [
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
            const [openDeleteModal, setOpenDeleteModal] = useState(false);

            const handleDelete = () => {
                router.delete(route("admin.destroyTeacher", row.original.id), {
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
                    <div className="flex flex-wrap w-16 justify-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2 text-blue-600 hover:text-blue-700"
                                    onClick={() => {
                                        router.visit(
                                            route(
                                                "admin.showTeacher",
                                                row.original.id
                                            )
                                        );
                                    }}
                                >
                                    <Folder />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Detail Pengajar</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2 text-red-600 hover:text-red-700"
                                    onClick={() => {
                                        setOpenDeleteModal(true);
                                    }}
                                >
                                    <Trash />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Hapus Pengajar</p>
                            </TooltipContent>
                        </Tooltip>
                        <ConfirmDialog
                            title="Hapus Pengajar"
                            description="Apakah Anda yakin ingin menghapus pengajar ini?"
                            open={openDeleteModal}
                            onClose={() => setOpenDeleteModal(false)}
                            onConfirm={handleDelete}
                        />
                    </div>
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
            <DataTableColumnHeader column={column} title="Nama" />
        ),
        cell: ({ row }) => <p className="w-[180px]">{row.original.name}</p>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <p>{row.original.email}</p>,
    },
    {
        accessorKey: "phone_number",
        header: "No Telepon",
        cell: ({ row }) => <p>{row.original.phone_number}</p>,
    },
    {
        accessorKey: "institution",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Instansi" />
        ),
        cell: ({ row }) => <p>{row.original.institution}</p>,
    },
    {
        accessorKey: "max_class",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Maksimal Kelas" />
        ),
        cell: ({ row }) => <p>{row.original.max_class} Kelas</p>,
    },
    {
        accessorKey: "last_login_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Terakhir Login" />
        ),
        cell: ({ row }) => (
            <p className="w-[120px]">
                {row.original.last_login_at
                    ? format(
                          new Date(row.original.last_login_at),
                          "dd MMMM yyyy HH:mm:ss",
                          { locale: id }
                      )
                    : "-"}
            </p>
        ),
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
