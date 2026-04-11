"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import ConfirmDialog from "../ConfirmDialog";
import { useState } from "react";
import FormEditTransactionItems from "@/Pages/Invoice/PajakKeluaran/FormEditTransactionItems";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

export type InvoiceItemColumns = {
    id: string;
    invoice_id: string;
    invoice: {
        id: string;
    };
    item_type: "barang" | "jasa";
    item_id: number;
    unit_id: number;
    item_name: string;
    item_quantity: number;
    item_price: number;
    item_discount: number;
    dpp: number;
    ppn_rate: number;
    ppn: number;
    ppnbm_rate: number;
    ppnbm: number;
};

export const columns = (
    removeItem: (id: string) => void,
    updateItem: (updatedItem: any) => void,
    itemTransaction: any,
    unitTransactions: any
): ColumnDef<InvoiceItemColumns>[] => [
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
            const item = row.original;
            const [openModal, setOpenModal] = useState(false);
            const [openEditModal, setOpenEditModal] = useState(false);

            return (
                <TooltipProvider>
                    <div className="flex flex-wrap w-16">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="px-2"
                                    onClick={() => setOpenEditModal(true)}
                                >
                                    <Edit />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit Item</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="px-2"
                                    onClick={() => setOpenModal(true)}
                                >
                                    <Trash />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Hapus Item</p>
                            </TooltipContent>
                        </Tooltip>
                        <FormEditTransactionItems
                            item={item}
                            updateItem={updateItem}
                            openEditModal={openEditModal}
                            setOpenEditModal={setOpenEditModal}
                            itemTransactions={itemTransaction}
                            unitTransactions={unitTransactions}
                        />
                        <ConfirmDialog
                            title="Hapus Item Transaksi"
                            description="Apakah Anda yakin ingin menghapus Transaksi ini?"
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            onConfirm={() => {
                                removeItem(item.id);
                                setOpenModal(false);
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
        accessorKey: "item_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tipe" />
        ),
        cell: ({ row }) => (
            <p className="capitalize">{row.original.item_type}</p>
        ),
    },
    {
        accessorKey: "item_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama" />
        ),
    },
    {
        accessorKey: "item_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kode Item" />
        ),
        cell: ({ row }) => {
            const itemId = row.original.item_id;
            const item = itemTransaction.find((item: any) => item.id == itemId);
            return <p>{item ? item.code : "Unknown Item"}</p>;
        },
    },
    {
        accessorKey: "item_quantity",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kuantitas" />
        ),
    },
    {
        accessorKey: "unit_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Satuan" />
        ),
        cell: ({ row }) => {
            const unitId = row.original.unit_id;
            const unit = unitTransactions.find(
                (unit: any) => unit.id == unitId
            );
            return <p>{unit ? unit.description : "Unknown Unit"}</p>;
        },
    },
    {
        accessorKey: "item_price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Harga Item" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("item_price");
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
        accessorKey: "item_discount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Diskon" />
        ),
        cell: ({ row }) => (
            <p className="capitalize">{row.original.item_discount} %</p>
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
        accessorKey: "ppn_rate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="PPn Rate" />
        ),
        cell: ({ row }) => <p>12 %</p>,
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
        accessorKey: "ppnbm_rate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="PPnBM Rate" />
        ),
        cell: ({ row }) => (
            <p className="capitalize">{row.original.ppnbm_rate} %</p>
        ),
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
