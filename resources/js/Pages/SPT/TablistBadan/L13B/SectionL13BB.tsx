import { Input } from "@/Components/ui/input";
import { router } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { L13BBItem } from "./types";

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

interface SectionL13BBProps {
    data: L13BBItem | null;
    sptBadanId: string;
}

type MoneyKey =
    | "amount_1a"
    | "amount_1b"
    | "amount_1c"
    | "amount_1d"
    | "amount_1e";

const FIELDS: { key: MoneyKey; badge: string; label: string }[] = [
    {
        key: "amount_1a",
        badge: "a",
        label: "BIAYA PENYEDIAAN FASILITAS FISIK KHUSUS BERUPA WORKSHOP ATAU TEMPAT PELATIHAN SEJENIS LAINNYA TERKAIT PRAKTIK KERJA DAN/ATAU PEMAGANGAN",
    },
    {
        key: "amount_1b",
        badge: "b",
        label: "BIAYA INSTRUKTUR ATAU PENGAJAR SEBAGAI TENAGA PEMBIMBING PELAKSANAAN PRAKTIK KERJA, PEMAGANGAN, DAN/ATAU PEMBELAJARAN",
    },
    {
        key: "amount_1c",
        badge: "c",
        label: "BARANG DAN/ATAU BAHAN UNTUK KEPERLUAN PELAKSANAAN PRAKTIK KERJA, PEMAGANGAN, DAN/ATAU PEMBELAJARAN",
    },
    {
        key: "amount_1d",
        badge: "d",
        label: "HONORARIUM ATAU PEMBAYARAN SEJENIS YANG DIBERIKAN KEPADA PESERTA PRAKTIK KERJA DAN/ATAU PEMAGANGAN",
    },
    {
        key: "amount_1e",
        badge: "e",
        label: "BIAYA SERTIFIKASI SERTA BIAYA LISTRIK, AIR, DAN BAHAN BAKAR UNTUK KEPERLUAN PELAKSANAAN PRAKTIK KERJA DAN/ATAU PEMAGANGAN",
    },
];

export function SectionL13BB({ data, sptBadanId }: SectionL13BBProps) {
    const [form, setForm] = useState<Record<MoneyKey, number>>({
        amount_1a: 0,
        amount_1b: 0,
        amount_1c: 0,
        amount_1d: 0,
        amount_1e: 0,
    });
    const [displays, setDisplays] = useState<Record<MoneyKey, string>>({
        amount_1a: "0",
        amount_1b: "0",
        amount_1c: "0",
        amount_1d: "0",
        amount_1e: "0",
    });
    const [isSaving, setIsSaving] = useState(false);
    const autoSaveTimeoutRef = useRef<number | null>(null);
    const hasMountedRef = useRef(false);
    const lastPayloadRef = useRef("");

    useEffect(() => {
        if (data) {
            const keys: MoneyKey[] = [
                "amount_1a",
                "amount_1b",
                "amount_1c",
                "amount_1d",
                "amount_1e",
            ];
            const newForm = {} as Record<MoneyKey, number>;
            const newDisplays = {} as Record<MoneyKey, string>;
            keys.forEach((k) => {
                newForm[k] = data[k] ?? 0;
                newDisplays[k] = formatRupiahInput(data[k] ?? 0);
            });
            setForm(newForm);
            setDisplays(newDisplays);
        }
    }, [data]);

    const setMoney = (key: MoneyKey, raw: string) => {
        const n = parseNumber(raw);
        setForm((prev) => ({ ...prev, [key]: n }));
        setDisplays((prev) => ({ ...prev, [key]: formatRupiahInput(n) }));
    };

    const total =
        form.amount_1a +
        form.amount_1b +
        form.amount_1c +
        form.amount_1d +
        form.amount_1e;

    const payload = useMemo(
        () => ({
            spt_badan_id: sptBadanId,
            ...form,
            amount_2: total,
        }),
        [sptBadanId, form, total],
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
                only: ["sptBadan", "l13bb"],
                onError: (errors: Record<string, string>) => {
                    const firstMsg = Object.values(errors)[0];
                    toast.error(firstMsg ?? "Gagal menyimpan data");
                },
                onFinish: () => setIsSaving(false),
            };

            if (data?.id) {
                router.put(
                    route("spt.badan.l13bb.update", data.id),
                    payload,
                    options,
                );
            } else {
                router.post(route("spt.badan.l13bb.store"), payload, options);
            }
        }, 500);

        return () => {
            if (autoSaveTimeoutRef.current) {
                window.clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [payload, sptBadanId, data?.id]);

    return (
        <div className="space-y-0">
            {/* Header row */}
            <div className="flex items-center justify-start sm:justify-end mb-2">
                <span className="text-xs font-semibold bg-blue-950 text-white px-4 py-1 rounded w-full sm:w-auto text-center">
                    NILAI (Rp)
                </span>
            </div>

            {/* Row 1 - label section */}
            <div className="flex items-start gap-2 py-2 border-b">
                <span className=" text-black font-bold text-xs rounded px-2 py-0.5 shrink-0 mt-0.5">
                    1
                </span>
                <span className="text-xs font-semibold flex-1 leading-relaxed break-words">
                    BIAYA KEGIATAN PRAKTIK KERJA, PEMAGANGAN, DAN/ATAU
                    PEMBELAJARAN DALAM RANGKA PEMBINAAN DAN PENGEMBANGAN SUMBER
                    DAYA MANUSIA BERBASIS KOMPETENSI TERTENTU
                </span>
            </div>

            {/* Sub-fields 1a – 1e */}
            {FIELDS.map(({ key, badge, label }) => (
                <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b pl-3 sm:pl-6"
                >
                    <div className="flex items-start gap-2 min-w-0 w-full">
                        <span className=" text-black font-bold text-xs rounded px-2 py-0.5 shrink-0 mt-0.5">
                            {badge}
                        </span>
                        <span className="text-xs flex-1 leading-relaxed break-words">{label}</span>
                    </div>
                    <div className="flex items-center gap-1 w-full sm:w-48 sm:shrink-0">
                        <Input
                            value={displays[key]}
                            onChange={(e) => setMoney(key, e.target.value)}
                            className="h-8 text-sm text-right"
                        />
                    </div>
                </div>
            ))}

            {/* Row 2 - Total */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-b">
                <div className="flex items-start gap-2 min-w-0 w-full">
                    <span className=" text-black font-bold text-xs rounded px-2 py-0.5 shrink-0 mt-0.5">
                        2
                    </span>
                    <span className="text-xs font-semibold flex-1 leading-relaxed break-words">
                        JUMLAH BIAYA TERKAIT KEGIATAN PRAKTIK KERJA, PEMAGANGAN,
                        DAN/ATAU PEMBELAJARAN DALAM RANGKA PEMBINAAN DAN
                        PENGEMBANGAN SUMBER DAYA MANUSIA BERBASIS KOMPETENSI
                        TERTENTU
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground w-full sm:w-48 sm:shrink-0">
                    <span className="border rounded px-2 py-1 bg-gray-50 font-semibold text-right w-full">
                        {formatRupiahInput(total)}
                    </span>
                </div>
            </div>
        </div>
    );
}
