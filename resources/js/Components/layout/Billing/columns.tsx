"use client";

import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Banknote, Edit, Printer, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PasswordVerificationDialog from "../PasswordConfirmationDialog";
import ConfirmDialog from "../ConfirmDialog";
import { useState } from "react";

export type BillingColumns = {
    billing_form_id: number;
    user: {
        name: string;
        npwp: string;
    };
    code: string;
    currency: string;
    amount: number;
    active_period: string;
    billing_count: number;
    description: string;
    billings: any[];
};

const handleLihatPDF = (billingFormId: number) => {
    window.open(route("payment.lihatPDF", billingFormId), "_blank");
};

export const columns: ColumnDef<BillingColumns>[] = [
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p>{row.index + 1}</p>,
    },
    {
        accessorKey: "user.name",
        header: "Nama Wajib Pajak",
        cell: ({ row }) => (
            <p className="w-[180px]">{row.original.user.name}</p>
        ),
    },
    {
        accessorKey: "user.npwp",
        header: "NPWP",
        cell: ({ row }) => <p>{row.original.user.npwp}</p>,
    },
    // {
    //     accessorKey: "billing_form_id",
    //     header: "ID Billing Group",
    //     cell: ({ row }) => <p>{row.original.billing_form_id}</p>,
    // },
    {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => (
            <div className="w-[250px]">
                <p className="text-sm">{row.original.description}</p>
                {/* <p className="text-xs text-gray-500">
                    {row.original.billing_count} billing(s)
                </p> */}
            </div>
        ),
    },
    {
        accessorKey: "currency",
        header: "Mata Uang",
        cell: ({ row }) => <p>{row.original.currency}</p>,
    },
    {
        accessorKey: "amount",
        header: "Total Nominal",
        cell: ({ row }) => {
            const amount = row.getValue<number>("amount");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
            return <div className="font-semibold">{formatted}</div>;
        },
    },
    {
        accessorKey: "active_period",
        header: "Periode Aktif",
        cell: ({ row }) => {
            return (
                <p>
                    {format(
                        new Date(row.original.active_period),
                        "dd MMMM yyyy",
                        { locale: id }
                    )}
                </p>
            );
        },
    },
    {
        accessorKey: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const [openPayModal, setOpenPayModal] = useState(false);
            const [openPasswordModal, setOpenPasswordModal] = useState(false);
            const [openDeleteModal, setOpenDeleteModal] = useState(false);
            const [openDeletePasswordModal, setOpenDeletePasswordModal] =
                useState(false);

            const handlePasswordConfirm = async (password: string) => {
                setOpenPasswordModal(false);
                router.post(
                    route(
                        "payment.billing.group",
                        row.original.billing_form_id
                    ),
                    {
                        password: password,
                    }
                );
            };

            const handleDeletePasswordConfirm = async (password: string) => {
                setOpenDeletePasswordModal(false);
                router.delete(
                    route(
                        "payment.billing.group.delete",
                        row.original.billing_form_id
                    ),
                    {
                        data: {
                            password,
                        },
                    }
                );
            };

            return (
                <TooltipProvider>
                    <div className="flex flex-wrap w-24">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2"
                                    onClick={() => {
                                        handleLihatPDF(
                                            row.original.billing_form_id
                                        );
                                    }}
                                >
                                    <Printer />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Lihat PDF Billing Group</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2"
                                    onClick={() => {
                                        setOpenPayModal(true);
                                    }}
                                >
                                    <Banknote />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Bayar Semua Billing (
                                    {row.original.billing_count})
                                </p>
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
                                    <Trash2 />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Hapus Billing Group</p>
                            </TooltipContent>
                        </Tooltip>
                        <PasswordVerificationDialog
                            open={openPasswordModal}
                            onClose={() => setOpenPasswordModal(false)}
                            onConfirm={handlePasswordConfirm}
                        />
                        <PasswordVerificationDialog
                            open={openDeletePasswordModal}
                            onClose={() => setOpenDeletePasswordModal(false)}
                            onConfirm={handleDeletePasswordConfirm}
                        />
                        <ConfirmDialog
                            title="Bayar Billing Group"
                            description={`Apakah Anda yakin ingin membayar ${
                                row.original.billing_count
                            } billing sekaligus dengan total ${new Intl.NumberFormat(
                                "id-ID",
                                {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }
                            ).format(row.original.amount)}?`}
                            open={openPayModal}
                            onClose={() => setOpenPayModal(false)}
                            onConfirm={() => {
                                setOpenPayModal(false);
                                setOpenPasswordModal(true);
                            }}
                        />
                        <ConfirmDialog
                            title="Hapus Billing Group"
                            description={`Apakah Anda yakin ingin menghapus ${
                                row.original.billing_count
                            } billing sekaligus dengan total ${new Intl.NumberFormat(
                                "id-ID",
                                {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }
                            ).format(row.original.amount)}?`}
                            open={openDeleteModal}
                            onClose={() => setOpenDeleteModal(false)}
                            onConfirm={() => {
                                setOpenDeleteModal(false);
                                setOpenDeletePasswordModal(true);
                            }}
                        />
                    </div>
                </TooltipProvider>
            );
        },
    },
];
