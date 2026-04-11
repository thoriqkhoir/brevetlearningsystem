import { Input } from "@/Components/ui/input";
import { router } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { L13BDItem } from "./types";

const fmt = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
const formatRupiahInput = (v: number) =>
    fmt
        .format(v ?? 0)
        .replace("Rp", "")
        .trim();
const parseNumber = (raw: string) => {
    const n = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

interface SectionL13BDProps {
    data: L13BDItem | null;
    sptBadanId: string;
}

type AmountKey = "amount_1" | "amount_2" | "amount_4";

export function SectionL13BD({ data, sptBadanId }: SectionL13BDProps) {
    const [amount1, setAmount1] = useState(0);
    const [amount2, setAmount2] = useState(0);
    const [amount4, setAmount4] = useState(0);

    const [display1, setDisplay1] = useState("0");
    const [display2, setDisplay2] = useState("0");
    const [display4, setDisplay4] = useState("0");

    const [isSaving, setIsSaving] = useState(false);
    const autoSaveTimeoutRef = useRef<number | null>(null);
    const hasMountedRef = useRef(false);
    const lastPayloadRef = useRef("");

    // Auto-calculated
    const amount3 = amount1 - amount2;
    const amount5 = Math.min(amount3, amount4);
    const amount6 = amount3 - amount5;

    useEffect(() => {
        if (data) {
            setAmount1(data.amount_1 ?? 0);
            setAmount2(data.amount_2 ?? 0);
            setAmount4(data.amount_4 ?? 0);
            setDisplay1(formatRupiahInput(data.amount_1 ?? 0));
            setDisplay2(formatRupiahInput(data.amount_2 ?? 0));
            setDisplay4(formatRupiahInput(data.amount_4 ?? 0));
        }
    }, [data]);

    const makeSetter =
        (
            setVal: React.Dispatch<React.SetStateAction<number>>,
            setDisp: React.Dispatch<React.SetStateAction<string>>,
        ) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const n = parseNumber(e.target.value);
            setVal(n);
            setDisp(formatRupiahInput(n));
        };

    const payload = useMemo(
        () => ({
            spt_badan_id: sptBadanId,
            amount_1: amount1,
            amount_2: amount2,
            amount_3: amount3,
            amount_4: amount4,
            amount_5: amount5,
            amount_6: amount6,
        }),
        [sptBadanId, amount1, amount2, amount3, amount4, amount5, amount6],
    );

    useEffect(() => {
        if (!sptBadanId) return;

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

            const options = {
                preserveScroll: true,
                preserveState: true,
                only: ["sptBadan", "l13bd"],
                onError: (errors: Record<string, string>) => {
                    const firstMsg = Object.values(errors)[0];
                    toast.error(firstMsg ?? "Gagal menyimpan data");
                },
                onFinish: () => setIsSaving(false),
            };

            if (data?.id) {
                router.put(
                    route("spt.badan.l13bd.update", data.id),
                    payload,
                    options,
                );
            } else {
                router.post(route("spt.badan.l13bd.store"), payload, options);
            }
        }, 500);

        return () => {
            if (autoSaveTimeoutRef.current) {
                window.clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [payload, sptBadanId, data?.id]);

    const readonlyInput = (value: number) => (
        <div className="flex items-center gap-1 w-full sm:w-48 sm:shrink-0">
            <span className="border rounded px-3 py-1.5 bg-gray-50 text-sm text-right w-full font-medium">
                {formatRupiahInput(value)}
            </span>
        </div>
    );

    const editableInput = (
        display: string,
        onChange: React.ChangeEventHandler<HTMLInputElement>,
    ) => (
        <div className="flex items-center gap-1 w-full sm:w-48 sm:shrink-0">
            <Input
                value={display}
                onChange={onChange}
                className="h-8 text-sm text-right"
            />
        </div>
    );

    return (
        <div className="space-y-0">
            {/* Header */}
            <div className="flex items-center justify-start sm:justify-end mb-2">
                <span className="text-xs font-semibold bg-blue-950 text-white px-4 py-1 rounded w-full sm:w-auto text-center">
                    NILAI (Rp)
                </span>
            </div>

            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b">
                <div className="flex items-start gap-2 min-w-0 w-full">
                    <span className=" text-black font-bold text-xs rounded px-2 py-0.5 shrink-0 mt-0.5">
                        1
                    </span>
                    <span className="text-xs flex-1 leading-relaxed break-words">
                        JUMLAH TAMBAHAN PENGURANGAN PENGHASILAN BRUTO PENELITIAN DAN
                        PENGEMBANGAN
                    </span>
                </div>
                {editableInput(display1, makeSetter(setAmount1, setDisplay1))}
            </div>

            {/* Row 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b">
                <div className="flex items-start gap-2 min-w-0 w-full">
                    <span className=" text-black font-bold text-xs rounded px-2 py-0.5 shrink-0 mt-0.5">
                        2
                    </span>
                    <span className="text-xs flex-1 leading-relaxed break-words">
                        JUMLAH TAMBAHAN PENGURANGAN PENGHASILAN BRUTO PENELITIAN DAN
                        PENGEMBANGAN YANG TERMANFAATKAN TAHUN-TAHUN SEBELUMNYA
                    </span>
                </div>
                {editableInput(display2, makeSetter(setAmount2, setDisplay2))}
            </div>

            {/* Row 3 — auto: (1 - 2) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b">
                <div className="flex items-start gap-2 min-w-0 w-full">
                    <span className=" text-black font-bold text-xs rounded px-2 py-0.5 shrink-0 mt-0.5">
                        3
                    </span>
                    <span className="text-xs flex-1 leading-relaxed break-words">
                        JUMLAH TAMBAHAN PENGURANGAN PENGHASILAN BRUTO PENELITIAN DAN
                        PENGEMBANGAN YANG BELUM TERMANFAATKAN TAHUN INI
                    </span>
                </div>
                {readonlyInput(amount3)}
            </div>

            {/* Row 4 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b">
                <div className="flex items-start gap-2 min-w-0 w-full">
                    <span className=" text-black font-bold text-xs rounded px-2 py-0.5 shrink-0 mt-0.5">
                        4
                    </span>
                    <span className="text-xs flex-1 leading-relaxed break-words">
                        40% x PENGHASILAN KENA PAJAK SEBELUM FASILITAS
                    </span>
                </div>
                {editableInput(display4, makeSetter(setAmount4, setDisplay4))}
            </div>

            {/* Row 5 — auto: min(3, 4) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b">
                <div className="flex items-start gap-2 min-w-0 w-full">
                    <span className=" text-black font-bold text-xs rounded px-2 py-0.5 shrink-0 mt-0.5">
                        5
                    </span>
                    <span className="text-xs flex-1 leading-relaxed break-words">
                        TAMBAHAN PENGURANGAN PENGHASILAN BRUTO PENELITIAN DAN
                        PENGEMBANGAN YANG DAPAT DIBEBANKAN PADA TAHUN INI
                    </span>
                </div>
                {readonlyInput(amount5)}
            </div>

            {/* Row 6 — auto: (3 - 5) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b">
                <div className="flex items-start gap-2 min-w-0 w-full">
                    <span className=" text-black font-bold text-xs rounded px-2 py-0.5 shrink-0 mt-0.5">
                        6
                    </span>
                    <span className="text-xs flex-1 leading-relaxed break-words">
                        SISA TAMBAHAN PENGURANGAN PENGHASILAN BRUTO PENELITIAN DAN
                        PENGEMBANGAN YANG BELUM TERMANFAATKAN TAHUN INI
                    </span>
                </div>
                {readonlyInput(amount6)}
            </div>
        </div>
    );
}
