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
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { L2BItem } from "./types";
import { countries } from "@/data/spt-op-data";
import { cn } from "@/lib/utils";

interface FormL2BDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L2BItem | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L2BItem, "id" | "spt_badan_id"> = {
    name: "",
    country: "",
    npwp: "",
    position: "",
    equity_capital_amount: 0,
    equity_capital_percentage: null,
    debt_amount: 0,
    debt_year: "",
    debt_interest: 0,
    receivables_amount: 0,
    receivables_year: "",
    receivables_interest: 0,
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

export function FormL2BDialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL2BDialogProps) {
    const [formData, setFormData] =
        useState<Omit<L2BItem, "id" | "spt_badan_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [equityDisplay, setEquityDisplay] = useState("");
    const [debtDisplay, setDebtDisplay] = useState("");
    const [debtInterestDisplay, setDebtInterestDisplay] = useState("");
    const [receivablesDisplay, setReceivablesDisplay] = useState("");
    const [receivablesInterestDisplay, setReceivablesInterestDisplay] =
        useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openCountry, setOpenCountry] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                country: editData.country || "",
                npwp: editData.npwp || "",
                position: editData.position || "",
                equity_capital_amount: editData.equity_capital_amount || 0,
                equity_capital_percentage:
                    editData.equity_capital_percentage ?? null,
                debt_amount: editData.debt_amount || 0,
                debt_year: editData.debt_year || "",
                debt_interest: editData.debt_interest || 0,
                receivables_amount: editData.receivables_amount || 0,
                receivables_year: editData.receivables_year || "",
                receivables_interest: editData.receivables_interest || 0,
            });
            setEquityDisplay(
                formatRupiahInput(editData.equity_capital_amount || 0),
            );
            setDebtDisplay(formatRupiahInput(editData.debt_amount || 0));
            setDebtInterestDisplay(
                formatRupiahInput(editData.debt_interest || 0),
            );
            setReceivablesDisplay(
                formatRupiahInput(editData.receivables_amount || 0),
            );
            setReceivablesInterestDisplay(
                formatRupiahInput(editData.receivables_interest || 0),
            );
        } else {
            setFormData(defaultFormData);
            setEquityDisplay("");
            setDebtDisplay("");
            setDebtInterestDisplay("");
            setReceivablesDisplay("");
            setReceivablesInterestDisplay("");
        }
        setErrors({});
    }, [editData, open]);

    const handleChange = (
        field: keyof typeof formData,
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

    const handleCountrySelect = (selectedValue: string) => {
        const selected = countries.find((c) => c.value === selectedValue);
        if (selected) handleChange("country", selected.value);
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
            if (errors[field]) {
                setErrors((prev) => {
                    const next = { ...prev };
                    delete next[field as string];
                    return next;
                });
            }
        };

    const handleEquityChange = makeMoneyHandler(
        "equity_capital_amount",
        setEquityDisplay,
    );
    const handleDebtChange = makeMoneyHandler("debt_amount", setDebtDisplay);
    const handleDebtInterestChange = makeMoneyHandler(
        "debt_interest",
        setDebtInterestDisplay,
    );
    const handleReceivablesChange = makeMoneyHandler(
        "receivables_amount",
        setReceivablesDisplay,
    );
    const handleReceivablesInterestChange = makeMoneyHandler(
        "receivables_interest",
        setReceivablesInterestDisplay,
    );

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "Nama wajib diisi";
        if (!formData.country) newErrors.country = "Negara wajib diisi";
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
                route("spt.badan.l2b.update", { id: editData.id }),
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
            router.post(route("spt.badan.l2b.store"), payload, {
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
        setEquityDisplay("");
        setDebtDisplay("");
        setDebtInterestDisplay("");
        setReceivablesDisplay("");
        setReceivablesInterestDisplay("");
        setErrors({});
        onClose();
    };

    const getCountryLabel = (value: string) =>
        countries.find((c) => c.value === value)?.label || value;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        Penyertaan Modal / Utang / Piutang pada Perusahaan Afiliasi
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Nama */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama <span className="text-red-500">*</span>
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
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Negara <span className="text-red-500">*</span>
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
                                            errors.country &&
                                                "border-red-500",
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
                                    className="w-[min(90vw,400px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
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
                            {errors.country && (
                                <p className="text-sm text-red-500">
                                    {errors.country}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* NPWP */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">NPWP</Label>
                        <Input
                            value={formData.npwp}
                            onChange={(e) =>
                                handleChange("npwp", e.target.value)
                            }
                            placeholder="Masukkan NPWP"
                        />
                    </div>

                    {/* Jabatan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Jabatan</Label>
                        <Input
                            value={formData.position}
                            onChange={(e) =>
                                handleChange("position", e.target.value)
                            }
                            placeholder="Masukkan jabatan"
                        />
                    </div>


                    {/* Modal Disetor */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Modal Disetor (Rp)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                Rp
                            </span>
                            <Input
                                value={equityDisplay}
                                onChange={handleEquityChange}
                                placeholder="0"
                                className="pl-9 text-right"
                            />
                        </div>
                    </div>

                    {/* Persentase Modal */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Persentase Modal (%)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            step={0.01}
                            value={formData.equity_capital_percentage ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                handleChange(
                                    "equity_capital_percentage",
                                    val === "" ? null : parseFloat(val),
                                );
                            }}
                            placeholder="Contoh: 25.50"
                        />
                    </div>

                  

                    {/* Utang */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Jumlah Utang (Rp)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                Rp
                            </span>
                            <Input
                                value={debtDisplay}
                                onChange={handleDebtChange}
                                placeholder="0"
                                className="pl-9 text-right"
                            />
                        </div>
                    </div>

                    {/* Tahun Utang */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Tahun Utang</Label>
                        <Input
                            value={formData.debt_year}
                            onChange={(e) =>
                                handleChange("debt_year", e.target.value)
                            }
                            placeholder="Contoh: 2024"
                        />
                    </div>

                    {/* Bunga Utang */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Bunga Utang (Rp)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                Rp
                            </span>
                            <Input
                                value={debtInterestDisplay}
                                onChange={handleDebtInterestChange}
                                placeholder="0"
                                className="pl-9 text-right"
                            />
                        </div>
                    </div>


                    {/* Piutang */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Jumlah Piutang (Rp)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                Rp
                            </span>
                            <Input
                                value={receivablesDisplay}
                                onChange={handleReceivablesChange}
                                placeholder="0"
                                className="pl-9 text-right"
                            />
                        </div>
                    </div>

                    {/* Tahun Piutang */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Tahun Piutang</Label>
                        <Input
                            value={formData.receivables_year}
                            onChange={(e) =>
                                handleChange(
                                    "receivables_year",
                                    e.target.value,
                                )
                            }
                            placeholder="Contoh: 2024"
                        />
                    </div>

                    {/* Bunga Piutang */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Bunga Piutang (Rp)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                Rp
                            </span>
                            <Input
                                value={receivablesInterestDisplay}
                                onChange={handleReceivablesInterestChange}
                                placeholder="0"
                                className="pl-9 text-right"
                            />
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
