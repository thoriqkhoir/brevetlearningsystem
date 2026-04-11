"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, Edit, FileUp } from "lucide-react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { router } from "@inertiajs/react";
import ConfirmDialog from "../ConfirmDialog";
import { Fragment, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import PasswordVerificationDialog from "../PasswordConfirmationDialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

export type ReturColumns = {
    id: string;
    user_id: string;
    invoice: {
        id: string;
        invoice_number: string;
    };
    retur_number: string;
    retur_date: string;
    retur_period: string;
    retur_year: string;
    dpp: number;
    dpp_lain: number;
    ppn: number;
    ppnbm: number;
    type: "keluaran" | "masukan";
    status: "created" | "approved" | "canceled" | "deleted" | "amanded";
};

const handleSubmit = (id: string, password: string) => {
    router.visit(route("retur.updateStatus", id), {
        method: "put",
        data: {
            status: "approved",
            password,
        },
    });
};

const handleCancel = (id: string, password: string) => {
    router.visit(route("retur.updateStatus", id), {
        method: "put",
        data: {
            status: "canceled",
            password,
        },
    });
};

export const columns: ColumnDef<ReturColumns>[] = [
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
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const [openSubmitModal, setOpenSubmitModal] = useState(false);
            const [openDeleteModal, setOpenDeleteModal] = useState(false);
            const [openPasswordModal, setOpenPasswordModal] = useState(false);
            const [passwordAction, setPasswordAction] = useState<
                "submit" | "cancel" | "delete"
            >("submit");
            const status = row.original.status;

            const handlePasswordConfirm = async (password: string) => {
                if (passwordAction === "submit") {
                    handleSubmit(row.original.id, password);
                } else if (passwordAction === "cancel") {
                    handleCancel(row.original.id, password);
                }
                setOpenPasswordModal(false);
            };

            return (
                <TooltipProvider>
                    <div className="flex flex-wrap w-16">
                        {status === "created" && (
                            <Fragment>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="px-2"
                                            onClick={() => {
                                                setPasswordAction("submit");
                                                setOpenSubmitModal(true);
                                            }}
                                        >
                                            <FileUp />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Laporkan Retur</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="px-2"
                                            onClick={() => {
                                                router.visit(
                                                    route(
                                                        row.original.type ===
                                                            "masukan"
                                                            ? "retur.editInput"
                                                            : "retur.edit",
                                                        row.original.id
                                                    )
                                                );
                                            }}
                                        >
                                            <Edit />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit Retur</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Fragment>
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2"
                                    onClick={() => {
                                        setPasswordAction("cancel");
                                        setOpenDeleteModal(true);
                                    }}
                                >
                                    <Ban />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Batalkan Retur</p>
                            </TooltipContent>
                        </Tooltip>
                        <PasswordVerificationDialog
                            open={openPasswordModal}
                            onClose={() => setOpenPasswordModal(false)}
                            onConfirm={handlePasswordConfirm}
                        />
                        <ConfirmDialog
                            title="Laporkan Retur"
                            description="Apakah Anda yakin ingin melaporkan Retur ini?"
                            open={openSubmitModal}
                            onClose={() => setOpenSubmitModal(false)}
                            onConfirm={() => {
                                setOpenSubmitModal(false);
                                setOpenPasswordModal(true);
                            }}
                        />
                        <ConfirmDialog
                            title="Batalkan Retur"
                            description="Apakah Anda yakin ingin membatalkan Retur ini?"
                            open={openDeleteModal}
                            onClose={() => setOpenDeleteModal(false)}
                            onConfirm={() => {
                                setOpenDeleteModal(false);
                                setOpenPasswordModal(true);
                            }}
                        />
                    </div>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
        accessorKey: "invoice.invoice_number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nomor Faktur" />
        ),
    },
    {
        accessorKey: "retur_number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nomor Retur" />
        ),
    },
    {
        accessorKey: "retur_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Retur" />
        ),
    },
    {
        accessorKey: "retur_period",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Periode Retur" />
        ),
    },
    {
        accessorKey: "retur_year",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tahun Retur" />
        ),
    },
    {
        accessorKey: "dpp",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="DPP" />
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
            <DataTableColumnHeader column={column} title="DPP Lain" />
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
            <DataTableColumnHeader column={column} title="PPN" />
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
            <DataTableColumnHeader column={column} title="PPnBM" />
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
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            let colorClass = "";

            switch (status) {
                case "approved":
                    colorClass = "bg-blue-600 hover:bg-blue-500";
                    break;
                case "created":
                    colorClass = "bg-green-600 hover:bg-green-500";
                    break;
                case "canceled":
                    colorClass = "bg-yellow-600 hover:bg-yellow-500";
                    break;
                case "deleted":
                    colorClass = "bg-red-600 hover:bg-red-500";
                    break;
                case "amanded":
                    colorClass = "bg-gray-600 hover:bg-gray-500";
                    break;
                default:
                    colorClass = "bg-gray-600 hover:bg-gray-500";
            }

            return (
                <Badge className={`capitalize ${colorClass}`}>{status}</Badge>
            );
        },
    },
];
