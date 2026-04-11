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
import { L4B_INCOME_TYPE_OPTIONS, L4BItem } from "./types";
import { cn } from "@/lib/utils";

interface FormL4BDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L4BItem | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L4BItem, "id" | "spt_badan_id"> = {
    code: "",
    income_type: "",
    source_income: null,
    gross_income: 0,
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

export function FormL4BDialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL4BDialogProps) {
    const [formData, setFormData] =
        useState<Omit<L4BItem, "id" | "spt_badan_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [grossIncomeDisplay, setGrossIncomeDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openIncomeType, setOpenIncomeType] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                code: editData.code || "",
                income_type: editData.income_type || "",
                source_income: editData.source_income || null,
                gross_income: editData.gross_income || 0,
            });
            setGrossIncomeDisplay(
                formatRupiahInput(editData.gross_income || 0),
            );
        } else {
            setFormData(defaultFormData);
            setGrossIncomeDisplay("");
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

    const handleGrossIncomeChange = makeMoneyHandler(
        "gross_income",
        setGrossIncomeDisplay,
    );

    const handleIncomeTypeSelect = (value: string) => {
        const selected = L4B_INCOME_TYPE_OPTIONS.find(
            (option) => option.value === value,
        );

        setFormData((prev) => ({
            ...prev,
            income_type: value,
            code: selected?.code ?? prev.code,
        }));

        setOpenIncomeType(false);

        if (errors.income_type || errors.code) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.income_type;
                delete next.code;
                return next;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.code) newErrors.code = "Kode wajib diisi";
        if (!formData.income_type)
            newErrors.income_type = "Jenis penghasilan wajib diisi";
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
                route("spt.badan.l4b.update", { id: editData.id }),
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
            router.post(route("spt.badan.l4b.store"), payload, {
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
        setGrossIncomeDisplay("");
        setErrors({});
        setOpenIncomeType(false);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        Penghasilan yang Tidak Termasuk Objek Pajak
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Kode */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Kode <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.code}
                                onChange={(e) =>
                                    handleChange("code", e.target.value)
                                }
                                placeholder="kode"
                                className={cn(errors.code && "border-red-500")}
                                disabled
                            />
                            {errors.code && (
                                <p className="text-sm text-red-500">
                                    {errors.code}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Jenis Penghasilan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
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
                                        <span className="block truncate text-left">
                                            {formData.income_type ||
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
                                        <CommandInput placeholder="Cari jenis penghasilan..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {L4B_INCOME_TYPE_OPTIONS.map(
                                                    (option) => (
                                                        <CommandItem
                                                            key={`${option.code}-${option.value}`}
                                                            value={`${option.code} ${option.label}`}
                                                            onSelect={() =>
                                                                handleIncomeTypeSelect(
                                                                    option.value,
                                                                )
                                                            }
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formData.income_type ===
                                                                        option.value
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
                            {errors.income_type && (
                                <p className="text-sm text-red-500">
                                    {errors.income_type}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sumber Penghasilan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Sumber Penghasilan</Label>
                        <Input
                            value={formData.source_income ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "source_income",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Masukkan sumber penghasilan"
                        />
                    </div>

                    {/* Penghasilan Bruto */}
                    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-4">
                        <Label className="pt-2">Penghasilan Bruto</Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={grossIncomeDisplay}
                                onChange={handleGrossIncomeChange}
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

export default FormL4BDialog;
