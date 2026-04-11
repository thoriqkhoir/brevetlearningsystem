"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Folder, Pencil, Trash } from "lucide-react";
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
import { Badge } from "@/Components/ui/badge";
import { DataTableColumnHeader } from "../DataTableColumnHeader";

export type UserColumns = {
    id: string;
    event: {
        id: string;
        name: string;
    };
    name: string;
    email: string;
    phone_number: string;
    role: "admin" | "pengguna";
    email_verified_at: string | null;
    password: string;
    npwp: string | null;
    address: string | null;
    access_rights: string | null;
    last_login_at: string | null;
    last_logout_at: string | null;
    created_at: string;
    updated_at: string;
};

type UserColumnActionMode = "detail" | "edit";

type CreateUserColumnsOptions = {
    actionRoute: string;
    deleteRoute: string;
    entityLabel: string;
    actionMode?: UserColumnActionMode;
};

const defaultOptions: CreateUserColumnsOptions = {
    actionRoute: "admin.show",
    deleteRoute: "admin.destroy",
    entityLabel: "Pengguna",
    actionMode: "detail",
};

export const createUserColumns = (
    options: CreateUserColumnsOptions = defaultOptions,
): ColumnDef<UserColumns>[] => [
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
            const actionMode = options.actionMode ?? "detail";
            const ActionIcon = actionMode === "edit" ? Pencil : Folder;
            const actionTooltip =
                actionMode === "edit"
                    ? `Edit ${options.entityLabel}`
                    : `Detail ${options.entityLabel}`;

            const handleDelete = () => {
                router.delete(route(options.deleteRoute, row.original.id), {
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
                                                options.actionRoute,
                                                row.original.id,
                                            ),
                                        );
                                    }}
                                >
                                    <ActionIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{actionTooltip}</p>
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
                                <p>Hapus {options.entityLabel}</p>
                            </TooltipContent>
                        </Tooltip>
                        <ConfirmDialog
                            title={`Hapus ${options.entityLabel}`}
                            description={`Apakah Anda yakin ingin menghapus ${options.entityLabel.toLowerCase()} ini?`}
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
        accessorKey: "npwp",
        header: "NPWP",
        cell: ({ row }) => <p>{row.original.npwp ?? "-"}</p>,
    },
    {
        accessorKey: "address",
        header: "Alamat",
        cell: ({ row }) => (
            <p className="w-[150px]">{row.original.address ?? "-"}</p>
        ),
    },
    // {
    //     accessorKey: "access_rights",
    //     header: "Hak Akses",
    //     cell: ({ row }) => {
    //         const accessRights = row.original.access_rights || "";
    //         const formattedAccessRights = String(accessRights)
    //             .replace(/[\[\]"]/g, "")
    //             .split(",")
    //             .map((right) => right.trim());

    //         if (
    //             formattedAccessRights.length === 0 ||
    //             !formattedAccessRights.some(
    //                 (right) => right === "efaktur" || right === "ebupot"
    //             )
    //         ) {
    //             return <p>-</p>;
    //         }

    //         return (
    //             <div className="w-[72px] flex flex-wrap gap-2">
    //                 {formattedAccessRights.map((right, index) => (
    //                     <Badge key={index} variant="default">
    //                         {right === "efaktur"
    //                             ? "e-Faktur"
    //                             : right === "ebupot"
    //                             ? "eBupot"
    //                             : right}
    //                     </Badge>
    //                 ))}
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: "event.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Event" />
        ),
        cell: ({ row }) => (
            <Badge variant="outline">{row.original.event.name}</Badge>
        ),
        enableColumnFilter: true,
    },
    {
        accessorKey: "event_id",
        header: "Event ID",
        cell: ({ row }) => row.original.event?.id ?? "-",
        enableColumnFilter: true,
        enableHiding: true,
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
                          { locale: id },
                      )
                    : "-"}
            </p>
        ),
    },
    {
        accessorKey: "last_logout_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Terakhir Logout" />
        ),
        cell: ({ row }) => (
            <p className="w-[120px]">
                {row.original.last_logout_at
                    ? format(
                          new Date(row.original.last_logout_at),
                          "dd MMMM yyyy HH:mm:ss",
                          { locale: id },
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
                          { locale: id },
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
                          { locale: id },
                      )
                    : "-"}
            </p>
        ),
    },
];

export const columns = createUserColumns();
