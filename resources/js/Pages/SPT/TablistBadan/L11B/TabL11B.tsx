import { FormL11B1 } from "./FormL11B1";
import { SectionL11B2A } from "./SectionL11B2A";
import { SectionL11B2B } from "./SectionL11B2B";
import { SectionL11B3 } from "./SectionL11B3";
import { Input } from "@/Components/ui/input";
import type { L11B1Data, L11B2AItem, L11B2BItem, L11B3Item } from "./types";

const DER_LIMIT = 4;

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const formatNumber = (value: number) =>
    new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(
        value ?? 0,
    );

interface TabL11BProps {
    sptBadanId: string;
    l11b1: L11B1Data | null;
    l11b2a: L11B2AItem[];
    l11b2b: L11B2BItem[];
    l11b3: L11B3Item[];
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="bg-blue-950 text-white px-4 py-4 font-semibold text-sm rounded">
            {title}
        </div>
    );
}

function SubSectionHeader({ title }: { title: string }) {
    return (
        <div className="bg-blue-850 text-black px-4 py-4 font-medium text-sm rounded ">
            {title}
        </div>
    );
}

export function TabL11B({
    sptBadanId,
    l11b1,
    l11b2a,
    l11b2b,
    l11b3,
}: TabL11BProps) {
    const totalUtang = l11b2a.reduce(
        (sum, item) => sum + (item.average_balance ?? 0),
        0,
    );
    const totalModal = l11b2b.reduce(
        (sum, item) => sum + (item.average_balance ?? 0),
        0,
    );
    const derValue = totalModal > 0 ? totalUtang / totalModal : null;
    const derCap = derValue === null ? 0 : Math.min(derValue, DER_LIMIT);
    const ebtidaAmount = Number(l11b1?.ebtida ?? 0);
    const ebtidaLimit = Number(
        l11b1?.ebtida_after_tax ?? Math.round(ebtidaAmount * 0.25),
    );

    return (
        <div className="space-y-6">
            {/* Section I - EBITDA */}
            <div className="border border-gray-300 rounded overflow-hidden">
                <SectionHeader title="I. PENGHITUNGAN EBITDA" />
                <div className="p-4">
                    <FormL11B1 sptBadanId={sptBadanId} l11b1={l11b1} />
                </div>
            </div>

            {/* Section II - Debt to Equity Ratio */}
            <div className="border border-gray-300 rounded overflow-hidden">
                <SectionHeader title="II. PERBANDINGAN ANTARA UTANG DAN MODAL (DEBT TO EQUITY RATIO)" />

                <div className="p-4 space-y-4">
                    <div className="border border-gray-200 rounded overflow-hidden">
                        <SubSectionHeader title="A. PENGHITUNGAN SALDO RATA-RATA UTANG" />
                        <div className="p-4">
                            <SectionL11B2A
                                data={l11b2a}
                                sptBadanId={sptBadanId}
                            />
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded overflow-hidden">
                        <SubSectionHeader title="B. PENGHITUNGAN SALDO RATA-RATA MODAL" />
                        <div className="p-4">
                            <SectionL11B2B
                                data={l11b2b}
                                sptBadanId={sptBadanId}
                            />
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded overflow-hidden">
                        <SubSectionHeader title="C. PENGHITUNGAN BESARNYA PERBANDINGAN ANTARA UTANG DAN MODAL (DEBT TO EQUITY RATIO)" />
                        <div className="p-4">
                            <DerFormulaDisplay
                                l11b2a={l11b2a}
                                l11b2b={l11b2b}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section III - Biaya Pinjaman */}
            <div className="border border-gray-300 rounded overflow-hidden">
                <SectionHeader title="III. PENGHITUNGAN BIAYA PINJAMAN" />
                <div className="p-4">
                    <SectionL11B3
                        data={l11b3}
                        sptBadanId={sptBadanId}
                        ebtidaLimit={ebtidaLimit}
                        derValue={derValue}
                        derCap={derCap}
                        totalDebtAverage={totalUtang}
                        totalEquityAverage={totalModal}
                    />
                </div>
            </div>
        </div>
    );
}

function DerFormulaDisplay({
    l11b2a,
    l11b2b,
}: {
    l11b2a: L11B2AItem[];
    l11b2b: L11B2BItem[];
}) {
    const totalUtang = l11b2a.reduce(
        (sum, item) => sum + (item.average_balance ?? 0),
        0,
    );
    const totalModal = l11b2b.reduce(
        (sum, item) => sum + (item.average_balance ?? 0),
        0,
    );
    const der = totalModal > 0 ? totalUtang / totalModal : 0;

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(val);

    return (
        <div className="overflow-x-auto rounded border border-gray-200">
            <table className="min-w-[600px] w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-blue-950 text-white">
                        <th className="border border-gray-300 px-3 py-2 text-left">
                            Keterangan
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center">
                            (1)
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center">
                            (2)
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center">
                            DER (1)/(2)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white">
                        <td className="border border-gray-300 px-3 py-2">
                            Perbandingan Utang dan Modal
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                            {formatRupiah(totalUtang)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                            {formatRupiah(totalModal)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
                            {totalModal > 0 ? der.toFixed(2) : "-"} : 1
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default TabL11B;
