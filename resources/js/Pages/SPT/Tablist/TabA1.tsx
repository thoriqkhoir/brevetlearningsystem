import { columns } from "@/Components/layout/SPTPPN/columns";
import { DataTableSPTPPN } from "@/Components/layout/SPTPPN/data-table";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { forwardRef, useEffect, useImperativeHandle } from "react";

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

const TabA1 = forwardRef(
    (
        {
            user,
            spt,
            invoice,
            retur,
            other,
            returnsOthers,
        }: {
            user: User;
            spt: Spt;
            invoice: any;
            retur: any;
            other: any;
            returnsOthers: any;
        },
        ref
    ) => {
        const data = [
            ...other.map((oth: any) => ({
                name: oth.customer_name,
                npwp: oth.customer_id,
                number: oth.other_no,
                date: oth.other_date,
                dpp: oth.dpp,
                dpp_lain: oth.dpp_lain,
                ppn: oth.ppn,
                ppnbm: oth.ppnbm,
            })),

            ...returnsOthers
                .filter((retOth: any) => {
                    return other.some((oth: any) => oth.id === retOth.other_id);
                })
                .map((retOth: any) => {
                    const relatedOther =
                        other.find((oth: any) => oth.id === retOth.other_id) ||
                        {};

                    return {
                        name: relatedOther.customer_name || "",
                        npwp: relatedOther.customer_id || "",
                        number: retOth.retur_number,
                        date: retOth.retur_date,
                        dpp: -retOth.dpp,
                        dpp_lain: -retOth.dpp_lain,
                        ppn: -retOth.ppn,
                        ppnbm: -retOth.ppnbm,
                    };
                }),
        ];

        useImperativeHandle(ref, () => ({
            getFormData: () => {
                return [
                    ...other.map((oth: any) => ({
                        type: "A1",
                        no: oth.other_no,
                        date: oth.other_date,
                        customer_id: oth.customer_id || "",
                        customer_name: oth.customer_name || "",
                        customer_email: oth.customer_email || "",
                        customer_address: oth.customer_address || "",
                        dpp: Number(oth.dpp || 0),
                        dpp_lain: Number(oth.dpp_lain || 0),
                        ppn: Number(oth.ppn || 0),
                        ppnbm: Number(oth.ppnbm || 0),
                        retur_no: null,
                    })),
                    ...returnsOthers
                        .filter((retOth: any) => {
                            return other.some(
                                (oth: any) => oth.id === retOth.other_id
                            );
                        })
                        .map((retOth: any) => {
                            const relatedOther =
                                other.find(
                                    (oth: any) => oth.id === retOth.other_id
                                ) || {};

                            return {
                                type: "A1",
                                no: retOth.retur_number,
                                date: retOth.retur_date,
                                customer_id: relatedOther.customer_id || "",
                                customer_name: relatedOther.customer_name || "",
                                customer_email:
                                    relatedOther.customer_email || "",
                                customer_address:
                                    relatedOther.customer_address || "",
                                dpp: Number(-retOth.dpp || 0),
                                dpp_lain: Number(-retOth.dpp_lain || 0),
                                ppn: Number(-retOth.ppn || 0),
                                ppnbm: Number(-retOth.ppnbm || 0),
                                retur_no: retOth.retur_number,
                            };
                        }),
                ];
            },
        }));

        return (
            <div>
                <h1 className="text-xl font-semibold mt-8 mb-2">
                    Daftar Ekspor BKP Berwujud, BKP Tidak Berwujud dan/atau JKP
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

export default TabA1;
