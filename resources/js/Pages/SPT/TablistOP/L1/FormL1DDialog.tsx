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
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L1DItem } from "./types";

interface FormL1DDialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L1DItem | null;
    onSuccess?: () => void;
}

type FormData = {
    employer_name: string;
    employer_id: string;
    gross_income: number;
    deduction_gross_income: number;
};

const defaultFormData: FormData = {
    employer_name: "",
    employer_id: "",
    gross_income: 0,
    deduction_gross_income: 0,
};

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const formatRupiahInput = (value: number) => {
    if (value === 0) return "0";
    if (!value) return "0";
    return rupiahFormatter.format(value).replace("Rp", "").trim();
};

export function FormL1DDialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: FormL1DDialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [grossDisplay, setGrossDisplay] = useState("0");
    const [deductionDisplay, setDeductionDisplay] = useState("0");

    const netPreview = useMemo(() => {
        const gross = formData.gross_income || 0;
        const deduction = formData.deduction_gross_income || 0;
        return Math.max(0, gross - deduction);
    }, [formData.gross_income, formData.deduction_gross_income]);

    useEffect(() => {
        if (editData) {
            setFormData({
                employer_name: editData.employer_name || "",
                employer_id: editData.employer_id || "",
                gross_income: editData.gross_income || 0,
                deduction_gross_income: editData.deduction_gross_income || 0,
            });
            setGrossDisplay(formatRupiahInput(editData.gross_income || 0));
            setDeductionDisplay(
                formatRupiahInput(editData.deduction_gross_income || 0),
            );
        } else {
            setFormData(defaultFormData);
            setGrossDisplay("0");
            setDeductionDisplay("0");
        }
        setErrors({});
    }, [editData, open]);

    const handleChange = (field: keyof FormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value as any }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleEmployerIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
        handleChange("employer_id", digits);
    };

    const handleGrossChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, gross_income: numericValue }));
        setGrossDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.gross_income) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.gross_income;
                return newErrors;
            });
        }
    };

    const handleDeductionChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({
            ...prev,
            deduction_gross_income: numericValue,
        }));
        setDeductionDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.deduction_gross_income) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.deduction_gross_income;
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.employer_id) {
            newErrors.employer_id = "Nomor Identitas Pemberi Kerja wajib diisi";
        } else if (formData.employer_id.length !== 16) {
            newErrors.employer_id = "Nomor Identitas harus 16 digit";
        }
        if (!formData.employer_name) {
            newErrors.employer_name = "Nama Pemberi Kerja wajib diisi";
        }
        if (!formData.gross_income || formData.gross_income === 0) {
            newErrors.gross_income = "Penghasilan Bruto wajib diisi";
        }
        if (formData.deduction_gross_income === undefined || formData.deduction_gross_income === null) {
            newErrors.deduction_gross_income = "Pengurang Penghasilan Bruto wajib diisi";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const payload = {
            id: editData?.id || uuidv4(),
            spt_op_id: sptOpId,
            employer_name: formData.employer_name,
            employer_id: formData.employer_id,
            gross_income: formData.gross_income,
            deduction_gross_income: formData.deduction_gross_income,
        };

        if (editData?.id) {
            router.put(
                route("spt.op.l1d.update", { id: editData.id }),
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
            router.post(route("spt.op.l1d.store"), payload, {
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
        setGrossDisplay("0");
        setDeductionDisplay("0");
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-2xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        PENGHASILAN NETO DALAM NEGERI DARI PEKERJAAN
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nomor Identitas Pemberi Kerja{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                inputMode="numeric"
                                value={formData.employer_id}
                                onChange={handleEmployerIdChange}
                                maxLength={16}
                                placeholder="Masukkan nomor identitas"
                                className={cn(
                                    errors.employer_id && "border-red-500"
                                )}
                            />
                            {errors.employer_id && (
                                <p className="text-sm text-red-500">
                                    {errors.employer_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama Pemberi Kerja{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.employer_name}
                                onChange={(e) =>
                                    handleChange("employer_name", e.target.value)
                                }
                                placeholder="Masukkan nama pemberi kerja"
                                className={cn(
                                    errors.employer_name && "border-red-500"
                                )}
                            />
                            {errors.employer_name && (
                                <p className="text-sm text-red-500">
                                    {errors.employer_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Penghasilan Bruto{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={grossDisplay}
                                    onChange={handleGrossChange}
                                    placeholder="0"
                                    className={cn(
                                        "pl-10",
                                        errors.gross_income && "border-red-500"
                                    )}
                                />
                            </div>
                            {errors.gross_income && (
                                <p className="text-sm text-red-500">
                                    {errors.gross_income}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Pengurang Penghasilan Bruto/Biaya{" "}
                            
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={deductionDisplay}
                                    onChange={handleDeductionChange}
                                    placeholder="0"
                                    className={cn(
                                        "pl-10",
                                        errors.deduction_gross_income && "border-red-500"
                                    )}
                                />
                            </div>
                            {errors.deduction_gross_income && (
                                <p className="text-sm text-red-500">
                                    {errors.deduction_gross_income}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Penghasilan Neto{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={formatRupiahInput(netPreview)}
                                    disabled
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t p-4 gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Tutup
                    </Button>
                    <Button
                        className="bg-blue-950 hover:bg-blue-900"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FormL1DDialog;