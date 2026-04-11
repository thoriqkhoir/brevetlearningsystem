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

type L6Record = {
    id?: string;
    spt_badan_id: string;
    amount_1: number;
    amount_2: number;
    amount_3: number;
    amount_4: number;
    amount_5: number;
    amount_6: number;
    amount_7: number;
};

type EditableState = {
    amount_1: number;
    amount_2: number;
    amount_3: number;
    amount_4: number;
    amount_5: number;
    amount_6: number;
    amount_7: number;
};

const defaultState: EditableState = {
    amount_1: 0,
    amount_2: 0,
    amount_3: 0,
    amount_4: 0,
    amount_5: 0,
    amount_6: 0,
    amount_7: 0,
};

const FIELD_CONFIGS: Array<{
    field: keyof EditableState;
    number: string;
    label: string;
    description?: string;
}> = [
    {
        field: "amount_1",
        number: "1",
        label: "Penghasilan yang menjadi dasar penghitungan angsuran",
    },
    {
        field: "amount_2",
        number: "2",
        label: "Kompensasi kerugian fiskal",
        description:
            "Diisi dari Formulir Lampiran-07 Jumlah Kompensasi Kerugian Fiskal Tahun Pajak Berjalan",
    },
    {
        field: "amount_3",
        number: "3",
        label: "Penghasilan kena pajak",
    },
    {
        field: "amount_4",
        number: "4",
        label: "PPh yang terutang",
    },
    {
        field: "amount_5",
        number: "5",
        label: "Kredit pajak tahun pajak yang lalu atas penghasilan yang termasuk dalam angka 1 yang dipotong/dipungut pihak lain",
    },
    {
        field: "amount_6",
        number: "6",
        label: "PPh yang harus dibayar sendiri",
    },
    {
        field: "amount_7",
        number: "7",
        label: "Angsuran PPh Pasal 25",
    },
];

const READONLY_FIELDS: (keyof EditableState)[] = [
    "amount_2",
    "amount_3",
    "amount_6",
    "amount_7",
];

