import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { L11B2BItem } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
const formatRupiahInput = (v: number) =>
    rupiahFormatter
        .format(v ?? 0)
        .replace("Rp", "")
        .trim();
const parseNumber = (raw: string) => {
    const n = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
type MonthKey = `month_balance_${(typeof MONTHS)[number]}`;

interface FormL11B2BDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData: L11B2BItem | null;
}

type MonthDisplays = Record<MonthKey, string>;

const defaultMonths = (): MonthDisplays =>
    Object.fromEntries(
        MONTHS.map((m) => [`month_balance_${m}`, "0"]),
    ) as MonthDisplays;

export function FormL11B2BDialog({
    open,
    onClose,
    sptBadanId,
    editData,
}: FormL11B2BDialogProps) {
    const [cost_breakdown, setCostBreakdown] = useState("");
    const [months, setMonths] = useState<Record<MonthKey, number>>(
        Object.fromEntries(
            MONTHS.map((m) => [`month_balance_${m}`, 0]),
        ) as Record<MonthKey, number>,
    );
    const [displays, setDisplays] = useState<MonthDisplays>(defaultMonths());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setCostBreakdown(editData.cost_breakdown);
            const m: Record<MonthKey, number> = {} as any;
            const d: MonthDisplays = {} as any;
            MONTHS.forEach((n) => {
                const key = `month_balance_${n}` as MonthKey;
                const val = Number((editData as any)[key] ?? 0);
                m[key] = val;
                d[key] = formatRupiahInput(val);
            });
            setMonths(m);
            setDisplays(d);
        } else {
            setCostBreakdown("");
            setMonths(
                Object.fromEntries(
                    MONTHS.map((m) => [`month_balance_${m}`, 0]),
                ) as any,
            );
            setDisplays(defaultMonths());
        }
    }, [open, editData]);

    const handleMonthChange =
        (key: MonthKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const num = parseNumber(e.target.value);
            setMonths((prev) => ({ ...prev, [key]: num }));
            setDisplays((prev) => ({ ...prev, [key]: formatRupiahInput(num) }));
        };

    const avgBalance = Math.round(
        MONTHS.reduce((s, m) => s + (months[`month_balance_${m}`] ?? 0), 0) /
            12,
    );

    const handleSave = () => {
        if (!cost_breakdown.trim()) {
            toast.error("Rincian Modal wajib diisi");
            return;
        }
        setIsSaving(true);
        const payload = {
            spt_badan_id: sptBadanId,
            cost_breakdown,
            ...months,
            average_balance: avgBalance,
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
                route("spt.badan.l11b2b.update", editData.id),
                payload,
                afterSave,
            );
        } else {
            router.post(route("spt.badan.l11b2b.store"), payload, afterSave);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        {editData ? "Edit" : "Tambah"} Rincian Modal
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto min-h-0 space-y-4 p-4">
                    <div className="space-y-1">
                        <Label>
                            Rincian Modal{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={cost_breakdown}
                            onChange={(e) => setCostBreakdown(e.target.value)}
                            placeholder="Contoh: Modal Saham, Pinjaman Tanpa Bunga dari ..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">
                            Saldo Modal Tiap Akhir Bulan (Rp)
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {MONTHS.map((m) => {
                                const key = `month_balance_${m}` as MonthKey;
                                return (
                                    <div key={key} className="space-y-1">
                                        <Label className="text-xs">
                                            Bulan ke-{m}
                                        </Label>
                                        <Input
                                            value={displays[key]}
                                            onChange={handleMonthChange(key)}
                                            className="text-right text-sm"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-sm font-semibold">
                                Rata-rata (auto)
                            </Label>
                            <Input
                                value={formatRupiahInput(avgBalance)}
                                readOnly
                                className="bg-gray-100 text-right"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="border-t p-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button
                        className="bg-blue-950 hover:bg-blue-900"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FormL11B2BDialog;
