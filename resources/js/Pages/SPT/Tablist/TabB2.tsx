import { columns } from "@/Components/layout/SPTPPN/columns";
import { DataTableSPTPPN } from "@/Components/layout/SPTPPN/data-table";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { forwardRef, useImperativeHandle } from "react";

interface User {
    name: string;
    address: string;
    phone_number: string;
    npwp: string;
}

interface Spt {
    start_period: string;
    year: number;
    correction_number: number;
}

const TabB2 = forwardRef(
    (
        {
            user,
            spt,
            invoice,
            retur,
        }: {
            user: User;
            spt: Spt;
            invoice: any;
            retur: any;
        },
        ref
    ) => {
        const filteredInvoice = (invoice || []).filter(
            (inv: any) => inv.type === "masukan"
        );

        const filteredRetur = (retur || []).filter((ret: any) =>
            filteredInvoice.some((inv: any) => inv.id === ret.invoice_id)
        );

        const data = [
            ...filteredInvoice.map((inv: any) => ({
                name: inv.customer_name,
                npwp: inv.customer_id,
                number: inv.invoice_number,
                date: inv.invoice_date,
                dpp: inv.dpp,
                dpp_lain: inv.dpp_lain,
                ppn: inv.ppn,
                ppnbm: inv.ppnbm,
            })),
            ...filteredRetur.map((ret: any) => {
                const matchedInvoice =
                    filteredInvoice.find(
                        (inv: any) => inv.id === ret.invoice_id
                    ) || {};

                return {
                    name: matchedInvoice.customer_name || "",
                    npwp: matchedInvoice.customer_id || "",
                    number: ret.retur_number,
                    date: ret.retur_date,
                    dpp: -ret.dpp,
                    dpp_lain: -ret.dpp_lain,
                    ppn: -ret.ppn,
                    ppnbm: -ret.ppnbm,
                };
            }),
        ];

        useImperativeHandle(ref, () => ({
            getFormData: () => {
                return [
                    ...filteredInvoice.map((inv: any) => ({
                        type: "B2",
                        no: inv.invoice_number,
                        date: inv.invoice_date,
                        customer_id: inv.customer_id,
                        customer_name: inv.customer_name,
                        customer_email: inv.customer_email || "",
                        customer_address: inv.customer_address || "",
                        dpp: inv.dpp || 0,
                        dpp_lain: inv.dpp_lain || 0,
                        ppn: inv.ppn || 0,
                        ppnbm: inv.ppnbm || 0,
                        retur_no: null,
                    })),
                    ...filteredRetur.map((ret: any) => {
                        const matchedInvoice =
                            filteredInvoice.find(
                                (inv: any) => inv.id === ret.invoice_id
                            ) || {};

                        return {
                            type: "B2",
                            no: ret.retur_number,
                            date: ret.retur_date,
                            customer_id: matchedInvoice.customer_id || "",
                            customer_name: matchedInvoice.customer_name || "",
                            customer_email: matchedInvoice.customer_email || "",
                            customer_address:
                                matchedInvoice.customer_address || "",
                            dpp: -ret.dpp || 0,
                            dpp_lain: -ret.dpp_lain || 0,
                            ppn: -ret.ppn || 0,
                            ppnbm: -ret.ppnbm || 0,
                            retur_no: ret.retur_number,
                        };
                    }),
                ];
            },
        }));

        return (
            <div>
                <h1 className="text-xl font-semibold mt-8 mb-2">
                    Daftar Pajak Masukan yang Dapat Dikreditkan atas Perolehan
                    BKP/JKP dalam Negeri
                </h1>
                <div className="bg-muted p-4 w-full rounded-t-xl">
                    <p className="font-semibold text-sm">HEADER</p>
                </div>
                <div className="p-4 bg-white w-full rounded-b-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="col-span-2">Nama PKP</Label>
                            <Input
                                type="text"
                                defaultValue={user.name}
                                disabled
                            />
                        </div>

                        <div>
                            <Label className="col-span-2">NPWP</Label>
                            <Input
                                type="text"
                                defaultValue={user.npwp}
                                disabled
                            />
                        </div>

                        <div>
                            <Label className="col-span-2">Periode</Label>
                            <Input
                                type="text"
                                defaultValue={spt.start_period + " " + spt.year}
                                disabled
                            />
                        </div>

                        <div>
                            <Label className="col-span-2">Model</Label>
                            <Input
                                type="text"
                                defaultValue={
                                    spt.correction_number === 0
                                        ? "Normal"
                                        : "Pembetulan"
                                }
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <DataTableSPTPPN columns={columns} data={data} />
                </div>
            </div>
        );
    }
);

export default TabB2;
