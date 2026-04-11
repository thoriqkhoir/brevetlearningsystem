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

export type InvoiceColumns = {
    id: string;
    transaction: {
        code: string;
        name: string;
    };
    invoice_number: string;
    invoice_date: string;
    invoice_period: string;
    invoice_year: string;
    invoice_reference: string | null;
    customer_id: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    dpp: number;
    dpp_lain: number;
    ppn: number;
    ppnbm: number;
    dpp_split: number | null;
    ppn_split: number | null;
    ppnbm_split: number | null;
    type: "keluaran" | "masukan";
    status:
        | "created"
        | "approved"
        | "canceled"
        | "deleted"
        | "amanded"
        | "credit"
        | "uncredit";
    payment_type: "lunas" | "uang muka" | "pelunasan" | null;
    credit_date: string | null;
};

const handleSubmit = (id: string, password: string) => {
    router.visit(route("invoice.updateStatus", id), {
        method: "put",
        data: {
            status: "approved",
            password,
        },
    });
};

const handleDelete = (id: string, password: string) => {
    router.visit(route("invoice.updateStatus", id), {
        method: "put",
        data: {
            status: "deleted",
            password,
        },
    });
};

const handleCancel = (id: string, password: string) => {
    router.visit(route("invoice.updateStatus", id), {
        method: "put",
        data: {
            status: "canceled",
            password,
        },
    });
};

const handleDownloadPDF = (id: string) => {
    window.open(route("invoice.downloadPDF", id), "_blank");
};

export const columns: ColumnDef<InvoiceColumns>[] = [
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
                        {type === "keluaran" && (
                            <Fragment>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="px-2"
                                            onClick={() =>
                                                handleDownloadPDF(
                                                    row.original.id
                                                )
                                            }
                                        >
                                            <Printer />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Unduh Faktur</p>
                                    </TooltipContent>
                                </Tooltip>
                                {status === "created" && (
                                    <Fragment>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="px-2"
                                                    onClick={() => {
                                                        setPasswordAction(
                                                            "submit"
                                                        );
                                                        setOpenSubmitModal(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <FileUp />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Laporkan Faktur</p>
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
                                                                "invoice.edit",
                                                                row.original.id
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <Edit />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Edit Faktur</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="px-2"
                                                    onClick={() => {
                                                        setPasswordAction(
                                                            "delete"
                                                        );
                                                        setOpenDeleteModal(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <Trash />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Hapus Faktur</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </Fragment>
                                )}
                                {status === "approved" && (
                                    <Fragment>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="px-2"
                                                    onClick={() => {
                                                        router.visit(
                                                            route(
                                                                "invoice.edit",
                                                                row.original.id
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <Edit />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Edit Faktur</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="px-2"
                                                    onClick={() => {
                                                        setPasswordAction(
                                                            "cancel"
                                                        );
                                                        setOpenCancelModal(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <Ban />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Batalkan Faktur</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </Fragment>
                                )}
                            </Fragment>
                        )}
                        {type === "masukan" && status === "approved" && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-2 mx-auto"
                                        onClick={() => {
                                            router.visit(
                                                route(
                                                    "invoice.editInput",
                                                    row.original.id
                                                )
                                            );
                                        }}
                                    >
                                        <Edit />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit Faktur</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <PasswordVerificationDialog
                            open={openPasswordModal}
                            onClose={() => setOpenPasswordModal(false)}
                            onConfirm={handlePasswordConfirm}
                        />
                        <ConfirmDialog
                            title="Laporkan Invoice Faktur"
                            description="Apakah Anda yakin ingin melaporkan Faktur ini?"
                            open={openSubmitModal}
                            onClose={() => setOpenSubmitModal(false)}
                            onConfirm={() => {
                                setOpenSubmitModal(false);
                                setOpenPasswordModal(true);
                            }}
                        />
                        <ConfirmDialog
                            title="Hapus Invoice Faktur"
                            description="Apakah Anda yakin ingin menghapus Faktur ini?"
                            open={openDeleteModal}
                            onClose={() => setOpenDeleteModal(false)}
                            onConfirm={() => {
                                setOpenDeleteModal(false);
                                setOpenPasswordModal(true);
                            }}
                        />
                        <ConfirmDialog
                            title="Batalkan Invoice Faktur"
                            description="Apakah Anda yakin ingin membatalkan Faktur ini?"
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
        accessorKey: "transaction.code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kode Transaksi" />
        ),
        cell: ({ row }) => (
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                {row.original.transaction.code} -{" "}
                {row.original.transaction.name}
            </p>
        ),
    },
    {
        accessorKey: "invoice_number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nomor Faktur" />
        ),
    },
    {
        accessorKey: "invoice_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Faktur" />
        ),
    },
    {
        accessorKey: "invoice_period",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Masa Pajak" />
        ),
    },
    {
        accessorKey: "invoice_year",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tahun" />
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status Faktur" />
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
    {
        accessorKey: "dpp_split",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="DPP Split" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("dpp_split");
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
        accessorKey: "ppn_split",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="PPN Split" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("ppn_split");
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
        accessorKey: "ppnbm_split",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="PPnBM Split" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("ppnbm_split");
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
        accessorKey: "invoice_reference",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Referensi Faktur" />
        ),
        cell: ({ row }) => <p>{row.original.invoice_reference ?? "-"}</p>,
    },
    {
        accessorKey: "payment_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jenis Pembayaran" />
        ),
        cell: ({ row }) => (
            <p className="capitalize">{row.original.payment_type}</p>
        ),
    },
    {
        accessorKey: "credit_date",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Tanggal Dikreditkan"
            />
        ),
        cell: ({ row }) => {
            const creditDate = row.getValue<string>("credit_date");
            return <div className="font-medium">{creditDate ?? "-"}</div>;
        },
    },
];
