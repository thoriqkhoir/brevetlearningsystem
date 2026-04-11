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
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { L12B8Item } from "./types";

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

interface FormDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData: L12B8Item | null;
}

function FormDialog({ open, onClose, sptBadanId, editData }: FormDialogProps) {
    const [assetType, setAssetType] = useState("");
    const [assetValue, setAssetValue] = useState(0);
    const [assetValueDisplay, setAssetValueDisplay] = useState("0");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setAssetType(editData.asset_type ?? "");
            setAssetValue(editData.asset_value ?? 0);
            setAssetValueDisplay(formatRupiahInput(editData.asset_value ?? 0));
            setDescription(editData.description ?? "");
        } else {
            setAssetType("");
            setAssetValue(0);
            setAssetValueDisplay("0");
            setDescription("");
        }
    }, [open, editData]);

    const handleSave = () => {
        if (!assetType.trim()) {
            toast.error("Jenis Aktiva wajib diisi");
            return;
        }
        setIsSaving(true);
        const payload = {
            spt_badan_id: sptBadanId,
            asset_type: assetType,
            asset_value: assetValue,
            description: description || null,
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
                route("spt.badan.l12b8.update", editData.id),
                payload,
                afterSave,
            );
        } else {
            router.post(route("spt.badan.l12b8.store"), payload, afterSave);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-lg p-0 overflow-hidden flex flex-col">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        {editData ? "Edit" : "Tambah"} Aktiva Tidak Berwujud
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 p-4">
                    <div className="space-y-1">
                        <Label>
                            Jenis Aktiva <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={assetType}
                            onChange={(e) => setAssetType(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Nilai Investasi (Rp)</Label>
                        <Input
                            value={assetValueDisplay}
                            onChange={(e) => {
                                const n = parseNumber(e.target.value);
                                setAssetValue(n);
                                setAssetValueDisplay(formatRupiahInput(n));
                            }}
                            className="text-right"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Uraian</Label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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

interface SectionL12B8Props {
    data: L12B8Item[];
    sptBadanId: string;
}

export function SectionL12B8({ data, sptBadanId }: SectionL12B8Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L12B8Item | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const confirmDelete = () => {
        const ids = deleteId ? [deleteId] : selectedIds;
        router.delete(route("spt.badan.l12b8.destroy"), {
            data: { ids },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                setIsDeleteConfirmOpen(false);
                setDeleteId(null);
            },
        });
    };

    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const totalValue = data.reduce((s, i) => s + (i.asset_value ?? 0), 0);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    className="bg-blue-950 hover:bg-blue-900"
                    onClick={() => {
                        setEditItem(null);
                        setIsFormOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" /> Tambah
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                        if (!selectedIds.length) return;
                        setDeleteId(null);
                        setIsDeleteConfirmOpen(true);
                    }}
                    disabled={!selectedIds.length}
                >
                    <Trash2 className="w-4 h-4 mr-2" /> Hapus (
                    {selectedIds.length})
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
                                        (selectedIds.length > 0 &&
                                            "indeterminate")
                                    }
                                    onCheckedChange={(c) =>
                                        setSelectedIds(
                                            c
                                                ? data
                                                      .map((i) => i.id!)
                                                      .filter(Boolean)
                                                : [],
                                        )
                                    }
                                />
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center w-10">
                                NO.
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center w-16">
                                Aksi
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center">
                                JENIS AKTIVA
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center">
                                NILAI INVESTASI (Rp)
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center">
                                URAIAN
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center text-muted-foreground h-16"
                                >
                                    Belum ada data.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, idx) => (
                                <TableRow key={item.id ?? idx}>
                                    <TableCell className="border border-gray-200">
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                item.id!,
                                            )}
                                            onCheckedChange={(c) =>
                                                setSelectedIds(
                                                    c
                                                        ? [
                                                              ...selectedIds,
                                                              item.id!,
                                                          ]
                                                        : selectedIds.filter(
                                                              (x) =>
                                                                  x !==
                                                                  item.id!,
                                                          ),
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="border border-gray-200 text-center">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        <div className="flex gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7"
                                                onClick={() => {
                                                    setEditItem(item);
                                                    setIsFormOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-red-500"
                                                onClick={() => {
                                                    setDeleteId(item.id!);
                                                    setIsDeleteConfirmOpen(
                                                        true,
                                                    );
                                                }}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        {item.asset_type}
                                    </TableCell>
                                    <TableCell className="border border-gray-200 text-right">
                                        {formatMoney(item.asset_value)}
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        {item.description ?? "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    {data.length > 0 && (
                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="border border-gray-300 text-right font-semibold"
                                >
                                    JUMLAH
                                </TableCell>
                                <TableCell className="border border-gray-300 text-right font-semibold">
                                    {formatMoney(totalValue)}
                                </TableCell>
                                <TableCell className="border border-gray-300" />
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>
            <FormDialog
                open={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditItem(null);
                }}
                sptBadanId={sptBadanId}
                editData={editItem}
            />
            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false);
                    setDeleteId(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Data"
                description={
                    deleteId
                        ? "Apakah Anda yakin ingin menghapus data ini?"
                        : `Apakah Anda yakin ingin menghapus ${selectedIds.length} data yang dipilih?`
                }
            />
        </div>
    );
}
