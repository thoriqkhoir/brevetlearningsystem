"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Banknote, FileDown, Folder, Printer, Trash } from "lucide-react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { router } from "@inertiajs/react";
import ConfirmDialog from "../ConfirmDialog";
import { Fragment, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import PasswordVerificationDialog from "../PasswordConfirmationDialog";

export type SPTColumns = {
    id: string;
    form: {
        code: string;
        name: string;
    };
    correction_number: number;
    start_period: string;
    end_period: string;
    year: string;
    tax_type: "nihil" | "kurang bayar" | "lebih bayar";
    tax_value: number;
    payment_value: number | null;
    paid_date: string | null;
    status:
        | "created"
        | "approved"
        | "canceled"
        | "rejected"
        | "amanded"
        | "waiting";
    ntte: string | null;
    spt_induk?: {
        ppn_ca: number | null;
        ppn_ce: number | null;
    };
};

const handleCancel = (id: string, password: string) => {
    router.visit(route("spt.updateStatus", id), {
        method: "put",
        data: {
            status: "canceled",
            password,
        },
    });
};

const handleApprove = (id: string, password: string) => {
    router.visit(route("spt.updateStatus", id), {
        method: "put",
        data: {
            status: "approved",
            password,
        },
    });
};

const handleDownloadPDF = (id: string, formName: string, formCode?: string) => {
    if (formCode === "PPH2126") {
        window.open(route("spt.downloadPDF21", id), "_blank");
        return;
    }
    if (formCode === "PPHUNI") {
        window.open(route("spt.downloadPDFUnifikasi", id), "_blank");
        return;
    }
    if (formCode === "PPHOP") {
        window.open(route("spt.downloadSPTOp", id), "_blank");
        return;
    }
    if (formCode === "PPHBADAN") {
        window.open(route("spt.downloadSPTBadan", id), "_blank");
        return;
    }
    const lowerForm = formName.toLowerCase();
    if (lowerForm.includes("unifikasi")) {
        window.open(route("spt.downloadPDFUnifikasi", id), "_blank");
    } else if (lowerForm.includes("pph 21") || lowerForm.includes("pph 26")) {
        window.open(route("spt.downloadPDF21", id), "_blank");
    } else {
        window.open(route("spt.downloadPDF", id), "_blank");
    }
};

const handleDownloadBPE = (id: string, formName: string, formCode?: string) => {
    if (formCode === "PPH2126") {
        window.open(route("spt.downloadBPE21", id), "_blank");
        return;
    }
    if (formCode === "PPHUNI") {
        window.open(route("spt.downloadBPEUnifikasi", id), "_blank");
        return;
    }
    if (formCode === "PPHOP") {
        window.open(route("spt.downloadBPEOp", id), "_blank");
        return;
    }
    if (formCode === "PPHBADAN") {
        window.open(route("spt.downloadBPEBadan", id), "_blank");
        return;
    }
    const lowerForm = formName.toLowerCase();
    if (lowerForm.includes("unifikasi")) {
        window.open(route("spt.downloadBPEUnifikasi", id), "_blank");
    } else if (lowerForm.includes("pph 21") || lowerForm.includes("pph 26")) {
        window.open(route("spt.downloadBPE21", id), "_blank");
    } else {
        window.open(route("spt.downloadBPE", id), "_blank");
    }
};

export const columns: ColumnDef<SPTColumns>[] = [
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
            const [openCancelModal, setOpenCancelModal] = useState(false);
            const [openPasswordModal, setOpenPasswordModal] = useState(false);
            const status = row.original.status;

            const handlePasswordConfirm = async (password: string) => {
                handleCancel(row.original.id, password);
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
                                                if (
                                                    row.original.form?.code ==
                                                    "PPH2126"
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "spt.detail21",
                                                            row.original.id,
                                                        ),
                                                    );
                                                } else if (
                                                    row.original.form?.code ==
                                                    "PPHUNI"
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "spt.detailUni",
                                                            row.original.id,
                                                        ),
                                                    );
                                                } else if (
                                                    row.original.form?.code ==
                                                    "PPHOP"
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "spt.detailOp",
                                                            row.original.id,
                                                        ),
                                                    );
                                                } else if (
                                                    row.original.form?.code ==
                                                    "PPHBADAN"
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "spt.detailBadan",
                                                            row.original.id,
                                                        ),
                                                    );
                                                } else {
                                                    router.visit(
                                                        route(
                                                            "spt.show",
                                                            row.original.id,
                                                        ),
                                                    );
                                                }
                                            }}
                                        >
                                            <Folder />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Lihat SPT</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="px-2"
                                            onClick={() => {
                                                setOpenCancelModal(true);
                                            }}
                                        >
                                            <Trash />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Hapus SPT</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Fragment>
                        )}
                        {status === "waiting" && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-2 mx-auto"
                                        onClick={() => {
                                            router.visit(
                                                route("payment.billing"),
                                            );
                                        }}
                                    >
                                        <Banknote />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Bayar SPT</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {status === "approved" && (
                            <Fragment>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="px-2 mx-auto"
                                            onClick={() =>
                                                handleDownloadBPE(
                                                    row.original.id,
                                                    row.original.form?.name ||
                                                        "",
                                                    row.original.form?.code,
                                                )
                                            }
                                        >
                                            <FileDown />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cetak BPE</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="px-2 mx-auto"
                                            onClick={() =>
                                                handleDownloadPDF(
                                                    row.original.id,
                                                    row.original.form?.name ||
                                                        "",
                                                    row.original.form?.code,
                                                )
                                            }
                                        >
                                            <Printer />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cetak SPT</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Fragment>
                        )}
                        <PasswordVerificationDialog
                            open={openPasswordModal}
                            onClose={() => setOpenPasswordModal(false)}
                            onConfirm={handlePasswordConfirm}
                        />
                        <ConfirmDialog
                            title="Hapus SPT"
                            description="Apakah Anda yakin ingin menghapus SPT ini?"
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
        cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
        accessorKey: "correction_number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jenis Pajak" />
        ),
        cell: ({ row }) => {
            const correction_number = row.original.correction_number;
            return (
                <div>{correction_number === 0 ? "Normal" : "Pembetulan"}</div>
            );
        },
    },
    {
        accessorKey: "form.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jenis SPT" />
        ),
    },
    {
        accessorKey: "start_period",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Masa Pajak" />
        ),
    },
    {
        accessorKey: "year",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tahun Pajak" />
        ),
    },
    {
        accessorKey: "tax_value",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tax Value" />
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            let amount;
            if (status === "waiting") {
                amount = row.getValue<number>("tax_value");
            } else {
                amount = row.getValue<number>("tax_value");
            }

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
        accessorKey: "payment_value",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Payment Value" />
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            let amount;

            if (status === "waiting") {
                amount = row.getValue<number | null>("payment_value");
            } else {
                amount = row.getValue<number | null>("payment_value");
            }

            if (amount === null) return <div className="font-medium">-</div>;

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
        accessorKey: "paid_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Paid Date" />
        ),
        cell: ({ row }) => {
            const paidDate = row.getValue<string | null>("paid_date");
            return <div>{paidDate ?? "-"}</div>;
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
                case "rejected":
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
