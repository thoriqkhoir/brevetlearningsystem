import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { CalendarIcon, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { L12B7Item } from "./types";

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
const formatDate = (v: string | null | undefined) => {
    if (!v) return "-";
    return new Date(v).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

interface FormDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData: L12B7Item | null;
}

function FormDialog({ open, onClose, sptBadanId, editData }: FormDialogProps) {
    const [fixedAssetType, setFixedAssetType] = useState("");
    const [fixedAssetLocation, setFixedAssetLocation] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [fixedAssetValue, setFixedAssetValue] = useState(0);
    const [fixedAssetValueDisplay, setFixedAssetValueDisplay] = useState("0");
    const [fixedAssetNumber, setFixedAssetNumber] = useState("");
    const [fixedAssetDate, setFixedAssetDate] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [documentDate, setDocumentDate] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isFixedAssetDateCalendarOpen, setIsFixedAssetDateCalendarOpen] =
        useState(false);
    const [isDocumentDateCalendarOpen, setIsDocumentDateCalendarOpen] =
        useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setFixedAssetType(editData.fixed_asset_type ?? "");
            setFixedAssetLocation(editData.fixed_asset_location ?? "");
            setQuantity(editData.quantity ?? 0);
            setFixedAssetValue(editData.fixed_asset_value ?? 0);
            setFixedAssetValueDisplay(
                formatRupiahInput(editData.fixed_asset_value ?? 0),
            );
            setFixedAssetNumber(editData.fixed_asset_number ?? "");
            setFixedAssetDate(
                editData.fixed_asset_date
                    ? editData.fixed_asset_date.substring(0, 10)
                    : "",
            );
            setDocumentNumber(editData.document_number ?? "");
            setDocumentDate(
                editData.document_date
                    ? editData.document_date.substring(0, 10)
                    : "",
            );
        } else {
            setFixedAssetType("");
            setFixedAssetLocation("");
            setQuantity(0);
            setFixedAssetValue(0);
            setFixedAssetValueDisplay("0");
            setFixedAssetNumber("");
            setFixedAssetDate("");
            setDocumentNumber("");
            setDocumentDate("");
        }
    }, [open, editData]);

    const handleSave = () => {
        if (!fixedAssetType.trim()) {
            toast.error("Jenis Aktiva Tetap wajib diisi");
            return;
        }
        if (!fixedAssetLocation.trim()) {
            toast.error("Lokasi Aktiva Tetap wajib diisi");
            return;
        }
        setIsSaving(true);
        const payload = {
            spt_badan_id: sptBadanId,
            fixed_asset_type: fixedAssetType,
            fixed_asset_location: fixedAssetLocation,
            quantity,
            fixed_asset_value: fixedAssetValue,
            fixed_asset_number: fixedAssetNumber || null,
            fixed_asset_date: fixedAssetDate || null,
            document_number: documentNumber || null,
            document_date: documentDate || null,
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
                route("spt.badan.l12b7.update", editData.id),
                payload,
                afterSave,
            );
        } else {
            router.post(route("spt.badan.l12b7.store"), payload, afterSave);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle className="text-lg font-semibold">
                        {editData ? "Edit" : "Tambah"} Aktiva Tetap
                    </DialogTitle>
                </DialogHeader>
                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Jenis Aktiva Tetap */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Jenis Aktiva Tetap <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={fixedAssetType}
                            onChange={(e) => setFixedAssetType(e.target.value)}
                        />
                    </div>

                    {/* Lokasi Aktiva Tetap */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Lokasi Aktiva Tetap <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={fixedAssetLocation}
                            onChange={(e) => setFixedAssetLocation(e.target.value)}
                        />
                    </div>

                    {/* Kuantitas */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Kuantitas</Label>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="text-right"
                            min={0}
                        />
                    </div>

                    {/* Nilai Aktiva Tetap */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Nilai Aktiva Tetap (Rp)</Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={fixedAssetValueDisplay}
                                onChange={(e) => {
                                    const n = parseNumber(e.target.value);
                                    setFixedAssetValue(n);
                                    setFixedAssetValueDisplay(formatRupiahInput(n));
                                }}
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* Section: Bukti Kepemilikan */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">
                        Bukti Kepemilikan Aktiva Tetap
                    </p>

                    {/* Nomor Bukti Kepemilikan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Nomor</Label>
                        <Input
                            value={fixedAssetNumber}
                            onChange={(e) => setFixedAssetNumber(e.target.value)}
                        />
                    </div>

                    {/* Tanggal Bukti Kepemilikan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Tanggal</Label>
                        <Popover
                            open={isFixedAssetDateCalendarOpen}
                            onOpenChange={setIsFixedAssetDateCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between pl-3 text-left font-normal",
                                        !fixedAssetDate && "text-muted-foreground",
                                    )}
                                >
                                    {fixedAssetDate ? (
                                        format(new Date(fixedAssetDate), "yyyy-MM-dd")
                                    ) : (
                                        <span>Pilih Tanggal</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent portalled={false} className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={fixedAssetDate ? new Date(fixedAssetDate) : undefined}
                                    onSelect={(date) => {
                                        setFixedAssetDate(date ? format(date, "yyyy-MM-dd") : "");
                                        setIsFixedAssetDateCalendarOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Section: Akta/Dokumen Pembelian */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-2">
                        Akta/Dokumen Pembelian
                    </p>

                    {/* Nomor Dokumen */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Nomor</Label>
                        <Input
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                        />
                    </div>

                    {/* Tanggal Dokumen */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Tanggal</Label>
                        <Popover
                            open={isDocumentDateCalendarOpen}
                            onOpenChange={setIsDocumentDateCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between pl-3 text-left font-normal",
                                        !documentDate && "text-muted-foreground",
                                    )}
                                >
                                    {documentDate ? (
                                        format(new Date(documentDate), "yyyy-MM-dd")
                                    ) : (
                                        <span>Pilih Tanggal</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent portalled={false} className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={documentDate ? new Date(documentDate) : undefined}
                                    onSelect={(date) => {
                                        setDocumentDate(date ? format(date, "yyyy-MM-dd") : "");
                                        setIsDocumentDateCalendarOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter className="border-t p-4 gap-2 flex justify-end">
                    <Button type="button" variant="outline" onClick={onClose} className="gap-2">
                        <X className="w-4 h-4" />
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-950 hover:bg-blue-900 gap-2"
                    >
                        <span>💾</span>
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface SectionL12B7Props {
    data: L12B7Item[];
    sptBadanId: string;
}

export function SectionL12B7({ data, sptBadanId }: SectionL12B7Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L12B7Item | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const confirmDelete = () => {
        const ids = deleteId ? [deleteId] : selectedIds;
        router.delete(route("spt.badan.l12b7.destroy"), {
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
    const totalQty = data.reduce((s, i) => s + (i.quantity ?? 0), 0);
    const totalValue = data.reduce((s, i) => s + (i.fixed_asset_value ?? 0), 0);

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
                <Table className="min-w-[1100px] text-xs">
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead
                                className="border border-gray-300 w-10"
                                rowSpan={2}
                            >
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
                            <TableHead
                                className="border border-gray-300 text-center w-10"
                                rowSpan={2}
                            >
                                NO.
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center w-16"
                                rowSpan={2}
                            >
                                Aksi
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                rowSpan={2}
                            >
                                JENIS AKTIVA TETAP
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                rowSpan={2}
                            >
                                LOKASI AKTIVA TETAP
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                rowSpan={2}
                            >
                                KUANTITAS
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                rowSpan={2}
                            >
                                NILAI AKTIVA TETAP (Rp)
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                colSpan={2}
                            >
                                BUKTI KEPEMILIKAN AKTIVA TETAP
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                colSpan={2}
                            >
                                AKTA/DOKUMEN PEMBELIAN
                            </TableHead>
                        </TableRow>
                        <TableRow className="bg-gray-100">
                            <TableHead className="border border-gray-300 text-center">
                                NOMOR
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center">
                                TANGGAL
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center">
                                NOMOR
                            </TableHead>
                            <TableHead className="border border-gray-300 text-center">
                                TANGGAL
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={11}
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
                                        {item.fixed_asset_type}
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        {item.fixed_asset_location}
                                    </TableCell>
                                    <TableCell className="border border-gray-200 text-center">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="border border-gray-200 text-right">
                                        {formatMoney(item.fixed_asset_value)}
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        {item.fixed_asset_number ?? "-"}
                                    </TableCell>
                                    <TableCell className="border border-gray-200 text-center">
                                        {formatDate(item.fixed_asset_date)}
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        {item.document_number ?? "-"}
                                    </TableCell>
                                    <TableCell className="border border-gray-200 text-center">
                                        {formatDate(item.document_date)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    {data.length > 0 && (
                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="border border-gray-300 text-right font-semibold"
                                >
                                    JUMLAH
                                </TableCell>
                                <TableCell className="border border-gray-300 text-right font-semibold">
                                    {totalQty}
                                </TableCell>
                                <TableCell className="border border-gray-300 text-right font-semibold">
                                    {formatMoney(totalValue)}
                                </TableCell>
                                <TableCell
                                    className="border border-gray-300"
                                    colSpan={4}
                                />
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
