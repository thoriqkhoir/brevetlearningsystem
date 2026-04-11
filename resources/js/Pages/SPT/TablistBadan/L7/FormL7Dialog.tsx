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
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L7Item } from "./types";

interface FormL7DialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L7Item | null;
    onSuccess?: () => void;
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const formatRupiahInput = (value: number) =>
    rupiahFormatter.format(value).replace("Rp", "").trim();

const parseNumber = (raw: string) => {
    const numeric = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
};

type FormData = Omit<L7Item, "id" | "spt_badan_id">;

const defaultFormData: FormData = {
    tax_year_part: null,
    amount: 0,
    fourth_year: 0,
    third_year: 0,
    second_year: 0,
    first_year: 0,
    year_now: 0,
    current_tax_year: 0,
};

const RUPIAH_FIELDS = [
    "amount",
    "fourth_year",
    "third_year",
    "second_year",
    "first_year",
    "year_now",
    "current_tax_year",
] as const;
type RupiahField = (typeof RUPIAH_FIELDS)[number];

export function FormL7Dialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL7DialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [displays, setDisplays] = useState<Record<RupiahField, string>>({
        amount: "0",
        fourth_year: "0",
        third_year: "0",
        second_year: "0",
        first_year: "0",
        year_now: "0",
        current_tax_year: "0",
    });

    useEffect(() => {
        if (editData) {
            const next: FormData = {
                tax_year_part: editData.tax_year_part,
                amount: Number(editData.amount ?? 0),
                fourth_year: Number(editData.fourth_year ?? 0),
                third_year: Number(editData.third_year ?? 0),
                second_year: Number(editData.second_year ?? 0),
                first_year: Number(editData.first_year ?? 0),
                year_now: Number(editData.year_now ?? 0),
                current_tax_year: Number(editData.current_tax_year ?? 0),
            };
            setFormData(next);
            setDisplays({
                amount: formatRupiahInput(next.amount),
                fourth_year: formatRupiahInput(next.fourth_year),
                third_year: formatRupiahInput(next.third_year),
                second_year: formatRupiahInput(next.second_year),
                first_year: formatRupiahInput(next.first_year),
                year_now: formatRupiahInput(next.year_now),
                current_tax_year: formatRupiahInput(next.current_tax_year),
            });
        } else {
            setFormData(defaultFormData);
            setDisplays({
                amount: "0",
                fourth_year: "0",
                third_year: "0",
                second_year: "0",
                first_year: "0",
                year_now: "0",
                current_tax_year: "0",
            });
        }
        setErrors({});
    }, [editData, open]);

    const handleRupiahChange =
        (field: RupiahField) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const numeric = parseNumber(e.target.value);
            setFormData((prev) => ({ ...prev, [field]: numeric }));
            setDisplays((prev) => ({
                ...prev,
                [field]: formatRupiahInput(numeric),
            }));
        };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.tax_year_part)
            newErrors.tax_year_part = "Tahun bagian pajak wajib diisi";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        setIsSubmitting(true);

        const payload = {
            ...formData,
            id: editData?.id || uuidv4(),
            spt_badan_id: sptBadanId,
        };

        if (editData?.id) {
            router.put(
                route("spt.badan.l7.update", { id: editData.id }),
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsSubmitting(false);
                        onSuccess?.();
                        onClose();
                    },
                    onError: () => setIsSubmitting(false),
                },
            );
        } else {
            router.post(route("spt.badan.l7.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    onSuccess?.();
                    onClose();
                },
                onError: () => setIsSubmitting(false),
            });
        }
    };

    const handleClose = () => {
        setFormData(defaultFormData);
        setErrors({});
        onClose();
    };

    const rupiahRow = (label: string, field: RupiahField) => (
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-4">
            <Label>{label}</Label>
            <Input
                value={displays[field]}
                onChange={handleRupiahChange(field)}
                placeholder="0"
            />
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>Kompensasi Kerugian</DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Tahun Bagian Pajak */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Tahun Bagian Pajak{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.tax_year_part ?? ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        tax_year_part: e.target.value || null,
                                    }))
                                }
                                placeholder="Contoh: 2020"
                                className={cn(
                                    errors.tax_year_part && "border-red-500",
                                )}
                            />
                            {errors.tax_year_part && (
                                <p className="text-sm text-red-500">
                                    {errors.tax_year_part}
                                </p>
                            )}
                        </div>
                    </div>

                    {rupiahRow("Nilai", "amount")}
                    {rupiahRow("Tahun Keempat", "fourth_year")}
                    {rupiahRow("Tahun Ketiga", "third_year")}
                    {rupiahRow("Tahun Kedua", "second_year")}
                    {rupiahRow("Tahun Pertama", "first_year")}
                    {rupiahRow("Tahun Pajak Ini", "current_tax_year")}
                    {rupiahRow("Tahun Pajak Berjalan", "year_now")}
                </div>

                <DialogFooter className="p-4 border-t flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                    </Button>
                    <Button
                        type="button"
                        className="bg-blue-950 hover:bg-blue-900"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FormL7Dialog;
