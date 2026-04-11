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

export type BupotColumns = {
    id: string;
    user_id: string;
    object: {
        type: string;
        tax_code: string;
        tax_name: string;
        tax_type: string;
        tax_rates: string;
    };
    start_period   : string;
    end_period     : string;
    bupot_number: string;
    bupot_period: string;
    bupot_year: string;
    bupot_status: "normal" | "perbaikan";
    customer_id: string;
    customer_name: string;
    facility:
        | "fasilitas lainnya"
        | "pph ditanggung pemerintah"
        | "tanpa fasilitas";
    dpp: number;
    rates: number;
    basic_salary :number;
    taxable_income: number;
    pph_taxable_income: number;
    pph_desember: number;
    gross_income_amount: number,
    tax: string;
    doc_type: string;
    doc_no: string;
    doc_date: string;
    created_at: string;
    status:
        | "created"
        | "approved"
        | "canceled"
        | "deleted"
        | "amanded"
        | "draft";
};

const handleDownloadPDF = (id: string, bppu: string) => {
    if (bppu === "bppu") {
        window.open(route("bppu.downloadPDF", id), "_blank");
    } else if (bppu === "bpnr") {
        window.open(route("bpnr.downloadPDF", id), "_blank");
    } else if (bppu === "sp") {
        window.open(route("sp.downloadPDF", id), "_blank");
    } else if (bppu === "cy") {
        window.open(route("cy.downloadPDF", id), "_blank");
    } else if (bppu === "bp21") {
        window.open(route("bp21.downloadPDF", id), "_blank");
    } else if (bppu === "bp26") {
        window.open(route("bp26.downloadPDF", id), "_blank");
    } else if (bppu === "bpa1") {
        window.open(route("bpa1.downloadPDF", id), "_blank");
    } else if (bppu === "bpa2") {
        window.open(route("bpa2.downloadPDF", id), "_blank");
    }
};

