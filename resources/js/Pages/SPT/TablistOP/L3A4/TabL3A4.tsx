import { Button } from "@/Components/ui/button";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { router } from "@inertiajs/react";
import axios from "axios";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import {
    type L3A4AItem,
    type L3A4BItem,
    type MasterObject,
    type MasterTku,
    L3A4B_INCOME_TYPE_OPTIONS,
    formatMoney,
    parseDigits,
    computeNetIncomeFromNorma,
} from "./types";
import FormL3A4BDialog from "./FormL3A4BDialog";

export default function TabL3A4({
    user,
    spt,
    sptOpId,
    masterTku,
    masterObjects,
    l3a4a,
    l3a4b,
    onBTotalChange,
}: {
    user: { npwp: string; name?: string; nik?: string };
    spt: { year: number };
    sptOpId: string;
    masterTku: MasterTku[];
    masterObjects: MasterObject[];
    l3a4a: any[];
    l3a4b: any[];
    onBTotalChange?: Dispatch<SetStateAction<number>>;
}) {
    const [isSaving, setIsSaving] = useState(false);

    const initialA = useMemo(() => {
        return (l3a4a ?? []).map((raw) => {
            const gross = Number(raw.gross_income ?? 0);
            const norma = Number(raw.norma ?? 0);
            const net = Number(
                raw.net_income ?? computeNetIncomeFromNorma(gross, norma),
            );
            return {
                id: raw.id,
                spt_op_id: String(raw.spt_op_id ?? sptOpId),
                business_place: raw.business_place ?? null,
                business_type: raw.business_type ?? null,
                gross_income: gross,
                norma,
                net_income: net,
            } satisfies L3A4AItem;
        });
    }, [l3a4a, sptOpId]);

    // State untuk bDraft
    const [bDraft, setBDraft] = useState<L3A4BItem[]>(() => l3a4b ?? []);
    const [editBIndex, setEditBIndex] = useState<number | null>(null);
    const [bForm, setBForm] = useState<L3A4BItem | null>(null);

    const initialB = useMemo(() => {
        return (l3a4b ?? []).map((raw) => {
            return {
                id: raw.id,
                spt_op_id: String(raw.spt_op_id ?? sptOpId),
                code: String(raw.code ?? ""),
                income_type: raw.income_type ?? null,
                net_income: Number(raw.net_income ?? 0),
            } satisfies L3A4BItem;
        });
    }, [l3a4b, sptOpId]);

    const [aDraft, setADraft] = useState<L3A4AItem[]>(() => initialA);

    // Sync state dengan data dari server saat ada perubahan
    useEffect(() => {
        setADraft(initialA);
    }, [initialA]);

    useEffect(() => {
        setBDraft(initialB);
    }, [initialB]);

    // Debounce ref for norma auto-save
    const normaSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    // Auto-save norma to server
    const saveNormaToServer = useCallback((id: string, norma: number) => {
        if (normaSaveTimeoutRef.current) {
            clearTimeout(normaSaveTimeoutRef.current);
        }
        normaSaveTimeoutRef.current = setTimeout(() => {
            axios
                .post(route("spt.op.l3a4a.updateNorma"), { id, norma })
                .then(() => {
                    // Reload to get updated net_income and b_1c_value
                    router.reload({
                        only: ["sptOp", "lampiranData", "l3a4a", "l3a4b"],
                    });
                })
                .catch(() => {
                    // Silent fail for auto-save
                });
        }, 500);
    }, []);

    // Delete confirmation state
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{
        type: "a" | "b";
        index: number;
    } | null>(null);

    // ===== A helpers =====
    const totalGross = useMemo(
        () =>
            aDraft.reduce((sum, row) => sum + Number(row.gross_income ?? 0), 0),
        [aDraft],
    );
    const totalNetA = useMemo(
        () => aDraft.reduce((sum, row) => sum + Number(row.net_income ?? 0), 0),
        [aDraft],
    );

    const updateARowNorma = (index: number, norma: number) => {
        setADraft((prev) => {
            const next = [...prev];
            const current = next[index];
            const merged = { ...current, norma } as L3A4AItem;
            merged.net_income = computeNetIncomeFromNorma(
                Number(merged.gross_income ?? 0),
                norma,
            );
            next[index] = merged;

            // Auto-save to server if record has an id
            if (current.id) {
                saveNormaToServer(current.id, norma);
            }

            return next;
        });
    };

    // ===== B dialog + helpers =====
    const [openB, setOpenB] = useState(false);

    const openAddB = () => {
        setEditBIndex(null);
        setBForm({
            spt_op_id: sptOpId,
            code: "",
            income_type: null,
            net_income: 0,
        });
        setOpenB(true);
    };

    const openEditB = (index: number) => {
        setEditBIndex(index);
        setBForm({ ...bDraft[index] });
        setOpenB(true);
    };

    const saveBForm = () => {
        if (!bForm) return;

        if (editBIndex !== null) {
            // Update row existing di local state langsung
            setBDraft((prev) => {
                const next = [...prev];
                next[editBIndex] = { ...bForm };
                return next;
            });
        } else {
            // Row baru: reload dari server untuk dapat id yang di-generate DB
            router.reload({ only: ["l3a4b"] });
        }

        setEditBIndex(null);
    };

    const removeBRow = (index: number) => {
        setDeleteTarget({ type: "b", index });
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteB = (index: number) => {
        const item = bDraft[index];

        if (item?.id) {
            // Jika sudah ada di database, hapus via API
            router.delete(route("spt.op.l3a4b.destroy"), {
                data: { ids: [item.id] },
                preserveScroll: true,
                onSuccess: () => {
                    // Reload data dari server
                    router.reload({
                        only: ["sptOp", "lampiranData", "l3a4a", "l3a4b"],
                    });
                },
            });
        } else {
            // Jika belum tersimpan, hapus langsung dari state
            setBDraft((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;

        if (deleteTarget.type === "b") {
            confirmDeleteB(deleteTarget.index);
        }

        setIsDeleteConfirmOpen(false);
        setDeleteTarget(null);
    };

    const totalNetB = useMemo(
        () => bDraft.reduce((sum, row) => sum + Number(row.net_income ?? 0), 0),
        [bDraft],
    );

    // Notify parent (Induk) when total net income of table B changes
    useEffect(() => {
        if (onBTotalChange) {
            onBTotalChange(totalNetB);
        }
    }, [totalNetB, onBTotalChange]);

    const handleSync = () => {
        if (!sptOpId) return;
        setIsSaving(true);

        const aRows = aDraft.map((row) => ({
            ...row,
            spt_op_id: sptOpId,
            gross_income: Number(row.gross_income ?? 0),
            norma: Number(row.norma ?? 0),
            net_income: computeNetIncomeFromNorma(
                Number(row.gross_income ?? 0),
                Number(row.norma ?? 0),
            ),
        }));

        const bRows = bDraft.map((row) => ({
            ...row,
            spt_op_id: sptOpId,
            net_income: Number(row.net_income ?? 0),
        }));

        router.post(
            route("spt.op.l3a4a.sync"),
            { spt_op_id: sptOpId, rows: aRows },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.post(
                        route("spt.op.l3a4b.sync"),
                        { spt_op_id: sptOpId, rows: bRows },
                        {
                            preserveScroll: true,
                            onFinish: () => {
                                // Ensure induk & lampiran totals reflect latest values
                                router.reload({
                                    only: [
                                        "sptOp",
                                        "lampiranData",
                                        "l3a4a",
                                        "l3a4b",
                                    ],
                                });
                                setIsSaving(false);
                            },
                        },
                    );
                },
                onError: () => setIsSaving(false),
            },
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
            <h2 className="text-xl font-semibold">LAMPIRAN 3A-4</h2>

            {/* Header */}
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

            <Accordion type="multiple" defaultValue={["a", "b"]}>
                {/* A */}
                <AccordionItem value="a">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        A. PENGHASILAN NETO DALAM NEGERI DARI USAHA DAN/ATAU
                        PEKERJAAN BEBAS BERDASARKAN PENCATATAN
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Wajib Pajak yang menyelenggarakan pencatatan wajib
                            mengisi Lampiran 3B untuk menyampaikan rincian
                            penghasilan bruto.
                        </p>

                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center text-xs">
                                            NO.
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            NAMA TKU
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            JENIS USAHA/PEKERJAAN BEBAS
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            PEREDARAN BRUTO (Rp)
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            NORMA (%)
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            PENGHASILAN NETO
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {aDraft.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center text-muted-foreground"
                                            >
                                                Tidak ada data untuk
                                                ditampilkan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        aDraft.map((row, index) => (
                                            <TableRow
                                                key={row.id ?? `new-${index}`}
                                            >
                                                <TableCell className="text-center">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {user.npwp}
                                                </TableCell>
                                                <TableCell>
                                                    {row.business_type || "-"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatMoney(
                                                        row.gross_income,
                                                    )}
                                                </TableCell>
                                                <TableCell className="w-[120px]">
                                                    <Input
                                                        value={String(
                                                            row.norma ?? 0,
                                                        )}
                                                        onChange={(e) =>
                                                            updateARowNorma(
                                                                index,
                                                                parseDigits(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        className="text-right h-8"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatMoney(
                                                        row.net_income,
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}

                                    {/* Totals */}
                                    <TableRow className="bg-gray-50 font-semibold">
                                        <TableCell
                                            colSpan={3}
                                            className="text-right"
                                        >
                                            JUMLAH PEREDARAN BRUTO (Rp)
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatMoney(totalGross)}
                                        </TableCell>
                                        <TableCell colSpan={2} />
                                    </TableRow>
                                    <TableRow className="bg-gray-50 font-semibold">
                                        <TableCell
                                            colSpan={4}
                                            className="text-right"
                                        >
                                            TOTAL PENGHASILAN NETO
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatMoney(totalNetA)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* B */}
                <AccordionItem value="b">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        B. PENGHASILAN NETO DALAM NEGERI LAINNYA
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full space-y-3">
                        <div>
                            <Button
                                type="button"
                                className="bg-blue-950 hover:bg-blue-900 gap-2"
                                onClick={openAddB}
                            >
                                <Plus className="w-4 h-4" />
                                Tambah
                            </Button>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center text-xs">
                                            TINDAKAN
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            NO.
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            KODE
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            JENIS PENGHASILAN
                                        </TableHead>
                                        <TableHead className="text-center text-xs">
                                            PENGHASILAN NETO
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bDraft.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center text-muted-foreground"
                                            >
                                                Tidak ada data untuk
                                                ditampilkan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        bDraft.map((row, idx) => (
                                            <TableRow
                                                key={row.id ?? `b-${idx}`}
                                            >
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() =>
                                                                openEditB(idx)
                                                            }
                                                        >
                                                            <Pencil className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() =>
                                                                removeBRow(idx)
                                                            }
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {idx + 1}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {row.code}
                                                </TableCell>
                                                <TableCell>
                                                    {row.income_type ?? ""}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatMoney(
                                                        row.net_income,
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}

                                    <TableRow className="bg-gray-50 font-semibold">
                                        <TableCell
                                            colSpan={4}
                                            className="text-right"
                                        >
                                            JUMLAH TABEL B
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatMoney(totalNetB)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="mt-2 flex gap-3">
                <Button
                    type="button"
                    className="bg-blue-950 hover:bg-blue-900"
                    onClick={handleSync}
                    disabled={isSaving}
                >
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Konsep
                </Button>
            </div>

            <FormL3A4BDialog
                open={openB}
                onOpenChange={setOpenB}
                form={bForm}
                setForm={setBForm}
                onSave={saveBForm}
            />

            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false);
                    setDeleteTarget(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Data"
                description="Apakah Anda yakin ingin menghapus data ini?"
            />
        </div>
    );
}
