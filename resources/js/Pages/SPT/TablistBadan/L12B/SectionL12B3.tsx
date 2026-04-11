import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { router } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { L12B3Item } from "./types";

const fmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const formatRupiahInput = (v: number) => fmt.format(v ?? 0).replace("Rp", "").trim();
const parseNumber = (raw: string) => {
    const n = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

interface SectionL12B3Props {
    data: L12B3Item[];
    sptBadanId: string;
}

export function SectionL12B3({ data, sptBadanId }: SectionL12B3Props) {
    const existing = data[0] ?? null;

    const [taxYear, setTaxYear] = useState(existing?.tax_year ?? "");
    const [taxableIncome, setTaxableIncome] = useState(existing?.taxable_income ?? 0);
    const [taxableIncomeDisplay, setTaxableIncomeDisplay] = useState(formatRupiahInput(existing?.taxable_income ?? 0));
    const [taxIncome, setTaxIncome] = useState(existing?.tax_income ?? 0);
    const [taxIncomeDisplay, setTaxIncomeDisplay] = useState(formatRupiahInput(existing?.tax_income ?? 0));
    const [isSaving, setIsSaving] = useState(false);

    // IIId = IIIb - IIIc (auto calculated)
    const incomeAfterReduce = useMemo(() => Math.max(0, taxableIncome - taxIncome), [taxableIncome, taxIncome]);

    useEffect(() => {
        const rec = data[0] ?? null;
        setTaxYear(rec?.tax_year ?? "");
        setTaxableIncome(rec?.taxable_income ?? 0);
        setTaxableIncomeDisplay(formatRupiahInput(rec?.taxable_income ?? 0));
        setTaxIncome(rec?.tax_income ?? 0);
        setTaxIncomeDisplay(formatRupiahInput(rec?.tax_income ?? 0));
    }, [data]);

    const money = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        disp: React.Dispatch<React.SetStateAction<string>>,
    ) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = parseNumber(e.target.value);
        setter(n);
        disp(formatRupiahInput(n));
    };

    const handleSave = () => {
        if (!taxYear.trim()) { toast.error("Tahun Pajak wajib diisi"); return; }
        setIsSaving(true);
        const payload = {
            spt_badan_id: sptBadanId,
            tax_year: taxYear,
            taxable_income: taxableIncome,
            tax_income: taxIncome,
            income_after_reduce: incomeAfterReduce,
        };
        const afterSave = {
            preserveScroll: true,
            onSuccess: () => toast.success("Data berhasil disimpan"),
            onError: () => toast.error("Gagal menyimpan data"),
            onFinish: () => setIsSaving(false),
        };
        if (existing?.id) {
            router.put(route("spt.badan.l12b3.update", existing.id), payload, afterSave);
        } else {
            router.post(route("spt.badan.l12b3.store"), payload, afterSave);
        }
    };

    return (
        <div className="space-y-2">
            {/* a - Tahun Pajak */}
            <div className="grid grid-cols-[28px_280px_16px_1fr] items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded   font-bold text-gray-900">a</span>
                <Label className=" font-semibold tracking-wide uppercase">TAHUN PAJAK</Label>
                <span className=" text-center">:</span>
                <Input
                    value={taxYear}
                    onChange={(e) => setTaxYear(e.target.value)}
                    placeholder="YYYY"
                    className="h-8 text-sm max-w-[120px]"
                />
            </div>

            {/* b - Penghasilan Kena Pajak */}
            <div className="grid grid-cols-[28px_1fr_16px_280px] items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded   font-bold text-gray-900">b</span>
                <Label className=" font-semibold tracking-wide uppercase">PENGHASILAN KENA PAJAK</Label>
                <span className=" text-center">:</span>
                <div className="flex items-center gap-2">
                    <span className=" font-medium">Rp</span>
                    <Input
                        value={taxableIncomeDisplay}
                        onChange={money(setTaxableIncome, setTaxableIncomeDisplay)}
                        className="h-8 text-sm text-right"
                    />
                </div>
            </div>

            {/* c - Pajak Penghasilan */}
            <div className="grid grid-cols-[28px_1fr_16px_280px] items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded   font-bold text-gray-900">c</span>
                <Label className=" font-semibold tracking-wide uppercase">PAJAK PENGHASILAN</Label>
                <span className=" text-center">:</span>
                <div className="flex items-center gap-2">
                    <span className=" font-medium">Rp</span>
                    <Input
                        value={taxIncomeDisplay}
                        onChange={money(setTaxIncome, setTaxIncomeDisplay)}
                        className="h-8 text-sm text-right"
                    />
                </div>
            </div>

            {/* d - Penghasilan Kena Pajak Sesudah Dikurangi (auto) */}
            <div className="grid grid-cols-[28px_1fr_16px_280px] items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded   font-bold text-gray-900">d</span>
                <div className="flex items-center gap-2  font-semibold tracking-wide uppercase">
                    PENGHASILAN KENA PAJAK SESUDAH DIKURANGI PAJAK
                    <span className="text-muted-foreground font-normal normal-case">
                        (<span className="inline-flex items-center justify-center px-1 rounded  text-gray-900 font-bold">IIIb</span>
                        &nbsp;-&nbsp;
                        <span className="inline-flex items-center justify-center px-1 rounded  text-gray-900 font-bold">IIIc</span>)
                    </span>
                </div>
                <span className=" text-center">:</span>
                <div className="flex items-center gap-2">
                    <span className=" font-medium">Rp</span>
                    <Input
                        value={formatRupiahInput(incomeAfterReduce)}
                        readOnly
                        disabled
                        className="h-8 text-sm text-right bg-gray-100"
                    />
                </div>
            </div>

            <div className="pt-3">
                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-950 hover:bg-blue-900"
                    size="sm"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Menyimpan..." : "Simpan"}
                </Button>
            </div>
        </div>
    );
}
