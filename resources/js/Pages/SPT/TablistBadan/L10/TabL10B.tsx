import { router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { L10BData } from "./types";

interface TabL10BProps {
    sptBadanId: string;
    l10b: Partial<L10BData> | null;
}

type BoolField = keyof Omit<L10BData, "id" | "spt_badan_id">;

const ALL_FIELDS: BoolField[] = [
    "is_1a",
    "is_1b",
    "is_1c",
    "is_1d",
    "is_2a",
    "is_2b",
    "is_2c",
    "is_3a",
    "is_3b",
    "is_3c",
    "is_3d",
    "is_3e",
    "is_4a",
    "is_4b",
    "is_4c",
];

type State = Record<BoolField, boolean | null>;

const defaultState: State = Object.fromEntries(
    ALL_FIELDS.map((f) => [f, null]),
) as State;

// Screenshot rows definition
const SECTION_1 = {
    header: "1. Mengenai Hubungan Istimewa",
    subheader: "Bahwasanya kami melakukan",
    rows: [
        {
            field: "is_1a" as BoolField,
            label: "a. Transaksi dengan pihak yang memiliki hubungan istimewa karena kepemilikan saham/penyertaan",
        },
        {
            field: "is_1b" as BoolField,
            label: "b. Transaksi dengan pihak yang memiliki hubungan istimewa karena penguasaan",
        },
        {
            field: "is_1c" as BoolField,
            label: "c. Transaksi dengan pihak yang memiliki hubungan istimewa karena hubungan keluarga",
        },
        {
            field: "is_1d" as BoolField,
            label: "d. Transaksi yang dilakukan antarpihak yang tidak memiliki hubungan istimewa tetapi Pihak Afiliasi dari salah satu atau kedua pihak yang bertransaksi tersebut menentukan lawan transaksi dan harga transaksi.",
        },
    ],
};

const SECTION_2 = {
    header: "2. Mengenai transaksi",
    subheader:
        "Bahwasanya kami telah menerapkan Prinsip Kewajaran dan Kelaziman Usaha",
    rows: [
        {
            field: "is_2a" as BoolField,
            label: "a. berdasarkan keadaan yang sebenarnya.",
        },
        {
            field: "is_2b" as BoolField,
            label: "b. pada saat Penentuan Harga Transfer dan/atau saat terjadinya Transaksi yang Dipengaruhi Hubungan Istimewa.",
        },
        {
            field: "is_2c" as BoolField,
            label: "c. sesuai dengan\n• tahapan penerapan Prinsip Kewajaran dan Kelaziman Usaha; dan\n• tahapan pendahuluan dalam hal terdapat Transaksi Yang Dipengaruhi Hubungan Istimewa tertentu.",
        },
    ],
};

const SECTION_3 = {
    header: "3. Mengenai Dokumentasi Penerapan Prinsip Kewajaran dan Kelaziman Usaha",
    subheader: "Bahwasanya kami memiliki",
    rows: [
        {
            field: "is_3a" as BoolField,
            label: "a. nilai peredaran bruto tahun pajak sebelumnya dalam satu tahun pajak lebih dari Rp50.000.000.000,00 (lima puluh miliar rupiah);",
        },
        {
            field: "is_3b" as BoolField,
            label: "b. nilai Transaksi Afiliasi tahun pajak sebelumnya dalam satu tahun pajak lebih dari Rp20.000.000.000,00 (dua puluh miliar rupiah) untuk transaksi barang berwujud;",
        },
        {
            field: "is_3c" as BoolField,
            label: "c. nilai Transaksi Afiliasi tahun pajak sebelumnya dalam satu tahun pajak: lebih dari Rp5.000.000.000,00 (lima miliar rupiah) untuk masing-masing penyediaan jasa, pembayaran bunga, pemanfaatan barang tidak berwujud, atau Transaksi Afiliasi lainnya;",
        },
        {
            field: "is_3d" as BoolField,
            label: "d. Pihak Afiliasi yang berada di negara atau yurisdiksi dengan tarif pajak penghasilan lebih rendah daripada tarif pajak penghasilan",
        },
        {
            field: "is_3e" as BoolField,
            label: "e. Grup Usaha dengan peredaran bruto konsolidasian paling sedikit Rp11.000.000.000.000,00 (sebelas triliun rupiah) pada tahun pajak sebelumnya",
        },
    ],
};

const SECTION_4 = {
    header: "4. Mengenai Dokumen Penentuan Harga Transfer",
    subheader: "Bahwasanya kami telah menyelenggarakan:",
    rows: [
        {
            field: "is_4a" as BoolField,
            label: "a. Dokumen Induk",
        },
        {
            field: "is_4b" as BoolField,
            label: "b. Dokumen Lokal",
        },
        {
            field: "is_4c" as BoolField,
            label: "c. Laporan per Negara",
        },
    ],
};

const SECTIONS = [SECTION_1, SECTION_2, SECTION_3, SECTION_4];

function YaTidakRadio({
    value,
    onChange,
}: {
    value: boolean | null;
    onChange: (val: boolean | null) => void;
}) {
    return (
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto sm:shrink-0">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                    type="radio"
                    className="w-4 h-4 accent-blue-950"
                    checked={value === true}
                    onChange={() => onChange(true)}
                />
                <span className="text-sm">Ya</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                    type="radio"
                    className="w-4 h-4 accent-blue-950"
                    checked={value === false}
                    onChange={() => onChange(false)}
                />
                <span className="text-sm">Tidak</span>
            </label>
        </div>
    );
}

export function TabL10B({ sptBadanId, l10b }: TabL10BProps) {
    const [state, setState] = useState<State>(defaultState);
    const autoSaveTimeoutRef = useRef<number | null>(null);
    const lastSyncedSnapshotRef = useRef<string>(JSON.stringify(defaultState));

    useEffect(() => {
        const raw = l10b ?? {};
        const nextState = Object.fromEntries(
            ALL_FIELDS.map((f) => [
                f,
                raw[f] !== undefined ? (raw[f] as boolean | null) : null,
            ]),
        ) as State;

        setState(nextState);
        lastSyncedSnapshotRef.current = JSON.stringify(nextState);
    }, [l10b, sptBadanId]);

    const handleChange = (field: BoolField, val: boolean | null) => {
        setState((prev) => ({ ...prev, [field]: val }));
    };

    const sync = (stateToSave: State) => {
        const payload: Record<string, string | boolean | null> = {
            spt_badan_id: sptBadanId,
        };
        ALL_FIELDS.forEach((f) => {
            payload[f] = stateToSave[f];
        });
        router.post(route("spt.badan.l10b.sync"), payload, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onSuccess: () => {
                lastSyncedSnapshotRef.current = JSON.stringify(stateToSave);
            },
            onError: () => toast.error("Gagal menyimpan data L10B"),
        });
    };

    useEffect(() => {
        if (!sptBadanId) return;

        const currentSnapshot = JSON.stringify(state);
        if (currentSnapshot === lastSyncedSnapshotRef.current) return;

        if (autoSaveTimeoutRef.current) {
            window.clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = window.setTimeout(() => {
            sync(state);
        }, 350);

        return () => {
            if (autoSaveTimeoutRef.current) {
                window.clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [state, sptBadanId]);

    return (
        <div className="space-y-0 rounded-lg overflow-hidden border">
            {SECTIONS.map((section, sIdx) => (
                <div key={sIdx} className={sIdx > 0 ? "border-t" : ""}>
                    {/* Section header */}
                    <div className="bg-zinc-300 px-4 py-2">
                        <p className="text-sm font-semibold">
                            {section.header}
                        </p>
                        <p className="text-sm text-gray-600">
                            {section.subheader}
                        </p>
                    </div>

                    {/* Rows */}
                    {section.rows.map((row, rIdx) => (
                        <div
                            key={row.field}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-4 py-3 ${
                                rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } border-t`}
                        >
                            <p className="text-sm w-full sm:flex-1 whitespace-pre-line break-words leading-relaxed">
                                {row.label}
                            </p>
                            <YaTidakRadio
                                value={state[row.field]}
                                onChange={(val) => handleChange(row.field, val)}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default TabL10B;
