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
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L2C_INCOME_TYPE_OPTIONS, type L2BItem } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { cn } from "@/lib/utils";

interface FormL2BDialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L2BItem | null;
    onSuccess?: () => void;
}

type FormData = Omit<L2BItem, "id" | "spt_op_id" | "created_at" | "updated_at">;

const defaultFormData: FormData = {
    code: "",
    income_type: "",
    npwp: "",
    name: "",
    gross_income: 0,
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

const L2B_INCOME_OPTIONS = L2C_INCOME_TYPE_OPTIONS.filter(
    (opt) => opt.category === "l2b"
);

export function FormL2BDialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: FormL2BDialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [grossDisplay, setGrossDisplay] = useState("0");
    const [openIncomeType, setOpenIncomeType] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const incomeCodeValue = useMemo(() => {
        const selected = L2B_INCOME_OPTIONS.find(
            (opt) => opt.name === formData.income_type
        );
        return selected?.code ?? "";
    }, [formData.income_type]);

    useEffect(() => {
        if (editData) {
            setFormData({
                code: editData.code || "",
                income_type: editData.income_type || "",
                npwp: editData.npwp || "",
                name: editData.name || "",
                gross_income: Number(editData.gross_income ?? 0),
            });
            setGrossDisplay(
                formatRupiahInput(Number(editData.gross_income ?? 0)),
            );
        } else {
            setFormData(defaultFormData);
            setGrossDisplay("0");
        }
        setErrors({});
    }, [editData, open]);

    useEffect(() => {
        if (!formData.income_type) {
            setFormData((prev) => ({
                ...prev,
                code: "",
            }));
            return;
        }
        if (!incomeCodeValue) return;
        setFormData((prev) => ({
            ...prev,
            code: incomeCodeValue,
        }));
    }, [incomeCodeValue, formData.income_type]);

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

    const handleNpwpChange = (e: ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
        handleChange("npwp", digits);
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

    const handleIncomeTypeSelect = (selectedValue: string) => {
        handleChange("income_type", selectedValue);
        setOpenIncomeType(false);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.code) {
            newErrors.code = "Kode wajib diisi";
        }
        if (!formData.income_type) {
            newErrors.income_type = "Jenis Penghasilan wajib diisi";
        }
        if (!formData.npwp) {
            newErrors.npwp = "NIK/NPWP wajib diisi";
        }
        if (!formData.name) {
            newErrors.name = "Nama wajib diisi";
        }
        if (!formData.gross_income || formData.gross_income === 0) {
            newErrors.gross_income = "Penghasilan Bruto wajib diisi";
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
            ...formData,
            id: editData?.id || uuidv4(),
            spt_op_id: sptOpId,
        };

        if (editData?.id) {
            router.put(
                route("spt.op.l2b.update", { id: editData.id }),
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
            router.post(route("spt.op.l2b.store"), payload, {
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
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-2xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        B. DAFTAR PENGHASILAN YANG DIKENAKAN PAJAK BERSIFAT
                        FINAL
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Kode <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.code}
                                onChange={(e) =>
                                    handleChange("code", e.target.value)
                                }
                                placeholder="Otomatis terisi"
                                readOnly
                                disabled
                                className={cn(
                                    "bg-gray-100",
                                    errors.code && "border-red-500"
                                )}
                            />
                            {errors.code && (
                                <p className="text-sm text-red-500">
                                    {errors.code}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Jenis Penghasilan
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover
                                open={openIncomeType}
                                onOpenChange={setOpenIncomeType}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openIncomeType}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.income_type && "border-red-500"
                                        )}
                                    >
                                        <span className="block truncate text-left">
                                            {formData.income_type
                                                ? formData.income_type.length > 40
                                                    ? `${formData.income_type.substring(0, 40)}...`
                                                    : formData.income_type
                                                : "Silakan Pilih"}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari jenis penghasilan..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {L2B_INCOME_OPTIONS.map((opt) => (
                                                    <CommandItem
                                                        key={opt.code}
                                                        value={opt.name}
                                                        onSelect={() =>
                                                            handleIncomeTypeSelect(
                                                                opt.name,
                                                            )
                                                        }
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.income_type ===
                                                                    opt.name
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {opt.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.income_type && (
                                <p className="text-sm text-red-500">
                                    {errors.income_type}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            NIK/NPWP
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                inputMode="numeric"
                                value={formData.npwp ?? ""}
                                onChange={handleNpwpChange}
                                maxLength={16}
                                placeholder="Masukkan NIK/NPWP"
                                className={cn(
                                    errors.npwp && "border-red-500"
                                )}
                            />
                            {errors.npwp && (
                                <p className="text-sm text-red-500">
                                    {errors.npwp}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.name ?? ""}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                placeholder="Masukkan nama"
                                className={cn(
                                    errors.name && "border-red-500"
                                )}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] items-start gap-4">
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

export default FormL2BDialog;