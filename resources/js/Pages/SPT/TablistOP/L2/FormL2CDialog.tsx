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
import { countries } from "@/data/spt-op-data";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Save, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L2C_INCOME_TYPE_OPTIONS, type L2CItem } from "./types";

interface FormL2CDialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L2CItem | null;
    onSuccess?: () => void;
}

type FormData = Omit<L2CItem, "id" | "spt_op_id" | "created_at" | "updated_at">;

const defaultFormData: FormData = {
    provider_name: "",
    country: "",
    transaction_date: "",
    income_type: "",
    income_code: "",
    net_income: 0,
    tax_foreign_currency: 0,
    amount: 0,
    currency: "",
    tax_credit: 0,
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

const formatNumberInput = (value: number) => {
    if (value === 0) return "0";
    if (!value) return "0";
    return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
};

const uniqueCurrencies = Array.from(
    new Set(
        countries
            .filter((c) => (c.currency ?? "").trim())
            .map((c) => `${c.currency} ${c.label}`),
    ),
).sort();

export function FormL2CDialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: FormL2CDialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [netDisplay, setNetDisplay] = useState("0");
    const [taxForeignDisplay, setTaxForeignDisplay] = useState("0");
    const [amountDisplay, setAmountDisplay] = useState("0");
    const [creditDisplay, setCreditDisplay] = useState("0");
    const [amountManuallyEdited, setAmountManuallyEdited] = useState(false);

    const [openCountry, setOpenCountry] = useState(false);
    const [openCurrency, setOpenCurrency] = useState(false);
    const [openIncomeType, setOpenIncomeType] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const countryLabel = useMemo(() => {
        return countries.find((c) => c.value === formData.country)?.label;
    }, [formData.country]);

    const incomeCodeValue = useMemo(() => {
        const selected = L2C_INCOME_TYPE_OPTIONS.find(
            (opt) => opt.name === (formData.income_type ?? ""),
        );
        return selected?.code ?? "";
    }, [formData.income_type]);

    useEffect(() => {
        if (editData) {
            setFormData({
                provider_name: editData.provider_name || "",
                country: editData.country || "",
                transaction_date: editData.transaction_date || "",
                income_type: editData.income_type || "",
                income_code: editData.income_code || "",
                net_income: Number(editData.net_income ?? 0),
                tax_foreign_currency: Number(
                    editData.tax_foreign_currency ?? 0,
                ),
                amount: Number(editData.amount ?? 0),
                currency: editData.currency || "",
                tax_credit: Number(editData.tax_credit ?? 0),
            });
            setNetDisplay(formatRupiahInput(Number(editData.net_income ?? 0)));
            setTaxForeignDisplay(
                formatNumberInput(Number(editData.tax_foreign_currency ?? 0)),
            );
            setAmountDisplay(formatRupiahInput(Number(editData.amount ?? 0)));
            setCreditDisplay(
                formatRupiahInput(Number(editData.tax_credit ?? 0)),
            );
            setAmountManuallyEdited(false);
        } else {
            setFormData(defaultFormData);
            setNetDisplay("0");
            setTaxForeignDisplay("0");
            setAmountDisplay("0");
            setCreditDisplay("0");
            setAmountManuallyEdited(false);
        }
        setErrors({});
    }, [editData, open]);

    useEffect(() => {
        if (!formData.income_type) {
            setFormData((prev) => ({
                ...prev,
                income_code: "",
            }));
            return;
        }
        if (!incomeCodeValue) return;
        setFormData((prev) => ({
            ...prev,
            income_code: incomeCodeValue,
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

    const handleNetChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, net_income: numericValue }));
        setNetDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.net_income) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.net_income;
                return newErrors;
            });
        }
    };

    const handleTaxForeignChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9.,]/g, "");
        // Allow decimal input with comma or dot
        const normalizedValue = rawValue.replace(/\./g, "").replace(",", ".");
        const numericValue = parseFloat(normalizedValue) || 0;
        setFormData((prev) => ({
            ...prev,
            tax_foreign_currency: numericValue,
        }));
        setTaxForeignDisplay(formatNumberInput(numericValue));

        // Auto-fill amount if not manually edited
        if (!amountManuallyEdited) {
            const roundedAmount = Math.round(numericValue);
            setFormData((prev) => ({ ...prev, amount: roundedAmount }));
            setAmountDisplay(formatRupiahInput(roundedAmount));
        }

        // Clear error when user starts typing
        if (errors.tax_foreign_currency) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.tax_foreign_currency;
                return newErrors;
            });
        }
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, amount: numericValue }));
        setAmountDisplay(formatRupiahInput(numericValue));
        setAmountManuallyEdited(true); // Mark as manually edited
        // Clear error when user starts typing
        if (errors.amount) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.amount;
                return newErrors;
            });
        }
    };

    const handleCreditChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, tax_credit: numericValue }));
        setCreditDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.tax_credit) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.tax_credit;
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.provider_name) {
            newErrors.provider_name =
                "Nama Sumber/Pemberi Penghasilan wajib diisi";
        }
        if (!formData.country) {
            newErrors.country = "Negara Sumber/Pemberi Penghasilan wajib diisi";
        }
        if (!formData.transaction_date) {
            newErrors.transaction_date = "Tanggal Transaksi wajib diisi";
        }
        if (!formData.income_type) {
            newErrors.income_type = "Jenis Penghasilan wajib diisi";
        }
        if (!formData.income_code) {
            newErrors.income_code = "Kode Penghasilan wajib diisi";
        }
        if (!formData.net_income || formData.net_income === 0) {
            newErrors.net_income = "Penghasilan Neto wajib diisi";
        }
        if (
            formData.tax_foreign_currency === undefined ||
            formData.tax_foreign_currency === 0
        ) {
            newErrors.tax_foreign_currency =
                "Pajak dalam Mata Uang Asing wajib diisi";
        }
        if (!formData.amount || formData.amount === 0) {
            newErrors.amount = "Pajak dalam Rupiah wajib diisi";
        }
        if (!formData.currency) {
            newErrors.currency = "Mata Uang wajib diisi";
        }
        if (!formData.tax_credit || formData.tax_credit === 0) {
            newErrors.tax_credit = "Kredit Pajak wajib diisi";
        } else if (formData.tax_credit > formData.amount) {
            newErrors.tax_credit =
                "Kredit Pajak, yang Dapat Dihitung (Pasal 24) tidak boleh lebih dari Pajak yang Terutang/Dibayar di Luar Negeri - Jumlah dalam Rupiah";
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
                route("spt.op.l2c.update", { id: editData.id }),
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
            router.post(route("spt.op.l2c.store"), payload, {
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
        setIsSubmitting(false);
        setFormData(defaultFormData);
        setNetDisplay("0");
        setTaxForeignDisplay("0");
        setAmountDisplay("0");
        setCreditDisplay("0");
        setAmountManuallyEdited(false);
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-3xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>Penghasilan Luar Negeri</DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama Sumber/Pemberi Penghasilan
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.provider_name}
                                onChange={(e) =>
                                    handleChange(
                                        "provider_name",
                                        e.target.value,
                                    )
                                }
                                placeholder="Masukkan nama"
                                className={cn(
                                    errors.provider_name && "border-red-500",
                                )}
                            />
                            {errors.provider_name && (
                                <p className="text-sm text-red-500">
                                    {errors.provider_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Negara Sumber/Pemberi Penghasilan
                            <span className="text-red-500">*</span>
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
                                            errors.country && "border-red-500",
                                        )}
                                    >
                                        {countryLabel || "Silakan Pilih"}
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
                                                                "country",
                                                                opt.value,
                                                            );
                                                            handleChange(
                                                                "currency",
                                                                opt.currency
                                                                    ? `${opt.currency} ${opt.label}`
                                                                    : "",
                                                            );
                                                            setOpenCountry(
                                                                false,
                                                            );
                                                        }}
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

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Tanggal Transaksi{" "}
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
                                            !formData.transaction_date &&
                                                "text-muted-foreground",
                                            errors.transaction_date &&
                                                "border-red-500",
                                        )}
                                        onClick={() => setIsCalendarOpen(true)}
                                    >
                                        {formData.transaction_date ? (
                                            format(
                                                new Date(
                                                    formData.transaction_date,
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
                                            formData.transaction_date
                                                ? new Date(
                                                      formData.transaction_date,
                                                  )
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            handleChange(
                                                "transaction_date",
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
                            {errors.transaction_date && (
                                <p className="text-sm text-red-500">
                                    {errors.transaction_date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Jenis Penghasilan{" "}
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
                                            errors.income_type &&
                                                "border-red-500",
                                        )}
                                    >
                                        {formData.income_type ||
                                            "Silakan Pilih"}
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
                                                {L2C_INCOME_TYPE_OPTIONS.map(
                                                    (opt) => (
                                                        <CommandItem
                                                            key={opt.code}
                                                            value={opt.name}
                                                            onSelect={() => {
                                                                handleChange(
                                                                    "income_type",
                                                                    opt.name,
                                                                );
                                                                setOpenIncomeType(
                                                                    false,
                                                                );
                                                            }}
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
                                                    ),
                                                )}
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

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Kode Penghasilan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.income_code ?? ""}
                                onChange={(e) =>
                                    handleChange("income_code", e.target.value)
                                }
                                disabled
                                readOnly
                                className={cn(
                                    "bg-muted",
                                    errors.income_code && "border-red-500",
                                )}
                            />
                            {errors.income_code && (
                                <p className="text-sm text-red-500">
                                    {errors.income_code}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Penghasilan Neto
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={netDisplay}
                                    onChange={handleNetChange}
                                    placeholder="0"
                                    className={cn(
                                        "pl-10",
                                        errors.net_income && "border-red-500",
                                    )}
                                />
                            </div>
                            {errors.net_income && (
                                <p className="text-sm text-red-500">
                                    {errors.net_income}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Pajak yang Dibayar/Dipotong/Terutang di Luar Negeri
                            dalam Mata Uang Asing{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                type="text"
                                value={taxForeignDisplay}
                                onChange={handleTaxForeignChange}
                                placeholder="0"
                                className={cn(
                                    errors.tax_foreign_currency &&
                                        "border-red-500",
                                )}
                            />
                            {errors.tax_foreign_currency && (
                                <p className="text-sm text-red-500">
                                    {errors.tax_foreign_currency}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Mata Uang<span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover
                                open={openCurrency}
                                onOpenChange={setOpenCurrency}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCurrency}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.currency && "border-red-500",
                                        )}
                                    >
                                        {formData.currency || "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari mata uang..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {uniqueCurrencies.map((cur) => (
                                                    <CommandItem
                                                        key={cur}
                                                        value={cur}
                                                        onSelect={() => {
                                                            handleChange(
                                                                "currency",
                                                                cur,
                                                            );
                                                            setOpenCurrency(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.currency ===
                                                                    cur
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {cur}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.currency && (
                                <p className="text-sm text-red-500">
                                    {errors.currency}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Pajak yang Dibayar/Dipotong/Terutang di Luar Negeri
                            dalam Rupiah <span className="text-red-500">*</span>
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

                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Kredit Pajak yang Dapat Diperhitungkan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={creditDisplay}
                                    onChange={handleCreditChange}
                                    placeholder="0"
                                    className={cn(
                                        "pl-10",
                                        errors.tax_credit && "border-red-500",
                                    )}
                                />
                            </div>
                            {errors.tax_credit && (
                                <p className="text-sm text-red-500">
                                    {errors.tax_credit}
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
                        type="button"
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

export default FormL2CDialog;
