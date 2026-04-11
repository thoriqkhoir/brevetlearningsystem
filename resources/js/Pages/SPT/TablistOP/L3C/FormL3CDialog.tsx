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
import { router } from "@inertiajs/react";
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    AssetOption,
    L3CItem,
    L3CSubType,
    L3CType,
    L3C_SUBTYPE_LABEL,
    L3C_TYPE_LABEL,
    METHOD_OPTIONS,
} from "./types";

interface FormL3CDialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    type: L3CType;
    subType: L3CSubType;
    assetOptions: AssetOption[];
    editData?: L3CItem | null;
    onSuccess?: () => void;
}

type FormState = Omit<L3CItem, "id" | "spt_op_id" | "type" | "sub_type">;

const defaultFormData: FormState = {
    code: "",
    asset_type: "",
    period_acquisition: "",
    cost_acquisition: 0,
    begining_fiscal_book: 0,
    method_commercial: null,
    method_fiscal: null,
    fiscal_depreciation: 0,
    notes: null,
};

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const formatRupiahInput = (value: number) => {
    if (!value) return "";
    return rupiahFormatter.format(value).replace("Rp", "").trim();
};

const parseNumber = (raw: string) => {
    const numeric = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
};

const MONTH_NAMES = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

const MONTH_NUMBER_TO_NAME: Record<string, string> = {
    "01": "Januari",
    "1": "Januari",
    "02": "Februari",
    "2": "Februari",
    "03": "Maret",
    "3": "Maret",
    "04": "April",
    "4": "April",
    "05": "Mei",
    "5": "Mei",
    "06": "Juni",
    "6": "Juni",
    "07": "Juli",
    "7": "Juli",
    "08": "Agustus",
    "8": "Agustus",
    "09": "September",
    "9": "September",
    "10": "Oktober",
    "11": "November",
    "12": "Desember",
};

const parsePeriod = (period: string | null | undefined) => {
    const trimmed = (period ?? "").trim();
    if (!trimmed) return { month: "", year: "" };
    const [rawMonth = "", rawYear = ""] = trimmed.split(/\s+/);
    const monthName = MONTH_NUMBER_TO_NAME[rawMonth] ?? rawMonth;
    return { month: monthName, year: rawYear };
};

const buildPeriod = (month: string, year: string) => {
    const name = (MONTH_NUMBER_TO_NAME[month] ?? month).trim();
    const cleanYear = (year ?? "").trim();
    return [name, cleanYear].filter(Boolean).join(" ");
};

