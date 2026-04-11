"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export type LedgerColumns = {
    id: string;
    user_id: string;
    billing_type_id: number;
    transaction_date: string;
    posting_date: string;
    accounting_type: string;
    accounting_type_detail: string;
    currency: string;
    transaction_type: string;
    debit_amount: number;
    debit_unpaid: number;
    credit_amount: number;
    credit_left: number;
    kap: string;
    kap_description: string;
    kjs: string;
    tax_period: string;
    transaction_number: string;
    created_at: string;
    updated_at: string;
};

export const columns: ColumnDef<LedgerColumns>[] = [
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p>{row.index + 1}</p>,
    },
    {
        accessorKey: "transaction_date",
        header: "Tanggal Transaksi",
        cell: ({ row }) => (
            <p className="w-[120px]">
                {format(
                    new Date(row.original.transaction_date),
                    "dd MMMM yyyy",
                    { locale: id }
                )}
            </p>
        ),
    },
    {
        accessorKey: "posting_date",
        header: "Tanggal Posting",
        cell: ({ row }) => (
            <p className="w-[120px]">
                {format(new Date(row.original.posting_date), "dd MMMM yyyy", {
                    locale: id,
                })}
            </p>
        ),
    },
    {
        accessorKey: "accounting_type",
        header: "Jenis Pencatatan",
        cell: ({ row }) => (
            <p className="capitalize">{row.original.accounting_type}</p>
        ),
    },
    {
        accessorKey: "accounting_type_detail",
        header: "Rincian Jenis Pencatatan",
        cell: ({ row }) => (
            <p className="capitalize min-w-[120px]">
                {row.original.accounting_type_detail}
            </p>
        ),
    },
    {
        accessorKey: "currency",
        header: "Mata Uang",
        cell: ({ row }) => <p>{row.original.currency}</p>,
    },
    {
        accessorKey: "transaction_type",
        header: "Jenis Transaksi",
        cell: ({ row }) => {
            const transactionType = row.original.transaction_type;
            return (
                <div>{transactionType === "debit" ? "Debit" : "Kredit"}</div>
            );
        },
    },
    {
        accessorKey: "debit_amount",
        header: "Jumlah Debit",
        cell: ({ row }) => {
            const amount = row.getValue<number>("debit_amount");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(Math.abs(amount));
            return <div className="min-w-[120px]">{formatted}</div>;
        },
    },
    {
        accessorKey: "debit_unpaid",
        header: "Debit Belum Dibayar",
        cell: ({ row }) => {
            const amount = row.getValue<number>("debit_unpaid");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(Math.abs(amount));
            return <div className="min-w-[90px]">{formatted}</div>;
        },
    },
    {
        accessorKey: "credit_amount",
        header: "Jumlah Kredit",
        cell: ({ row }) => {
            const amount = row.getValue<number>("credit_amount");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(Math.abs(amount));
            return <div className="min-w-[90px]">{formatted}</div>;
        },
    },
    {
        accessorKey: "credit_left",
        header: "Sisa Kredit",
        cell: ({ row }) => {
            const amount = row.getValue<number>("credit_left");
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(Math.abs(amount));
            return <div className="min-w-[90px]">{formatted}</div>;
        },
    },
    {
        accessorKey: "kap",
        header: "KAP",
        cell: ({ row }) => <p>{row.original.kap}</p>,
    },
    {
        accessorKey: "kap_description",
        header: "Deskripsi KAP",
        cell: ({ row }) => (
            <p className="w-[180px]">{row.original.kap_description}</p>
        ),
    },
    {
        accessorKey: "kjs",
        header: "KJS",
        cell: ({ row }) => <p>{row.original.kjs}</p>,
    },
    {
        accessorKey: "tax_period",
        header: "Periode Pajak",
        cell: ({ row }) => (
            <p className="w-[90px]">{row.original.tax_period}</p>
        ),
    },
    {
        accessorKey: "transaction_number",
        header: "Nomor Transaksi",
        cell: ({ row }) => <p>{row.original.transaction_number}</p>,
    },
];
