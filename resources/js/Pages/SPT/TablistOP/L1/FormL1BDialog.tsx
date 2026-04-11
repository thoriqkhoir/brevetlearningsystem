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
import { countries } from "@/data/spt-op-data";
import { router } from "@inertiajs/react";
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L1BItem, NOTES_OPTIONS } from "./types";

interface FormL1BDialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L1BItem | null;
    onSuccess?: () => void;
}

type FormData = Omit<L1BItem, "id" | "spt_op_id">;

const defaultFormData: FormData = {
    code: "",
    description: "",
    creditor_id: "",
    creditor_name: "",
    creditor_country: "",
    ownership: "",
    loan_year: "",
    balance: 0,
    notes: "",
};

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const formatRupiahInput = (value: number) => {
    if (!value) return "";
    return rupiahFormatter.format(value).replace("Rp", "").trim();
};

export function FormL1BDialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: FormL1BDialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [saldoDisplay, setSaldoDisplay] = useState("");
    const [openCountry, setOpenCountry] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);

    const noteLabel = useMemo(() => {
        return NOTES_OPTIONS.find((n) => n.value === formData.notes)?.label;
    }, [formData.notes]);

    useEffect(() => {
        if (editData) {
            setFormData({
                code: editData.code || "",
                description: editData.description || "",
                creditor_id: editData.creditor_id || "",
                creditor_name: editData.creditor_name || "",
                creditor_country: editData.creditor_country || "",
                ownership: editData.ownership || "",
                loan_year: editData.loan_year || "",
                balance: editData.balance || 0,
                notes: editData.notes || "",
            });
            setSaldoDisplay(formatRupiahInput(editData.balance || 0));
        } else {
            setFormData(defaultFormData);
            setSaldoDisplay("");
        }
        setErrors({});
    }, [editData, open]);

    const handleChange = (field: keyof FormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleCreditorIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
        handleChange("creditor_id", digits);
    };

    const handleLoanYearChange = (e: ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
        handleChange("loan_year", digits);
    };

    const handleSaldoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, balance: numericValue }));
        setSaldoDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.balance) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.balance;
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.code) {
            newErrors.code = "Kode wajib diisi";
        }
        if (!formData.description) {
            newErrors.description = "Deskripsi wajib diisi";
        }
        if (!formData.creditor_id) {
            newErrors.creditor_id = "Nomor Identitas WP wajib diisi";
        }
        if (!formData.creditor_name) {
            newErrors.creditor_name = "Nama wajib diisi";
        }
        if (!formData.creditor_country) {
            newErrors.creditor_country = "Negara Kreditur wajib diisi";
        }
        if (!formData.loan_year) {
            newErrors.loan_year = "Tahun Peminjaman wajib diisi";
        } else if (formData.loan_year.length !== 4 || !/^\d{4}$/.test(formData.loan_year)) {
            newErrors.loan_year = "Tahun Peminjaman harus 4 digit angka";
        }
        if (!formData.balance || formData.balance === 0) {
            newErrors.balance = "Saldo wajib diisi";
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
                route("spt.op.l1b.update", { id: editData.id }),
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
            router.post(route("spt.op.l1b.store"), payload, {
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
        setSaldoDisplay("");
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-2xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>UTANG PADA AKHIR TAHUN PAJAK</DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Kode <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.code}
                                onChange={(e) =>
                                    handleChange("code", e.target.value)
                                }
                                placeholder="Masukkan kode"
                                className={cn(
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

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">Deskripsi<span className="text-red-500">*</span></Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.description}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                                placeholder="Masukkan deskripsi"
                                className={cn(
                                    errors.description && "border-red-500"
                                )}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">Nomor Identitas WP<span className="text-red-500">*</span></Label>
                        <div className="space-y-1">
                            <Input
                                inputMode="numeric"
                                value={formData.creditor_id}
                                onChange={handleCreditorIdChange}
                                maxLength={16}
                                placeholder="Masukkan nomor identitas"
                                className={cn(
                                    errors.creditor_id && "border-red-500"
                                )}
                            />
                            {errors.creditor_id && (
                                <p className="text-sm text-red-500">
                                    {errors.creditor_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">Nama<span className="text-red-500">*</span></Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.creditor_name}
                                onChange={(e) =>
                                    handleChange("creditor_name", e.target.value)
                                }
                                placeholder="Masukkan nama"
                                className={cn(
                                    errors.creditor_name && "border-red-500"
                                )}
                            />
                            {errors.creditor_name && (
                                <p className="text-sm text-red-500">
                                    {errors.creditor_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">Negara Kreditur<span className="text-red-500">*</span></Label>
                        <div className="space-y-1">
                            <Popover
                                open={openCountry}
                                onOpenChange={setOpenCountry}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCountry}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.creditor_country && "border-red-500"
                                        )}
                                    >
                                        {formData.creditor_country
                                            ? countries.find(
                                                  (c) =>
                                                      c.value ===
                                                      formData.creditor_country,
                                              )?.label
                                            : "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari negara..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {countries.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.label}
                                                        onSelect={() => {
                                                            handleChange(
                                                                "creditor_country",
                                                                opt.value,
                                                            );
                                                            setOpenCountry(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.creditor_country ===
                                                                    opt.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {opt.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.creditor_country && (
                                <p className="text-sm text-red-500">
                                    {errors.creditor_country}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">Tahun Peminjaman<span className="text-red-500">*</span></Label>
                        <div className="space-y-1">
                            <Input
                                inputMode="numeric"
                                value={formData.loan_year}
                                onChange={handleLoanYearChange}
                                maxLength={4}
                                placeholder="Contoh: 2024"
                                className={cn(
                                    errors.loan_year && "border-red-500"
                                )}
                            />
                            {errors.loan_year && (
                                <p className="text-sm text-red-500">
                                    {errors.loan_year}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Saldo <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={saldoDisplay}
                                    onChange={handleSaldoChange}
                                    placeholder="0"
                                    className={cn(
                                        "pl-10",
                                        errors.balance && "border-red-500"
                                    )}
                                />
                            </div>
                            {errors.balance && (
                                <p className="text-sm text-red-500">
                                    {errors.balance}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">Keterangan</Label>
                        <div className="space-y-1">
                            <Popover open={openNotes} onOpenChange={setOpenNotes}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openNotes}
                                        className="w-full justify-between font-normal"
                                    >
                                        {noteLabel || "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari keterangan..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {NOTES_OPTIONS.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.label}
                                                        onSelect={() => {
                                                            handleChange(
                                                                "notes",
                                                                opt.value,
                                                            );
                                                            setOpenNotes(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.notes ===
                                                                    opt.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {opt.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
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

export default FormL1BDialog;   