import { Checkbox } from "@/Components/ui/checkbox";
import { router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { L10DData } from "./types";

interface TabL10DProps {
    sptBadanId: string;
    l10d: Partial<L10DData> | null;
}

type BoolField =
    | "is_i_a"
    | "is_i_b"
    | "is_i_c"
    | "is_i_d"
    | "is_i_e"
    | "is_ii_a"
    | "is_ii_b"
    | "is_ii_c"
    | "is_ii_d"
    | "is_ii_e";

const SECTION_I_ROWS: { field: BoolField; label: string }[] = [
    {
        field: "is_i_a",
        label: "a. Struktur dan Bagan Kepemilikan Grup Usaha serta Negara atau Yurisdiksi Masing-Masing Anggota Grup Usaha",
    },
    {
        field: "is_i_b",
        label: "b. Kegiatan Usaha yang Dilakukan oleh Grup Usaha",
    },
    {
        field: "is_i_c",
        label: "c. Harta Tidak Berwujud yang Dimiliki Grup Usaha",
    },
    {
        field: "is_i_d",
        label: "d. Aktivitas Keuangan dan Pembiayaan dalam Grup Usaha",
    },
    {
        field: "is_i_e",
        label: "e. Laporan Keuangan Konsolidasi Entitas Induk dan Informasi Perpajakan terkait Transaksi Afiliasi",
    },
];

const SECTION_II_ROWS: { field: BoolField; label: string }[] = [
    {
        field: "is_ii_a",
        label: "a. Identitas dan Kegiatan Usaha yang Dilakukan Wajib Pajak",
    },
    {
        field: "is_ii_b",
        label: "b. Informasi Transaksi Afiliasi dan Transaksi Independen yang Dilakukan Wajib Pajak",
    },
    {
        field: "is_ii_c",
        label: "c. Penerapan Prinsip Kewajaran dan Kelaziman Usaha",
    },
    {
        field: "is_ii_d",
        label: "d. Informasi Keuangan Wajib Pajak",
    },
    {
        field: "is_ii_e",
        label: "e. Peristiwa-Peristiwa/Kejadian-Kejadian/Fakta-fakta Non Keuangan yang Mempengaruhi Pembentukan Harga atau Tingkat Laba",
    },
];

function parseDateParts(isoDate: string | null | undefined): {
    tanggal: string;
    bulan: string;
    tahun: string;
} {
    if (!isoDate) return { tanggal: "", bulan: "", tahun: "" };
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return { tanggal: "", bulan: "", tahun: "" };
    return {
        tanggal: String(d.getDate()).padStart(2, "0"),
        bulan: String(d.getMonth() + 1).padStart(2, "0"),
        tahun: String(d.getFullYear()),
    };
}

function buildIso(
    tanggal: string,
    bulan: string,
    tahun: string,
): string | null {
    if (!tanggal || !bulan || !tahun) return null;
    const iso = `${tahun}-${bulan.padStart(2, "0")}-${tanggal.padStart(2, "0")}`;
    return isNaN(new Date(iso).getTime()) ? null : iso;
}

interface DateState {
    tanggal: string;
    bulan: string;
    tahun: string;
}

export function TabL10D({ sptBadanId, l10d }: TabL10DProps) {
    const [boolState, setBoolState] = useState<
        Record<BoolField, boolean | null>
    >({
        is_i_a: null,
        is_i_b: null,
        is_i_c: null,
        is_i_d: null,
        is_i_e: null,
        is_ii_a: null,
        is_ii_b: null,
        is_ii_c: null,
        is_ii_d: null,
        is_ii_e: null,
    });
    const [iiiA, setIiiA] = useState<DateState>({
        tanggal: "",
        bulan: "",
        tahun: "",
    });
    const [iiiB, setIiiB] = useState<DateState>({
        tanggal: "",
        bulan: "",
        tahun: "",
    });
    const autoSaveTimeoutRef = useRef<number | null>(null);
    const lastSyncedSnapshotRef = useRef<string>("");

    const serializeState = (
        nextBoolState: Record<BoolField, boolean | null>,
        nextIiiA: DateState,
        nextIiiB: DateState,
    ) =>
        JSON.stringify({
            ...nextBoolState,
            iii_a: buildIso(nextIiiA.tanggal, nextIiiA.bulan, nextIiiA.tahun),
            iii_b: buildIso(nextIiiB.tanggal, nextIiiB.bulan, nextIiiB.tahun),
        });

    useEffect(() => {
        const raw = l10d ?? {};
        const nextBoolState = {
            is_i_a: raw.is_i_a ?? null,
            is_i_b: raw.is_i_b ?? null,
            is_i_c: raw.is_i_c ?? null,
            is_i_d: raw.is_i_d ?? null,
            is_i_e: raw.is_i_e ?? null,
            is_ii_a: raw.is_ii_a ?? null,
            is_ii_b: raw.is_ii_b ?? null,
            is_ii_c: raw.is_ii_c ?? null,
            is_ii_d: raw.is_ii_d ?? null,
            is_ii_e: raw.is_ii_e ?? null,
        };
        const nextIiiA = parseDateParts(raw.iii_a ?? null);
        const nextIiiB = parseDateParts(raw.iii_b ?? null);

        setBoolState(nextBoolState);
        setIiiA(nextIiiA);
        setIiiB(nextIiiB);
        lastSyncedSnapshotRef.current = serializeState(
            nextBoolState,
            nextIiiA,
            nextIiiB,
        );
    }, [l10d, sptBadanId]);

    const handleCheck = (field: BoolField, checked: boolean) => {
        setBoolState((prev) => ({ ...prev, [field]: checked }));
    };

    const sync = (
        nextBoolState: Record<BoolField, boolean | null>,
        nextIiiA: DateState,
        nextIiiB: DateState,
    ) => {
        const payloadSnapshot = serializeState(
            nextBoolState,
            nextIiiA,
            nextIiiB,
        );
        const payload: Record<string, string | boolean | null> = {
            spt_badan_id: sptBadanId,
            is_i_a: nextBoolState.is_i_a,
            is_i_b: nextBoolState.is_i_b,
            is_i_c: nextBoolState.is_i_c,
            is_i_d: nextBoolState.is_i_d,
            is_i_e: nextBoolState.is_i_e,
            is_ii_a: nextBoolState.is_ii_a,
            is_ii_b: nextBoolState.is_ii_b,
            is_ii_c: nextBoolState.is_ii_c,
            is_ii_d: nextBoolState.is_ii_d,
            is_ii_e: nextBoolState.is_ii_e,
            iii_a: buildIso(nextIiiA.tanggal, nextIiiA.bulan, nextIiiA.tahun),
            iii_b: buildIso(nextIiiB.tanggal, nextIiiB.bulan, nextIiiB.tahun),
        };
        router.post(route("spt.badan.l10d.sync"), payload, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onSuccess: () => {
                lastSyncedSnapshotRef.current = payloadSnapshot;
            },
            onError: () => toast.error("Gagal menyimpan data L10D"),
        });
    };

    useEffect(() => {
        if (!sptBadanId) return;

        const currentSnapshot = serializeState(boolState, iiiA, iiiB);
        if (currentSnapshot === lastSyncedSnapshotRef.current) return;

        if (autoSaveTimeoutRef.current) {
            window.clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = window.setTimeout(() => {
            sync(boolState, iiiA, iiiB);
        }, 350);

        return () => {
            if (autoSaveTimeoutRef.current) {
                window.clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [boolState, iiiA, iiiB, sptBadanId]);

    const sectionHeaderClass =
        "px-4 py-2 text-black text-sm font-bold bg-zinc-300";
    const subheaderClass = "px-4 py-2 text-sm text-gray-700 bg-zinc-100";

    return (
        <div className="rounded-lg overflow-hidden border">
            {/* Section I */}
            <div className={sectionHeaderClass}>I. IKHTISAR DOKUMEN INDUK</div>
            <div className={subheaderClass}>
                Bahwasanya kami telah menyelenggarakan dokumen induk yang
                menjadi dasar penerapan Prinsip Kewajaran dan Kelaziman Usaha (
                <em>arm's length principle</em>) yang memuat informasi mengenai:
            </div>
            {SECTION_I_ROWS.map((row, idx) => (
                <div
                    key={row.field}
                    className={`flex items-start gap-3 px-4 py-3 border-t ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                    <Checkbox
                        className="mt-0.5 shrink-0"
                        checked={boolState[row.field] === true}
                        onCheckedChange={(checked) =>
                            handleCheck(row.field, checked === true)
                        }
                    />
                    <span className="text-sm">{row.label}</span>
                </div>
            ))}

            {/* Section II */}
            <div className={`${sectionHeaderClass} border-t`}>
                II. IKHTISAR DOKUMEN LOKAL
            </div>
            <div className={subheaderClass}>
                Bahwasanya kami telah menyelenggarakan dokumen lokal yang
                menjadi dasar penerapan Prinsip Kewajaran dan Kelaziman Usaha (
                <em>arm's length principle</em>) yang memuat informasi mengenai:
            </div>
            {SECTION_II_ROWS.map((row, idx) => (
                <div
                    key={row.field}
                    className={`flex items-start gap-3 px-4 py-3 border-t ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                    <Checkbox
                        className="mt-0.5 shrink-0"
                        checked={boolState[row.field] === true}
                        onCheckedChange={(checked) =>
                            handleCheck(row.field, checked === true)
                        }
                    />
                    <span className="text-sm">{row.label}</span>
                </div>
            ))}

            {/* Section III */}
            <div className={`${sectionHeaderClass} border-t`}>
                III. PERNYATAAN PENYELENGGARAAN DAN PENYEDIAAN DOKUMEN INDUK DAN
                DOKUMEN LOKAL
            </div>
            <div className={subheaderClass}>
                Bahwasanya kami telah menyelenggarakan dokumen induk dan dokumen
                lokal berdasarkan data dan informasi yang tersedia saat
                dilakukannya Transaksi Afiliasi, dan:
            </div>

            {/* III Row 1 — iii_a */}
            <div className="flex items-center gap-3 px-4 py-3 border-t bg-white flex-wrap">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold shrink-0">
                    1.
                </span>
                <span className="text-sm shrink-0">
                    dokumen Induk telah tersedia pada tanggal
                </span>
                <div className="flex items-center gap-1">
                    <input
                        type="text"
                        maxLength={2}
                        placeholder="DD"
                        value={iiiA.tanggal}
                        onChange={(e) =>
                            setIiiA((p) => ({ ...p, tanggal: e.target.value }))
                        }
                        className="w-10 border border-gray-400 text-center text-sm py-1 rounded"
                    />
                    <span className="text-sm">/</span>
                    <input
                        type="text"
                        maxLength={2}
                        placeholder="MM"
                        value={iiiA.bulan}
                        onChange={(e) =>
                            setIiiA((p) => ({ ...p, bulan: e.target.value }))
                        }
                        className="w-10 border border-gray-400 text-center text-sm py-1 rounded"
                    />
                    <span className="text-sm">/</span>
                    <input
                        type="text"
                        maxLength={4}
                        placeholder="YYYY"
                        value={iiiA.tahun}
                        onChange={(e) =>
                            setIiiA((p) => ({ ...p, tahun: e.target.value }))
                        }
                        className="w-16 border border-gray-400 text-center text-sm py-1 rounded"
                    />
                </div>
            </div>

            {/* III Row 2 — iii_b */}
            <div className="flex items-center gap-3 px-4 py-3 border-t bg-gray-50 flex-wrap">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold shrink-0">
                    2.
                </span>
                <span className="text-sm shrink-0">
                    dokumen Lokal telah tersedia pada tanggal
                </span>
                <div className="flex items-center gap-1">
                    <input
                        type="text"
                        maxLength={2}
                        placeholder="DD"
                        value={iiiB.tanggal}
                        onChange={(e) =>
                            setIiiB((p) => ({ ...p, tanggal: e.target.value }))
                        }
                        className="w-10 border border-gray-400 text-center text-sm py-1 rounded"
                    />
                    <span className="text-sm">/</span>
                    <input
                        type="text"
                        maxLength={2}
                        placeholder="MM"
                        value={iiiB.bulan}
                        onChange={(e) =>
                            setIiiB((p) => ({ ...p, bulan: e.target.value }))
                        }
                        className="w-10 border border-gray-400 text-center text-sm py-1 rounded"
                    />
                    <span className="text-sm">/</span>
                    <input
                        type="text"
                        maxLength={4}
                        placeholder="YYYY"
                        value={iiiB.tahun}
                        onChange={(e) =>
                            setIiiB((p) => ({ ...p, tahun: e.target.value }))
                        }
                        className="w-16 border border-gray-400 text-center text-sm py-1 rounded"
                    />
                </div>
            </div>
        </div>
    );
}

export default TabL10D;
