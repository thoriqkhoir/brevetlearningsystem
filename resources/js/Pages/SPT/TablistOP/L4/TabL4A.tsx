import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { router } from "@inertiajs/react";
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PTKP_MAP = {
    "K/0": 58_500_000,
    "K/1": 63_000_000,
    "K/2": 67_500_000,
    "K/3": 72_000_000,
    "K/I/0": 112_500_000,
    "K/I/1": 117_000_000,
    "K/I/2": 121_500_000,
    "K/I/3": 126_000_000,
    "TK/0": 54_000_000,
    "TK/1": 58_500_000,
    "TK/2": 63_000_000,
    "TK/3": 67_500_000,
    "-/-": 0,
} as const;

type PtkpStatus = keyof typeof PTKP_MAP;

const PTKP_STATUS_ORDER: PtkpStatus[] = [
    "K/0",
    "K/1",
    "K/2",
    "K/3",
    "K/I/0",
    "K/I/1",
    "K/I/2",
    "K/I/3",
    "TK/0",
    "TK/1",
    "TK/2",
    "TK/3",
    "-/-",
];

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const formatRupiahInput = (value: number) => {
    if (!value) return "0";
    return rupiahFormatter.format(value).replace("Rp", "").trim();
};

const parseNumber = (raw: string) => {
    const numeric = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
};

const roundDownToThousand = (value: number) =>
    Math.floor(Math.max(0, value) / 1000) * 1000;

const calcProgressivePph21 = (pkp: number) => {
    const taxable = Math.max(0, pkp);
    let remaining = taxable;
    let tax = 0;

    const take = (cap: number, rate: number) => {
        const amount = Math.min(remaining, cap);
        remaining -= amount;
        tax += amount * rate;
    };

    // Tarif progresif (UU HPP):
    // 0-60 jt: 5%
    // 60-250 jt: 15%
    // 250-500 jt: 25%
    // 500-5 M: 30%
    // >5 M: 35%
    take(60_000_000, 0.05);
    if (remaining > 0) take(190_000_000, 0.15);
    if (remaining > 0) take(250_000_000, 0.25);
    if (remaining > 0) take(4_500_000_000, 0.3);
    if (remaining > 0) take(Number.POSITIVE_INFINITY, 0.35);

    return Math.round(tax);
};

type L4ARecord = {
    id?: string;
    spt_op_id: string;
    regular_net_income: number;
    final_loss: number;
    zakat: number;
    total_net_income: number;
    ptkp: string | null;
    taxable_income: number;
    income_tax_payable: number;
    income_tax_deduction: number;
    tax_credit: number;
    income_tax_must_paid: number;
    tax_installments: number;
};

type EditableState = {
    regular_net_income: number;
    final_loss: number;
    zakat: number;
    ptkp: string | null;
    income_tax_deduction: number;
    tax_credit: number;
};

const defaultState: EditableState = {
    regular_net_income: 0,
    final_loss: 0,
    zakat: 0,
    ptkp: null,
    income_tax_deduction: 0,
    tax_credit: 0,
};

