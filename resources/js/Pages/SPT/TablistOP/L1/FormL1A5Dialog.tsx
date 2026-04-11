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
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    L1A5Item,
    L1A5_CODE_OPTIONS,
    NOTES_OPTIONS,
    OWNERSHIP_OPTIONS,
} from "./types";

interface FormL1A5DialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L1A5Item | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L1A5Item, "id" | "spt_op_id"> = {
    code: "",
    description: "",
    country: "",
    land_size: "",
    building_size: "",
    ownership_source: "",
    certificate_number: "",
    acquisition_year: "",
    acquisition_cost: 0,
    amount_now: 0,
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

export function FormL1A5Dialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: FormL1A5DialogProps) {
    const ownershipSourceOptions = useMemo(
        () =>
            OWNERSHIP_OPTIONS.filter(
                (opt) => opt.type === "harta tidak bergerak",
            ),
        [],
    );

    const [formData, setFormData] =
        useState<Omit<L1A5Item, "id" | "spt_op_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [hargaPerolehanDisplay, setHargaPerolehanDisplay] = useState("");
    const [nilaiSaatIniDisplay, setNilaiSaatIniDisplay] = useState("");

    const [openDescription, setOpenDescription] = useState(false);
    const [openCountry, setOpenCountry] = useState(false);
    const [openOwnershipSource, setOpenOwnershipSource] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                code: editData.code || "",
                description: editData.description || "",
                country: editData.country || "",
                land_size: editData.land_size || "",
                building_size: editData.building_size || "",
                ownership_source: editData.ownership_source || "",
                certificate_number: editData.certificate_number || "",
                acquisition_year: editData.acquisition_year || "",
                acquisition_cost: editData.acquisition_cost || 0,
                amount_now: editData.amount_now || 0,
                notes: editData.notes || "",
            });
            setHargaPerolehanDisplay(
                formatRupiahInput(editData.acquisition_cost || 0),
            );
            setNilaiSaatIniDisplay(formatRupiahInput(editData.amount_now || 0));
        } else {
            setFormData(defaultFormData);
            setHargaPerolehanDisplay("");
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
        const selected = L1A5_CODE_OPTIONS.find(
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

    const handleCountrySelect = (selectedValue: string) => {
        const selected = countries.find((opt) => opt.value === selectedValue);
        if (selected) {
            handleChange("country", selected.value);
        }
        setOpenCountry(false);
    };

    const handleOwnershipSourceSelect = (selectedValue: string) => {
        handleChange("ownership_source", selectedValue);
        setOpenOwnershipSource(false);
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

    const handleHargaPerolehanChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, acquisition_cost: numericValue }));
        setHargaPerolehanDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.acquisition_cost) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.acquisition_cost;
                return newErrors;
            });
        }
    };

    const handleNilaiSaatIniChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
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
        if (!formData.country) {
            newErrors.country = "Lokasi Harta wajib diisi";
        }
        if (!formData.land_size) {
            newErrors.land_size = "Ukuran Properti - Tanah wajib diisi";
        }
        if (!formData.building_size) {
            newErrors.building_size = "Ukuran Properti - Bangunan wajib diisi";
        }
        if (!formData.ownership_source) {
            newErrors.ownership_source = "Sumber Kepemilikan wajib diisi";
        }
        if (!formData.certificate_number) {
            newErrors.certificate_number = "Nomor Sertifikat wajib diisi";
        }
        if (!formData.acquisition_year) {
            newErrors.acquisition_year = "Tahun Perolehan wajib diisi";
        } else if (formData.acquisition_year.length !== 4 || !/^\d{4}$/.test(formData.acquisition_year)) {
            newErrors.acquisition_year = "Tahun Perolehan harus 4 digit angka";
        }
        if (!formData.acquisition_cost || formData.acquisition_cost === 0) {
            newErrors.acquisition_cost = "Harga Perolehan wajib diisi";
        }
        if (!formData.amount_now || formData.amount_now === 0) {
            newErrors.amount_now = "Nilai Saat Ini wajib diisi";
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
                route("spt.op.l1a5.update", { id: editData.id }),
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
                },
            );
        } else {
            router.post(route("spt.op.l1a5.store"), payload, {
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
        setHargaPerolehanDisplay("");
        setNilaiSaatIniDisplay("");
        setErrors({});
        onClose();
    };

    const getCountryLabel = (value: string) =>
        countries.find((c) => c.value === value)?.label || "";

    const getOwnershipSourceLabel = (value: string) =>
        ownershipSourceOptions.find((o) => o.value === value)?.label || "";

    const getNotesLabel = (value: string) =>
        NOTES_OPTIONS.find((n) => n.value === value)?.label || "";

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-2xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>HARTA TIDAK BERGERAK</DialogTitle>
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
                                        {formData.description || "Silakan Pilih"}
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
                                                {L1A5_CODE_OPTIONS.map((opt) => (
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
                            Lokasi Harta <span className="text-red-500">*</span>
                        </Label>
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
                                            errors.country && "border-red-500"
                                        )}
                                    >
                                        {formData.country
                                            ? getCountryLabel(formData.country)
                                            : "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari lokasi..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {countries.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.label}
                                                        onSelect={() =>
                                                            handleCountrySelect(
                                                                opt.value,
                                                            )
                                                        }
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.country ===
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
                            {errors.country && (
                                <p className="text-sm text-red-500">
                                    {errors.country}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Ukuran Properti - Tanah{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.land_size}
                                onChange={(e) =>
                                    handleChange("land_size", e.target.value)
                                }
                                placeholder="Contoh: 120 m2"
                                className={cn(
                                    errors.land_size && "border-red-500"
                                )}
                            />
                            {errors.land_size && (
                                <p className="text-sm text-red-500">
                                    {errors.land_size}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Ukuran Properti - Bangunan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.building_size}
                                onChange={(e) =>
                                    handleChange("building_size", e.target.value)
                                }
                                placeholder="Contoh: 90 m2"
                                className={cn(
                                    errors.building_size && "border-red-500"
                                )}
                            />
                            {errors.building_size && (
                                <p className="text-sm text-red-500">
                                    {errors.building_size}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Sumber Kepemilikan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover
                                open={openOwnershipSource}
                                onOpenChange={setOpenOwnershipSource}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openOwnershipSource}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.ownership_source && "border-red-500"
                                        )}
                                    >
                                        {formData.ownership_source
                                            ? getOwnershipSourceLabel(
                                                  formData.ownership_source,
                                              )
                                            : "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari sumber..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {ownershipSourceOptions.map(
                                                    (opt) => (
                                                        <CommandItem
                                                            key={opt.value}
                                                            value={opt.label}
                                                            onSelect={() =>
                                                                handleOwnershipSourceSelect(
                                                                    opt.value,
                                                                )
                                                            }
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formData.ownership_source ===
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
                            {errors.ownership_source && (
                                <p className="text-sm text-red-500">
                                    {errors.ownership_source}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nomor Sertifikat{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.certificate_number}
                                onChange={(e) =>
                                    handleChange(
                                        "certificate_number",
                                        e.target.value,
                                    )
                                }
                                placeholder="Masukkan nomor sertifikat"
                                className={cn(
                                    errors.certificate_number && "border-red-500"
                                )}
                            />
                            {errors.certificate_number && (
                                <p className="text-sm text-red-500">
                                    {errors.certificate_number}
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
                            Harga Perolehan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={hargaPerolehanDisplay}
                                    onChange={handleHargaPerolehanChange}
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
                                            : "Silakan Pilih"}
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

export default FormL1A5Dialog;