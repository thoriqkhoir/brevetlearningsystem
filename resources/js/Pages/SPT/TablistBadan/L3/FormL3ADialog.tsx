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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { L3AItem, TYPE_INCOME_OPTIONS } from "./types";
import { countries } from "@/data/spt-op-data";
import { cn } from "@/lib/utils";

interface FormL3ADialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L3AItem | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L3AItem, "id" | "spt_badan_id"> = {
    name: "",
    country: null,
    pph_date: null,
    type_income: null,
    net_income: 0,
    pph_amount: 0,
    pph_currency: null,
    pph_foreign_amount: 0,
    tax_credit: 0,
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

const uniqueCurrencies = Array.from(
    new Set(
        countries
            .filter((c) => (c.currency ?? "").trim())
            .map((c) => `${c.currency} ${c.label}`),
    ),
).sort();

export function FormL3ADialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL3ADialogProps) {
    const [formData, setFormData] =
        useState<Omit<L3AItem, "id" | "spt_badan_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [netIncomeDisplay, setNetIncomeDisplay] = useState("");
    const [pphAmountDisplay, setPphAmountDisplay] = useState("");
    const [pphForeignAmountDisplay, setPphForeignAmountDisplay] = useState("");
    const [taxCreditDisplay, setTaxCreditDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openCountry, setOpenCountry] = useState(false);
    const [openCurrency, setOpenCurrency] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                country: editData.country || null,
                pph_date: editData.pph_date
                    ? editData.pph_date.substring(0, 10)
                    : null,
                type_income: editData.type_income || null,
                net_income: editData.net_income || 0,
                pph_amount: editData.pph_amount || 0,
                pph_currency: editData.pph_currency || null,
                pph_foreign_amount: editData.pph_foreign_amount || 0,
                tax_credit: editData.tax_credit || 0,
            });
            setNetIncomeDisplay(formatRupiahInput(editData.net_income || 0));
            setPphAmountDisplay(formatRupiahInput(editData.pph_amount || 0));
            setPphForeignAmountDisplay(
                formatRupiahInput(editData.pph_foreign_amount || 0),
            );
            setTaxCreditDisplay(formatRupiahInput(editData.tax_credit || 0));
        } else {
            setFormData(defaultFormData);
            setNetIncomeDisplay("");
            setPphAmountDisplay("");
            setPphForeignAmountDisplay("");
            setTaxCreditDisplay("");
        }
        setErrors({});
    }, [editData, open]);

    const handleChange = (
        field: keyof typeof formData,
        value: string | number | null,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as string]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field as string];
                return next;
            });
        }
    };

    const handleCountrySelect = (selectedValue: string) => {
        const selected = countries.find((c) => c.value === selectedValue);
        if (selected) {
            handleChange("country", selected.value);
            handleChange(
                "pph_currency",
                selected.currency
                    ? `${selected.currency} ${selected.label}`
                    : null,
            );
        }
        setOpenCountry(false);
    };

    const makeMoneyHandler =
        (
            field: keyof typeof formData,
            setDisplay: React.Dispatch<React.SetStateAction<string>>,
        ) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            const num = parseInt(raw) || 0;
            setFormData((prev) => ({ ...prev, [field]: num }));
            setDisplay(formatRupiahInput(num));
            if (errors[field as string]) {
                setErrors((prev) => {
                    const next = { ...prev };
                    delete next[field as string];
                    return next;
                });
            }
        };

    const handleNetIncomeChange = makeMoneyHandler(
        "net_income",
        setNetIncomeDisplay,
    );
    const handlePphAmountChange = makeMoneyHandler(
        "pph_amount",
        setPphAmountDisplay,
    );
    const handlePphForeignAmountChange = makeMoneyHandler(
        "pph_foreign_amount",
        setPphForeignAmountDisplay,
    );
    const handleTaxCreditChange = makeMoneyHandler(
        "tax_credit",
        setTaxCreditDisplay,
    );

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "Nama wajib diisi";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                route("spt.badan.l3a.update", { id: editData.id }),
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
            router.post(route("spt.badan.l3a.store"), payload, {
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
        setNetIncomeDisplay("");
        setPphAmountDisplay("");
        setPphForeignAmountDisplay("");
        setTaxCreditDisplay("");
        setErrors({});
        onClose();
    };

    const getCountryLabel = (value: string | null) =>
        countries.find((c) => c.value === value)?.label || value || "";

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-3xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>PENGHASILAN DARI LUAR NEGERI</DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Nama */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama Pemotong Pajak{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                placeholder="Masukkan nama"
                                className={cn(errors.name && "border-red-500")}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Negara */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">NEGARA</Label>
                        <Popover
                            open={openCountry}
                            onOpenChange={setOpenCountry}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCountry}
                                    className="w-full justify-between font-normal"
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
                                    <CommandInput placeholder="Cari negara..." />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ditemukan.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {countries.map((c) => (
                                                <CommandItem
                                                    key={c.value}
                                                    value={c.label}
                                                    onSelect={() =>
                                                        handleCountrySelect(
                                                            c.value,
                                                        )
                                                    }
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            formData.country ===
                                                                c.value
                                                                ? "opacity-100"
                                                                : "opacity-0",
                                                        )}
                                                    />
                                                    {c.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Tanggal PPh */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Tanggal PPh Terutang/Dibayar/Dipotong{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={isCalendarOpen}
                            onOpenChange={setIsCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between pl-3 text-left font-normal",
                                        !formData.pph_date &&
                                            "text-muted-foreground",
                                    )}
                                    onClick={() => setIsCalendarOpen(true)}
                                >
                                    {formData.pph_date ? (
                                        format(
                                            new Date(formData.pph_date),
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
                                        formData.pph_date
                                            ? new Date(formData.pph_date)
                                            : undefined
                                    }
                                    onSelect={(date) => {
                                        handleChange(
                                            "pph_date",
                                            date
                                                ? format(date, "yyyy-MM-dd")
                                                : null,
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
                    </div>

                    {/* Jenis Penghasilan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Jenis Penghasilan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.type_income ?? ""}
                            onValueChange={(val) =>
                                handleChange("type_income", val || null)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Silakan Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                                {TYPE_INCOME_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Penghasilan Neto */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Penghasilan Neto{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={netIncomeDisplay}
                                onChange={handleNetIncomeChange}
                                className="rounded-l-none text-right"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* PPh Terutang (Rp) */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            PPh Terutang/Dibayar/Dipotong di Luar Negeri{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={pphAmountDisplay}
                                onChange={handlePphAmountChange}
                                className="rounded-l-none text-right"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Mata Uang */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Mata Uang <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openCurrency}
                            onOpenChange={setOpenCurrency}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCurrency}
                                    className="w-full justify-between font-normal"
                                >
                                    {formData.pph_currency || "Silakan Pilih"}
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
                                                            "pph_currency",
                                                            cur,
                                                        );
                                                        setOpenCurrency(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            formData.pph_currency ===
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
                    </div>

                    {/* PPh Terutang (Valas) */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            PPh yang Dibayar/Dipotong/Terutang di Luar Negeri
                            dalam Mata Uang Asing{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={pphForeignAmountDisplay}
                                onChange={handlePphForeignAmountChange}
                                className="rounded-l-none text-right"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Kredit Pajak */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Kredit Pajak yang Dapat Diperhitungkan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={taxCreditDisplay}
                                onChange={handleTaxCreditChange}
                                className="rounded-l-none text-right"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t flex justify-end gap-2">
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

export default FormL3ADialog;
