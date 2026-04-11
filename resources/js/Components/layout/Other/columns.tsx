"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, Edit, FileUp, Printer, Trash } from "lucide-react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { router } from "@inertiajs/react";
import { Fragment, useState } from "react";
import ConfirmDialog from "../ConfirmDialog";
import { Badge } from "@/Components/ui/badge";
import PasswordVerificationDialog from "../PasswordConfirmationDialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

export type OtherColumns = {
    id: string;
    transaction_type: string;
    transaction_detail: string;
    transaction_doc: string;
    other_no: string;
    other_date: string;
    other_period: string;
    other_year: string;
    customer_id: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    dpp: number;
    dpp_lain: number;
    ppn: number;
    ppnbm: number;
    type: "keluaran" | "masukan";
    status: "created" | "approved" | "canceled" | "deleted" | "amanded";
};

const handleSubmit = (id: string, password: string) => {
    router.visit(route("other.updateStatus", id), {
        method: "put",
        data: {
            status: "approved",
            password,
        },
    });
};

const handleDelete = (id: string, password: string) => {
    router.visit(route("other.updateStatus", id), {
        method: "put",
        data: {
            status: "deleted",
            password,
        },
    });
};

const handleCancel = (id: string, password: string) => {
    router.visit(route("other.updateStatus", id), {
        method: "put",
        data: {
            status: "canceled",
            password,
        },
    });
};

export const columns: ColumnDef<OtherColumns>[] = [
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
            const [openSubmitModal, setOpenSubmitModal] = useState(false);
            const [openCancelModal, setOpenCancelModal] = useState(false);
            const [openDeleteModal, setOpenDeleteModal] = useState(false);
            const [openPasswordModal, setOpenPasswordModal] = useState(false);
            const [passwordAction, setPasswordAction] = useState<
                "submit" | "cancel" | "delete"
            >("submit");
            const status = row.original.status;
            const type = row.original.type;

            const handlePasswordConfirm = async (password: string) => {
                if (passwordAction === "submit") {
                    handleSubmit(row.original.id, password);
                } else if (passwordAction === "cancel") {
                    handleCancel(row.original.id, password);
                } else if (passwordAction === "delete") {
                    handleDelete(row.original.id, password);
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
                                        <p>Laporkan Dokumen</p>
                                    </TooltipContent>
                                </Tooltip>
                                {type === "keluaran" && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="px-2"
                                                onClick={() => {
                                                    router.visit(
                                                        route(
                                                            "other.edit",
                                                            row.original.id
                                                        )
                                                    );
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit Dokumen</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}

                                {type === "masukan" && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="px-2 mx-auto"
                                                onClick={() => {
                                                    router.visit(
                                                        route(
                                                            "other.editImport",
                                                            row.original.id
                                                        )
                                                    );
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit Dokumen</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="px-2"
                                            onClick={() => {
                                                setPasswordAction("delete");
                                                setOpenDeleteModal(true);
                                            }}
                                        >
                                            <Trash />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Hapus Dokumen</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Fragment>
                        )}
                        {status === "approved" && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-2 mx-auto"
                                        onClick={() => {
                                            setPasswordAction("cancel");
                                            setOpenCancelModal(true);
                                        }}
                                    >
                                        <Ban />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Batalkan Dokumen</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <PasswordVerificationDialog
                            open={openPasswordModal}
                            onClose={() => setOpenPasswordModal(false)}
                            onConfirm={handlePasswordConfirm}
                        />
                        <ConfirmDialog
                            title="Laporkan Dokumen"
                            description="Apakah Anda yakin ingin melaporkan Dokumen ini?"
                            open={openSubmitModal}
                            onClose={() => setOpenSubmitModal(false)}
                            onConfirm={() => {
                                setOpenSubmitModal(false);
                                setOpenPasswordModal(true);
                            }}
                        />
                        <ConfirmDialog
                            title="Hapus Dokumen"
                            description="Apakah Anda yakin ingin menghapus Dokumen ini?"
                            open={openDeleteModal}
                            onClose={() => setOpenDeleteModal(false)}
                            onConfirm={() => {
                                setOpenDeleteModal(false);
                                setOpenPasswordModal(true);
                            }}
                        />
                        <ConfirmDialog
                            title="Batalkan Dokumen"
                            description="Apakah Anda yakin ingin membatalkan Dokumen ini?"
                            open={openCancelModal}
                            onClose={() => setOpenCancelModal(false)}
                            onConfirm={() => {
                                setOpenCancelModal(false);
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
        cell: (info) => <p className="text-center">{info.row.index + 1}</p>,
    },
    {
        accessorKey: "customer_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="NPWP Pembeli" />
        ),
    },
    {
        accessorKey: "customer_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Pembeli" />
        ),
    },
    {
        accessorKey: "transaction_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tipe Transaksi" />
        ),
        cell: ({ row }) => (
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                {row.original.transaction_type}
            </p>
        ),
    },
    {
        accessorKey: "transaction_detail",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Detail Transaksi" />
        ),
    },
    {
        accessorKey: "transaction_doc",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Dokumen Transaksi" />
        ),
    },
    {
        accessorKey: "other_no",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nomor Dokumen" />
        ),
    },
    {
        accessorKey: "other_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Dokumen" />
        ),
    },
    {
        accessorKey: "other_period",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Masa Pajak" />
        ),
    },
    {
        accessorKey: "other_year",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tahun" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status Dokumen" />
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
            <DataTableColumnHeader column={column} title="PPn" />
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
];