export default function TabL4A({
    user,
    spt,
    sptOpId,
    l4a,
}: {
    user: { npwp: string };
    spt: { year: number };
    sptOpId: string;
    l4a: Partial<L4ARecord> | null;
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [ptkpOpen, setPtkpOpen] = useState(false);

    const [state, setState] = useState<EditableState>(defaultState);

    const [regularNetDisplay, setRegularNetDisplay] = useState("");
    const [finalLossDisplay, setFinalLossDisplay] = useState("");
    const [zakatDisplay, setZakatDisplay] = useState("");
    const [deductionDisplay, setDeductionDisplay] = useState("");
    const [creditDisplay, setCreditDisplay] = useState("");

    useEffect(() => {
        const raw = l4a ?? {};
        const next: EditableState = {
            regular_net_income: Number(raw.regular_net_income ?? 0),
            final_loss: Number(raw.final_loss ?? 0),
            zakat: Number(raw.zakat ?? 0),
            ptkp: (raw.ptkp ?? null) as any,
            income_tax_deduction: Number(raw.income_tax_deduction ?? 0),
            tax_credit: Number(raw.tax_credit ?? 0),
        };
        setState(next);

        setRegularNetDisplay(formatRupiahInput(next.regular_net_income));
        setFinalLossDisplay(formatRupiahInput(next.final_loss));
        setZakatDisplay(formatRupiahInput(next.zakat));
        setDeductionDisplay(formatRupiahInput(next.income_tax_deduction));
        setCreditDisplay(formatRupiahInput(next.tax_credit));
    }, [l4a, sptOpId]);

    const computed = useMemo(() => {
        const totalNetIncome = Math.max(
            0,
            Number(state.regular_net_income ?? 0) -
                Number(state.final_loss ?? 0) -
                Number(state.zakat ?? 0),
        );

        const ptkpValue = state.ptkp
            ? Number((PTKP_MAP as any)[state.ptkp] ?? 0)
            : 0;

        const taxableIncomeRaw = Math.max(0, totalNetIncome - ptkpValue);
        const taxableIncome = roundDownToThousand(taxableIncomeRaw);

        const incomeTaxPayable = calcProgressivePph21(taxableIncome);

        const incomeTaxMustPaid = Math.max(
            0,
            incomeTaxPayable -
                Number(state.income_tax_deduction ?? 0) -
                Number(state.tax_credit ?? 0),
        );

        const taxInstallments =
            incomeTaxMustPaid > 0 ? Math.ceil(incomeTaxMustPaid / 12) : 0;

        return {
            total_net_income: totalNetIncome,
            ptkp_value: ptkpValue,
            taxable_income: taxableIncome,
            income_tax_payable: incomeTaxPayable,
            income_tax_must_paid: incomeTaxMustPaid,
            tax_installments: taxInstallments,
        };
    }, [state]);

    const handleRupiahChange = (
        field:
            | "regular_net_income"
            | "final_loss"
            | "zakat"
            | "income_tax_deduction"
            | "tax_credit",
        setDisplay: (v: string) => void,
    ) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const numeric = parseNumber(e.target.value);
            setState((prev) => ({ ...prev, [field]: numeric }));
            setDisplay(formatRupiahInput(numeric));
        };
    };

    const ptkpLabel = (value: string | null) => {
        if (!value) return "";
        const amount = Number((PTKP_MAP as any)[value] ?? 0);
        return `${value} = ${rupiahFormatter.format(amount).replace("Rp", "").trim()}`;
    };

    const sync = () => {
        setIsSaving(true);

        const payload = {
            spt_op_id: sptOpId,
            regular_net_income: Number(state.regular_net_income ?? 0),
            final_loss: Number(state.final_loss ?? 0),
            zakat: Number(state.zakat ?? 0),
            total_net_income: Number(computed.total_net_income ?? 0),
            ptkp: state.ptkp,
            taxable_income: Number(computed.taxable_income ?? 0),
            income_tax_payable: Number(computed.income_tax_payable ?? 0),
            income_tax_deduction: Number(state.income_tax_deduction ?? 0),
            tax_credit: Number(state.tax_credit ?? 0),
            income_tax_must_paid: Number(computed.income_tax_must_paid ?? 0),
            tax_installments: Number(computed.tax_installments ?? 0),
        } as Record<string, any>;

        router.post(route("spt.op.l4a.sync"), payload, {
            preserveScroll: true,
            onSuccess: () => toast.success("Data L4A berhasil disimpan"),
            onError: () => toast.error("Gagal menyimpan data L4A"),
            onFinish: () => setIsSaving(false),
        });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>
                    A. PENGHITUNGAN ANGSURAN PPh PASAL 25 TAHUN PAJAK BERIKUTNYA
                </li>
                <li>
                    B. PENGHITUNGAN PPh TERUTANG WAJIB PAJAK DAN SUAMI/ISTRI
                </li>
            </ul>

            {/* HEADER */}
            <div>
                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                    HEADER
                </div>
                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <Label className="text-sm">Tahun Pajak</Label>
                            <Input
                                type="text"
                                value={String(spt.year)}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                            <Label className="text-sm">NPWP</Label>
                            <Input
                                type="text"
                                value={user.npwp}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={["l4a"]}>
                <AccordionItem value="l4a">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        A. PERHITUNGAN ANGSURAN PPh PASAL 25 TAHUN PAJAK
                        BERIKUTNYA
                    </AccordionTrigger>
                    <AccordionContent className="p-6 bg-white w-full border border-t-0 rounded-b-xl">
                        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-3 items-center">
                            <Label>
                                Penghasilan neto{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={regularNetDisplay}
                                onChange={handleRupiahChange(
                                    "regular_net_income",
                                    setRegularNetDisplay,
                                )}
                                placeholder="0"
                            />

                            <Label>Kompensasi kerugian tahun berikutnya</Label>
                            <Input
                                value={finalLossDisplay}
                                onChange={handleRupiahChange(
                                    "final_loss",
                                    setFinalLossDisplay,
                                )}
                                placeholder="0"
                            />

                            <Label>
                                Zakat/sumbangan keagamaan yang bersifat wajib
                            </Label>
                            <Input
                                value={zakatDisplay}
                                onChange={handleRupiahChange(
                                    "zakat",
                                    setZakatDisplay,
                                )}
                                placeholder="0"
                            />

                            <Label>Jumlah penghasilan neto</Label>
                            <Input
                                value={formatRupiahInput(
                                    computed.total_net_income,
                                )}
                                disabled
                                className="bg-gray-100"
                            />

                            <Label>Penghasilan tidak kena pajak</Label>
                            <div className="flex items-center gap-2">
                                <Popover
                                    open={ptkpOpen}
                                    onOpenChange={setPtkpOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={ptkpOpen}
                                            className="w-full justify-between font-normal"
                                        >
                                            {state.ptkp
                                                ? ptkpLabel(state.ptkp)
                                                : "Pilih PTKP"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[420px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari status PTKP..." />
                                            <CommandList>
                                                <CommandEmpty>
                                                    Tidak ditemukan.
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {PTKP_STATUS_ORDER.map(
                                                        (opt) => (
                                                            <CommandItem
                                                                key={opt}
                                                                value={opt}
                                                                onSelect={() => {
                                                                    setState(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            ptkp: opt,
                                                                        }),
                                                                    );
                                                                    setPtkpOpen(
                                                                        false,
                                                                    );
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        state.ptkp ===
                                                                            opt
                                                                            ? "opacity-100"
                                                                            : "opacity-0",
                                                                    )}
                                                                />
                                                                {ptkpLabel(opt)}
                                                            </CommandItem>
                                                        ),
                                                    )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="px-3"
                                    onClick={() =>
                                        setState((prev) => ({
                                            ...prev,
                                            ptkp: null,
                                        }))
                                    }
                                    disabled={!state.ptkp}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <Label>Penghasilan Kena Pajak</Label>
                            <Input
                                value={formatRupiahInput(
                                    computed.taxable_income,
                                )}
                                disabled
                                className="bg-gray-100"
                            />

                            <Label>Pajak Terutang</Label>
                            <Input
                                value={formatRupiahInput(
                                    computed.income_tax_payable,
                                )}
                                disabled
                                className="bg-gray-100"
                            />

                            <Label>Pengurang PPh Terutang</Label>
                            <Input
                                value={deductionDisplay}
                                onChange={handleRupiahChange(
                                    "income_tax_deduction",
                                    setDeductionDisplay,
                                )}
                                placeholder="0"
                            />

                            <Label>Kredit pajak</Label>
                            <Input
                                value={creditDisplay}
                                onChange={handleRupiahChange(
                                    "tax_credit",
                                    setCreditDisplay,
                                )}
                                placeholder="0"
                            />

                            <Label>PPh yang harus dibayar</Label>
                            <Input
                                value={formatRupiahInput(
                                    computed.income_tax_must_paid,
                                )}
                                disabled
                                className="bg-gray-100"
                            />

                            <Label>
                                Angsuran PPh Pasal 25 Tahun Pajak Berikutnya
                            </Label>
                            <Input
                                value={formatRupiahInput(
                                    computed.tax_installments,
                                )}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="flex justify-start">
                <Button
                    type="button"
                    onClick={sync}
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
