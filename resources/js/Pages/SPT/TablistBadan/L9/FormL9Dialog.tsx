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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { L9Item, L9GroupType, getL9TreasureOptions } from "./types";

interface FormL9DialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    groupType: L9GroupType;
    editData?: L9Item | null;
    onSuccess?: () => void;
}

type FormData = Omit<L9Item, "id" | "spt_badan_id">;

const defaultFormData = (groupType: L9GroupType): FormData => ({
    group_type: groupType,
    treasure_code: "",
    treasure_type: "",
    period_aquisition: null,
    cost_aquisition: 0,
    residual_value: 0,
    comercial_depreciation_method: null,
    fiscal_depreciation_method: null,
    depreciation_this_year: 0,
    note: null,
});

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const formatRupiahInput = (value: number) => {
    if (!value) return "";
    return rupiahFormatter.format(value).replace("Rp", "").trim();
};

const DEPRECIATION_METHODS = [
    { value: "Garis Lurus", label: "Garis Lurus" },
    { value: "Saldo Menurun", label: "Saldo Menurun" },
    { value: "Saldo Menurun Ganda", label: "Saldo Menurun Ganda" },
];

export function FormL9Dialog({
    open,
    onClose,
    sptBadanId,
    groupType,
    editData,
    onSuccess,
}: FormL9DialogProps) {
    const [formData, setFormData] = useState<FormData>(
        defaultFormData(groupType),
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [costDisplay, setCostDisplay] = useState("");
    const [residualDisplay, setResidualDisplay] = useState("");
    const [depreciationDisplay, setDepreciationDisplay] = useState("");
    const [periodAquisitionInput, setPeriodAquisitionInput] = useState("");
    const [openTreasureType, setOpenTreasureType] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const treasureOptions = getL9TreasureOptions(groupType);

    useEffect(() => {
        if (editData) {
            setFormData({
                group_type: editData.group_type,
                treasure_code: editData.treasure_code || "",
                treasure_type: editData.treasure_type || "",
                period_aquisition: editData.period_aquisition
                    ? editData.period_aquisition
                    : null,
                cost_aquisition: editData.cost_aquisition || 0,
                residual_value: editData.residual_value || 0,
                comercial_depreciation_method:
                    editData.comercial_depreciation_method || null,
                fiscal_depreciation_method:
                    editData.fiscal_depreciation_method || null,
                depreciation_this_year: editData.depreciation_this_year || 0,
                note: editData.note || null,
            });
            setCostDisplay(formatRupiahInput(editData.cost_aquisition || 0));
            setResidualDisplay(formatRupiahInput(editData.residual_value || 0));
            setDepreciationDisplay(
                formatRupiahInput(editData.depreciation_this_year || 0),
            );
            if (editData.period_aquisition) {
                const date = new Date(editData.period_aquisition);
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = String(date.getFullYear());
                setPeriodAquisitionInput(`${month}/${year}`);
            } else {
                setPeriodAquisitionInput("");
            }
        } else {
            setFormData(defaultFormData(groupType));
            setCostDisplay("");
            setResidualDisplay("");
            setDepreciationDisplay("");
            setPeriodAquisitionInput("");
        }
        setErrors({});
    }, [editData, open, groupType]);

    const handleChange = (
        field: keyof FormData,
        value: string | number | null,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleRupiahChange = (
        field: "cost_aquisition" | "residual_value" | "depreciation_this_year",
        setter: (v: string) => void,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        const num = parseInt(raw) || 0;
        setFormData((prev) => ({ ...prev, [field]: num }));
        setter(formatRupiahInput(num));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.treasure_code)
            newErrors.treasure_code = "Kode harta wajib diisi";
        if (!formData.treasure_type)
            newErrors.treasure_type = "Jenis harta wajib diisi";
        if (periodAquisitionInput && !formData.period_aquisition) {
            newErrors.period_aquisition =
                "Gunakan format bulan/tahun yang valid, misalnya 03/2026";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTreasureTypeSelect = (value: string) => {
        const selected = treasureOptions.find(
            (option) => option.label === value,
        );

        setFormData((prev) => ({
            ...prev,
            treasure_type: value,
            treasure_code: selected?.code ?? "",
        }));
        setOpenTreasureType(false);

        setErrors((prev) => {
            const next = { ...prev };
            delete next.treasure_type;
            delete next.treasure_code;
            return next;
        });
    };

    const handlePeriodAquisitionChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
        const month = digits.slice(0, 2);
        const year = digits.slice(2, 6);
        const formatted = year ? `${month}/${year}` : month;

        setPeriodAquisitionInput(formatted);

        const monthNumber = Number(month);
        const yearNumber = Number(year);
        const isValid =
            digits.length === 6 &&
            monthNumber >= 1 &&
            monthNumber <= 12 &&
            yearNumber >= 1900;

        handleChange(
            "period_aquisition",
            isValid ? `${year}-${month}-01 00:00:00` : null,
        );
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
                route("spt.badan.l9.update", { id: editData.id }),
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Data berhasil disimpan");
                        router.reload({ only: ["l9"] });
                        setIsSubmitting(false);
                        onSuccess?.();
                        onClose();
                    },
                    onError: (errors) => {
                        toast.error(Object.values(errors)[0] as string ?? "Gagal menyimpan data");
                        setIsSubmitting(false);
                    },
                },
            );
        } else {
            router.post(route("spt.badan.l9.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data berhasil disimpan");
                    router.reload({ only: ["l9"] });
                    setIsSubmitting(false);
                    onSuccess?.();
                    onClose();
                },
                onError: (errors) => {
                    toast.error(Object.values(errors)[0] as string ?? "Gagal menyimpan data");
                    setIsSubmitting(false);
                },
            });
        }
    };

    const handleClose = () => {
        setFormData(defaultFormData(groupType));
        setCostDisplay("");
        setResidualDisplay("");
        setDepreciationDisplay("");
        setPeriodAquisitionInput("");
        setOpenTreasureType(false);
        setErrors({});
        onClose();
    };

    const rowClass = "grid grid-cols-[280px_1fr] items-start gap-x-4 py-2";
    const labelClass =
        "text-sm font-medium text-gray-700 dark:text-gray-300 pt-2";

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        {editData ? "Edit" : "Tambah"} Data Penyusutan /
                        Amortisasi
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 p-4">
                    {/* 1. Kode Harta */}
                    <div className={rowClass}>
                        <Label className={labelClass}>Kode Harta</Label>
                        <Input
                            value={formData.treasure_code}
                            placeholder="Kode harta"
                            className="bg-gray-50"
                            disabled
                        />
                        {errors.treasure_code && (
                            <p className="col-start-2 text-xs text-red-500 mt-1">
                                {errors.treasure_code}
                            </p>
                        )}
                    </div>

                    {/* 2. Jenis Harta */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Jenis Harta <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Popover
                                open={openTreasureType}
                                onOpenChange={setOpenTreasureType}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openTreasureType}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.treasure_type &&
                                                "border-red-500",
                                        )}
                                    >
                                        <span className="block truncate text-left">
                                            {formData.treasure_type ||
                                                "Pilih jenis harta"}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari jenis harta..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {treasureOptions.map(
                                                    (option) => (
                                                        <CommandItem
                                                            key={option.code}
                                                            value={`${option.code} ${option.label}`}
                                                            onSelect={() =>
                                                                handleTreasureTypeSelect(
                                                                    option.label,
                                                                )
                                                            }
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formData.treasure_type ===
                                                                        option.label
                                                                        ? "opacity-100"
                                                                        : "opacity-0",
                                                                )}
                                                            />
                                                            <span className="truncate">
                                                                {option.code} -{" "}
                                                                {option.label}
                                                            </span>
                                                        </CommandItem>
                                                    ),
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        {errors.treasure_type && (
                            <p className="col-start-2 text-xs text-red-500 mt-1">
                                {errors.treasure_type}
                            </p>
                        )}
                    </div>

                    {/* 3. Bulan / Tahun Perolehan */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Bulan / Tahun Perolehan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            value={periodAquisitionInput}
                            onChange={handlePeriodAquisitionChange}
                            placeholder="MM/YYYY"
                        />
                        {errors.period_aquisition && (
                            <p className="col-start-2 text-xs text-red-500 mt-1">
                                {errors.period_aquisition}
                            </p>
                        )}
                    </div>

                    {/* 4. Biaya Perolehan */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Biaya Perolehan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-gray-100 text-sm text-gray-600">
                                Rp.
                            </span>
                            <Input
                                value={costDisplay}
                                onChange={(e) =>
                                    handleRupiahChange(
                                        "cost_aquisition",
                                        setCostDisplay,
                                        e,
                                    )
                                }
                                placeholder="0"
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* 5. Nilai Sisa Buku Fiskal Pada Awal Tahun */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Nilai Sisa Buku Fiskal Pada Awal Tahun
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-gray-100 text-sm text-gray-600">
                                Rp.
                            </span>
                            <Input
                                value={residualDisplay}
                                onChange={(e) =>
                                    handleRupiahChange(
                                        "residual_value",
                                        setResidualDisplay,
                                        e,
                                    )
                                }
                                placeholder="0"
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* 6. Metode Penyusutan / Amortisasi */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Metode Penyusutan/Amortisasi
                        </Label>
                        <div className="space-y-2">
                            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                                <span className="text-sm font-semibold uppercase text-gray-600">
                                    Komersial
                                </span>
                                <Select
                                    value={
                                        formData.comercial_depreciation_method ??
                                        ""
                                    }
                                    onValueChange={(v) =>
                                        handleChange(
                                            "comercial_depreciation_method",
                                            v || null,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih metode..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEPRECIATION_METHODS.map((m) => (
                                            <SelectItem
                                                key={m.value}
                                                value={m.value}
                                            >
                                                {m.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                                <span className="text-sm font-semibold uppercase text-gray-600">
                                    Fiskal
                                </span>
                                <Select
                                    value={
                                        formData.fiscal_depreciation_method ??
                                        ""
                                    }
                                    onValueChange={(v) =>
                                        handleChange(
                                            "fiscal_depreciation_method",
                                            v || null,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih metode..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEPRECIATION_METHODS.map((m) => (
                                            <SelectItem
                                                key={m.value}
                                                value={m.value}
                                            >
                                                {m.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* 7. Penyusutan / Amortisasi Fiskal Tahun Ini */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Penyusutan/Amortisasi Fiskal Tahun Ini
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-gray-100 text-sm text-gray-600">
                                Rp.
                            </span>
                            <Input
                                value={depreciationDisplay}
                                onChange={(e) =>
                                    handleRupiahChange(
                                        "depreciation_this_year",
                                        setDepreciationDisplay,
                                        e,
                                    )
                                }
                                placeholder="0"
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* 8. Keterangan */}
                    <div className={rowClass}>
                        <Label className={labelClass}>Keterangan</Label>
                        <Input
                            value={formData.note ?? ""}
                            onChange={(e) =>
                                handleChange("note", e.target.value || null)
                            }
                            placeholder="Keterangan (opsional)"
                        />
                    </div>
                </div>

                <DialogFooter className="border-t p-4 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Tutup
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

export default FormL9Dialog;
