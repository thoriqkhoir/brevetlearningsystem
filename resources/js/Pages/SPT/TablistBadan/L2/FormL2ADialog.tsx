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
import { L2AItem } from "./types";
import { countries } from "@/data/spt-op-data";
import { cn } from "@/lib/utils";

interface FormL2ADialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L2AItem | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L2AItem, "id" | "spt_badan_id"> = {
    name: "",
    address: "",
    country: "",
    npwp: "",
    position: "",
    paid_up_capital_amount: 0,
    paid_up_capital_percentage: null,
    dividen: 0,
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

export function FormL2ADialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL2ADialogProps) {
    const [formData, setFormData] =
        useState<Omit<L2AItem, "id" | "spt_badan_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalAmountDisplay, setModalAmountDisplay] = useState("");
    const [dividenDisplay, setDividenDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openCountry, setOpenCountry] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                address: editData.address || "",
                country: editData.country || "",
                npwp: editData.npwp || "",
                position: editData.position || "",
                paid_up_capital_amount: editData.paid_up_capital_amount || 0,
                paid_up_capital_percentage:
                    editData.paid_up_capital_percentage ?? null,
                dividen: editData.dividen || 0,
            });
            setModalAmountDisplay(
                formatRupiahInput(editData.paid_up_capital_amount || 0),
            );
            setDividenDisplay(formatRupiahInput(editData.dividen || 0));
        } else {
            setFormData(defaultFormData);
            setModalAmountDisplay("");
            setDividenDisplay("");
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

    const handleModalAmountChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        const num = parseInt(raw) || 0;
        setFormData((prev) => ({ ...prev, paid_up_capital_amount: num }));
        setModalAmountDisplay(formatRupiahInput(num));
        if (errors.paid_up_capital_amount) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.paid_up_capital_amount;
                return next;
            });
        }
    };

    const handleDividenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        const num = parseInt(raw) || 0;
        setFormData((prev) => ({ ...prev, dividen: num }));
        setDividenDisplay(formatRupiahInput(num));
        if (errors.dividen) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.dividen;
                return next;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "Nama wajib diisi";
        if (!formData.country) newErrors.country = "Negara wajib diisi";
        if (!formData.position) newErrors.position = "Jabatan wajib diisi";
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
                route("spt.badan.l2a.update", { id: editData.id }),
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
            router.post(route("spt.badan.l2a.store"), payload, {
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
        setModalAmountDisplay("");
        setDividenDisplay("");
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
                        Pemegang Saham / Pemilik Modal
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Nama */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
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

                    {/* Alamat */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">Alamat</Label>
                        <Input
                            value={formData.address}
                            onChange={(e) =>
                                handleChange("address", e.target.value)
                            }
                            placeholder="Masukkan alamat"
                        />
                    </div>

                    {/* Negara */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
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
                                            errors.country && "border-red-500",
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
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">NPWP</Label>
                        <Input
                            value={formData.npwp}
                            onChange={(e) =>
                                handleChange("npwp", e.target.value)
                            }
                            placeholder="Masukkan NPWP"
                        />
                    </div>

                    {/* Jabatan / Posisi */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Jabatan <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.position}
                                onChange={(e) =>
                                    handleChange("position", e.target.value)
                                }
                                placeholder="Masukkan jabatan"
                                className={cn(
                                    errors.position && "border-red-500",
                                )}
                            />
                            {errors.position && (
                                <p className="text-sm text-red-500">
                                    {errors.position}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Modal Disetor */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">Modal Disetor</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                Rp
                            </span>
                            <Input
                                value={modalAmountDisplay}
                                onChange={handleModalAmountChange}
                                placeholder="0"
                                className="pl-9 text-right"
                            />
                        </div>
                    </div>

                    {/* Persentase Modal */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">Persentase Modal (%)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            step={0.01}
                            value={
                                formData.paid_up_capital_percentage ?? ""
                            }
                            onChange={(e) => {
                                const val = e.target.value;
                                handleChange(
                                    "paid_up_capital_percentage",
                                    val === "" ? null : parseFloat(val),
                                );
                            }}
                            placeholder="Contoh: 25.50"
                        />
                    </div>

                    {/* Dividen */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">Dividen/Pembagian Laba</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                Rp
                            </span>
                            <Input
                                value={dividenDisplay}
                                onChange={handleDividenChange}
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

export default FormL2ADialog;
