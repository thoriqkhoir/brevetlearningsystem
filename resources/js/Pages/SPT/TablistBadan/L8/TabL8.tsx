import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

const FACILITY_GROSS_REVENUE_LIMIT = 4_800_000_000;
const FACILITY_ELIGIBLE_GROSS_REVENUE_LIMIT = 50_000_000_000;
const DEFAULT_NORMAL_TAX_RATE_PERCENT = 22;

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

type L8Record = {
    id?: string;
    spt_badan_id: string;
    amount_1: number;
    amount_2a: number;
    amount_2b: number;
    amount_3a: number;
    amount_3b: number;
    amount_4: number;
};

type EditableState = Pick<L8Record, "amount_1">;

const defaultState: EditableState = {
    amount_1: 0,
};

export default function TabL8({
    sptBadan,
    spt,
    l8,
}: {
    sptBadan: {
        id: string;
        npwp?: string;
        d_9?: number;
        d_11_percentage?: number;
    };
    spt: { year: number };
    l8: Partial<L8Record> | null;
}) {
    const [state, setState] = useState<EditableState>(defaultState);
    const [amount1Display, setAmount1Display] = useState("0");
    const autoSaveTimeoutRef = useRef<number | null>(null);
    const lastSyncedAmount1Ref = useRef<number>(0);

    useEffect(() => {
        const raw = l8 ?? {};
        const next: EditableState = {
            amount_1: Number(raw.amount_1 ?? 0),
        };
        setState(next);
        setAmount1Display(formatRupiahInput(next.amount_1));
        lastSyncedAmount1Ref.current = Math.max(0, next.amount_1);
    }, [l8]);

    // Pasal 31E split:
    // - Peredaran bruto fasilitas maksimal 4,8 miliar
    // - PKP dibagi proporsional terhadap peredaran bruto
    // - Tarif fasilitas = 50% x tarif normal
    const computed = useMemo(() => {
        const grossRevenue = Math.max(0, state.amount_1);
        const taxableIncome = Math.max(0, Number(sptBadan.d_9 ?? 0));
        const configuredTaxRate = Number(sptBadan.d_11_percentage ?? 0);
        const normalTaxRate =
            configuredTaxRate > 0
                ? configuredTaxRate
                : DEFAULT_NORMAL_TAX_RATE_PERCENT;

        const isFacilityEligible =
            grossRevenue > 0 &&
            grossRevenue <= FACILITY_ELIGIBLE_GROSS_REVENUE_LIMIT;

        // 2.a = ((4.800.000.000 / Jumlah Peredaran Bruto) x PKP)
        // dengan batas maksimum proporsi 100% PKP.
        const facilityRatio = isFacilityEligible
            ? Math.min(1, FACILITY_GROSS_REVENUE_LIMIT / grossRevenue)
            : 0;
        const amount_2a = Math.min(
            taxableIncome,
            Math.max(0, Math.round(taxableIncome * facilityRatio)),
        );
        const amount_2b = Math.max(0, taxableIncome - amount_2a);

        const facilityTaxRate = normalTaxRate / 2 / 100;
        const nonFacilityTaxRate = normalTaxRate / 100;

        const amount_3a = Math.round(amount_2a * facilityTaxRate);
        const amount_3b = Math.round(amount_2b * nonFacilityTaxRate);
        const amount_4 = amount_3a + amount_3b;

        return {
            amount_2a,
            amount_2b,
            amount_3a,
            amount_3b,
            amount_4,
        };
    }, [state.amount_1, sptBadan.d_9, sptBadan.d_11_percentage]);

    const handleAmount1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numeric = parseNumber(e.target.value);
        setState({ amount_1: numeric });
        setAmount1Display(formatRupiahInput(numeric));
    };

    const sync = ({
        silent = false,
        amount1 = state.amount_1,
    }: {
        silent?: boolean;
        amount1?: number;
    } = {}) => {
        const normalizedAmount1 = Math.max(0, amount1);
        const payload = {
            spt_badan_id: sptBadan.id,
            amount_1: normalizedAmount1,
        };

        router.post(route("spt.badan.l8.sync"), payload, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onSuccess: () => {
                lastSyncedAmount1Ref.current = normalizedAmount1;
                if (!silent) {
                    toast.success("Data L8 berhasil disimpan");
                }
            },
            onError: () => {
                toast.error("Gagal menyimpan data L8");
            },
        });
    };

    useEffect(() => {
        if (!sptBadan.id) return;

        const currentAmount1 = Math.max(0, state.amount_1);
        if (currentAmount1 === lastSyncedAmount1Ref.current) return;

        if (autoSaveTimeoutRef.current) {
            window.clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = window.setTimeout(() => {
            sync({ silent: true, amount1: currentAmount1 });
        }, 500);

        return () => {
            if (autoSaveTimeoutRef.current) {
                window.clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [state.amount_1, sptBadan.id]);

    const getDisplayValue = (value: number) => formatRupiahInput(value);

    const renderCurrencyInput = (value: string, disabled = false) => (
        <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 bg-gray-200 px-3 text-sm text-muted-foreground">
                Rp.
            </span>
            <Input
                value={value}
                disabled={disabled}
                className={cn(
                    "rounded-l-none text-right",
                    disabled && "bg-gray-100",
                )}
                placeholder="0"
            />
        </div>
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
            {/* HEADER */}
            <div>
                <h2 className="text-xl font-semibold mb-6">
                    PERHITUNGAN FASILITAS PENGURANGAN TARIF PPh BAGI WAJIB PAJAK
                    BADAN DALAM NEGERI BERDASARKAN PASAL 31E AYAT (1)
                    UNDANG-UNDANG PPh
                </h2>
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
                            <Label className="text-sm">NPWP Badan</Label>
                            <Input
                                type="text"
                                value={sptBadan.npwp ?? "-"}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={["l8"]}>
                <AccordionItem value="l8">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        PERHITUNGAN FASILITAS PENGURANGAN TARIF PPh BAGI WAJIB
                        PAJAK BADAN DALAM NEGERI BERDASARKAN PASAL 31E AYAT (1)
                        UNDANG-UNDANG PPh
                    </AccordionTrigger>
                    <AccordionContent className="p-6 bg-white w-full border border-t-0 rounded-b-xl">
                        <div className="overflow-x-auto border">
                            <div className="grid min-w-[900px] grid-cols-[70px_minmax(0,1fr)_380px] text-sm">
                                <div className="border-b bg-amber-400 px-3 py-2 text-center font-semibold">
                                    NO.
                                </div>
                                <div className="border-b border-l bg-amber-400 px-3 py-2 text-center font-semibold">
                                    DESKRIPSI
                                </div>
                                <div className="border-b border-l bg-amber-400 px-3 py-2 text-center font-semibold">
                                    AMOUNT (Rupiah)
                                </div>

                                <div className="border-b px-3 py-3 text-center">
                                    1.
                                </div>
                                <div className="border-b border-l px-3 py-3 font-medium">
                                    Jumlah Peredaran Bruto
                                </div>
                                <div className="border-b border-l px-3 py-3" />

                                <div className="border-b px-3 py-3" />
                                <div className="border-b border-l px-3 py-3">
                                    Jumlah Peredaran Bruto
                                </div>
                                <div className="border-b border-l px-3 py-3">
                                    <div className="flex">
                                        <span className="inline-flex items-center rounded-l-md border border-r-0 bg-gray-200 px-3 text-sm text-muted-foreground">
                                            Rp.
                                        </span>
                                        <Input
                                            value={amount1Display}
                                            onChange={handleAmount1Change}
                                            className="rounded-l-none text-right"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="border-b px-3 py-3 text-center">
                                    2.
                                </div>
                                <div className="border-b border-l px-3 py-3 font-medium">
                                    Penghasilan Kena Pajak
                                </div>
                                <div className="border-b border-l px-3 py-3" />

                                <div className="border-b px-3 py-3" />
                                <div className="border-b border-l px-3 py-3">
                                    Penghasilan Kena Pajak dari bagian peredaran
                                    bruto yang memperoleh fasilitas
                                </div>
                                <div className="border-b border-l px-3 py-3">
                                    {renderCurrencyInput(
                                        getDisplayValue(computed.amount_2a),
                                        true,
                                    )}
                                </div>

                                <div className="border-b px-3 py-3" />
                                <div className="border-b border-l px-3 py-3">
                                    Penghasilan Kena Pajak dari bagian peredaran
                                    bruto yang tidak memperoleh fasilitas
                                </div>
                                <div className="border-b border-l px-3 py-3">
                                    {renderCurrencyInput(
                                        getDisplayValue(computed.amount_2b),
                                        true,
                                    )}
                                </div>

                                <div className="border-b px-3 py-3 text-center">
                                    3.
                                </div>
                                <div className="border-b border-l px-3 py-3 font-medium">
                                    PPh Terutang
                                </div>
                                <div className="border-b border-l px-3 py-3" />

                                <div className="border-b px-3 py-3" />
                                <div className="border-b border-l px-3 py-3">
                                    PPh Terutang atas Penghasilan Kena Pajak
                                    dari bagian peredaran bruto yang memperoleh
                                    fasilitas
                                </div>
                                <div className="border-b border-l px-3 py-3">
                                    {renderCurrencyInput(
                                        getDisplayValue(computed.amount_3a),
                                        true,
                                    )}
                                </div>

                                <div className="border-b px-3 py-3" />
                                <div className="border-b border-l px-3 py-3">
                                    PPh Terutang atas Penghasilan Kena Pajak
                                    dari bagian peredaran bruto yang tidak
                                    memperoleh fasilitas
                                </div>
                                <div className="border-b border-l px-3 py-3">
                                    {renderCurrencyInput(
                                        getDisplayValue(computed.amount_3b),
                                        true,
                                    )}
                                </div>

                                <div className="px-3 py-3" />
                                <div className="border-l px-3 py-3 font-semibold">
                                    Jumlah PPh Terutang
                                </div>
                                <div className="border-l px-3 py-3">
                                    {renderCurrencyInput(
                                        getDisplayValue(computed.amount_4),
                                        true,
                                    )}
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
