import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { router } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { L11B1Data } from "./types";

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

type EditKey =
    | "net_income"
    | "depreciation_expense"
    | "income_tax_expense"
    | "loan_tax_expense";
type AllKey = EditKey | "ebtida" | "ebtida_after_tax";

const INPUT_COLUMN_CLASS = "grid grid-cols-[56px_minmax(0,1fr)] w-full";

const FIELD_ROWS: {
    key: AllKey;
    label: string;
    number: number;
    readonly?: boolean;
}[] = [
    { key: "net_income", number: 1, label: "PENGHASILAN NETO KOMERSIAL" },
    {
        key: "depreciation_expense",
        number: 2,
        label: "BEBAN PENYUSUTAN DAN AMORTISASI",
    },
    { key: "income_tax_expense", number: 3, label: "BEBAN PAJAK PENGHASILAN" },
    { key: "loan_tax_expense", number: 4, label: "BEBAN BIAYA PINJAMAN" },
    { key: "ebtida", number: 5, label: "EBITDA", readonly: true },
    {
        key: "ebtida_after_tax",
        number: 6,
        label: "EBITDA (25%)",
        readonly: true,
    },
];

interface FormL11B1Props {
    sptBadanId: string;
    l11b1: L11B1Data | null;
}

export function FormL11B1({ sptBadanId, l11b1 }: FormL11B1Props) {
    const [state, setState] = useState<Pick<L11B1Data, AllKey>>({
        net_income: 0,
        depreciation_expense: 0,
        income_tax_expense: 0,
        loan_tax_expense: 0,
        ebtida: 0,
        ebtida_after_tax: 0,
    });
    const autoSaveTimeoutRef = useRef<number | null>(null);
    const lastSyncedSnapshotRef = useRef<string>("");

    const serializeState = (
        nextState: Pick<L11B1Data, AllKey>,
        nextComputed: { ebtida: number; ebtida_after_tax: number },
    ) =>
        JSON.stringify({
            net_income: nextState.net_income,
            depreciation_expense: nextState.depreciation_expense,
            income_tax_expense: nextState.income_tax_expense,
            loan_tax_expense: nextState.loan_tax_expense,
            ebtida: nextComputed.ebtida,
            ebtida_after_tax: nextComputed.ebtida_after_tax,
        });

    useEffect(() => {
        const raw: Partial<L11B1Data> = l11b1 ?? {};
        const next = {
            net_income: Number(raw.net_income ?? 0),
            depreciation_expense: Number(raw.depreciation_expense ?? 0),
            income_tax_expense: Number(raw.income_tax_expense ?? 0),
            loan_tax_expense: Number(raw.loan_tax_expense ?? 0),
            ebtida: Number(raw.ebtida ?? 0),
            ebtida_after_tax: Number(raw.ebtida_after_tax ?? 0),
        };
        setState(next);

        lastSyncedSnapshotRef.current = serializeState(next, {
            ebtida: Number(raw.ebtida ?? 0),
            ebtida_after_tax: Number(raw.ebtida_after_tax ?? 0),
        });
    }, [l11b1]);

    // EBITDA = penghasilan neto + penyusutan/amortisasi + pajak penghasilan + biaya pinjaman.
    const computed = useMemo(() => {
        const ebtida =
            state.net_income +
            state.depreciation_expense +
            state.income_tax_expense +
            state.loan_tax_expense;
        const ebtida_after_tax = Math.round(ebtida * 0.25);
        return { ebtida, ebtida_after_tax };
    }, [
        state.net_income,
        state.depreciation_expense,
        state.income_tax_expense,
        state.loan_tax_expense,
    ]);

    const handleChange =
        (field: EditKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const numeric = parseNumber(e.target.value);
            setState((prev) => ({ ...prev, [field]: numeric }));
        };

    const getValue = (key: AllKey): string => {
        if (key === "ebtida") return formatRupiahInput(computed.ebtida);
        if (key === "ebtida_after_tax")
            return formatRupiahInput(computed.ebtida_after_tax);
        return formatRupiahInput(state[key]);
    };

    const sync = (
        nextState: Pick<L11B1Data, AllKey>,
        nextComputed: { ebtida: number; ebtida_after_tax: number },
    ) => {
        router.post(
            route("spt.badan.l11b1.sync"),
            {
                spt_badan_id: sptBadanId,
                net_income: nextState.net_income,
                depreciation_expense: nextState.depreciation_expense,
                income_tax_expense: nextState.income_tax_expense,
                loan_tax_expense: nextState.loan_tax_expense,
                ebtida: nextComputed.ebtida,
                ebtida_after_tax: nextComputed.ebtida_after_tax,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    lastSyncedSnapshotRef.current = serializeState(
                        nextState,
                        nextComputed,
                    );
                },
                onError: () => toast.error("Gagal menyimpan data L11B-I"),
            },
        );
    };

    useEffect(() => {
        if (!sptBadanId) return;

        const snapshot = serializeState(state, computed);
        if (snapshot === lastSyncedSnapshotRef.current) return;

        if (autoSaveTimeoutRef.current) {
            window.clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = window.setTimeout(() => {
            sync(state, computed);
        }, 500);

        return () => {
            if (autoSaveTimeoutRef.current) {
                window.clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [sptBadanId, state, computed.ebtida, computed.ebtida_after_tax]);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_260px] gap-2 sm:gap-4 items-center">
                <div className="hidden sm:block" />
                <div className="bg-blue-950 text-white text-xs font-semibold text-center px-3 py-1.5 rounded">
                    JUMLAH (Rp)
                </div>
            </div>

            {FIELD_ROWS.map((row) => (
                <div
                    key={row.key}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_260px] gap-2 sm:gap-4 items-start sm:items-center"
                >
                    <div className="flex items-start gap-2 min-w-0">
                        <span className=" text-black font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center">
                            {row.number}
                        </span>
                        <Label className="font-semibold uppercase tracking-wide text-xs sm:text-sm leading-relaxed break-words">
                            {row.label}
                        </Label>
                    </div>
                    <div className={INPUT_COLUMN_CLASS}>
                        <div className="flex items-center justify-center rounded-l-md border border-r-0 border-input bg-gray-100 text-sm font-medium text-gray-600">
                            Rp.
                        </div>
                        <Input
                            type="text"
                            value={getValue(row.key)}
                            onChange={
                                row.readonly
                                    ? undefined
                                    : handleChange(row.key as EditKey)
                            }
                            readOnly={row.readonly}
                            className={`rounded-l-none text-right ${row.readonly ? "bg-gray-100 font-semibold" : ""}`}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FormL11B1;
