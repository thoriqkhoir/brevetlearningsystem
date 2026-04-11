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
import type { L12B5Item } from "./types";

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
    editData: L12B5Item | null;
}

function FormDialog({ open, onClose, sptBadanId, editData }: FormDialogProps) {
    const [name, setName] = useState("");
    const [npwp, setNpwp] = useState("");
    const [address, setAddress] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [deedNumber, setDeedNumber] = useState("");
    const [deedDate, setDeedDate] = useState("");
    const [deedNotary, setDeedNotary] = useState("");
    const [investmentValue, setInvestmentValue] = useState(0);
    const [investmentValueDisplay, setInvestmentValueDisplay] = useState("0");
    const [activePeriod, setActivePeriod] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isDeedDateCalendarOpen, setIsDeedDateCalendarOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setName(editData.name ?? "");
            setNpwp(editData.npwp ?? "");
            setAddress(editData.address ?? "");
            setBusinessType(editData.business_type ?? "");
            setDeedNumber(editData.deed_incorporation_number ?? "");
            setDeedDate(
                editData.deed_incorporation_date
                    ? editData.deed_incorporation_date.substring(0, 10)
                    : "",
            );
            setDeedNotary(editData.deed_incorporation_notary ?? "");
            setInvestmentValue(editData.investment_value ?? 0);
            setInvestmentValueDisplay(
                formatRupiahInput(editData.investment_value ?? 0),
            );
            setActivePeriod(editData.active_period ?? "");
        } else {
            setName("");
            setNpwp("");
            setAddress("");
            setBusinessType("");
            setDeedNumber("");
            setDeedDate("");
            setDeedNotary("");
            setInvestmentValue(0);
            setInvestmentValueDisplay("0");
            setActivePeriod("");
        }
    }, [open, editData]);

    const handleSave = () => {
        if (!name.trim()) {
            toast.error("Nama Perusahaan wajib diisi");
            return;
        }
        if (!npwp.trim()) {
            toast.error("NPWP wajib diisi");
            return;
        }
        setIsSaving(true);
        const payload = {
            spt_badan_id: sptBadanId,
            name,
            npwp,
            address: address || null,
            business_type: businessType || null,
            deed_incorporation_number: deedNumber || null,
            deed_incorporation_date: deedDate || null,
            deed_incorporation_notary: deedNotary || null,
            investment_value: investmentValue,
            active_period: activePeriod || null,
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
                route("spt.badan.l12b5.update", editData.id),
                payload,
                afterSave,
            );
        } else {
            router.post(route("spt.badan.l12b5.store"), payload, afterSave);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle className="text-lg font-semibold">
                        {editData ? "UBAH" : "TAMBAH"}
                    </DialogTitle>
                </DialogHeader>
                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Nama Perusahaan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Nama Perusahaan <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* NPWP */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            NPWP <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={npwp}
                            onChange={(e) => setNpwp(e.target.value)}
                            placeholder="00.000.000.0-000.000"
                        />
                    </div>

                    {/* Alamat */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Alamat</Label>
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    {/* Jenis Usaha */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Jenis Usaha</Label>
                        <Input
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                        />
                    </div>

                    {/* AKTA PENDIRIAN */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Akta Pendirian
                    </p>

                    {/* Nomor */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Nomor</Label>
                        <Input
                            value={deedNumber}
                            onChange={(e) => setDeedNumber(e.target.value)}
                        />
                    </div>

                    {/* Tanggal */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Tanggal</Label>
                        <Popover
                            open={isDeedDateCalendarOpen}
                            onOpenChange={setIsDeedDateCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between pl-3 text-left font-normal",
                                        !deedDate && "text-muted-foreground",
                                    )}
                                >
                                    {deedDate ? (
                                        format(new Date(deedDate), "yyyy-MM-dd")
                                    ) : (
                                        <span>Pilih Tanggal</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                portalled={false}
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={
                                        deedDate ? new Date(deedDate) : undefined
                                    }
                                    onSelect={(date) => {
                                        setDeedDate(
                                            date ? format(date, "yyyy-MM-dd") : "",
                                        );
                                        setIsDeedDateCalendarOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Notaris */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Notaris</Label>
                        <Input
                            value={deedNotary}
                            onChange={(e) => setDeedNotary(e.target.value)}
                        />
                    </div>

                    {/* Nilai Investasi */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Nilai Investasi
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={investmentValueDisplay}
                                onChange={(e) => {
                                    const n = parseNumber(e.target.value);
                                    setInvestmentValue(n);
                                    setInvestmentValueDisplay(
                                        formatRupiahInput(n),
                                    );
                                }}
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* Masa Aktif */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Masa Perusahaan Mulai Aktif / Berproduksi / Komersial
                        </Label>
                        <Input
                            value={activePeriod}
                            onChange={(e) => setActivePeriod(e.target.value)}
                            placeholder="YYYY"
                        />
                    </div>
                </div>
                <DialogFooter className="border-t p-4 gap-2 flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Tutup
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

interface SectionL12B5Props {
    data: L12B5Item[];
    sptBadanId: string;
}

export function SectionL12B5({ data, sptBadanId }: SectionL12B5Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<L12B5Item | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const confirmDelete = () => {
        const ids = deleteId ? [deleteId] : selectedIds;
        router.delete(route("spt.badan.l12b5.destroy"), {
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
    const totalInvestment = data.reduce(
        (s, i) => s + (i.investment_value ?? 0),
        0,
    );

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
                <Table className="min-w-[1200px] text-xs">
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
                                NAMA PERUSAHAAN
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                rowSpan={2}
                            >
                                NPWP
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                rowSpan={2}
                            >
                                ALAMAT
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                rowSpan={2}
                            >
                                JENIS USAHA
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                colSpan={3}
                            >
                                AKTA PENDIRIAN
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                rowSpan={2}
                            >
                                NILAI INVESTASI (Rp)
                            </TableHead>
                            <TableHead
                                className="border border-gray-300 text-center"
                                rowSpan={2}
                            >
                                MASA AKTIF
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
                                NOTARIS
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={12}
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
                                        {item.name}
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        {item.npwp}
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        {item.address ?? "-"}
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        {item.business_type ?? "-"}
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        {item.deed_incorporation_number ?? "-"}
                                    </TableCell>
                                    <TableCell className="border border-gray-200 text-center">
                                        {formatDate(
                                            item.deed_incorporation_date,
                                        )}
                                    </TableCell>
                                    <TableCell className="border border-gray-200">
                                        {item.deed_incorporation_notary ?? "-"}
                                    </TableCell>
                                    <TableCell className="border border-gray-200 text-right">
                                        {formatMoney(item.investment_value)}
                                    </TableCell>
                                    <TableCell className="border border-gray-200 text-center">
                                        {item.active_period ?? "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    {data.length > 0 && (
                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    colSpan={11}
                                    className="border border-gray-300 text-right font-semibold"
                                >
                                    JUMLAH
                                </TableCell>
                                <TableCell className="border border-gray-300 text-right font-semibold">
                                    {formatMoney(totalInvestment)}
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
