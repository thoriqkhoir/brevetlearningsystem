import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { router } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { L12AData } from "./types";

const fmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const formatRupiahInput = (v: number) => fmt.format(v ?? 0).replace("Rp", "").trim();
const parseNumber = (raw: string) => {
    const n = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

interface FormL12AProps {
    sptBadanId: string;
    data: L12AData | null;
}

export function FormL12A({ sptBadanId, data }: FormL12AProps) {
    const [taxableIncome, setTaxableIncome] = useState(0);
    const [taxableIncomeDisplay, setTaxableIncomeDisplay] = useState("0");
    const [pphPayable, setPphPayable] = useState(0);
    const [pphPayableDisplay, setPphPayableDisplay] = useState("0");

    // Row 4 - pph_26_a checkbox + value
    const [pph26a, setPph26a] = useState<boolean | null>(null);
    const [pph26aValue, setPph26aValue] = useState(0);
    const [pph26aValueDisplay, setPph26aValueDisplay] = useState("0");

    // Row 4b - pph_26_b checkbox
    const [pph26b, setPph26b] = useState<boolean | null>(null);

    // Row 4b-1
    const [pph26b1, setPph26b1] = useState<boolean | null>(null);
    const [pph26b1Value, setPph26b1Value] = useState(0);
    const [pph26b1ValueDisplay, setPph26b1ValueDisplay] = useState("0");

    // Row 4b-2
    const [pph26b2, setPph26b2] = useState<boolean | null>(null);
    const [pph26b2a, setPph26b2a] = useState<boolean | null>(null);
    const [pph26b2aValue, setPph26b2aValue] = useState("");
    const [pph26b2b, setPph26b2b] = useState<boolean | null>(null);
    const [pph26b2bValue, setPph26b2bValue] = useState("");
    const [pph26b2c, setPph26b2c] = useState<boolean | null>(null);
    const [pph26b2d, setPph26b2d] = useState<boolean | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const raw: Partial<L12AData> = data ?? {};
        setTaxableIncome(raw.taxable_income ?? 0);
        setTaxableIncomeDisplay(formatRupiahInput(raw.taxable_income ?? 0));
        setPphPayable(raw.pph_payable ?? 0);
        setPphPayableDisplay(formatRupiahInput(raw.pph_payable ?? 0));
        setPph26a(raw.pph_26_a ?? null);
        setPph26aValue(raw.pph_26_a_value ?? 0);
        setPph26aValueDisplay(formatRupiahInput(raw.pph_26_a_value ?? 0));
        setPph26b(raw.pph_26_b ?? null);
        setPph26b1(raw.pph_26_b_1 ?? null);
        setPph26b1Value(raw.pph_26_b_1_value ?? 0);
        setPph26b1ValueDisplay(formatRupiahInput(raw.pph_26_b_1_value ?? 0));
        setPph26b2(raw.pph_26_b_2 ?? null);
        setPph26b2a(raw.pph_26_b_2_a ?? null);
        setPph26b2aValue(raw.pph_26_b_2_a_value ?? "");
        setPph26b2b(raw.pph_26_b_2_b ?? null);
        setPph26b2bValue(raw.pph_26_b_2_b_value ?? "");
        setPph26b2c(raw.pph_26_b_2_c ?? null);
        setPph26b2d(raw.pph_26_b_2_d ?? null);
    }, [data, sptBadanId]);

    // dpp = taxableIncome - pphPayable (row 3)
    const dpp = useMemo(() => Math.max(0, taxableIncome - pphPayable), [taxableIncome, pphPayable]);

    const makeMoneyHandler = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        displaySetter: React.Dispatch<React.SetStateAction<string>>,
    ) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = parseNumber(e.target.value);
        setter(n);
        displaySetter(formatRupiahInput(n));
    };

    const handleSave = () => {
        setIsSaving(true);
        router.post(route("spt.badan.l12a.sync"), {
            spt_badan_id:       sptBadanId,
            taxable_income:     taxableIncome,
            pph_payable:        pphPayable,
            dpp,
            pph_26_a:           pph26a,
            pph_26_a_value:     pph26aValue,
            pph_26_b:           pph26b,
            pph_26_b_1:         pph26b1,
            pph_26_b_1_value:   pph26b1Value,
            pph_26_b_2:         pph26b2,
            pph_26_b_2_a:       pph26b2a,
            pph_26_b_2_a_value: pph26b2aValue || null,
            pph_26_b_2_b:       pph26b2b,
            pph_26_b_2_b_value: pph26b2bValue || null,
            pph_26_b_2_c:       pph26b2c,
            pph_26_b_2_d:       pph26b2d,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success("Data berhasil disimpan"),
            onError: () => toast.error("Gagal menyimpan data"),
            onFinish: () => setIsSaving(false),
        });
    };

    return (
        <div className="p-4 space-y-0">
            {/* Header column */}
            <div className="grid grid-cols-[1fr_240px]">
                <div />
                <div className="bg-blue-950 text-white text-center text-xs font-semibold py-2 px-3 rounded-t">
                    NILAI (Rupiah)
                </div>
            </div>

            {/* Row 1 - Penghasilan Kena Pajak */}
            <Row
                number="1"
                label="PENGHASILAN KENA PAJAK"
                input={
                    <Input
                        value={taxableIncomeDisplay}
                        onChange={makeMoneyHandler(setTaxableIncome, setTaxableIncomeDisplay)}
                        className="text-right"
                    />
                }
            />

            {/* Row 2 - PPh Terutang */}
            <Row
                number="2"
                label="PPh TERUTANG"
                input={
                    <Input
                        value={pphPayableDisplay}
                        onChange={makeMoneyHandler(setPphPayable, setPphPayableDisplay)}
                        className="text-right"
                    />
                }
            />

            {/* Row 3 - DPP */}
            <Row
                number="3"
                label={
                    <span>
                        DASAR PENGENAAN PAJAK PPh PASAL 26 AYAT (4)
                        <span className="ml-4 text-xs text-muted-foreground">
                            ( <BadgeYellow>1</BadgeYellow> - <BadgeYellow>2</BadgeYellow> )
                        </span>
                    </span>
                }
                input={
                    <Input
                        value={formatRupiahInput(dpp)}
                        disabled
                        className="text-right bg-gray-100"
                    />
                }
            />

            {/* Row 4 - PPh Pasal 26 Ayat (4) */}
            <Row number="4" label="PPh PASAL 26 AYAT (4)" input={<div />} />

            {/* 4a */}
            <SubRow
                badge={<BadgeYellow small>a.</BadgeYellow>}
                content={
                    <div className="flex items-center gap-3 w-full">
                        <Checkbox
                            checked={pph26a === true}
                            onCheckedChange={(c) => setPph26a(c ? true : null)}
                        />
                        <span className="text-sm flex-1">
                            TERUTANG : ...... *) % X JUMLAH PADA ANGKA{" "}
                            <BadgeYellow>3</BadgeYellow>
                        </span>
                    </div>
                }
                input={
                    <Input
                        value={pph26aValueDisplay}
                        onChange={makeMoneyHandler(setPph26aValue, setPph26aValueDisplay)}
                        className="text-right"
                        disabled={!pph26a}
                    />
                }
            />

            {/* 4b */}
            <SubRow
                badge={<BadgeYellow small>b.</BadgeYellow>}
                content={
                    <div className="flex items-center gap-3 w-full">
                        <Checkbox
                            checked={pph26b === true}
                            onCheckedChange={(c) => setPph26b(c ? true : null)}
                        />
                        <span className="text-sm">TIDAK TERUTANG, BERDASARKAN:</span>
                    </div>
                }
                input={<div />}
            />

            {/* 4b-1 */}
            <SubRow
                indent={2}
                badge={<BadgeYellow small>1)</BadgeYellow>}
                content={
                    <div className="flex items-center gap-3 w-full">
                        <Checkbox
                            checked={pph26b1 === true}
                            onCheckedChange={(c) => setPph26b1(c ? true : null)}
                            disabled={!pph26b}
                        />
                        <span className="text-sm flex-1 flex items-center gap-2">
                            KETENTUAN P3B INDONESIA -
                            <Input
                                value={pph26b1Value ? String(pph26b1Value) : ""}
                                onChange={(e) => setPph26b1Value(parseNumber(e.target.value))}
                                placeholder="Negara"
                                className="w-40 h-7 text-sm"
                                disabled={!pph26b1}
                            />
                        </span>
                    </div>
                }
                input={<div />}
            />

            {/* 4b-2 */}
            <SubRow
                indent={2}
                badge={<BadgeYellow small>2)</BadgeYellow>}
                content={
                    <div className="flex items-center gap-3 w-full">
                        <Checkbox
                            checked={pph26b2 === true}
                            onCheckedChange={(c) => setPph26b2(c ? true : null)}
                            disabled={!pph26b}
                        />
                        <span className="text-sm">DITANAMKAN KEMBALI SELURUHNYA DI INDONESIA **</span>
                    </div>
                }
                input={<div />}
            />

            {/* 4b-2-a */}
            <SubRow
                indent={3}
                badge={<BadgeYellow small>a)</BadgeYellow>}
                content={
                    <div className="space-y-1 w-full">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={pph26b2a === true}
                                onCheckedChange={(c) => setPph26b2a(c ? true : null)}
                                disabled={!pph26b2}
                            />
                            <span className="text-sm">Ditanamkan kembali pada perusahaan baru di Indonesia</span>
                        </div>
                        <div className="flex items-center gap-2 pl-7">
                            <span className="text-sm text-muted-foreground">NPWP</span>
                            <Input
                                value={pph26b2aValue}
                                onChange={(e) => setPph26b2aValue(e.target.value)}
                                placeholder="00.000.000.0-000.000"
                                className="w-56 h-7 text-sm"
                                disabled={!pph26b2a}
                            />
                        </div>
                    </div>
                }
                input={<div />}
            />

            {/* 4b-2-b */}
            <SubRow
                indent={3}
                badge={<BadgeYellow small>b)</BadgeYellow>}
                content={
                    <div className="space-y-1 w-full">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={pph26b2b === true}
                                onCheckedChange={(c) => setPph26b2b(c ? true : null)}
                                disabled={!pph26b2}
                            />
                            <span className="text-sm">Ditanamkan kembali pada perusahaan yang sudah berdiri di Indonesia</span>
                        </div>
                        <div className="flex items-center gap-2 pl-7">
                            <span className="text-sm text-muted-foreground">NPWP</span>
                            <Input
                                value={pph26b2bValue}
                                onChange={(e) => setPph26b2bValue(e.target.value)}
                                placeholder="00.000.000.0-000.000"
                                className="w-56 h-7 text-sm"
                                disabled={!pph26b2b}
                            />
                        </div>
                    </div>
                }
                input={<div />}
            />

            {/* 4b-2-c */}
            <SubRow
                indent={3}
                badge={<BadgeYellow small>c)</BadgeYellow>}
                content={
                    <div className="flex items-center gap-3 w-full">
                        <Checkbox
                            checked={pph26b2c === true}
                            onCheckedChange={(c) => setPph26b2c(c ? true : null)}
                            disabled={!pph26b2}
                        />
                        <span className="text-sm">Ditanamkan kembali dalam bentuk perolehan aktiva tetap</span>
                    </div>
                }
                input={<div />}
            />

            {/* 4b-2-d */}
            <SubRow
                indent={3}
                badge={<BadgeYellow small>d)</BadgeYellow>}
                content={
                    <div className="flex items-center gap-3 w-full">
                        <Checkbox
                            checked={pph26b2d === true}
                            onCheckedChange={(c) => setPph26b2d(c ? true : null)}
                            disabled={!pph26b2}
                        />
                        <span className="text-sm">Ditanamkan kembali dalam bentuk aktiva tidak berwujud</span>
                    </div>
                }
                input={<div />}
            />

            {/* Save */}
            <div className="pt-6">
                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-950 hover:bg-blue-900 gap-2"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Menyimpan..." : "Simpan Konsep"}
                </Button>
            </div>
        </div>
    );
}

/* ─── helper sub-components ─── */

function BadgeYellow({ children, small }: { children: React.ReactNode; small?: boolean }) {
    return (
        <span className={`font-bold ${small ? "text-xs" : "text-sm"}`}>
            {children}
        </span>
    );
}

function Row({
    number,
    label,
    input,
}: {
    number: string;
    label: React.ReactNode;
    input: React.ReactNode;
}) {
    return (
        <div className="grid grid-cols-[1fr_240px] border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-sm font-bold">{number}</span>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="px-3 py-2 border-l border-gray-200">{input}</div>
        </div>
    );
}

function SubRow({
    indent = 1,
    badge,
    content,
    input,
}: {
    indent?: number;
    badge: React.ReactNode;
    content: React.ReactNode;
    input: React.ReactNode;
}) {
    const paddingLeft = indent * 28;
    return (
        <div className="grid grid-cols-[1fr_240px] border-b border-gray-200 bg-white">
            <div className="flex items-start gap-3 px-4 py-3" style={{ paddingLeft: `${paddingLeft}px` }}>
                {badge}
                <div className="flex-1">{content}</div>
            </div>
            <div className="px-3 py-2 border-l border-gray-200">{input}</div>
        </div>
    );
}

export default FormL12A;