export function FormL3CDialog({
    open,
    onClose,
    sptOpId,
    type,
    subType,
    assetOptions,
    editData,
    onSuccess,
}: FormL3CDialogProps) {
    const [formData, setFormData] = useState<FormState>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [openAssetType, setOpenAssetType] = useState(false);
    const [openCommercial, setOpenCommercial] = useState(false);
    const [openFiscal, setOpenFiscal] = useState(false);

    const [acquisitionCostDisplay, setAcquisitionCostDisplay] = useState("");
    const [beginingFiscalDisplay, setBeginingFiscalDisplay] = useState("");
    const [fiscalDepDisplay, setFiscalDepDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { month: selectedMonth, year: selectedYear } = parsePeriod(
        formData.period_acquisition,
    );

    const title = useMemo(() => {
        const cat = L3C_TYPE_LABEL[type];
        const sub = L3C_SUBTYPE_LABEL[subType];
        return `${cat} - ${sub}`;
    }, [type, subType]);

    useEffect(() => {
        if (editData) {
            const normalizedPeriod = parsePeriod(
                editData.period_acquisition ?? "",
            );
            setFormData({
                code: editData.code ?? "",
                asset_type: editData.asset_type ?? "",
                period_acquisition: buildPeriod(
                    normalizedPeriod.month,
                    normalizedPeriod.year,
                ),
                cost_acquisition: Number(editData.cost_acquisition ?? 0),
                begining_fiscal_book: Number(
                    editData.begining_fiscal_book ?? 0,
                ),
                method_commercial: editData.method_commercial ?? null,
                method_fiscal: editData.method_fiscal ?? null,
                fiscal_depreciation: Number(editData.fiscal_depreciation ?? 0),
                notes: editData.notes ?? null,
            });
            setAcquisitionCostDisplay(
                formatRupiahInput(Number(editData.cost_acquisition ?? 0)),
            );
            setBeginingFiscalDisplay(
                formatRupiahInput(Number(editData.begining_fiscal_book ?? 0)),
            );
            setFiscalDepDisplay(
                formatRupiahInput(Number(editData.fiscal_depreciation ?? 0)),
            );
        } else {
            setFormData(defaultFormData);
            setAcquisitionCostDisplay("");
            setBeginingFiscalDisplay("");
            setFiscalDepDisplay("");
        }
    }, [editData, open]);

    const clearError = (field: string) => {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleChange = (field: keyof FormState, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        clearError(field);
    };

    const handleRupiahChange = (
        field:
            | "cost_acquisition"
            | "begining_fiscal_book"
            | "fiscal_depreciation",
        displaySetter: (v: string) => void,
    ) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const numeric = parseNumber(e.target.value);
            handleChange(field, numeric);
            displaySetter(formatRupiahInput(numeric));
            clearError(field);
        };
    };

    const handleSubmit = () => {
        const acquisitionCost = parseNumber(acquisitionCostDisplay);
        const beginingFiscalBook = parseNumber(beginingFiscalDisplay);
        const fiscalDepreciation = parseNumber(fiscalDepDisplay);
        const { month: periodMonth, year: periodYear } = parsePeriod(
            formData.period_acquisition,
        );

        const validationErrors: Record<string, string> = {};

        if (!formData.asset_type) {
            validationErrors.asset_type = "Wajib diisi";
        }
        if (!periodMonth || !periodYear || periodYear.length !== 4) {
            validationErrors.period_acquisition = "Bulan dan tahun wajib diisi";
        }
        if (!acquisitionCostDisplay.trim()) {
            validationErrors.cost_acquisition = "Wajib diisi";
        }
        if (!beginingFiscalDisplay.trim()) {
            validationErrors.begining_fiscal_book = "Wajib diisi";
        }
        if (!fiscalDepDisplay.trim()) {
            validationErrors.fiscal_depreciation = "Wajib diisi";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        const normalizedPeriod = buildPeriod(periodMonth, periodYear);

        const payload = {
            id: editData?.id || uuidv4(),
            spt_op_id: sptOpId,
            type,
            sub_type: subType,
            code: formData.code,
            asset_type: formData.asset_type,
            period_acquisition: normalizedPeriod,
            cost_acquisition: acquisitionCost,
            begining_fiscal_book: beginingFiscalBook,
            method_commercial: formData.method_commercial ?? null,
            method_fiscal: formData.method_fiscal ?? null,
            fiscal_depreciation: fiscalDepreciation,
            notes: formData.notes ?? null,
        } as Record<string, any>;

        if (editData?.id) {
            router.put(
                route("spt.op.l3c.update", { id: editData.id }),
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
            router.post(route("spt.op.l3c.store"), payload, {
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
        onClose();
    };

    const methodLabel = (value: string | null | undefined) => value || "";

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-4xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>Kode Harta</Label>
                        <Input
                            value={formData.code}
                            onChange={(e) =>
                                handleChange("code", e.target.value)
                            }
                            placeholder=""
                            disabled
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Jenis Harta <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover
                                open={openAssetType}
                                onOpenChange={setOpenAssetType}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openAssetType}
                                        className="w-full justify-between font-normal"
                                    >
                                        {formData.asset_type || "Please Select"}
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
                                                {assetOptions.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                        onSelect={() => {
                                                            handleChange(
                                                                "asset_type",
                                                                opt.value,
                                                            );
                                                            if (opt.code) {
                                                                handleChange(
                                                                    "code",
                                                                    opt.code,
                                                                );
                                                            }
                                                            setOpenAssetType(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.asset_type ===
                                                                    opt.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {opt.value}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.asset_type && (
                                <p className="text-xs text-red-500">
                                    {errors.asset_type}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Bulan / Tahun Perolehan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Select
                                    value={selectedMonth}
                                    onValueChange={(value) => {
                                        handleChange(
                                            "period_acquisition",
                                            buildPeriod(value, selectedYear),
                                        );
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="Pilih bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MONTH_NAMES.map((month) => (
                                            <SelectItem
                                                key={month}
                                                value={month}
                                            >
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="number"
                                    className="w-full sm:w-24"
                                    placeholder="Tahun"
                                    min={1900}
                                    max={2100}
                                    value={selectedYear}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(
                                            /[^0-9]/g,
                                            "",
                                        );
                                        if (val.length > 4)
                                            val = val.slice(0, 4);
                                        handleChange(
                                            "period_acquisition",
                                            buildPeriod(selectedMonth, val),
                                        );
                                    }}
                                />
                            </div>
                            {errors.period_acquisition && (
                                <p className="text-xs text-red-500">
                                    {errors.period_acquisition}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Biaya Perolehan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={acquisitionCostDisplay}
                                onChange={handleRupiahChange(
                                    "cost_acquisition",
                                    setAcquisitionCostDisplay,
                                )}
                                placeholder=""
                            />
                            {errors.cost_acquisition && (
                                <p className="text-xs text-red-500">
                                    {errors.cost_acquisition}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Nilai Sisa Buku Fiskal Awal Tahun{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={beginingFiscalDisplay}
                                onChange={handleRupiahChange(
                                    "begining_fiscal_book",
                                    setBeginingFiscalDisplay,
                                )}
                                placeholder=""
                            />
                            {errors.begining_fiscal_book && (
                                <p className="text-xs text-red-500">
                                    {errors.begining_fiscal_book}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            METODE PENYUSUTAN/AMORTISASI
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-3 items-center">
                            <Label className="text-sm">KOMERSIAL</Label>
                            <Popover
                                open={openCommercial}
                                onOpenChange={setOpenCommercial}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCommercial}
                                        className="w-full justify-between font-normal"
                                    >
                                        {methodLabel(
                                            formData.method_commercial,
                                        ) || "Please Select"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,360px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari metode..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {METHOD_OPTIONS.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                        onSelect={() => {
                                                            handleChange(
                                                                "method_commercial",
                                                                opt.value,
                                                            );
                                                            setOpenCommercial(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.method_commercial ===
                                                                    opt.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {opt.value}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <Label className="text-sm">FISKAL</Label>
                            <Popover
                                open={openFiscal}
                                onOpenChange={setOpenFiscal}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openFiscal}
                                        className="w-full justify-between font-normal"
                                    >
                                        {methodLabel(formData.method_fiscal) ||
                                            "Please Select"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,360px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari metode..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {METHOD_OPTIONS.filter(
                                                    (opt) =>
                                                        opt.type === "Fiskal",
                                                ).map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                        onSelect={() => {
                                                            handleChange(
                                                                "method_fiscal",
                                                                opt.value,
                                                            );
                                                            setOpenFiscal(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.method_fiscal ===
                                                                    opt.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {opt.value}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Penyusutan/Amortisasi Fiskal Tahun Ini{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={fiscalDepDisplay}
                                onChange={handleRupiahChange(
                                    "fiscal_depreciation",
                                    setFiscalDepDisplay,
                                )}
                                placeholder=""
                            />
                            {errors.fiscal_depreciation && (
                                <p className="text-xs text-red-500">
                                    {errors.fiscal_depreciation}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>Keterangan</Label>
                        <Input
                            value={formData.notes ?? ""}
                            onChange={(e) =>
                                handleChange("notes", e.target.value)
                            }
                            placeholder=""
                        />
                    </div>
                </div>

                <DialogFooter className="p-4 border-t flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        <X className="w-4 h-4 mr-2" />
                        Tutup
                    </Button>
                    <Button
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

export default FormL3CDialog;
