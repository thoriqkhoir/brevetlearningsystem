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
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { L5BItem } from "./types";
import { cn } from "@/lib/utils";

interface FormL5BDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L5BItem | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L5BItem, "id" | "spt_badan_id"> = {
    tku_name: "",
    january: null,
    february: null,
    march: null,
    april: null,
    may: null,
    june: null,
    july: null,
    august: null,
    september: null,
    october: null,
    november: null,
    december: null,
    total: null,
};

const MONTHS: { key: keyof Omit<L5BItem, "id" | "spt_badan_id" | "tku_name" | "total">; label: string }[] = [
    { key: "january", label: "Januari" },
    { key: "february", label: "Februari" },
    { key: "march", label: "Maret" },
    { key: "april", label: "April" },
    { key: "may", label: "Mei" },
    { key: "june", label: "Juni" },
    { key: "july", label: "Juli" },
    { key: "august", label: "Agustus" },
    { key: "september", label: "September" },
    { key: "october", label: "Oktober" },
    { key: "november", label: "November" },
    { key: "december", label: "Desember" },
];

export function FormL5BDialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL5BDialogProps) {
    const [formData, setFormData] =
        useState<Omit<L5BItem, "id" | "spt_badan_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editData) {
            setFormData({
                tku_name: editData.tku_name || "",
                january: editData.january || null,
                february: editData.february || null,
                march: editData.march || null,
                april: editData.april || null,
                may: editData.may || null,
                june: editData.june || null,
                july: editData.july || null,
                august: editData.august || null,
                september: editData.september || null,
                october: editData.october || null,
                november: editData.november || null,
                december: editData.december || null,
                total: editData.total || null,
            });
        } else {
            setFormData(defaultFormData);
        }
        setErrors({});
    }, [editData, open]);

    const handleChange = (
        field: keyof typeof formData,
        value: string | null,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as string]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field as string];
                return next;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.tku_name) newErrors.tku_name = "Nama TKU wajib diisi";
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
                route("spt.badan.l5b.update", { id: editData.id }),
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Data berhasil disimpan");
                        setIsSubmitting(false);
                        onSuccess?.();
                        onClose();
                    },
                    onError: () => setIsSubmitting(false),
                },
            );
        } else {
            router.post(route("spt.badan.l5b.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data berhasil disimpan");
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

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        Penghasilan Bruto per Bulan per TKU
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Nama TKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama TKU <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.tku_name}
                                onChange={(e) =>
                                    handleChange("tku_name", e.target.value)
                                }
                                placeholder="Masukkan nama TKU"
                                className={cn(errors.tku_name && "border-red-500")}
                            />
                            {errors.tku_name && (
                                <p className="text-sm text-red-500">
                                    {errors.tku_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Per-month fields */}
                    {MONTHS.map((m) => (
                        <div
                            key={m.key}
                            className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4"
                        >
                            <Label className="pt-2">{m.label}</Label>
                            <Input
                                value={formData[m.key] ?? ""}
                                onChange={(e) =>
                                    handleChange(m.key, e.target.value || null)
                                }
                                placeholder={`Masukkan nilai ${m.label}`}
                            />
                        </div>
                    ))}

                    {/* Total */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">Total</Label>
                        <Input
                            value={formData.total ?? ""}
                            onChange={(e) =>
                                handleChange("total", e.target.value || null)
                            }
                            placeholder="Masukkan total"
                        />
                    </div>
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

export default FormL5BDialog;
