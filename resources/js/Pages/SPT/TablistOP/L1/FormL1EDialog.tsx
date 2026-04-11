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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Save, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L1EItem, L1E_TAX_TYPE_OPTIONS } from "./types";

interface FormL1EDialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L1EItem | null;
    onSuccess?: () => void;
}

type FormData = Omit<L1EItem, "id" | "spt_op_id">;

const defaultFormData: FormData = {
    tax_withholder_name: "",
    tax_withholder_id: "",
    tax_withholder_slip_number: "",
    tax_withholder_slip_date: "",
    tax_type: "",
    gross_income: 0,
    amount: 0,
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

export function FormL1EDialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: FormL1EDialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [grossDisplay, setGrossDisplay] = useState("0");
    const [amountDisplay, setAmountDisplay] = useState("0");

    const [openTaxType, setOpenTaxType] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const taxTypeLabel = useMemo(() => {
        return L1E_TAX_TYPE_OPTIONS.find((t) => t.value === formData.tax_type)
            ?.label;
    }, [formData.tax_type]);

    useEffect(() => {
        if (editData) {
            setFormData({
                tax_withholder_name: editData.tax_withholder_name || "",
                tax_withholder_id: editData.tax_withholder_id || "",
                tax_withholder_slip_number:
                    editData.tax_withholder_slip_number || "",
                tax_withholder_slip_date:
                    editData.tax_withholder_slip_date || "",
                tax_type: editData.tax_type || "",
                gross_income: editData.gross_income || 0,
                amount: editData.amount || 0,
            });
            setGrossDisplay(formatRupiahInput(editData.gross_income || 0));
            setAmountDisplay(formatRupiahInput(editData.amount || 0));
        } else {
            setFormData(defaultFormData);
            setGrossDisplay("0");
            setAmountDisplay("0");
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

    const handleWithholderIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
        handleChange("tax_withholder_id", digits);
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

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, amount: numericValue }));
        setAmountDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.amount) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.amount;
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.tax_withholder_name) {
            newErrors.tax_withholder_name =
                "Nama Pemotong/Pemungut PPh wajib diisi";
        }
        if (!formData.tax_withholder_id) {
            newErrors.tax_withholder_id =
                "NPWP Pemotong/Pemungut PPh wajib diisi";
        } else if (formData.tax_withholder_id.length !== 16) {
            newErrors.tax_withholder_id = "NPWP harus 16 digit";
        }
        if (!formData.tax_withholder_slip_number) {
            newErrors.tax_withholder_slip_number =
                "Nomor Bukti Pemotongan/Pemungutan wajib diisi";
        }
        if (!formData.tax_withholder_slip_date) {
            newErrors.tax_withholder_slip_date =
                "Tanggal Bukti Pemotongan/Pemungutan wajib diisi";
        }
        if (!formData.tax_type) {
            newErrors.tax_type = "Jenis Pajak wajib diisi";
        }
        if (!formData.gross_income || formData.gross_income === 0) {
            newErrors.gross_income = "Penghasilan Bruto wajib diisi";
        }
        if (!formData.amount || formData.amount === 0) {
            newErrors.amount = "PPh yang Dipotong/Dipungut wajib diisi";
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
                route("spt.op.l1e.update", { id: editData.id }),
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
            router.post(route("spt.op.l1e.store"), payload, {
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
        setAmountDisplay("0");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-2xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        DAFTAR BUKTI PEMOTONGAN/PEMUNGUTAN PPh
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama Pemotong/Pemungut PPh{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.tax_withholder_name}
                                onChange={(e) =>
                                    handleChange(
                                        "tax_withholder_name",
                                        e.target.value,
                                    )
                                }
                                placeholder="Masukkan nama pemotong/pemungut"
                                className={cn(
                                    errors.tax_withholder_name &&
                                        "border-red-500",
                                )}
                            />
                            {errors.tax_withholder_name && (
                                <p className="text-sm text-red-500">
                                    {errors.tax_withholder_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            NPWP Pemotong/Pemungut PPh{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                inputMode="numeric"
                                value={formData.tax_withholder_id}
                                onChange={handleWithholderIdChange}
                                maxLength={16}
                                placeholder="Masukkan NPWP"
                                className={cn(
                                    errors.tax_withholder_id &&
                                        "border-red-500",
                                )}
                            />
                            {errors.tax_withholder_id && (
                                <p className="text-sm text-red-500">
                                    {errors.tax_withholder_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nomor Bukti Pemotongan/Pemungutan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.tax_withholder_slip_number}
                                onChange={(e) =>
                                    handleChange(
                                        "tax_withholder_slip_number",
                                        e.target.value,
                                    )
                                }
                                placeholder="Masukkan nomor bukti"
                                className={cn(
                                    errors.tax_withholder_slip_number &&
                                        "border-red-500",
                                )}
                            />
                            {errors.tax_withholder_slip_number && (
                                <p className="text-sm text-red-500">
                                    {errors.tax_withholder_slip_number}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Tanggal Bukti Pemotongan/Pemungutan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover
                                open={isCalendarOpen}
                                onOpenChange={setIsCalendarOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-between pl-3 text-left font-normal",
                                            !formData.tax_withholder_slip_date &&
                                                "text-muted-foreground",
                                            errors.tax_withholder_slip_date &&
                                                "border-red-500",
                                        )}
                                        onClick={() => setIsCalendarOpen(true)}
                                    >
                                        {formData.tax_withholder_slip_date ? (
                                            format(
                                                new Date(
                                                    formData.tax_withholder_slip_date,
                                                ),
                                                "yyyy-MM-dd",
                                            )
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
                                            formData.tax_withholder_slip_date
                                                ? new Date(
                                                      formData.tax_withholder_slip_date,
                                                  )
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            handleChange(
                                                "tax_withholder_slip_date",
                                                date
                                                    ? format(date, "yyyy-MM-dd")
                                                    : "",
                                            );
                                            setIsCalendarOpen(false);
                                        }}
                                        disabled={(date) =>
                                            date > new Date() ||
                                            date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.tax_withholder_slip_date && (
                                <p className="text-sm text-red-500">
                                    {errors.tax_withholder_slip_date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Jenis Pajak <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover
                                open={openTaxType}
                                onOpenChange={setOpenTaxType}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openTaxType}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.tax_type && "border-red-500",
                                        )}
                                    >
                                        {taxTypeLabel || "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari jenis pajak..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {L1E_TAX_TYPE_OPTIONS.map(
                                                    (opt) => (
                                                        <CommandItem
                                                            key={opt.value}
                                                            value={opt.label}
                                                            onSelect={() => {
                                                                handleChange(
                                                                    "tax_type",
                                                                    opt.value,
                                                                );
                                                                setOpenTaxType(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formData.tax_type ===
                                                                        opt.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0",
                                                                )}
                                                            />
                                                            {opt.label}
                                                        </CommandItem>
                                                    ),
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.tax_type && (
                                <p className="text-sm text-red-500">
                                    {errors.tax_type}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
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
                                        errors.gross_income && "border-red-500",
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

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            PPh yang Dipotong/Dipungut{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={amountDisplay}
                                    onChange={handleAmountChange}
                                    placeholder="0"
                                    className={cn(
                                        "pl-10",
                                        errors.amount && "border-red-500",
                                    )}
                                />
                            </div>
                            {errors.amount && (
                                <p className="text-sm text-red-500">
                                    {errors.amount}
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

export default FormL1EDialog;
