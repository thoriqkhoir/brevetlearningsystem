import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { router } from "@inertiajs/react";
import {
    ChevronDown,
    ChevronRight,
    Pencil,
    Plus,
    Save,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { L12B4BItem, L12B4Item } from "./types";

// ----------------------------------------------------------------
// IV.a — predefined investment form options
// ----------------------------------------------------------------
const INVESTMENT_FORM_OPTIONS = [
    "Penyertaan modal pada perusahaan yang baru didirikan dan berkedudukan di Indonesia sebagai pendiri / ikut serta sebagai pendiri",
    "Penyertaan modal pada perusahaan yang sudah didirikan dan berkedudukan di Indonesia sebagai pemegang saham",
    "Pembelian aktiva tetap yang digunakan oleh Bentuk Usaha Tetap untuk memperluas usaha atau melakukan kegiatan Bentuk Usaha Tetap di Indonesia",
    "Investasi dalam bentuk aktiva tidak berwujud oleh Bentuk Usaha Tetap untuk memperluas usaha atau melakukan kegiatan Bentuk Usaha Tetap di Indonesia",
] as const;

const fmt = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
const formatMoney = (v: number | null | undefined) => fmt.format(v ?? 0);
const formatRupiahInput = (v: number) =>
    fmt
        .format(v ?? 0)
        .replace("Rp", "")
        .trim();
const parseNumber = (raw: string) => {
    const n = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

// ----------------------------------------------------------------
// Form Dialog for L12B4B (child)
// ----------------------------------------------------------------
interface ChildFormDialogProps {
    open: boolean;
    onClose: () => void;
    parentId: string;
    editData: L12B4BItem | null;
}

function ChildFormDialog({
    open,
    onClose,
    parentId,
    editData,
}: ChildFormDialogProps) {
    const [investmentName, setInvestmentName] = useState("");
    const [realizationValue, setRealizationValue] = useState(0);
    const [realizationValueDisplay, setRealizationValueDisplay] = useState("0");
    const [realizationYear, setRealizationYear] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setInvestmentName(editData.investment_name ?? "");
            setRealizationValue(editData.realization_value ?? 0);
            setRealizationValueDisplay(
                formatRupiahInput(editData.realization_value ?? 0),
            );
            setRealizationYear(editData.realization_year ?? "");
        } else {
            setInvestmentName("");
            setRealizationValue(0);
            setRealizationValueDisplay("0");
            setRealizationYear("");
        }
    }, [open, editData]);

    const handleSave = () => {
        setIsSaving(true);
        const payload = {
            spt_badan_l_12b_4_id: parentId,
            investment_name: investmentName || null,
            realization_value: realizationValue,
            realization_year: realizationYear || null,
        };
        const afterSave = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data berhasil disimpan");
                onClose();
            },
            onError: () => toast.error("Gagal menyimpan data"),
            onFinish: () => setIsSaving(false),
        };
        if (editData?.id) {
            router.put(
                route("spt.badan.l12b4b.update", editData.id),
                payload,
                afterSave,
            );
        } else {
            router.post(route("spt.badan.l12b4b.store"), payload, afterSave);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md p-0 overflow-hidden flex flex-col">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        {editData ? "Edit" : "Tambah"} Realisasi Penanaman
                        Kembali
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 p-4">
                    <div className="space-y-1">
                        <Label>Bentuk Penanaman Kembali</Label>
                        <Input
                            value={investmentName}
                            onChange={(e) => setInvestmentName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Nilai Realisasi (Rp)</Label>
                        <Input
                            value={realizationValueDisplay}
                            onChange={(e) => {
                                const n = parseNumber(e.target.value);
                                setRealizationValue(n);
                                setRealizationValueDisplay(
                                    formatRupiahInput(n),
                                );
                            }}
                            className="text-right"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Tahun Realisasi</Label>
                        <Input
                            value={realizationYear}
                            onChange={(e) => setRealizationYear(e.target.value)}
                            placeholder="YYYY"
                        />
                    </div>
                </div>
                <DialogFooter className="border-t p-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-950 hover:bg-blue-900"
                    >
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ----------------------------------------------------------------
// Section
// ----------------------------------------------------------------
interface SectionL12B4Props {
    data: L12B4Item[];
    sptBadanId: string;
}

export function SectionL12B4({ data, sptBadanId }: SectionL12B4Props) {
    // IV.a — checkboxes state (derived from existing rows)
    const [checkedOptions, setCheckedOptions] = useState<Set<string>>(() => {
        const s = new Set<string>();
        data.forEach((d) => {
            if (d.investment_form) s.add(d.investment_form);
        });
        return s;
    });
    const [isSavingA, setIsSavingA] = useState(false);

    useEffect(() => {
        const s = new Set<string>();
        data.forEach((d) => {
            if (d.investment_form) s.add(d.investment_form);
        });
        setCheckedOptions(s);
    }, [data]);

    const toggleOption = (opt: string) => {
        setCheckedOptions((prev) => {
            const next = new Set(prev);
            next.has(opt) ? next.delete(opt) : next.add(opt);
            return next;
        });
    };

    const handleSaveA = () => {
        setIsSavingA(true);
        router.post(
            route("spt.badan.l12b4.sync"),
            {
                spt_badan_id: sptBadanId,
                investment_forms: Array.from(checkedOptions),
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success("Data berhasil disimpan"),
                onError: () => toast.error("Gagal menyimpan data"),
                onFinish: () => setIsSavingA(false),
            },
        );
    };

    // IV.b — child dialogs
    const [isChildFormOpen, setIsChildFormOpen] = useState(false);
    const [editChild, setEditChild] = useState<L12B4BItem | null>(null);
    const [activeParentId, setActiveParentId] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{
        type: "child";
        ids: string[];
    } | null>(null);
    const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);

    const allChildren = data.flatMap((p) => p.items ?? []);
    const allSelected =
        allChildren.length > 0 &&
        selectedChildIds.length === allChildren.length;

    const toggleSelectChild = (id: string, checked: boolean) =>
        setSelectedChildIds((prev) =>
            checked ? [...prev, id] : prev.filter((x) => x !== id),
        );

    const toggleSelectAll = (checked: boolean) =>
        setSelectedChildIds(
            checked ? allChildren.map((c) => c.id!).filter(Boolean) : [],
        );

    const toggleExpand = (id: string) =>
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );

    const confirmDelete = () => {
        if (!deleteTarget) return;
        router.delete(route("spt.badan.l12b4b.destroyMultiple"), {
            data: { ids: deleteTarget.ids },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedChildIds([]);
                setIsDeleteConfirmOpen(false);
                setDeleteTarget(null);
            },
        });
    };

    const totalRealizationValue = data
        .flatMap((p) => p.items ?? [])
        .reduce((s, i) => s + (i.realization_value ?? 0), 0);

    return (
        <div className="space-y-4">
            {/* ---- IV.a: Bentuk Penanaman Modal (checkboxes) ---- */}
            <div className="space-y-2">
                <p className=" font-semibold">a. Bentuk Penanaman Modal</p>
                <div className="pl-4 space-y-2">
                    {INVESTMENT_FORM_OPTIONS.map((opt) => (
                        <div key={opt} className="flex items-start gap-3">
                            <Checkbox
                                id={`opt-${opt}`}
                                checked={checkedOptions.has(opt)}
                                onCheckedChange={() => toggleOption(opt)}
                                className="mt-0.5"
                            />
                            <Label
                                htmlFor={`opt-${opt}`}
                                className=" leading-snug cursor-pointer font-normal"
                            >
                                {opt}
                            </Label>
                        </div>
                    ))}
                </div>
                <div className="pl-4">
                    <Button
                        type="button"
                        size="sm"
                        className="bg-blue-950 hover:bg-blue-900"
                        onClick={handleSaveA}
                        disabled={isSavingA}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSavingA ? "Menyimpan..." : "Simpan"}
                    </Button>
                </div>
            </div>

            {/* ---- IV.b: Realisasi Penanaman Kembali ---- */}
            <p className=" font-semibold">
                b. Realisasi Penanaman Kembali yang Telah Dilakukan
            </p>
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    className="bg-blue-950 hover:bg-blue-900"
                    size="sm"
                    onClick={() => {
                        const firstParent = data[0];
                        if (!firstParent?.id) {
                            return;
                        }
                        setActiveParentId(firstParent.id);
                        setEditChild(null);
                        setIsChildFormOpen(true);
                    }}
                    disabled={data.length === 0}
                >
                    <Plus className="w-4 h-4 mr-2" /> Tambah
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                        setDeleteTarget({
                            type: "child",
                            ids: selectedChildIds,
                        });
                        setIsDeleteConfirmOpen(true);
                    }}
                    disabled={selectedChildIds.length === 0}
                >
                    <Trash2 className="w-4 h-4 mr-2" /> Hapus (
                    {selectedChildIds.length})
                </Button>
            </div>

            <div className="w-full overflow-x-auto border">
                <Table className="min-w-[600px] text-xs">
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="border border-gray-300 w-10">
                                <Checkbox
                                    checked={
                                        allSelected ||
                                        (selectedChildIds.length > 0
                                            ? "indeterminate"
                                            : false)
                                    }
                                    onCheckedChange={(c) =>
                                        toggleSelectAll(!!c)
                                    }
                                />
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center w-10">
                                NO.
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center">
                                BENTUK PENANAMAN KEMBALI
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center">
                                NILAI REALISASI (Rp)
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center">
                                TAHUN REALISASI
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center w-20">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allChildren.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center text-muted-foreground h-16"
                                >
                                    Belum ada data.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((parent, idx) => (
                                <>
                                    <TableRow
                                        key={`parent-${parent.id ?? idx}`}
                                        className="bg-gray-50"
                                    >
                                        <TableCell className="border border-gray-200" />
                                        <TableCell
                                            className="border border-gray-200 text-center font-semibold"
                                            colSpan={1}
                                        >
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell className="border border-gray-200 font-semibold">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleExpand(parent.id!)
                                                    }
                                                    className="text-gray-500 hover:text-gray-900"
                                                >
                                                    {expandedIds.includes(
                                                        parent.id!,
                                                    ) ? (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4" />
                                                    )}
                                                </button>
                                                {parent.investment_form ?? "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="border border-gray-200 text-right font-semibold">
                                            {formatMoney(
                                                (parent.items ?? []).reduce(
                                                    (s, i) =>
                                                        s +
                                                        (i.realization_value ??
                                                            0),
                                                    0,
                                                ),
                                            )}
                                        </TableCell>
                                        <TableCell className="border border-gray-200" />
                                        <TableCell className="border border-gray-200">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7"
                                                onClick={() => {
                                                    setActiveParentId(
                                                        parent.id!,
                                                    );
                                                    setEditChild(null);
                                                    setIsChildFormOpen(true);
                                                }}
                                                title="Tambah realisasi"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {expandedIds.includes(parent.id!) &&
                                        (parent.items ?? []).map(
                                            (child, cidx) => (
                                                <TableRow
                                                    key={`child-${child.id ?? cidx}`}
                                                >
                                                    <TableCell className="border border-gray-200">
                                                        <Checkbox
                                                            checked={selectedChildIds.includes(
                                                                child.id!,
                                                            )}
                                                            onCheckedChange={(
                                                                c,
                                                            ) =>
                                                                toggleSelectChild(
                                                                    child.id!,
                                                                    !!c,
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell className="border border-gray-200 text-center text-muted-foreground">
                                                        {idx + 1}.{cidx + 1}
                                                    </TableCell>
                                                    <TableCell className="border border-gray-200 pl-8">
                                                        {child.investment_name ??
                                                            "-"}
                                                    </TableCell>
                                                    <TableCell className="border border-gray-200 text-right">
                                                        {formatMoney(
                                                            child.realization_value,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="border border-gray-200 text-center">
                                                        {child.realization_year ??
                                                            "-"}
                                                    </TableCell>
                                                    <TableCell className="border border-gray-200">
                                                        <div className="flex gap-1">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-7 w-7"
                                                                onClick={() => {
                                                                    setActiveParentId(
                                                                        parent.id!,
                                                                    );
                                                                    setEditChild(
                                                                        child,
                                                                    );
                                                                    setIsChildFormOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <Pencil className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-7 w-7 text-red-500"
                                                                onClick={() => {
                                                                    setDeleteTarget(
                                                                        {
                                                                            type: "child",
                                                                            ids: [
                                                                                child.id!,
                                                                            ],
                                                                        },
                                                                    );
                                                                    setIsDeleteConfirmOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                </>
                            ))
                        )}
                    </TableBody>
                    {allChildren.length > 0 && (
                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="border border-gray-300 text-right font-semibold"
                                >
                                    JUMLAH
                                </TableCell>
                                <TableCell className="border border-gray-300 text-right font-semibold">
                                    {formatMoney(totalRealizationValue)}
                                </TableCell>
                                <TableCell className="border border-gray-300" />
                                <TableCell className="border border-gray-300" />
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>

            {activeParentId && (
                <ChildFormDialog
                    open={isChildFormOpen}
                    onClose={() => {
                        setIsChildFormOpen(false);
                        setEditChild(null);
                        setActiveParentId(null);
                    }}
                    parentId={activeParentId}
                    editData={editChild}
                />
            )}
            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false);
                    setDeleteTarget(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Data"
                description={
                    deleteTarget?.ids && deleteTarget.ids.length > 1
                        ? `Apakah Anda yakin ingin menghapus ${deleteTarget.ids.length} data yang dipilih?`
                        : "Apakah Anda yakin ingin menghapus data ini?"
                }
            />
        </div>
    );
}