export const columns: ColumnDef<BupotColumns>[] = [
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
            const objectType = row.original.object.type;
            const currentRoute = route().current();

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
                                                if (
                                                    currentRoute?.startsWith(
                                                        "bppu"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bppu.show",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "bpnr"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bpnr.show",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "sp"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "sp.show",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "cy"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "cy.show",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "bp21"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bp21.show",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "bp26"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bp26.show",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "bpa1"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bpa1.show",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "bpa2"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bpa2.show",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "mp"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "mp.show",
                                                            row.original.id
                                                        )
                                                    );
                                                }
                                            }}
                                        >
                                            <Eye />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Lihat Bupot</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="px-2"
                                            onClick={() => {
                                                if (
                                                    currentRoute?.startsWith(
                                                        "bppu"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bppu.edit",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "bpnr"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bpnr.edit",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "sp"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "sp.edit",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "cy"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "cy.edit",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "bp21"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bp21.edit",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "bp26"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bp26.edit",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "bpa1"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bpa1.edit",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "bpa2"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "bpa2.edit",
                                                            row.original.id
                                                        )
                                                    );
                                                } else if (
                                                    currentRoute?.startsWith(
                                                        "mp"
                                                    )
                                                ) {
                                                    router.visit(
                                                        route(
                                                            "mp.edit",
                                                            row.original.id
                                                        )
                                                    );
                                                }
                                            }}
                                        >
                                            <Edit />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit Bupot</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Fragment>
                        )}
                        {status === "approved" && (
                            <Fragment>
                                {objectType !== "pegawai" && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="px-2 mx-auto"
                                                onClick={() => {
                                                    if (
                                                        currentRoute?.startsWith(
                                                            "bppu"
                                                        )
                                                    ) {
                                                        handleDownloadPDF(
                                                            row.original.id,
                                                            "bppu"
                                                        );
                                                    } else if (
                                                        currentRoute?.startsWith(
                                                            "bpnr"
                                                        )
                                                    ) {
                                                        handleDownloadPDF(
                                                            row.original.id,
                                                            "bpnr"
                                                        );
                                                    } else if (
                                                        currentRoute?.startsWith(
                                                            "sp"
                                                        )
                                                    ) {
                                                        handleDownloadPDF(
                                                            row.original.id,
                                                            "sp"
                                                        );
                                                    } else if (
                                                        currentRoute?.startsWith(
                                                            "cy"
                                                        )
                                                    ) {
                                                        handleDownloadPDF(
                                                            row.original.id,
                                                            "cy"
                                                        );
                                                    } else if (
                                                        currentRoute?.startsWith(
                                                            "bp21"
                                                        )
                                                    ) {
                                                        handleDownloadPDF(
                                                            row.original.id,
                                                            "bp21"
                                                        );
                                                    } else if (
                                                        currentRoute?.startsWith(
                                                            "bp26"
                                                        )
                                                    ) {
                                                        handleDownloadPDF(
                                                            row.original.id,
                                                            "bp26"
                                                        );
                                                    } else if (
                                                        currentRoute?.startsWith(
                                                            "bpa1"
                                                        )
                                                    ) {
                                                        handleDownloadPDF(
                                                            row.original.id,
                                                            "bpa1"
                                                        );
                                                    } else if (
                                                        currentRoute?.startsWith(
                                                            "bpa2"
                                                        )
                                                    ) {
                                                        handleDownloadPDF(
                                                            row.original.id,
                                                            "bpa2"
                                                        );
                                                    } else if (
                                                        currentRoute?.startsWith(
                                                            "mp"
                                                        )
                                                    ) {
                                                        handleDownloadPDF(
                                                            row.original.id,
                                                            "mp"
                                                        );
                                                    }
                                                }}
                                            >
                                                <Printer />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Cetak Bupot</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                {objectType === "pegawai" && (
                                    <>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="px-2"
                                                    onClick={() => {
                                                        if (
                                                            currentRoute?.startsWith(
                                                                "bpa1"
                                                            )
                                                        ) {
                                                            router.visit(
                                                                route(
                                                                    "bpa1.show",
                                                                    row.original.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Eye />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Lihat BPA1</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="px-2"
                                                    onClick={() => {
                                                        if (
                                                            currentRoute?.startsWith(
                                                                "bpa1"
                                                            )
                                                        ) {
                                                            handleDownloadPDF(
                                                                row.original.id,
                                                                "bpa1"
                                                            );
                                                        } else if (
                                                            currentRoute?.startsWith(
                                                                "bpa2"
                                                            )
                                                        ) {
                                                            handleDownloadPDF(
                                                                row.original.id,
                                                                "bpa2"
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Printer />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Cetak BPA1</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </>
                                )}
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
            <p className="capitalize">{row.original.bupot_number}</p>
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
                    break;
                case "created":
                    colorClass = "bg-green-600 hover:bg-green-500";
                    statusText = "Disimpan Valid";
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
                case "draft":
                    colorClass = "bg-gray-600 hover:bg-gray-500";
                    statusText = "Disimpan Tidak Valid";
                    break;
                default:
                    colorClass = "bg-gray-600 hover:bg-gray-500";
            }

            return (
                <Badge className={`capitalize text-center ${colorClass}`}>
                    {statusText || status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "customer_name",
        header: "NITKU / Nomor Identitas Subunit Organisasi Penerima Penghasilan",
        cell: ({ row }) => (
            <p className="min-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                {row.original.customer_id}000000 - {row.original.customer_name}
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
        header: "DPP",
        cell: ({ row }) => {
            const amount = row.getValue<number>("gross_income_amount");
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
        accessorKey: "pph_taxable_income",
        header: "PPh",
        cell: ({ row }) => {
            const amount = row.getValue<number>("pph_taxable_income");
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
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "facility",
        header: "Fasilitas Pajak",
        cell: ({ row }) => (
            <p className="capitalize">{row.original.facility}</p>
        ),
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