export default function TabL6({
    sptBadan,
    spt,
    l6,
    l7,
}: {
    sptBadan: { id: string; npwp?: string };
    spt: { year: number };
    l6: Partial<L6Record> | null;
    l7?: Array<{ year_now?: number | null }>;
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [state, setState] = useState<EditableState>(defaultState);
    const autoSaveTimeoutRef = useRef<number | null>(null);
    const hasMountedRef = useRef(false);
    const lastPayloadRef = useRef<string>("");

    const [displays, setDisplays] = useState<
        Record<keyof EditableState, string>
    >({
        amount_1: "0",
        amount_2: "0",
        amount_3: "0",
        amount_4: "0",
        amount_5: "0",
        amount_6: "0",
        amount_7: "0",
    });

    const amount2FromL7 = useMemo(
        () =>
            (l7 ?? []).reduce(
                (sum, item) => sum + Number(item?.year_now ?? 0),
                0,
            ),
        [l7],
    );

    useEffect(() => {
        const raw = l6 ?? {};
        const next: EditableState = {
            amount_1: Number(raw.amount_1 ?? 0),
            amount_2: amount2FromL7,
            amount_3: Number(raw.amount_3 ?? 0),
            amount_4: Number(raw.amount_4 ?? 0),
            amount_5: Number(raw.amount_5 ?? 0),
            amount_6: Number(raw.amount_6 ?? 0),
            amount_7: Number(raw.amount_7 ?? 0),
        };
        setState(next);
        setDisplays({
            amount_1: formatRupiahInput(next.amount_1),
            amount_2: formatRupiahInput(next.amount_2),
            amount_3: formatRupiahInput(next.amount_3),
            amount_4: formatRupiahInput(next.amount_4),
            amount_5: formatRupiahInput(next.amount_5),
            amount_6: formatRupiahInput(next.amount_6),
            amount_7: formatRupiahInput(next.amount_7),
        });
    }, [l6, amount2FromL7]);

    // amount_3 = amount_1 - amount_2
    // amount_6 = amount_4 - amount_5
    // amount_7 = ceil(amount_6 / 12)
    const computed = useMemo(() => {
        const amount_3 = Math.max(0, state.amount_1 - amount2FromL7);
        const amount_6 = Math.max(0, state.amount_4 - state.amount_5);
        const amount_7 = amount_6 > 0 ? Math.ceil(amount_6 / 12) : 0;
        return { amount_3, amount_6, amount_7 };
    }, [state.amount_1, amount2FromL7, state.amount_4, state.amount_5]);

    const handleChange =
        (field: keyof EditableState) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const numeric = parseNumber(e.target.value);
            setState((prev) => ({ ...prev, [field]: numeric }));
            setDisplays((prev) => ({
                ...prev,
                [field]: formatRupiahInput(numeric),
            }));
        };

    const payload = useMemo(
        () => ({
            spt_badan_id: sptBadan.id,
            amount_1: state.amount_1,
            amount_2: amount2FromL7,
            amount_3: computed.amount_3,
            amount_4: state.amount_4,
            amount_5: state.amount_5,
            amount_6: computed.amount_6,
            amount_7: computed.amount_7,
        }),
        [
            sptBadan.id,
            state.amount_1,
            state.amount_4,
            state.amount_5,
            amount2FromL7,
            computed.amount_3,
            computed.amount_6,
            computed.amount_7,
        ],
    );

    useEffect(() => {
        if (!sptBadan.id) return;

        const payloadKey = JSON.stringify(payload);

        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            lastPayloadRef.current = payloadKey;
            return;
        }

        if (payloadKey === lastPayloadRef.current) {
            return;
        }

        if (autoSaveTimeoutRef.current) {
            window.clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = window.setTimeout(() => {
            setIsSaving(true);
            lastPayloadRef.current = payloadKey;

            router.post(route("spt.badan.l6.sync"), payload, {
                preserveScroll: true,
                preserveState: true,
                only: ["sptBadan", "l6"],
                onError: () => toast.error("Gagal menyimpan data L6"),
                onFinish: () => setIsSaving(false),
            });
        }, 500);

        return () => {
            if (autoSaveTimeoutRef.current) {
                window.clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [payload, sptBadan.id]);

    const getValue = (field: keyof EditableState) => {
        if (field === "amount_3") return formatRupiahInput(computed.amount_3);
        if (field === "amount_6") return formatRupiahInput(computed.amount_6);
        if (field === "amount_7") return formatRupiahInput(computed.amount_7);
        return displays[field];
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
            {/* HEADER */}
            <div>
                <h2 className="text-xl font-semibold mb-6">
                    ANGSURAN PAJAK PENGHASILAN PASAL 25 TAHUN PAJAK BERJALAN
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

            <Accordion type="multiple" defaultValue={["l6"]}>
                <AccordionItem value="l6">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        ANGSURAN PAJAK PENGHASILAN TAHUN PAJAK BERJALAN
                    </AccordionTrigger>
                    <AccordionContent className="p-6 bg-white w-full border border-t-0 rounded-b-xl">
                        <div className="space-y-3">
                            {FIELD_CONFIGS.map((config) => {
                                const isReadOnly = READONLY_FIELDS.includes(
                                    config.field,
                                );
                                return (
                                    <div
                                        key={config.field}
                                        className="grid grid-cols-1 gap-3 border-b pb-3 last:border-b-0 md:grid-cols-[32px_minmax(0,1fr)_280px] md:items-center"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center text-xs font-semibold text-black">
                                            {config.number}
                                        </div>
                                        <div className="min-w-0 text-sm leading-relaxed text-slate-700">
                                            <div>{config.label}</div>
                                            {config.description && (
                                                <div className="text-xs text-slate-500">
                                                    {config.description}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex">
                                            <span className="inline-flex items-center rounded-l-md border border-r-0 bg-gray-200 px-3 text-sm text-muted-foreground">
                                                Rp.
                                            </span>
                                            <Input
                                                value={getValue(config.field)}
                                                onChange={
                                                    isReadOnly
                                                        ? undefined
                                                        : handleChange(
                                                              config.field,
                                                          )
                                                }
                                                disabled={isReadOnly}
                                                className={cn(
                                                    "rounded-l-none text-right",
                                                    isReadOnly && "bg-gray-100",
                                                )}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
