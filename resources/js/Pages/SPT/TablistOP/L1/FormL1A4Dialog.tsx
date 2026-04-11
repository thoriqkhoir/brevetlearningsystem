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
import { router, usePage } from "@inertiajs/react";
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    L1A4Item,
    L1A4_CODE_OPTIONS,
    NOTES_OPTIONS,
    OWNERSHIP_OPTIONS,
} from "./types";

interface FormL1A4DialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L1A4Item | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L1A4Item, "id" | "spt_op_id"> = {
    code: "",
    type: "",
    brand: "",
    police_number: "",
    ownership: "",
    owner_id: "",
    owner_name: "",
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

export function FormL1A4Dialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: FormL1A4DialogProps) {
    const { props } = usePage<any>();
    const authUser = props?.auth?.user;
    const defaultOwnerId: string = authUser?.npwp ?? "";
    const defaultOwnerName: string = authUser?.name ?? "";

    const ownershipOptions = useMemo(
        () => OWNERSHIP_OPTIONS.filter((opt) => opt.type === "harta bergerak"),
        [],
    );

    const [formData, setFormData] =
        useState<Omit<L1A4Item, "id" | "spt_op_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [hargaPerolehanDisplay, setHargaPerolehanDisplay] = useState("");
    const [nilaiSaatIniDisplay, setNilaiSaatIniDisplay] = useState("");

    const [openType, setOpenType] = useState(false);
    const [openOwnership, setOpenOwnership] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);

    const isOwnerEditable = formData.ownership === "atas nama pihak lain";

    useEffect(() => {
        if (editData) {
            setFormData({
                code: editData.code || "",
                type: editData.type || "",
                brand: editData.brand || "",
                police_number: editData.police_number || "",
                ownership: editData.ownership || "",
                owner_id: editData.owner_id || defaultOwnerId,
                owner_name: editData.owner_name || defaultOwnerName,
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
            setFormData({
                ...defaultFormData,
                owner_id: defaultOwnerId,
                owner_name: defaultOwnerName,
            });
            setHargaPerolehanDisplay("");
            setNilaiSaatIniDisplay("");
        }
        setErrors({});
    }, [editData, open, defaultOwnerId, defaultOwnerName]);

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

    const handleTypeSelect = (selectedValue: string) => {
        const selected = L1A4_CODE_OPTIONS.find(
            (opt) => opt.value === selectedValue,
        );
        if (selected) {
            setFormData((prev) => ({
                ...prev,
                code: selected.value,
                type: selected.label,
            }));
            // Clear errors for code and type
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.code;
                delete newErrors.type;
                return newErrors;
            });
        }
        setOpenType(false);
    };

    const handleOwnershipSelect = (selectedValue: string) => {
        setFormData((prev) => {
            const next = { ...prev, ownership: selectedValue };
            if (selectedValue !== "atas nama pihak lain") {
                next.owner_id = defaultOwnerId;
                next.owner_name = defaultOwnerName;
            }
            return next;
        });
        // Clear error for ownership
        if (errors.ownership) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.ownership;
                return newErrors;
            });
        }
        setOpenOwnership(false);
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
        if (!formData.type) {
            newErrors.type = "Tipe wajib diisi";
        }
        if (!formData.brand) {
            newErrors.brand = "Merk/Model wajib diisi";
        }
        if (!formData.police_number) {
            newErrors.police_number = "Nomor Polisi/Registrasi wajib diisi";
        }
        if (!formData.ownership) {
            newErrors.ownership = "Kepemilikan wajib diisi";
        }
        if (!formData.owner_id) {
            newErrors.owner_id = "Nomor Identitas Pemilik wajib diisi";
        }
        if (!formData.owner_name) {
            newErrors.owner_name = "Nama pemilik wajib diisi";
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
                route("spt.op.l1a4.update", { id: editData.id }),
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
            router.post(route("spt.op.l1a4.store"), payload, {
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

    const getOwnershipLabel = (value: string) =>
        ownershipOptions.find((o) => o.value === value)?.label || "";

    const getNotesLabel = (value: string) =>
        NOTES_OPTIONS.find((n) => n.value === value)?.label || "";

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-2xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>HARTA BERGERAK</DialogTitle>
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
                            Tipe <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover open={openType} onOpenChange={setOpenType}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openType}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.type && "border-red-500"
                                        )}
                                    >
                                        {formData.type || "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari tipe..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {L1A4_CODE_OPTIONS.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.label}
                                                        onSelect={() =>
                                                            handleTypeSelect(
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
                            {errors.type && (
                                <p className="text-sm text-red-500">
                                    {errors.type}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Merk/Model <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.brand}
                                onChange={(e) =>
                                    handleChange("brand", e.target.value)
                                }
                                placeholder="Masukkan merk/model"
                                className={cn(
                                    errors.brand && "border-red-500"
                                )}
                            />
                            {errors.brand && (
                                <p className="text-sm text-red-500">
                                    {errors.brand}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nomor Polisi/Registrasi{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.police_number}
                                onChange={(e) =>
                                    handleChange("police_number", e.target.value)
                                }
                                placeholder="Masukkan nomor polisi/registrasi"
                                className={cn(
                                    errors.police_number && "border-red-500"
                                )}
                            />
                            {errors.police_number && (
                                <p className="text-sm text-red-500">
                                    {errors.police_number}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Kepemilikan <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover
                                open={openOwnership}
                                onOpenChange={setOpenOwnership}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openOwnership}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.ownership && "border-red-500"
                                        )}
                                    >
                                        {formData.ownership
                                            ? getOwnershipLabel(formData.ownership)
                                            : "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari kepemilikan..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {ownershipOptions.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.label}
                                                        onSelect={() =>
                                                            handleOwnershipSelect(
                                                                opt.value,
                                                            )
                                                        }
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.ownership ===
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
                            {errors.ownership && (
                                <p className="text-sm text-red-500">
                                    {errors.ownership}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nomor Identitas Pemilik (NIK/NPWP)
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.owner_id}
                                inputMode="numeric"
                                pattern="\\d*"
                                maxLength={16}
                                disabled={!isOwnerEditable}
                                className={cn(
                                    !isOwnerEditable && "bg-gray-100",
                                    errors.owner_id && "border-red-500"
                                )}
                                onChange={(e) => {
                                    const sanitized = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 16);
                                    handleChange("owner_id", sanitized);
                                }}
                                placeholder="Contoh: 16 digit angka"
                            />
                            {errors.owner_id && (
                                <p className="text-sm text-red-500">
                                    {errors.owner_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama pemilik <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.owner_name}
                                disabled={!isOwnerEditable}
                                className={cn(
                                    !isOwnerEditable && "bg-gray-100",
                                    errors.owner_name && "border-red-500"
                                )}
                                onChange={(e) =>
                                    handleChange("owner_name", e.target.value)
                                }
                                placeholder="Masukkan nama pemilik"
                            />
                            {errors.owner_name && (
                                <p className="text-sm text-red-500">
                                    {errors.owner_name}
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

export default FormL1A4Dialog;