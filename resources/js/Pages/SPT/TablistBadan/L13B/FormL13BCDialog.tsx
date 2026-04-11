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
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { L13BCItem } from "./types";

interface FormL13BCDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData: L13BCItem | null;
}

const fmt = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
const formatRupiahInput = (v: number) =>
    fmt.format(v ?? 0).replace("Rp", "").trim();
const parseNumber = (raw: string) => {
    const n = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

const emptyForm = () => ({
    proposal_number: "",
    expenses_start_period: "",
    expenses_end_period: "",
    total_cost: 0,
    year_acquisition: "",
    facilities_percentage: 0,
    additional_gross_income: 0,
});

type FormState = ReturnType<typeof emptyForm>;

export function FormL13BCDialog({
    open,
    onClose,
    sptBadanId,
    editData,
}: FormL13BCDialogProps) {
    const [form, setForm] = useState<FormState>(emptyForm());
    const [totalCostDisplay, setTotalCostDisplay] = useState("0");
    const [additionalGrossDisplay, setAdditionalGrossDisplay] = useState("0");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setForm({
                proposal_number: editData.proposal_number ?? "",
                expenses_start_period: editData.expenses_start_period ?? "",
                expenses_end_period: editData.expenses_end_period ?? "",
                total_cost: editData.total_cost ?? 0,
                year_acquisition: editData.year_acquisition ?? "",
                facilities_percentage: editData.facilities_percentage ?? 0,
                additional_gross_income: Number(editData.additional_gross_income ?? 0),
            });
            setTotalCostDisplay(formatRupiahInput(editData.total_cost ?? 0));
            setAdditionalGrossDisplay(
                formatRupiahInput(Number(editData.additional_gross_income ?? 0)),
            );
        } else {
            setForm(emptyForm());
            setTotalCostDisplay("0");
            setAdditionalGrossDisplay("0");
        }
    }, [open, editData]);

    const set = (key: keyof FormState, value: string | number) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const makeMoneyHandler =
        (
            key: keyof FormState,
            setDisplay: React.Dispatch<React.SetStateAction<string>>,
        ) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const n = parseNumber(e.target.value);
            setForm((prev) => ({ ...prev, [key]: n }));
            setDisplay(formatRupiahInput(n));
        };

    const handleSave = () => {
        setIsSaving(true);
        const payload = { spt_badan_id: sptBadanId, ...form };
        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data berhasil disimpan");
                onClose();
            },
            onError: (errors: Record<string, string>) => {
                const firstMsg = Object.values(errors)[0];
                toast.error(firstMsg ?? "Gagal menyimpan data");
            },
            onFinish: () => setIsSaving(false),
        };
        if (editData?.id) {
            router.put(
                route("spt.badan.l13bc.update", editData.id),
                payload,
                opts,
            );
        } else {
            router.post(route("spt.badan.l13bc.store"), payload, opts);
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
                    {/* Nomor Proposal */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Nomor Proposal</Label>
                        <Input
                            value={form.proposal_number}
                            onChange={(e) => set("proposal_number", e.target.value)}
                            placeholder="Nomor proposal"
                        />
                    </div>

                    {/* Dari Tahun */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Dari Tahun </Label>
                        <Input
                            value={form.expenses_start_period}
                            onChange={(e) => set("expenses_start_period", e.target.value)}
                            placeholder="cth: 2023"
                        />
                    </div>

                    {/* Sampai Tahun */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Sampai Tahun</Label>
                        <Input
                            value={form.expenses_end_period}
                            onChange={(e) => set("expenses_end_period", e.target.value)}
                            placeholder="cth: 2025"
                        />
                    </div>

                    {/* Jumlah Biaya */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Jumlah Biaya </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={totalCostDisplay}
                                onChange={makeMoneyHandler("total_cost", setTotalCostDisplay)}
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* Tahun Perolehan HAKI */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Tahun Perolehan HAKI/Komersialisasi
                        </Label>
                        <Input
                            value={form.year_acquisition}
                            onChange={(e) => set("year_acquisition", e.target.value)}
                            placeholder="cth: 2024"
                        />
                    </div>

                    {/* Persentase Fasilitas */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Persentase Fasilitas</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                value={form.facilities_percentage}
                                onChange={(e) =>
                                    set("facilities_percentage", parseFloat(e.target.value) || 0)
                                }
                                className="text-right"
                            />
                            <span className="text-sm">%</span>
                        </div>
                    </div>

                    {/* Tambahan Pengurangan Penghasilan Bruto */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Tambahan Pengurangan Penghasilan Bruto Penelitian dan Pengembangan
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={additionalGrossDisplay}
                                onChange={makeMoneyHandler(
                                    "additional_gross_income",
                                    setAdditionalGrossDisplay,
                                )}
                                className="rounded-l-none text-right"
                            />
                        </div>
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
                        className="bg-blue-950 hover:bg-blue-900 gap-2"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <span>💾</span>
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
