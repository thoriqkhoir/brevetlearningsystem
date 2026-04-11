import { columns } from "@/Components/layout/SPTPPN/columns";
import { DataTableSPTPPN } from "@/Components/layout/SPTPPN/data-table";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

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

const TabC = ({
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
}) => {
    const filteredOther = (other || []).filter(
        (oth: any) => oth.type === "hebat"
    );

    const filteredReturnsOthers = (returnsOthers || []).filter(
        (retOth: any) => retOth.type === "hebat"
    );
    const data = [
        ...(invoice || [])
            .filter((inv: any) => inv.type === "hebat")
            .map((inv: any) => ({
                name: inv.customer_name,
                npwp: inv.customer_id,
                number: inv.invoice_number,
                date: inv.invoice_date,
                dpp: inv.dpp,
                dpp_lain: inv.dpp_lain,
                ppn: inv.ppn,
                ppnbm: inv.ppnbm,
            })),
        ...filteredOther.map((oth: any) => ({
            name: oth.customer_name,
            npwp: oth.customer_id,
            number: oth.other_number,
            date: oth.other_date,
            dpp: oth.dpp,
            dpp_lain: oth.dpp_lain,
            ppn: oth.ppn,
            ppnbm: oth.ppnbm,
        })),
        ...filteredReturnsOthers.map((retOth: any) => ({
            name:
                filteredOther.length > 0 ? filteredOther[0].customer_name : "-",
            npwp: filteredOther.length > 0 ? filteredOther[0].customer_id : "-",
            number: retOth.retur_number,
            date: retOth.retur_date,
            dpp: -retOth.dpp,
            dpp_lain: -retOth.dpp_lain,
            ppn: -retOth.ppn,
            ppnbm: -retOth.ppnbm,
        })),
    ];

    return (
        <div>
            <h1 className="text-xl font-semibold mt-8 mb-2">Dokumen C</h1>
            <div className="bg-muted p-4 w-full rounded-t-xl">
                <p className="font-semibold text-sm">HEADER</p>
            </div>
            <div className="p-4 bg-white w-full rounded-b-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="col-span-2">Nama PKP</Label>
                        <Input type="text" defaultValue={user.name} disabled />
                    </div>

                    <div>
                        <Label className="col-span-2">NPWP</Label>
                        <Input type="text" defaultValue={user.npwp} disabled />
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
};

export default TabC;
