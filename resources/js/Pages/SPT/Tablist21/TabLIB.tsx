import { forwardRef, useImperativeHandle } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { columns } from "@/Components/layout/SPT21/columns"; 
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/Components/layout/DataTableColumnHeader";
import { DataTableSPT21 } from "@/Components/layout/SPT21/data-table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/Components/ui/accordion";

interface User {
    name?: string;
    address?: string;
    phone_number?: string;
    npwp?: string;
}

interface Spt {
    start_period?: string;
    year?: number;
    correction_number?: number;
}

const TabLIB = forwardRef(
    (
        {
            user = {},
            spt = {},
            bupots = [],
            bupotA1 = [],
            bupotA2 = [], // ← Tambahkan props bupotA2
            
        }: {
            user?: User;
            spt?: Spt;
            bupots?: any[];
            bupotA1?: any[];
            bupotA2?: any[]; // ← Tambahkan type
            
        },
        ref
    ) => {
        // Transform data untuk LIST-IB dari BupotA1
        const dataBPA1 = [
            ...(bupotA1 || [])
                .filter((item: any) => item.object?.type === "pegawai") // Filter untuk BPA1
                .map((item: any) => ({
                    npwp: item.customer_id || '',
                    name: item.customer_name || '',
                    doc_no: item.bupot_number || '',
                    doc_date: item.created_at || '',
                    tax_type: item.object?.tax_type || '',
                    tax_code: item.object?.tax_code || '',
                    tax_name: item.object?.tax_name || '',
                    dpp: item.gross_income_amount || 0,
                    tarif: item.pph_desember || 0,
                    tax: item.pph_owed || 0,
                    facility: item.facility || '',
                })),
        ];

        // Transform data untuk LIST-IB dari BupotA2
        const dataBPA2 = [
            ...(bupotA2 || [])
                .map((item: any) => ({
                    npwp: item.customer_id || '',
                    name: item.customer_name || '',
                    doc_no: item.bupot_number || '',
                    doc_date: item.created_at || '',
                    tax_type: item.object?.tax_type || '',
                    tax_code: item.object?.tax_code || '',
                    tax_name: item.object?.tax_name || '',
                    dpp: item.gross_income_amount || 0,
                    tarif: item.pph_desember || 0,
                    tax: item.pph_owed || 0,
                    facility: 'Tanpa Fasilitas', // BPA2 tidak memiliki field facility
                })),
        ];

        // Gabungkan data BPA1 dan BPA2
        const dataBppu = [...dataBPA1, ...dataBPA2];


    // Custom columns untuk LIST-IB (tanpa persen pada tarif)
const customColumns: ColumnDef<any>[] = [
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
        accessorKey: "npwp",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="NPWP" />
        ),
    },
    {
        accessorKey: "doc_no",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Nomor Bukti Potong"
            />
        ),
    },
    {
        accessorKey: "doc_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Bukti Pemotongan" />
        ),
        cell: ({ row }) => {
        const dateString = row.getValue<string>("doc_date");
        if (!dateString) return <div>-</div>;
        
        try {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return <div>{`${day}-${month}-${year}`}</div>;
        } catch {
            return <div>-</div>;
        }
    },
    },
    {
        accessorKey: "tax_code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kode Objek Pajak" />
        ),
        
    },
    {
        accessorKey: "dpp",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Penghasilan Bruto" />
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
        accessorKey: "tarif",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="PPh Bulan Terakhir" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("tarif");
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
        accessorKey: "tax",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Pajak Penghasilan" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue<number>("tax");
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
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fasilitas Perpajakan" />
        ),
    },
];
    
        

        return (
            <div>
                <h1 className="text-xl font-semibold mt-8 mb-2">
                    Daftar Pemotongan Pajak Penghasilan Pasal 21 Bagi Pegawai Tetap Dan Pensiunan Yang Menerima Uang Terkait Pensiun Secara Berkala Serta Bagi Pegawai Negeri Sipil, Anggota Tentara Nasional Indonesia, Anggota Kepolisian Republik Indonesia, Pejabat Negara, Dan Pensiunannya Untuk Masa Pajak Terakhir 
                </h1>
                <div className="bg-muted p-4 w-full rounded-t-xl">
                    <p className="font-semibold text-sm">List-IB</p>
                </div>
                <div className="p-4 bg-white w-full rounded-b-xl">
                    <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                            <Label className="min-w-[180px] text-base font-medium">
                                Periode :
                            </Label>
                            <Input
                                type="text"
                                defaultValue={(spt.start_period || '-') + " " + (spt.year || '-')}
                                disabled
                                className="flex-1"
                            />
                        </div>

                        <div className="flex items-center">
                            <Label className="min-w-[180px] text-base font-medium">
                                NPWP :
                            </Label>
                            <Input
                                type="text"
                                defaultValue={user.npwp || '-'}
                                disabled
                                className="flex-1"
                            />
                        </div>                        
                    </div>
                </div>

                <div className="bg-muted p-4 mt-8 w-full rounded-t-xl">
                    <p className="font-semibold text-sm">Daftar Slip Pemotongan</p>
                </div>
                <div className="p-4 bg-white w-full rounded-b-xl">
                <Accordion type="single" collapsible className="w-full" defaultValue="IB">
                        <AccordionItem value="IB">
                            <AccordionTrigger className="bg-amber-400 p-4 w-full rounded">
                                LIST-IB (BPA1 & BPA2)
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                                 <div className="border p-4 rounded-lg">
                                    <div className="mb-4">
                                        <p className="text-sm text-muted-foreground">
                                            Menampilkan {dataBPA1.length} data dari BPA1 dan {dataBPA2.length} data dari BPA2
                                        </p>
                                    </div>
                                    <div className="mt-5">
                                        <DataTableSPT21 columns={customColumns} data={dataBppu} />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        
                    </Accordion>
                    
                    
                </div>
            </div>
            
        );
    }
);

export default TabLIB;