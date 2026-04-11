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
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    L4_TAX_OBJECT_OPTIONS,
    L4AItem,
    type L4TaxObjectOption,
} from "./types";
import { cn } from "@/lib/utils";

interface FormL4ADialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L4AItem | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L4AItem, "id" | "spt_badan_id"> = {
    npwp: "",
    name: "",
    tax_object_code: null,
    tax_object_name: null,
    dpp: 0,
    rate: 0,
    pph_payable: 0,
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

const calculatePphPayable = (dpp: number, rate: number) => {
    const safeDpp = Number.isFinite(dpp) ? dpp : 0;
    const safeRate = Number.isFinite(rate) ? rate : 0;
    return Math.round((safeDpp * safeRate) / 100);
};

export function FormL4ADialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL4ADialogProps) {
    const [formData, setFormData] =
        useState<Omit<L4AItem, "id" | "spt_badan_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dppDisplay, setDppDisplay] = useState("");
    const [pphPayableDisplay, setPphPayableDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openTaxObjectCode, setOpenTaxObjectCode] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                npwp: editData.npwp || "",
                name: editData.name || "",
                tax_object_code: editData.tax_object_code || null,
                tax_object_name: editData.tax_object_name || null,
                dpp: editData.dpp || 0,
                rate: editData.rate || 0,
                pph_payable: editData.pph_payable || 0,
            });
            setDppDisplay(formatRupiahInput(editData.dpp || 0));
            setPphPayableDisplay(formatRupiahInput(editData.pph_payable || 0));
        } else {
            setFormData(defaultFormData);
            setDppDisplay("");
            setPphPayableDisplay("");
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

    const handleDppChange = makeMoneyHandler("dpp", setDppDisplay);

    useEffect(() => {
        const nextPphPayable = calculatePphPayable(formData.dpp, formData.rate);

        setFormData((prev) => {
            if (prev.pph_payable === nextPphPayable) return prev;
            return { ...prev, pph_payable: nextPphPayable };
        });

        setPphPayableDisplay(formatRupiahInput(nextPphPayable));
    }, [formData.dpp, formData.rate]);

    const handleTaxObjectSelect = (option: L4TaxObjectOption) => {
        setFormData((prev) => ({
            ...prev,
            tax_object_code: option.code,
            tax_object_name: option.name,
        }));
        setOpenTaxObjectCode(false);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.npwp) newErrors.npwp = "NPWP wajib diisi";
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
                route("spt.badan.l4a.update", { id: editData.id }),
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
            router.post(route("spt.badan.l4a.store"), payload, {
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
        setDppDisplay("");
        setPphPayableDisplay("");
        setErrors({});
        setOpenTaxObjectCode(false);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        Daftar Pemotongan/Pemungutan PPh oleh Pihak Ketiga
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* NPWP */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            NPWP <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.npwp}
                                onChange={(e) =>
                                    handleChange("npwp", e.target.value)
                                }
                                placeholder="Masukkan NPWP"
                                className={cn(errors.npwp && "border-red-500")}
                            />
                            {errors.npwp && (
                                <p className="text-sm text-red-500">
                                    {errors.npwp}
                                </p>
                            )}
                        </div>
                    </div>

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

                    {/* Kode Objek Pajak */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Kode Objek Pajak</Label>
                        <Popover
                            open={openTaxObjectCode}
                            onOpenChange={setOpenTaxObjectCode}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openTaxObjectCode}
                                    className="w-full justify-between font-normal"
                                >
                                    <span className="block truncate text-left">
                                        {formData.tax_object_code ||
                                            "Silakan Pilih"}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                portalled={false}
                                className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                            >
                                <Command>
                                    <CommandInput placeholder="Cari kode objek pajak..." />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ditemukan.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {L4_TAX_OBJECT_OPTIONS.map(
                                                (option) => (
                                                    <CommandItem
                                                        key={option.code}
                                                        value={`${option.code} ${option.name}`}
                                                        onSelect={() =>
                                                            handleTaxObjectSelect(
                                                                option,
                                                            )
                                                        }
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.tax_object_code ===
                                                                    option.code
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        <span className="truncate">
                                                            {option.code} -{" "}
                                                            {option.name}
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

                    {/* Nama Objek Pajak */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Nama Objek Pajak</Label>
                        <Input
                            value={formData.tax_object_name ?? ""}
                            placeholder="Nama objek pajak"
                            disabled
                        />
                    </div>

                    {/* DPP */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">DPP</Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={dppDisplay}
                                onChange={handleDppChange}
                                className="rounded-l-none text-right"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Tarif */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Tarif (%)</Label>
                        <div className="flex">
                            <Input
                                type="number"
                                value={formData.rate}
                                onChange={(e) =>
                                    handleChange(
                                        "rate",
                                        parseFloat(e.target.value) || 0,
                                    )
                                }
                                className="rounded-r-none text-right"
                                placeholder="0"
                                min={0}
                                step={0.01}
                            />
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-l-0 rounded-r-md">
                                %
                            </span>
                        </div>
                    </div>

                    {/* PPh Terutang */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">PPh Terutang</Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={pphPayableDisplay}
                                className="rounded-l-none text-right"
                                placeholder="0"
                                disabled
                                readOnly
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
                        Batal
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

export default FormL4ADialog;
