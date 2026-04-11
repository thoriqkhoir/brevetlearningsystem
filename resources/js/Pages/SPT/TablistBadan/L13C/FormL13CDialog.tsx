import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
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
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { L13CItem } from "./types";

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

interface FormL13CDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData: L13CItem | null;
}

const emptyForm = (): Omit<L13CItem, "id" | "spt_badan_id"> => ({
    grant_facilities_number: "",
    grant_facilities_date: "",
    utilization_facilities_number: "",
    utilization_facilities_date: "",
    facilities_period: "",
    utilization_year: "",
    pph_reducer_percentage: 0,
    taxable_income: 0,
    pph_payable: 0,
    facilities_amount: 0,
});

export function FormL13CDialog({
    open,
    onClose,
    sptBadanId,
    editData,
}: FormL13CDialogProps) {
    const [form, setForm] = useState(emptyForm());
    const [displays, setDisplays] = useState({
        taxable_income: "",
        pph_payable: "",
        facilities_amount: "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isGrantDateCalendarOpen, setIsGrantDateCalendarOpen] =
        useState(false);
    const [isUtilizationDateCalendarOpen, setIsUtilizationDateCalendarOpen] =
        useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setForm({
                grant_facilities_number: editData.grant_facilities_number ?? "",
                grant_facilities_date: editData.grant_facilities_date
                    ? editData.grant_facilities_date.substring(0, 10)
                    : "",
                utilization_facilities_number:
                    editData.utilization_facilities_number ?? "",
                utilization_facilities_date:
                    editData.utilization_facilities_date
                        ? editData.utilization_facilities_date.substring(0, 10)
                        : "",
                facilities_period: editData.facilities_period ?? "",
                utilization_year: editData.utilization_year ?? "",
                pph_reducer_percentage: editData.pph_reducer_percentage ?? 0,
                taxable_income: editData.taxable_income ?? 0,
                pph_payable: editData.pph_payable ?? 0,
                facilities_amount: editData.facilities_amount ?? 0,
            });
            setDisplays({
                taxable_income: formatRupiahInput(editData.taxable_income ?? 0),
                pph_payable: formatRupiahInput(editData.pph_payable ?? 0),
                facilities_amount: formatRupiahInput(
                    editData.facilities_amount ?? 0,
                ),
            });
        } else {
            setForm(emptyForm());
            setDisplays({
                taxable_income: "",
                pph_payable: "",
                facilities_amount: "",
            });
        }
    }, [open, editData]);

    const setMoney = (key: keyof typeof displays, raw: string) => {
        const n = parseNumber(raw);
        setForm((prev) => ({ ...prev, [key]: n }));
        setDisplays((prev) => ({ ...prev, [key]: formatRupiahInput(n) }));
    };

    const handleSave = () => {
        setIsSaving(true);
        const payload = { spt_badan_id: sptBadanId, ...form };
        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data berhasil disimpan");
                router.reload({
                    only: ["sptBadan"],
                });
                onClose();
            },
            onError: (errors: Record<string, string>) => {
                console.error("L13C save errors:", errors);
                const firstMsg = Object.values(errors)[0];
                toast.error(firstMsg ?? "Gagal menyimpan data");
            },
            onFinish: () => setIsSaving(false),
        };
        if (editData?.id) {
            router.put(
                route("spt.badan.l13c.update", editData.id),
                payload,
                opts,
            );
        } else {
            router.post(route("spt.badan.l13c.store"), payload, opts);
        }
    };

    const field = (
        label: string,
        key: keyof Omit<L13CItem, "id" | "spt_badan_id">,
        opts?: { type?: string; placeholder?: string },
    ) => (
        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
            <Label className="text-sm font-normal">{label}</Label>
            <Input
                type={opts?.type ?? "text"}
                placeholder={opts?.placeholder}
                value={(form[key] as string) ?? ""}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
            />
        </div>
    );

    const dateField = (
        label: string,
        key: "grant_facilities_date" | "utilization_facilities_date",
        calendarOpen: boolean,
        setCalendarOpen: (open: boolean) => void,
    ) => (
        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
            <Label className="text-sm font-normal">{label}</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className={cn(
                            "w-full justify-between pl-3 text-left font-normal",
                            !form[key] && "text-muted-foreground",
                        )}
                    >
                        {form[key] ? (
                            format(new Date(form[key]), "yyyy-MM-dd")
                        ) : (
                            <span>Pilih tanggal</span>
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
                        selected={form[key] ? new Date(form[key]) : undefined}
                        onSelect={(date) => {
                            setForm((prev) => ({
                                ...prev,
                                [key]: date ? format(date, "yyyy-MM-dd") : "",
                            }));
                            setCalendarOpen(false);
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );

    const moneyField = (label: string, key: keyof typeof displays) => (
        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
            <Label className="text-sm font-normal">{label}</Label>
            <div className="flex">
                <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                    Rp.
                </span>
                <Input
                    value={displays[key]}
                    onChange={(e) => setMoney(key, e.target.value)}
                    className="rounded-l-none text-right"
                />
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle className="text-lg font-semibold">
                        {editData ? "UBAH" : "TAMBAH"}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Keputusan Pemberian Fasilitas */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Keputusan atau Pemberitahuan Pemberian Fasilitas
                    </p>
                    {field("Nomor", "grant_facilities_number")}
                    {dateField(
                        "Tanggal",
                        "grant_facilities_date",
                        isGrantDateCalendarOpen,
                        setIsGrantDateCalendarOpen,
                    )}

                    {/* Keputusan Pemanfaatan Fasilitas */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Keputusan Pemanfaatan Fasilitas
                    </p>
                    {field("Nomor", "utilization_facilities_number")}
                    {dateField(
                        "Tanggal",
                        "utilization_facilities_date",
                        isUtilizationDateCalendarOpen,
                        setIsUtilizationDateCalendarOpen,
                    )}

                    {field("Periode Fasilitas", "facilities_period")}
                    {field("Tahun Pemanfaatan", "utilization_year")}
                    {/* Persentase */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Persentase Pengurangan PPh
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                step="0.01"
                                min={0}
                                max={100}
                                value={form.pph_reducer_percentage ?? 0}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        pph_reducer_percentage:
                                            parseFloat(e.target.value) || 0,
                                    }))
                                }
                                className="text-right"
                            />
                            <span className="text-sm">%</span>
                        </div>
                    </div>

                    {/* Fasilitas Pengurangan PPh */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Fasilitas Pengurangan PPh Badan
                    </p>
                    {moneyField("Penghasilan Kena Pajak", "taxable_income")}
                    {moneyField("PPh Terutang", "pph_payable")}
                    {moneyField("Jumlah Fasilitas", "facilities_amount")}
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
