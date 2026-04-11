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
import { router } from "@inertiajs/react";
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L1A6Item, L1A6_CODE_OPTIONS, NOTES_OPTIONS } from "./types";

interface FormL1A6DialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L1A6Item | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L1A6Item, "id" | "spt_op_id"> = {
    code: "",
    description: "",
    acquisition_year: "",
    acquisition_cost: 0,
    amount_now: 0,
    account_number: "",
    additional_information: "",
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

export function FormL1A6Dialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: FormL1A6DialogProps) {
    const [formData, setFormData] =
        useState<Omit<L1A6Item, "id" | "spt_op_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [biayaPerolehanDisplay, setBiayaPerolehanDisplay] = useState("");
    const [nilaiSaatIniDisplay, setNilaiSaatIniDisplay] = useState("");

    const [openDescription, setOpenDescription] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                code: editData.code || "",
                description: editData.description || "",
                acquisition_year: editData.acquisition_year || "",
                acquisition_cost: editData.acquisition_cost || 0,
                amount_now: editData.amount_now || 0,
                account_number: editData.account_number || "",
                additional_information: editData.additional_information || "",
                notes: editData.notes || "",
            });
            setBiayaPerolehanDisplay(
                formatRupiahInput(editData.acquisition_cost || 0),
            );
            setNilaiSaatIniDisplay(formatRupiahInput(editData.amount_now || 0));
        } else {
            setFormData(defaultFormData);
            setBiayaPerolehanDisplay("");
            setNilaiSaatIniDisplay("");
        }
        setErrors({});
    }, [editData, open]);

    const handleChange = (
        field: keyof typeof formData,
        value: string | number,
    ) => {
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

    const handleDescriptionSelect = (selectedValue: string) => {
        const selected = L1A6_CODE_OPTIONS.find(
            (opt) => opt.value === selectedValue,
        );
        if (selected) {
            setFormData((prev) => ({
                ...prev,
                code: selected.value,
                description: selected.label,
            }));
            // Clear errors for code and description
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.code;
                delete newErrors.description;
                return newErrors;
            });
        }
        setOpenDescription(false);
    };

    const handleNotesSelect = (selectedValue: string) => {
        const selected = NOTES_OPTIONS.find(
            (opt) => opt.value === selectedValue,
        );
        if (selected) {
            handleChange("notes", selected.value);
        }
        setOpenNotes(false);
    };

    const handleBiayaPerolehanChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, acquisition_cost: numericValue }));
        setBiayaPerolehanDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.acquisition_cost) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.acquisition_cost;
                return newErrors;
            });
        }
    };

    const handleNilaiSaatIniChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, amount_now: numericValue }));
        setNilaiSaatIniDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.amount_now) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.amount_now;
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
        if (!formData.acquisition_year) {
            newErrors.acquisition_year = "Tahun Perolehan wajib diisi";
        } else if (formData.acquisition_year.length !== 4 || !/^\d{4}$/.test(formData.acquisition_year)) {
            newErrors.acquisition_year = "Tahun Perolehan harus 4 digit angka";
        }
        if (!formData.acquisition_cost || formData.acquisition_cost === 0) {
            newErrors.acquisition_cost = "Biaya Perolehan wajib diisi";
        }
        if (!formData.amount_now || formData.amount_now === 0) {
            newErrors.amount_now = "Nilai Saat Ini wajib diisi";
        }
        if (!formData.account_number) {
            newErrors.account_number = "Bukti Kepemilikan/Nomor Akun wajib diisi";
        }
        if (!formData.additional_information) {
            newErrors.additional_information = "Informasi Tambahan wajib diisi";
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
                route("spt.op.l1a6.update", { id: editData.id }),
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsSubmitting(false);
                        onSuccess?.();
                        onClose();
                    },
                    onError: () => {
                        setIsSubmitting(false);
                    },
                }
            );
        } else {
            router.post(route("spt.op.l1a6.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    onSuccess?.();
                    onClose();
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            });
        }
    };

    const handleClose = () => {
        setFormData(defaultFormData);
        setBiayaPerolehanDisplay("");
        setNilaiSaatIniDisplay("");
        setErrors({});
        onClose();
    };

    const getNotesLabel = (value: string) =>
        NOTES_OPTIONS.find((n) => n.value === value)?.label || "";

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-2xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>Aset Lain-Lain</DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Kode <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.code}
                                readOnly
                                disabled
                                className={cn(
                                    "bg-gray-100",
                                    errors.code && "border-red-500"
                                )}
                                placeholder="Otomatis terisi"
                            />
                            {errors.code && (
                                <p className="text-sm text-red-500">
                                    {errors.code}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Deskripsi <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover
                                open={openDescription}
                                onOpenChange={setOpenDescription}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openDescription}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.description && "border-red-500"
                                        )}
                                    >
                                        {formData.description || "Please Select"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari deskripsi..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {L1A6_CODE_OPTIONS.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.label}
                                                        onSelect={() =>
                                                            handleDescriptionSelect(
                                                                opt.value,
                                                            )
                                                        }
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.code ===
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
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Tahun Perolehan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                type="text"
                                value={formData.acquisition_year}
                                onChange={(e) =>
                                    handleChange("acquisition_year", e.target.value)
                                }
                                placeholder="Contoh: 2020"
                                maxLength={4}
                                className={cn(
                                    errors.acquisition_year && "border-red-500"
                                )}
                            />
                            {errors.acquisition_year && (
                                <p className="text-sm text-red-500">
                                    {errors.acquisition_year}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Biaya Perolehan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={biayaPerolehanDisplay}
                                    onChange={handleBiayaPerolehanChange}
                                    placeholder="0"
                                    className={cn(
                                        "pl-10",
                                        errors.acquisition_cost && "border-red-500"
                                    )}
                                />
                            </div>
                            {errors.acquisition_cost && (
                                <p className="text-sm text-red-500">
                                    {errors.acquisition_cost}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nilai Saat Ini{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={nilaiSaatIniDisplay}
                                    onChange={handleNilaiSaatIniChange}
                                    placeholder="0"
                                    className={cn(
                                        "pl-10",
                                        errors.amount_now && "border-red-500"
                                    )}
                                />
                            </div>
                            {errors.amount_now && (
                                <p className="text-sm text-red-500">
                                    {errors.amount_now}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Bukti Kepemilikan/Nomor Akun{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.account_number}
                                onChange={(e) =>
                                    handleChange("account_number", e.target.value)
                                }
                                placeholder="Masukkan bukti kepemilikan/nomor akun"
                                className={cn(
                                    errors.account_number && "border-red-500"
                                )}
                            />
                            {errors.account_number && (
                                <p className="text-sm text-red-500">
                                    {errors.account_number}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Informasi Tambahan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.additional_information}
                                onChange={(e) =>
                                    handleChange(
                                        "additional_information",
                                        e.target.value,
                                    )
                                }
                                placeholder="Masukkan informasi tambahan"
                                className={cn(
                                    errors.additional_information && "border-red-500"
                                )}
                            />
                            {errors.additional_information && (
                                <p className="text-sm text-red-500">
                                    {errors.additional_information}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
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
                                        {formData.notes
                                            ? getNotesLabel(formData.notes)
                                            : "Please Select"}
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
                                                        onSelect={() =>
                                                            handleNotesSelect(
                                                                opt.value,
                                                            )
                                                        }
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

export default FormL1A6Dialog;