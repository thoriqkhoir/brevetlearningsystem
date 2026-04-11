"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Printer } from "lucide-react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { router } from "@inertiajs/react";
import { Fragment } from "react";
import { Badge } from "@/Components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export type BupotA2Columns = {
    id: string;
    user_id: string;
    object: {
        type: string;
        tax_code: string;
        tax_name: string;
        tax_type: string;
        tax_rates: string;
    };
    start_period: string;
    end_period: string;
    bupot_number: string;
    bupot_status: "normal" | "perbaikan";
    customer_id: string;
    customer_name: string;
    nip: string;
    rank_group: string;
    customer_ptkp: string;
    customer_position: string;
    tax_type: string;
    tax_code: string;
    bupot_types: string;
    basic_salary: number;
    wifes_allowance: number;
    childs_allowance: number;
    income_improvement_allowance: number;
    fungtional_allowance: number;
    rice_allowance: number;
    other_allowance: number;
    separate_salary: number;
    gross_income_amount: number;
    position_cost: number;
    pension_contribution: number;
    zakat_donation: number;
    amount_of_reduction: number;
    neto: number;
    proof_number: string;
    before_neto: number;
    total_neto: number;
    non_taxable_income: number;
    taxable_income: number;
    pph_taxable_income: number;
    pph_owed: number;
    pph_deducted: number;
    pph_deducted_withholding: number;
    pph_hasbeen_deducted: number;
    pph_desember: number;
    kap: string;
    nitku: string;
    created_at: string;
    status:
        | "created"
        | "approved"
        | "canceled"
        | "deleted"
        | "amanded"
        | "draft";
};

const handleDownloadPDF = (id: string) => {
    window.open(route("bpa2.downloadPDF", id), "_blank");
};

export const columns: ColumnDef<BupotA2Columns>[] = [
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
            const status = row.original.status;

            return (
                <TooltipProvider>
                    <div className="flex flex-wrap w-16">
                        {(status === "created" || status === "draft") && (
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
                                                        "bpa2.show",
                                                        row.original.id
                                                    )
                                                );
                                            }}
                                        >
                                            <Eye />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Lihat BPA2</p>
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
                                                        "bpa2.edit",
                                                        row.original.id
                                                    )
                                                );
                                            }}
                                        >
                                            <Edit />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit BPA2</p>
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
                                                        "bpa2.show",
                                                        row.original.id
                                                    )
                                                );
                                            }}
                                        >
                                            <Eye />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Lihat BPA2</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="px-2"
                                            onClick={() => {
                                                handleDownloadPDF(
                                                    row.original.id
                                                );
                                            }}
                                        >
                                            <Printer />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cetak BPA2</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Fragment>
                        )}
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
        accessorKey: "start_period",
        header: "Masa Awal Pendapatan",
        cell: ({ row }) => (
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                {row.original.start_period}
            </p>
        ),
    },
    {
        accessorKey: "end_period",
        header: "Masa Akhir Pendapatan",
        cell: ({ row }) => (
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                {row.original.end_period}
            </p>
        ),
    },
    {
        accessorKey: "bupot_number",
        header: "Nomor Pemotongan",
        cell: ({ row }) => (
            <p className="capitalize">{row.original.bupot_number || "-"}</p>
        ),
    },
    {
        accessorKey: "bupot_status",
        header: "Status",
        cell: ({ row }) => (
            <p className="capitalize">{row.original.bupot_status}</p>
        ),
    },
    {
        accessorKey: "status",
        header: "Status Bupot",
        cell: ({ row }) => {
            const status = row.original.status;
            let colorClass = "";
            let statusText = "";

            switch (status) {
                case "approved":
                    colorClass = "bg-blue-600 hover:bg-blue-500";
                    statusText = "Approved";
                    break;
                case "created":
                    colorClass = "bg-green-600 hover:bg-green-500";
                    statusText = "Disimpan Valid";
                    break;
                case "canceled":
                    colorClass = "bg-yellow-600 hover:bg-yellow-500";
                    statusText = "Canceled";
                    break;
                case "deleted":
                    colorClass = "bg-red-600 hover:bg-red-500";
                    statusText = "Deleted";
                    break;
                case "amanded":
                    colorClass = "bg-gray-600 hover:bg-gray-500";
                    statusText = "Amanded";
                    break;
                case "draft":
                    colorClass = "bg-gray-600 hover:bg-gray-500";
                    statusText = "Disimpan Tidak Valid";
                    break;
                default:
                    colorClass = "bg-gray-600 hover:bg-gray-500";
                    statusText = status;
            }

            return (
                <Badge className={`capitalize text-center ${colorClass}`}>
                    {statusText}
                </Badge>
            );
        },
    },
    {
        accessorKey: "customer_name",
        header: "NPWP / Nama",
        cell: ({ row }) => (
            <p className="min-w-[250px] whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                {row.original.customer_id} - {row.original.customer_name}
            </p>
        ),
    },
    {
        accessorKey: "nip",
        header: "NIP/NRP",
        cell: ({ row }) => (
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                {row.original.nip || "-"}
            </p>
        ),
    },
    {
        accessorKey: "rank_group",
        header: "Pangkat/Golongan",
        cell: ({ row }) => (
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                {row.original.rank_group || "-"}
            </p>
        ),
    },
    {
        accessorKey: "customer_ptkp",
        header: "Status PTKP",
        cell: ({ row }) => (
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                {row.original.customer_ptkp}
            </p>
        ),
    },
    {
        accessorKey: "object.tax_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jenis Pajak" />
        ),
        cell: ({ row }) => (
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                {row.original.object.tax_type}
            </p>
        ),
    },
    {
        accessorKey: "object.tax_code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kode Objek Pajak" />
        ),
    },
    {
        accessorKey: "gross_income_amount",
        header: "Penghasilan Bruto",
        cell: ({ row }) => {
            const amount = row.getValue<number>("gross_income_amount");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
            return <div className="min-w-[150px]">{formatted}</div>;
        },
    },
    {
        accessorKey: "pph_taxable_income",
        header: "PPh Pasal 21 atas PKP",
        cell: ({ row }) => {
            const amount = row.getValue<number>("pph_taxable_income");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
            return <div className="min-w-[150px]">{formatted}</div>;
        },
    },
    {
        accessorKey: "pph_desember",
        header: "PPh Desember/Periode Terakhir",
        cell: ({ row }) => {
            const amount = row.getValue<number>("pph_desember");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);
            return <div className="min-w-[150px]">{formatted}</div>;
        },
    },
    {
        accessorKey: "created_at",
        header: "Tanggal Bupot",
        cell: ({ row }) => (
            <p className="w-[120px]">
                {row.original.created_at
                    ? format(
                          new Date(row.original.created_at),
                          "dd MMMM yyyy",
                          { locale: id }
                      )
                    : "-"}
            </p>
        ),
    },
];