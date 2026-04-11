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
import { router } from "@inertiajs/react";
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { L2AItem, MasterObjectOption } from "./types";

interface FormL2ADialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    masterObjects: MasterObjectOption[];
    editData?: L2AItem | null;
    onSuccess?: () => void;
}

type FormData = Omit<L2AItem, "id" | "spt_op_id" | "created_at" | "updated_at">;

const defaultFormData: FormData = {
    object_id: 0,
    tax_withholder_id: "",
    tax_withholder_name: "",
    dpp: 0,
    pph_owed: 0,
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

export function FormL2ADialog({
    open,
    onClose,
    sptOpId,
    masterObjects,
    editData,
    onSuccess,
}: FormL2ADialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [dppDisplay, setDppDisplay] = useState("0");
    const [pphDisplay, setPphDisplay] = useState("0");

    const [openObject, setOpenObject] = useState(false);

    const selectedObject = useMemo(() => {
        return masterObjects.find(
            (m) => Number(m.id) === Number(formData.object_id),
        );
    }, [masterObjects, formData.object_id]);

    useEffect(() => {
        if (editData) {
            setFormData({
                object_id: Number(editData.object_id ?? 0),
                tax_withholder_id: editData.tax_withholder_id || "",
                tax_withholder_name: editData.tax_withholder_name || "",
                dpp: Number(editData.dpp ?? 0),
                pph_owed: Number(editData.pph_owed ?? 0),
            });
            setDppDisplay(formatRupiahInput(Number(editData.dpp ?? 0)));
            setPphDisplay(formatRupiahInput(Number(editData.pph_owed ?? 0)));
        } else {
            setFormData(defaultFormData);
            setDppDisplay("0");
            setPphDisplay("0");
        }
        setErrors({});
    }, [editData, open]);

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

    const handleWithholderIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
        handleChange("tax_withholder_id", digits);
    };

    const handleDppChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, dpp: numericValue }));
        setDppDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.dpp) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.dpp;
                return newErrors;
            });
        }
    };

    const handlePphChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const numericValue = parseInt(rawValue) || 0;
        setFormData((prev) => ({ ...prev, pph_owed: numericValue }));
        setPphDisplay(formatRupiahInput(numericValue));
        // Clear error when user starts typing
        if (errors.pph_owed) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.pph_owed;
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.tax_withholder_id) {
            newErrors.tax_withholder_id = "NPWP Pemotong/Pemungut wajib diisi";
        } else if (formData.tax_withholder_id.length !== 16) {
            newErrors.tax_withholder_id = "NPWP harus 16 digit";
        }
        if (!formData.tax_withholder_name) {
            newErrors.tax_withholder_name =
                "Nama Pemotong/Pemungut wajib diisi";
        }
        if (!formData.object_id || formData.object_id === 0) {
            newErrors.object_id = "Kode Objek Pajak wajib diisi";
        }
        if (!formData.dpp || formData.dpp === 0) {
            newErrors.dpp = "Dasar Pengenaan Pajak wajib diisi";
        }
        if (!formData.pph_owed || formData.pph_owed === 0) {
            newErrors.pph_owed = "PPh Terutang wajib diisi";
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
            object_id: Number(formData.object_id),
            id: editData?.id || uuidv4(),
            spt_op_id: sptOpId,
        };

        if (editData?.id) {
            router.put(
                route("spt.op.l2a.update", { id: editData.id }),
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
            router.post(route("spt.op.l2a.store"), payload, {
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
        setDppDisplay("0");
        setPphDisplay("0");
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-3xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        A. PENGHASILAN YANG DIKENAKAN PPh FINAL
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            NPWP Pemotong/Pemungut{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                inputMode="numeric"
                                value={formData.tax_withholder_id}
                                onChange={handleWithholderIdChange}
                                maxLength={16}
                                placeholder="Masukkan NPWP"
                                className={cn(
                                    errors.tax_withholder_id &&
                                        "border-red-500",
                                )}
                            />
                            {errors.tax_withholder_id && (
                                <p className="text-sm text-red-500">
                                    {errors.tax_withholder_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama Pemotong/Pemungut{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.tax_withholder_name}
                                onChange={(e) =>
                                    handleChange(
                                        "tax_withholder_name",
                                        e.target.value,
                                    )
                                }
                                placeholder="Masukkan nama pemotong/pemungut"
                                className={cn(
                                    errors.tax_withholder_name &&
                                        "border-red-500",
                                )}
                            />
                            {errors.tax_withholder_name && (
                                <p className="text-sm text-red-500">
                                    {errors.tax_withholder_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Jenis Penghasilan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover
                                open={openObject}
                                onOpenChange={setOpenObject}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openObject}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.object_id &&
                                                "border-red-500",
                                        )}
                                    >
                                        {selectedObject?.name ||
                                            "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,640px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari jenis penghasilan..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {masterObjects.map((opt) => (
                                                    <CommandItem
                                                        key={opt.id}
                                                        value={`${opt.name} ${opt.code}`}
                                                        onSelect={() => {
                                                            handleChange(
                                                                "object_id",
                                                                opt.id,
                                                            );
                                                            setOpenObject(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.object_id ===
                                                                    opt.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        <span className="font-medium">
                                                            {opt.name}
                                                        </span>
                                                        <span className="ml-2 text-muted-foreground">
                                                            {opt.code}
                                                        </span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.object_id && (
                                <p className="text-sm text-red-500">
                                    {errors.object_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Kode Objek Pajak{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={selectedObject?.code ?? ""}
                                disabled
                                readOnly
                                className="bg-muted"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Dasar Pengenaan Pajak (Rupiah){" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={dppDisplay}
                                    onChange={handleDppChange}
                                    placeholder="0"
                                    className={cn(
                                        "pl-10",
                                        errors.dpp && "border-red-500",
                                    )}
                                />
                            </div>
                            {errors.dpp && (
                                <p className="text-sm text-red-500">
                                    {errors.dpp}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            PPh Terutang <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    type="text"
                                    value={pphDisplay}
                                    onChange={handlePphChange}
                                    placeholder="0"
                                    className={cn(
                                        "pl-10",
                                        errors.pph_owed && "border-red-500",
                                    )}
                                />
                            </div>
                            {errors.pph_owed && (
                                <p className="text-sm text-red-500">
                                    {errors.pph_owed}
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
