import { Button } from "@/Components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { router } from "@inertiajs/react";
import { Pencil, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FormL3BEditDialog from "./FormL3BEditDialog";
import {
    type BrutoType,
    type L3BItem,
    type MasterObject,
    type MasterTku,
    MONTH_KEYS,
    computeRowTotal,
    emptyL3BRow,
    formatMoney,
    parseDigits,
} from "./types";

const SECTION_TITLE: Record<BrutoType, string> = {
    a: "A. REKAPITULASI PEREDARAN BRUTO UNTUK WAJIB PAJAK ORANG PRIBADI YANG MEMILIKI PEREDARAN BRUTO TERTENTU YANG DIKENAI PAJAK BERSIFAT FINAL",
    b: "B. REKAPITULASI PEREDARAN BRUTO UNTUK WAJIB PAJAK ORANG PRIBADI PENGUSAHA TERTENTU (OPPT)",
    c: "C. REKAPITULASI PEREDARAN BRUTO UNTUK PENGGUNA NORMA PENGHITUNGAN PENGHASILAN NETO (NPPN)",
};

const NON_TAXABLE_CAP_OP = 500_000_000;
const PPH_FINAL_RATE = 0.005;

// TKU IDs from MasterTku seeder
const TKU_USER_ID = 8;
const TKU_JUMLAH_PEREDARAN_BRUTO = 1;
const TKU_AKUMULASI_PEREDARAN_BRUTO = 2;
const TKU_PEREDARAN_BRUTO_TIDAK_KENA_PAJAK = 3;
const TKU_PEREDARAN_BRUTO_KENA_PAJAK = 4;
const TKU_JUMLAH_PPH_FINAL_TERUTANG = 5;
const TKU_PPH_FINAL_DISETOR_SENDIRI = 6;
const TKU_PPH_FINAL_DIPOTONG_PIHAK_LAIN = 7;

export default function TabL3B({
    user,
    spt,
    sptOpId,
    masterTku,
    masterObjects,
    l3b,
}: {
    user: {
        npwp: string;
        name?: string;
        full_name?: string;
        alamat?: string;
        address?: string;
        kelurahan?: string;
        desa?: string;
        kecamatan?: string;
        kota?: string;
        kabupaten?: string;
        provinsi?: string;
    };
    spt: { year: number };
    sptOpId: string;
    masterTku: MasterTku[];
    masterObjects: MasterObject[];
    l3b: any[];
}) {
    const [isSaving, setIsSaving] = useState(false);

    const initial = useMemo(() => {
        return (l3b ?? []).map((raw) => {
            const row: L3BItem = {
                id: raw.id,
                spt_op_id: String(raw.spt_op_id ?? sptOpId),
                tku_id: Number(raw.tku_id ?? 0),
                bruto_type: (raw.bruto_type ?? "a") as BrutoType,
                type_of_bookkeeping: raw.type_of_bookkeeping ?? null,
                business_type: raw.business_type ?? null,
                januari: Number(raw.januari ?? 0),
                februari: Number(raw.februari ?? 0),
                maret: Number(raw.maret ?? 0),
                april: Number(raw.april ?? 0),
                mei: Number(raw.mei ?? 0),
                juni: Number(raw.juni ?? 0),
                juli: Number(raw.juli ?? 0),
                agustus: Number(raw.agustus ?? 0),
                september: Number(raw.september ?? 0),
                oktober: Number(raw.oktober ?? 0),
                november: Number(raw.november ?? 0),
                desember: Number(raw.desember ?? 0),
                accumulated: Number(raw.accumulated ?? 0),
                total: Number(raw.total ?? 0),
            };

            const total = computeRowTotal(row);
            return {
                ...row,
                total,
                accumulated: row.accumulated || total,
            };
        });
    }, [l3b, sptOpId]);

    const [draft, setDraft] = useState<L3BItem[]>(() => initial);

    // State for manual PPh inputs (PPh DISETOR SENDIRI and PPh DIPOTONG PIHAK LAIN)
    const initialPphDisetorSendiri = useMemo(() => {
        const row = (l3b ?? []).find(
            (r) =>
                r.bruto_type === "a" &&
                Number(r.tku_id) === TKU_PPH_FINAL_DISETOR_SENDIRI,
        );
        if (!row)
            return Object.fromEntries(MONTH_KEYS.map((m) => [m, 0])) as Record<
                (typeof MONTH_KEYS)[number],
                number
            >;
        return Object.fromEntries(
            MONTH_KEYS.map((m) => [m, Number(row[m] ?? 0)]),
        ) as Record<(typeof MONTH_KEYS)[number], number>;
    }, [l3b]);

    const initialPphDipotongPihakLain = useMemo(() => {
        const row = (l3b ?? []).find(
            (r) =>
                r.bruto_type === "a" &&
                Number(r.tku_id) === TKU_PPH_FINAL_DIPOTONG_PIHAK_LAIN,
        );
        if (!row)
            return Object.fromEntries(MONTH_KEYS.map((m) => [m, 0])) as Record<
                (typeof MONTH_KEYS)[number],
                number
            >;
        return Object.fromEntries(
            MONTH_KEYS.map((m) => [m, Number(row[m] ?? 0)]),
        ) as Record<(typeof MONTH_KEYS)[number], number>;
    }, [l3b]);

    const [pphDisetorSendiri, setPphDisetorSendiri] = useState<
        Record<(typeof MONTH_KEYS)[number], number>
    >(() => initialPphDisetorSendiri);
    const [pphDipotongPihakLain, setPphDipotongPihakLain] = useState<
        Record<(typeof MONTH_KEYS)[number], number>
    >(() => initialPphDipotongPihakLain);

    // Debounce timer ref for auto-save
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Refs to store latest PPh values for use in debounced callback
    const pphDisetorSendiriRef = useRef(pphDisetorSendiri);
    const pphDipotongPihakLainRef = useRef(pphDipotongPihakLain);
    const draftRef = useRef(draft);

    // Keep refs in sync with state
    useEffect(() => {
        pphDisetorSendiriRef.current = pphDisetorSendiri;
    }, [pphDisetorSendiri]);

    useEffect(() => {
        pphDipotongPihakLainRef.current = pphDipotongPihakLain;
    }, [pphDipotongPihakLain]);

    useEffect(() => {
        draftRef.current = draft;
    }, [draft]);

    const normalizeId = (value: unknown) =>
        String(value ?? "").replace(/\D/g, "");

    const tkuOptions = useMemo(() => {
        const list = masterTku ?? [];
        return [...list].sort((a, b) => Number(a.id) - Number(b.id));
    }, [masterTku]);

    const tkuNameById = useMemo(() => {
        const map = new Map<number, string>();
        for (const t of tkuOptions) {
            const code = (t as any).code ?? t.id;
            map.set(Number(t.id), `${code} - ${t.name}`);
        }
        return map;
    }, [tkuOptions]);

    const userTkuMatch = useMemo(() => {
        const npwp = normalizeId(user.npwp);
        if (!npwp) return null;
        return (
            tkuOptions.find((t) => {
                const raw = t as any;
                const code = normalizeId(raw.code ?? t.id);
                const id = normalizeId(t.id);
                return code === npwp || id === npwp;
            }) ?? null
        );
    }, [tkuOptions, user.npwp]);

    const tkuDisplay = (tku: MasterTku) => {
        const raw = tku as any;
        const idTku = String(raw.code ?? tku.id);
        const name = String(raw.name ?? "");
        const alamat = String(raw.alamat ?? raw.address ?? "").trim();
        const kelurahan = String(raw.kelurahan ?? raw.desa ?? "").trim();
        const kecamatan = String(raw.kecamatan ?? "").trim();
        const kota = String(raw.kota ?? raw.kabupaten ?? "").trim();
        const provinsi = String(raw.provinsi ?? "").trim();
        return { idTku, name, alamat, kelurahan, kecamatan, kota, provinsi };
    };

    const userTku = useMemo(() => {
        const raw = user as any;
        const name = String(raw.name ?? raw.nama ?? raw.full_name ?? "").trim();
        const alamat = String(raw.alamat ?? raw.address ?? "").trim();
        const kelurahan = String(raw.kelurahan ?? raw.desa ?? "").trim();
        const kecamatan = String(raw.kecamatan ?? "").trim();
        const kota = String(raw.kota ?? raw.kabupaten ?? "").trim();
        const provinsi = String(raw.provinsi ?? "").trim();
        return {
            idTku: String(user.npwp ?? "").trim(),
            name,
            alamat,
            kelurahan,
            kecamatan,
            kota,
            provinsi,
        };
    }, [user]);

    const getRowForTku = (type: BrutoType, tkuId: number) => {
        const found = draft.find(
            (r) => r.bruto_type === type && Number(r.tku_id) === Number(tkuId),
        );
        if (found) return found;
        return {
            ...emptyL3BRow(sptOpId, type),
            tku_id: Number(tkuId),
        } satisfies L3BItem;
    };

    const totals = useMemo(() => {
        // For section A, we use user TKU (id=8) as the source
        const userRow = getRowForTku("a", TKU_USER_ID);

        // User's monthly income (this is also JUMLAH PEREDARAN BRUTO)
        const userMonthSum: Record<(typeof MONTH_KEYS)[number], number> =
            Object.fromEntries(
                MONTH_KEYS.map((m) => [m, Number(userRow[m] ?? 0)]),
            ) as any;
        const userTotal = MONTH_KEYS.reduce((s, m) => s + userMonthSum[m], 0);

        // AKUMULASI PEREDARAN BRUTO - cumulative sum
        const cumulative: Record<(typeof MONTH_KEYS)[number], number> =
            Object.fromEntries(MONTH_KEYS.map((m) => [m, 0])) as any;
        let running = 0;
        for (const m of MONTH_KEYS) {
            running += userMonthSum[m];
            cumulative[m] = running;
        }

        // PEREDARAN BRUTO KENA PAJAK - only from month when accumulation exceeds 500M
        const taxable: Record<(typeof MONTH_KEYS)[number], number> =
            Object.fromEntries(MONTH_KEYS.map((m) => [m, 0])) as any;
        let prevCumulative = 0;
        for (const m of MONTH_KEYS) {
            // If previous month's cumulative already exceeded cap, this month is fully taxable
            // If this month's cumulative exceeds cap, only the excess is taxable
            if (prevCumulative >= NON_TAXABLE_CAP_OP) {
                taxable[m] = userMonthSum[m];
            } else if (cumulative[m] > NON_TAXABLE_CAP_OP) {
                taxable[m] = cumulative[m] - NON_TAXABLE_CAP_OP;
            } else {
                taxable[m] = 0;
            }
            prevCumulative = cumulative[m];
        }

        // JUMLAH PPh FINAL TERUTANG - 0.5% of taxable
        const pphDue: Record<(typeof MONTH_KEYS)[number], number> =
            Object.fromEntries(MONTH_KEYS.map((m) => [m, 0])) as any;
        for (const m of MONTH_KEYS) {
            pphDue[m] = Math.round(taxable[m] * PPH_FINAL_RATE);
        }

        // For section B and C, use existing logic
        const baseBC = (type: BrutoType) => {
            const monthSum: Record<(typeof MONTH_KEYS)[number], number> =
                Object.fromEntries(MONTH_KEYS.map((m) => [m, 0])) as any;
            for (const tku of tkuOptions) {
                const row = getRowForTku(type, Number(tku.id));
                for (const m of MONTH_KEYS) monthSum[m] += Number(row[m] ?? 0);
            }
            const total = MONTH_KEYS.reduce((s, m) => s + monthSum[m], 0);
            return { monthSum, total };
        };

        const b = baseBC("b");
        const c = baseBC("c");

        return {
            a: { monthSum: userMonthSum, total: userTotal },
            b,
            c,
            aExtras: {
                cumulative,
                taxable,
                pphDue,
                taxableTotal: MONTH_KEYS.reduce((s, m) => s + taxable[m], 0),
                pphDueTotal: MONTH_KEYS.reduce((s, m) => s + pphDue[m], 0),
            },
        };
    }, [draft, sptOpId, tkuOptions, pphDisetorSendiri, pphDipotongPihakLain]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<BrutoType>("a");
    const [editingValue, setEditingValue] = useState<L3BItem>(() =>
        emptyL3BRow(sptOpId, "a"),
    );

    const openEdit = (type: BrutoType, tkuId: number) => {
        setDialogType(type);
        const current = getRowForTku(type, tkuId);
        setEditingValue({ ...current });
        setDialogOpen(true);
    };

    // Debounced auto-save for PPh manual inputs (saves 1 second after last change)
    const debouncedSavePphInputs = useCallback(() => {
        // Clear any pending save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout for save
        saveTimeoutRef.current = setTimeout(() => {
            setIsSaving(true);

            // Use refs to get latest values (state values in closure are stale)
            const currentPphDisetor = pphDisetorSendiriRef.current;
            const currentPphDipotong = pphDipotongPihakLainRef.current;
            const currentDraft = draftRef.current;

            // Build rows for PPh DISETOR SENDIRI and PPh DIPOTONG PIHAK LAIN
            const pphDisetorRow = {
                tku_id: TKU_PPH_FINAL_DISETOR_SENDIRI,
                bruto_type: "a" as BrutoType,
                type_of_bookkeeping: null,
                business_type: null,
                ...Object.fromEntries(
                    MONTH_KEYS.map((m) => [m, currentPphDisetor[m]]),
                ),
                accumulated: MONTH_KEYS.reduce(
                    (s, m) => s + currentPphDisetor[m],
                    0,
                ),
                total: MONTH_KEYS.reduce((s, m) => s + currentPphDisetor[m], 0),
            };

            const pphDipotongRow = {
                tku_id: TKU_PPH_FINAL_DIPOTONG_PIHAK_LAIN,
                bruto_type: "a" as BrutoType,
                type_of_bookkeeping: null,
                business_type: null,
                ...Object.fromEntries(
                    MONTH_KEYS.map((m) => [m, currentPphDipotong[m]]),
                ),
                accumulated: MONTH_KEYS.reduce(
                    (s, m) => s + currentPphDipotong[m],
                    0,
                ),
                total: MONTH_KEYS.reduce(
                    (s, m) => s + currentPphDipotong[m],
                    0,
                ),
            };

            // Get existing rows (excluding these two TKUs)
            const existingRows = currentDraft
                .filter((row) => {
                    if (row.bruto_type !== "a") return true;
                    return ![
                        TKU_PPH_FINAL_DISETOR_SENDIRI,
                        TKU_PPH_FINAL_DIPOTONG_PIHAK_LAIN,
                    ].includes(Number(row.tku_id));
                })
                .filter((row) => {
                    const hasAnyMonth = MONTH_KEYS.some(
                        (m) => Number((row as any)[m] ?? 0) > 0,
                    );
                    const hasMeta =
                        (row.bruto_type === "b" && !!row.type_of_bookkeeping) ||
                        (row.bruto_type === "c" && !!row.business_type);
                    return hasAnyMonth || hasMeta;
                })
                .map((row) => {
                    const total = computeRowTotal(row);
                    return {
                        tku_id: Number(row.tku_id),
                        bruto_type: row.bruto_type,
                        type_of_bookkeeping: row.type_of_bookkeeping,
                        business_type: row.business_type,
                        januari: Number(row.januari ?? 0),
                        februari: Number(row.februari ?? 0),
                        maret: Number(row.maret ?? 0),
                        april: Number(row.april ?? 0),
                        mei: Number(row.mei ?? 0),
                        juni: Number(row.juni ?? 0),
                        juli: Number(row.juli ?? 0),
                        agustus: Number(row.agustus ?? 0),
                        september: Number(row.september ?? 0),
                        oktober: Number(row.oktober ?? 0),
                        november: Number(row.november ?? 0),
                        desember: Number(row.desember ?? 0),
                        accumulated: total,
                        total,
                    };
                });

            const payloadRows = [
                ...existingRows,
                pphDisetorRow,
                pphDipotongRow,
            ];

            router.post(
                route("spt.op.l3b.sync"),
                { spt_op_id: sptOpId, rows: payloadRows },
                {
                    preserveScroll: true,
                    onFinish: () => setIsSaving(false),
                },
            );
        }, 1000); // Wait 1 second after last change before saving
    }, [sptOpId]); // Only sptOpId needed - refs always have latest values

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const submitDialog = () => {
        const computedTotal = computeRowTotal(editingValue);
        const nextRow: L3BItem = {
            ...editingValue,
            spt_op_id: sptOpId,
            bruto_type: dialogType,
            total: computedTotal,
            accumulated: computedTotal,
        };
        const resolvedTkuId = Number(nextRow.tku_id) || TKU_USER_ID;
        if (!resolvedTkuId) return;

        nextRow.tku_id = resolvedTkuId;

        // For B and C sections, they are linked - editing one saves both
        const isLinkedBC = dialogType === "b" || dialogType === "c";

        const nextDraft = (() => {
            if (isLinkedBC) {
                // Create both B and C rows with same values
                // type_of_bookkeeping is always "1" for B/C
                const rowB: L3BItem = {
                    ...nextRow,
                    bruto_type: "b",
                    type_of_bookkeeping: "1",
                };
                const rowC: L3BItem = {
                    ...nextRow,
                    bruto_type: "c",
                    type_of_bookkeeping: "1",
                };

                let result = [...draft];

                // Update or add B row
                const idxB = result.findIndex(
                    (r) =>
                        r.bruto_type === "b" &&
                        Number(r.tku_id) === Number(rowB.tku_id),
                );
                if (idxB === -1) {
                    result.push(rowB);
                } else {
                    result = result.map((r, i) => (i === idxB ? rowB : r));
                }

                // Update or add C row
                const idxC = result.findIndex(
                    (r) =>
                        r.bruto_type === "c" &&
                        Number(r.tku_id) === Number(rowC.tku_id),
                );
                if (idxC === -1) {
                    result.push(rowC);
                } else {
                    result = result.map((r, i) => (i === idxC ? rowC : r));
                }

                return result;
            } else {
                // Normal behavior for section A
                const idx = draft.findIndex(
                    (r) =>
                        r.bruto_type === dialogType &&
                        Number(r.tku_id) === Number(nextRow.tku_id),
                );
                if (idx === -1) return [...draft, nextRow];
                return draft.map((r, i) => (i === idx ? nextRow : r));
            }
        })();

        const payloadRows = nextDraft
            .filter((row) => {
                const hasAnyMonth = MONTH_KEYS.some(
                    (m) => Number((row as any)[m] ?? 0) > 0,
                );
                const hasMeta =
                    (row.bruto_type === "b" && !!row.type_of_bookkeeping) ||
                    (row.bruto_type === "c" && !!row.business_type);
                return hasAnyMonth || hasMeta;
            })
            .map((row) => {
                const total = computeRowTotal(row);
                return {
                    tku_id: Number(row.tku_id),
                    bruto_type: row.bruto_type,
                    type_of_bookkeeping: row.type_of_bookkeeping,
                    business_type: row.business_type,
                    januari: Number(row.januari ?? 0),
                    februari: Number(row.februari ?? 0),
                    maret: Number(row.maret ?? 0),
                    april: Number(row.april ?? 0),
                    mei: Number(row.mei ?? 0),
                    juni: Number(row.juni ?? 0),
                    juli: Number(row.juli ?? 0),
                    agustus: Number(row.agustus ?? 0),
                    september: Number(row.september ?? 0),
                    oktober: Number(row.oktober ?? 0),
                    november: Number(row.november ?? 0),
                    desember: Number(row.desember ?? 0),
                    accumulated: total,
                    total,
                };
            });

        setIsSaving(true);
        router.post(
            route("spt.op.l3b.sync"),
            { spt_op_id: sptOpId, rows: payloadRows },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDraft(nextDraft);
                    setDialogOpen(false);
                    // Reload to sync data across sections
                    router.reload({ only: ["lampiranData"] });
                },
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const syncAll = () => {
        setIsSaving(true);

        const payloadRows = draft
            .filter((row) => {
                const hasAnyMonth = MONTH_KEYS.some(
                    (m) => Number((row as any)[m] ?? 0) > 0,
                );
                const hasMeta =
                    (row.bruto_type === "b" && !!row.type_of_bookkeeping) ||
                    (row.bruto_type === "c" && !!row.business_type);
                return hasAnyMonth || hasMeta;
            })
            .map((row) => {
                const total = computeRowTotal(row);
                return {
                    tku_id: Number(row.tku_id),
                    bruto_type: row.bruto_type,
                    type_of_bookkeeping: row.type_of_bookkeeping,
                    business_type: row.business_type,
                    januari: Number(row.januari ?? 0),
                    februari: Number(row.februari ?? 0),
                    maret: Number(row.maret ?? 0),
                    april: Number(row.april ?? 0),
                    mei: Number(row.mei ?? 0),
                    juni: Number(row.juni ?? 0),
                    juli: Number(row.juli ?? 0),
                    agustus: Number(row.agustus ?? 0),
                    september: Number(row.september ?? 0),
                    oktober: Number(row.oktober ?? 0),
                    november: Number(row.november ?? 0),
                    desember: Number(row.desember ?? 0),
                    accumulated: total,
                    total,
                };
            });

        router.post(
            route("spt.op.l3b.sync"),
            { spt_op_id: sptOpId, rows: payloadRows },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const renderFilterRow = (colCount: number) => (
        <TableRow>
            {Array.from({ length: colCount }).map((_, idx) => (
                <TableCell key={idx} className="p-2">
                    <Input className="h-7" disabled value="" />
                </TableCell>
            ))}
        </TableRow>
    );

    const renderA = () => {
        const colCount = 2 + MONTH_KEYS.length + 1;
        const monthSum = totals.a.monthSum;
        const extras = totals.aExtras;

        // Calculate totals for PPh inputs
        const pphDisetorTotal = MONTH_KEYS.reduce(
            (s, m) => s + pphDisetorSendiri[m],
            0,
        );
        const pphDipotongTotal = MONTH_KEYS.reduce(
            (s, m) => s + pphDipotongPihakLain[m],
            0,
        );

        // SELISIH = PPh TERUTANG - PPh DISETOR SENDIRI - PPh DIPOTONG PIHAK LAIN
        const selisih: Record<(typeof MONTH_KEYS)[number], number> =
            Object.fromEntries(
                MONTH_KEYS.map((m) => [
                    m,
                    extras.pphDue[m] -
                        pphDisetorSendiri[m] -
                        pphDipotongPihakLain[m],
                ]),
            ) as any;
        const selisihTotal =
            extras.pphDueTotal - pphDisetorTotal - pphDipotongTotal;

        // Get user TKU display name
        const userDisplayName = `${userTku.idTku || "-"} - ${userTku.name || "-"}`;

        return (
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center text-xs w-[90px]">
                                TINDAKAN
                            </TableHead>
                            <TableHead className="text-center text-xs max-w-[200px]">
                                NAMA TKU
                            </TableHead>
                            {MONTH_KEYS.map((m) => (
                                <TableHead
                                    key={m}
                                    className="text-center text-xs uppercase min-w-[100px]"
                                >
                                    {m}
                                </TableHead>
                            ))}
                            <TableHead className="text-center text-xs min-w-[120px]">
                                JUMLAH
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderFilterRow(colCount)}

                        {/* USER TKU ROW - Editable */}
                        <TableRow>
                            <TableCell className="text-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => openEdit("a", TKU_USER_ID)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </TableCell>
                            <TableCell className="max-w-[200px] break-words">
                                {userDisplayName}
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell key={m} className="text-right">
                                    {formatMoney(monthSum[m])}
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-semibold">
                                {formatMoney(totals.a.total)}
                            </TableCell>
                        </TableRow>

                        {/* JUMLAH PEREDARAN BRUTO (same as user) */}
                        <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell className="font-semibold max-w-[200px] break-words">
                                JUMLAH PEREDARAN BRUTO
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell
                                    key={m}
                                    className="text-right font-semibold"
                                >
                                    {formatMoney(monthSum[m])}
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                                {formatMoney(totals.a.total)}
                            </TableCell>
                        </TableRow>

                        {/* AKUMULASI PEREDARAN BRUTO (cumulative) */}
                        <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell className="font-semibold max-w-[200px] break-words">
                                AKUMULASI PEREDARAN BRUTO
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell
                                    key={m}
                                    className="text-right font-semibold"
                                >
                                    {formatMoney(extras.cumulative[m])}
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                                {formatMoney(extras.cumulative.desember)}
                            </TableCell>
                        </TableRow>

                        {/* PEREDARAN BRUTO TIDAK KENA PAJAK (merged 500jt) */}
                        <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell className="font-semibold max-w-[200px] break-words">
                                PEREDARAN BRUTO TIDAK KENA PAJAK
                            </TableCell>
                            <TableCell
                                colSpan={MONTH_KEYS.length}
                                className="text-center font-semibold"
                            >
                                {formatMoney(NON_TAXABLE_CAP_OP)}
                            </TableCell>
                            <TableCell className="text-right font-bold">
                                {formatMoney(NON_TAXABLE_CAP_OP)}
                            </TableCell>
                        </TableRow>

                        {/* PEREDARAN BRUTO KENA PAJAK */}
                        <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell className="font-semibold max-w-[200px] break-words">
                                PEREDARAN BRUTO KENA PAJAK
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell
                                    key={m}
                                    className="text-right font-semibold"
                                >
                                    {formatMoney(extras.taxable[m])}
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                                {formatMoney(extras.taxableTotal)}
                            </TableCell>
                        </TableRow>

                        {/* JUMLAH PPh FINAL TERUTANG (e) */}
                        <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell className="font-semibold max-w-[200px] break-words">
                                JUMLAH PPh FINAL TERUTANG
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell
                                    key={m}
                                    className="text-right font-semibold"
                                >
                                    {formatMoney(extras.pphDue[m])}
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                                {formatMoney(extras.pphDueTotal)}
                            </TableCell>
                        </TableRow>

                        {/* PPH FINAL YANG DISETOR SENDIRI (f) - Manual Input */}
                        <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell className="font-semibold max-w-[200px] break-words">
                                PPh FINAL YANG DISETOR SENDIRI
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell key={m} className="p-1">
                                    <Input
                                        className="h-8 text-right"
                                        value={formatMoney(
                                            pphDisetorSendiri[m],
                                        )}
                                        onChange={(e) => {
                                            const val = parseDigits(
                                                e.target.value,
                                            );
                                            setPphDisetorSendiri((prev) => ({
                                                ...prev,
                                                [m]: val,
                                            }));
                                            debouncedSavePphInputs();
                                        }}
                                    />
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                                {formatMoney(pphDisetorTotal)}
                            </TableCell>
                        </TableRow>

                        {/* JUMLAH PPH FINAL YANG DIPOTONG/DIPUNGUT PIHAK LAIN (g) - Manual Input */}
                        <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell className="font-semibold max-w-[200px] break-words">
                                JUMLAH PPh FINAL YANG DIPOTONG/DIPUNGUT PIHAK
                                LAIN
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell key={m} className="p-1">
                                    <Input
                                        className="h-8 text-right"
                                        value={formatMoney(
                                            pphDipotongPihakLain[m],
                                        )}
                                        onChange={(e) => {
                                            const val = parseDigits(
                                                e.target.value,
                                            );
                                            setPphDipotongPihakLain((prev) => ({
                                                ...prev,
                                                [m]: val,
                                            }));
                                            debouncedSavePphInputs();
                                        }}
                                    />
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                                {formatMoney(pphDipotongTotal)}
                            </TableCell>
                        </TableRow>

                        {/* SELISIH (e-f-g) */}
                        <TableRow className="bg-gray-100">
                            <TableCell />
                            <TableCell className="font-semibold max-w-[200px] break-words">
                                SELISIH (e-f-g)
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell
                                    key={m}
                                    className="text-right font-semibold"
                                >
                                    {formatMoney(selisih[m])}
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                                {formatMoney(selisihTotal)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    };

    const renderB = () => {
        const colCount = 3 + MONTH_KEYS.length + 1;
        const row = getRowForTku("b", TKU_USER_ID);
        const rowTotal = computeRowTotal(row);
        const userDisplayName = `${userTku.idTku || "-"} - ${userTku.name || "-"}`;

        // Monthly sums from user row (auto-fill)
        const monthSum: Record<(typeof MONTH_KEYS)[number], number> =
            Object.fromEntries(
                MONTH_KEYS.map((m) => [m, Number(row[m] ?? 0)]),
            ) as any;

        return (
            <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                    Kotak metode pembukuan diisi dengan angka 1 atau 2 sesuai
                    daftar di bawah ini:
                    <div className="mt-2">
                        <div className="font-semibold">METODE PEMBUKUAN :</div>
                        <div className="mt-1">1. PENCATATAN</div>
                        <div>
                            2. PEMBUKUAN STELSEL KAS ATAU PEMBUKUAN STELSEL
                            AKRUAL
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center text-xs w-[90px]">
                                    TINDAKAN
                                </TableHead>
                                <TableHead className="text-center text-xs max-w-[200px]">
                                    NAMA TKU
                                </TableHead>
                                <TableHead className="text-center text-xs">
                                    METODE PEMBUKUAN
                                </TableHead>
                                {MONTH_KEYS.map((m) => (
                                    <TableHead
                                        key={m}
                                        className="text-center text-xs uppercase min-w-[100px]"
                                    >
                                        {m}
                                    </TableHead>
                                ))}
                                <TableHead className="text-center text-xs min-w-[120px]">
                                    JUMLAH
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {renderFilterRow(colCount)}

                            {/* USER ROW - Editable */}
                            <TableRow>
                                <TableCell className="text-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            openEdit("b", TKU_USER_ID)
                                        }
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                                <TableCell className="max-w-[200px] break-words">
                                    {userDisplayName}
                                </TableCell>
                                <TableCell className="text-center">1</TableCell>
                                {MONTH_KEYS.map((m) => (
                                    <TableCell key={m} className="text-right">
                                        {formatMoney(row[m])}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right font-semibold">
                                    {formatMoney(rowTotal)}
                                </TableCell>
                            </TableRow>

                            {/* JUMLAH PEREDARAN BRUTO (auto-fill from user) */}
                            <TableRow className="bg-gray-50">
                                <TableCell />
                                <TableCell
                                    className="font-semibold max-w-[200px] break-words"
                                    colSpan={2}
                                >
                                    JUMLAH PEREDARAN BRUTO
                                </TableCell>
                                {MONTH_KEYS.map((m) => (
                                    <TableCell
                                        key={m}
                                        className="text-right font-semibold"
                                    >
                                        {formatMoney(monthSum[m])}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right font-bold">
                                    {formatMoney(rowTotal)}
                                </TableCell>
                            </TableRow>

                            {/* JUMLAH PPh (always 0) */}
                            <TableRow className="bg-gray-50">
                                <TableCell />
                                <TableCell
                                    className="font-semibold max-w-[200px] break-words"
                                    colSpan={2}
                                >
                                    JUMLAH PPh
                                </TableCell>
                                {MONTH_KEYS.map((m) => (
                                    <TableCell
                                        key={m}
                                        className="text-right font-semibold"
                                    >
                                        {formatMoney(0)}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right font-bold">
                                    {formatMoney(0)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    };

    const renderC = () => {
        const colCount = 3 + MONTH_KEYS.length + 1;
        const row = getRowForTku("c", TKU_USER_ID);
        const rowTotal = computeRowTotal(row);
        const userDisplayName = `${userTku.idTku || "-"} - ${userTku.name || "-"}`;

        // Monthly sums from user row (auto-fill)
        const monthSum: Record<(typeof MONTH_KEYS)[number], number> =
            Object.fromEntries(
                MONTH_KEYS.map((m) => [m, Number(row[m] ?? 0)]),
            ) as any;

        return (
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center text-xs w-[90px]">
                                TINDAKAN
                            </TableHead>
                            <TableHead className="text-center text-xs max-w-[200px]">
                                NAMA TKU
                            </TableHead>
                            <TableHead className="text-center text-xs">
                                JENIS USAHA/PEKERJAAN BEBAS
                            </TableHead>
                            {MONTH_KEYS.map((m) => (
                                <TableHead
                                    key={m}
                                    className="text-center text-xs uppercase min-w-[100px]"
                                >
                                    {m}
                                </TableHead>
                            ))}
                            <TableHead className="text-center text-xs min-w-[120px]">
                                JUMLAH
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderFilterRow(colCount)}

                        {/* USER ROW - Editable */}
                        <TableRow>
                            <TableCell className="text-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => openEdit("c", TKU_USER_ID)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </TableCell>
                            <TableCell className="max-w-[200px] break-words">
                                {userDisplayName}
                            </TableCell>
                            <TableCell className="text-center">
                                {row.business_type ?? "-"}
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell key={m} className="text-right">
                                    {formatMoney(row[m])}
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-semibold">
                                {formatMoney(rowTotal)}
                            </TableCell>
                        </TableRow>

                        {/* JUMLAH PEREDARAN BRUTO (auto-fill from user) */}
                        <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell
                                className="font-semibold max-w-[200px] break-words"
                                colSpan={2}
                            >
                                JUMLAH PEREDARAN BRUTO
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell
                                    key={m}
                                    className="text-right font-semibold"
                                >
                                    {formatMoney(monthSum[m])}
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                                {formatMoney(rowTotal)}
                            </TableCell>
                        </TableRow>

                        {/* JUMLAH PPh (always 0) */}
                        <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell
                                className="font-semibold max-w-[200px] break-words"
                                colSpan={2}
                            >
                                JUMLAH PPh
                            </TableCell>
                            {MONTH_KEYS.map((m) => (
                                <TableCell
                                    key={m}
                                    className="text-right font-semibold"
                                >
                                    {formatMoney(0)}
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                                {formatMoney(0)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
            <h2 className="text-xl font-semibold">LAMPIRAN 3B</h2>

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

            <Accordion type="multiple" defaultValue={["tku", "a", "b", "c"]}>
                <AccordionItem value="tku">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        DAFTAR TEMPAT KEGIATAN USAHA (TKU)
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full">
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center text-xs">
                                            ID TKU
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            NAMA
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            ALAMAT
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            KELURAHAN/DESA
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            KECAMATAN
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            KOTA/KABUPATEN
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            PROVINSI
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="whitespace-nowrap">
                                            {userTku.idTku || "-"}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {userTku.name || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {userTku.alamat || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {userTku.kelurahan || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {userTku.kecamatan || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {userTku.kota || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {userTku.provinsi || "-"}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="a">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        {SECTION_TITLE.a}
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full">
                        {renderA()}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="b">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        {SECTION_TITLE.b}
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full">
                        {renderB()}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="c">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        {SECTION_TITLE.c}
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full">
                        {renderC()}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <FormL3BEditDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                brutoType={dialogType}
                masterTku={masterTku}
                masterObjects={masterObjects}
                value={editingValue}
                onChange={setEditingValue}
                onSubmit={submitDialog}
                userLabel={`${userTku.idTku || "-"} - ${userTku.name || "-"}`}
            />
        </div>
    );
}
