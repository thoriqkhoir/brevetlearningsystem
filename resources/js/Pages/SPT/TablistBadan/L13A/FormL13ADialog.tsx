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
import type { L13AItem } from "./types";

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

interface FormL13ADialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData: L13AItem | null;
}

const emptyForm = (): Omit<L13AItem, "id" | "spt_badan_id"> => ({
    decision_grant_facilities_number: "",
    decision_grant_facilities_date: "",
    decision_utilization_facilities_number: "",
    decision_utilization_facilities_date: "",
    amount_capital_naming_in_foreign: 0,
    amount_capital_naming_equivalen: 0,
    amount_capital_naming_in_rupiah: 0,
    amount_capital_naming_total: 0,
    capital_naming: "",
    field: "",
    facilities: "",
    reduce_net_income_persentage: 0,
    additional_period: "",
    realization_capital_naming_acumulation: 0,
    realization_capital_naming_start_production: "",
    start_comercial_production: "",
    reducer_net_income_year: "",
    reducer_net_income_amount: 0,
});

export function FormL13ADialog({
    open,
    onClose,
    sptBadanId,
    editData,
}: FormL13ADialogProps) {
    const [form, setForm] = useState(emptyForm());
    const [displays, setDisplays] = useState({
        amount_capital_naming_in_foreign: "",
        amount_capital_naming_equivalen: "",
        amount_capital_naming_in_rupiah: "",
        amount_capital_naming_total: "",
        realization_capital_naming_acumulation: "",
        reducer_net_income_amount: "",
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
                decision_grant_facilities_number:
                    editData.decision_grant_facilities_number ?? "",
                decision_grant_facilities_date:
                    editData.decision_grant_facilities_date
                        ? editData.decision_grant_facilities_date.substring(
                              0,
                              10,
                          )
                        : "",
                decision_utilization_facilities_number:
                    editData.decision_utilization_facilities_number ?? "",
                decision_utilization_facilities_date:
                    editData.decision_utilization_facilities_date
                        ? editData.decision_utilization_facilities_date.substring(
                              0,
                              10,
                          )
                        : "",
                amount_capital_naming_in_foreign:
                    editData.amount_capital_naming_in_foreign ?? 0,
                amount_capital_naming_equivalen:
                    editData.amount_capital_naming_equivalen ?? 0,
                amount_capital_naming_in_rupiah:
                    editData.amount_capital_naming_in_rupiah ?? 0,
                amount_capital_naming_total:
                    editData.amount_capital_naming_total ?? 0,
                capital_naming: editData.capital_naming ?? "",
                field: editData.field ?? "",
                facilities: editData.facilities ?? "",
                reduce_net_income_persentage:
                    editData.reduce_net_income_persentage ?? 0,
                additional_period: editData.additional_period ?? "",
                realization_capital_naming_acumulation:
                    editData.realization_capital_naming_acumulation ?? 0,
                realization_capital_naming_start_production:
                    editData.realization_capital_naming_start_production ?? "",
                start_comercial_production:
                    editData.start_comercial_production ?? "",
                reducer_net_income_year: editData.reducer_net_income_year ?? "",
                reducer_net_income_amount:
                    editData.reducer_net_income_amount ?? 0,
            });
            setDisplays({
                amount_capital_naming_in_foreign: formatRupiahInput(
                    editData.amount_capital_naming_in_foreign ?? 0,
                ),
                amount_capital_naming_equivalen: formatRupiahInput(
                    editData.amount_capital_naming_equivalen ?? 0,
                ),
                amount_capital_naming_in_rupiah: formatRupiahInput(
                    editData.amount_capital_naming_in_rupiah ?? 0,
                ),
                amount_capital_naming_total: formatRupiahInput(
                    editData.amount_capital_naming_total ?? 0,
                ),
                realization_capital_naming_acumulation: formatRupiahInput(
                    editData.realization_capital_naming_acumulation ?? 0,
                ),
                reducer_net_income_amount: formatRupiahInput(
                    editData.reducer_net_income_amount ?? 0,
                ),
            });
        } else {
            setForm(emptyForm());
            setDisplays({
                amount_capital_naming_in_foreign: "",
                amount_capital_naming_equivalen: "",
                amount_capital_naming_in_rupiah: "",
                amount_capital_naming_total: "",
                realization_capital_naming_acumulation: "",
                reducer_net_income_amount: "",
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
                console.error("L13A save errors:", errors);
                const firstMsg = Object.values(errors)[0];
                toast.error(firstMsg ?? "Gagal menyimpan data");
            },
            onFinish: () => setIsSaving(false),
        };
        if (editData?.id) {
            router.put(
                route("spt.badan.l13a.update", editData.id),
                payload,
                opts,
            );
        } else {
            router.post(route("spt.badan.l13a.store"), payload, opts);
        }
    };

    const field = (
        label: string,
        key: keyof Omit<L13AItem, "id" | "spt_badan_id">,
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
        key:
            | "decision_grant_facilities_date"
            | "decision_utilization_facilities_date",
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
                        Keputusan / Pemberitahuan Pemberian Fasilitas
                    </p>
                    {field("Nomor", "decision_grant_facilities_number")}
                    {dateField(
                        "Tanggal",
                        "decision_grant_facilities_date",
                        isGrantDateCalendarOpen,
                        setIsGrantDateCalendarOpen,
                    )}

                    {/* Keputusan Pemanfaatan Fasilitas */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Keputusan Pemanfaatan Fasilitas
                    </p>
                    {field("Nomor", "decision_utilization_facilities_number")}
                    {dateField(
                        "Tanggal",
                        "decision_utilization_facilities_date",
                        isUtilizationDateCalendarOpen,
                        setIsUtilizationDateCalendarOpen,
                    )}

                    {/* Jumlah Penanaman Modal */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Jumlah Penanaman Modal yang Disetujui
                    </p>
                    {moneyField(
                        "Dalam Mata Uang Asing",
                        "amount_capital_naming_in_foreign",
                    )}
                    {moneyField("Ekuivalen", "amount_capital_naming_equivalen")}
                    {moneyField(
                        "Dalam Rupiah",
                        "amount_capital_naming_in_rupiah",
                    )}
                    {moneyField(
                        "Jumlah / Total",
                        "amount_capital_naming_total",
                    )}

                    {field("Bentuk Penanaman Modal", "capital_naming")}
                    {field("Di Bidang Dan/Atau Daerah", "field")}
                    {field("Fasilitas yang Diberikan", "facilities")}

                    {/* Persentase */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Persentase Pengurangan Penghasilan Neto
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                step="0.01"
                                min={0}
                                max={100}
                                value={form.reduce_net_income_persentage ?? 0}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        reduce_net_income_persentage:
                                            parseFloat(e.target.value) || 0,
                                    }))
                                }
                                className="text-right"
                            />
                            <span className="text-sm">%</span>
                        </div>
                    </div>

                    {field(
                        "Penambahan Jangka Waktu Kompensasi Kerugian",
                        "additional_period",
                    )}

                    {/* Realisasi Penanaman Modal */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Realisasi Penanaman Modal
                    </p>
                    {moneyField(
                        "Akumulasi S.D. Tahun Ini",
                        "realization_capital_naming_acumulation",
                    )}
                    {field(
                        "Pada Saat Mulai Berproduksi Komersial",
                        "realization_capital_naming_start_production",
                    )}
                    {field(
                        "Saat Mulai Berproduksi Komersial",
                        "start_comercial_production",
                    )}

                    {/* Fasilitas Pengurangan Penghasilan Neto */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Fasilitas Pengurangan Penghasilan Neto
                    </p>
                    {field("Tahun ke-", "reducer_net_income_year")}
                    {moneyField("Jumlah (Rp)", "reducer_net_income_amount")}
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
