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
import { Calendar } from "@/Components/ui/calendar";
import { router } from "@inertiajs/react";
import { Save, X, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { L3DAItem } from "./types";

type FormState = Omit<L3DAItem, "id" | "spt_op_id">;

const defaultFormData: FormState = {
    entertainment_date: null,
    entertainment_location: "",
    address: "",
    entertainment_type: "",
    entertainment_amount: 0,
    related_party: "",
    position: "",
    company_name: "",
    business_type: "",
    notes: "",
};

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const parseNumber = (raw: string) => {
    const numeric = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
};

const formatRupiahInput = (value: number) => {
    if (!value) return "";
    return rupiahFormatter.format(value).replace("Rp", "").trim();
};

const parseDateValue = (value: string | null | undefined) => {
    if (!value) return undefined;
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const formatDateLabel = (value: string | null | undefined) => {
    const parsed = parseDateValue(value);
    if (!parsed) return "";
    return parsed.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

export function FormL3DADialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L3DAItem | null;
    onSuccess?: () => void;
}) {
    const [formData, setFormData] = useState<FormState>(defaultFormData);
    const [amountDisplay, setAmountDisplay] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editData) {
            const amount = Number(editData.entertainment_amount ?? 0);
            setFormData({
                entertainment_date: editData.entertainment_date ?? null,
                entertainment_location: editData.entertainment_location ?? "",
                address: editData.address ?? "",
                entertainment_type: editData.entertainment_type ?? "",
                entertainment_amount: amount,
                related_party: editData.related_party ?? "",
                position: editData.position ?? "",
                company_name: editData.company_name ?? "",
                business_type: editData.business_type ?? "",
                notes: editData.notes ?? "",
            });
            setAmountDisplay(formatRupiahInput(amount));
        } else {
            setFormData(defaultFormData);
            setAmountDisplay("");
        }
        setErrors({});
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

    const handleSubmit = () => {
        const validationErrors: Record<string, string> = {};

        if (!formData.entertainment_date)
            validationErrors.entertainment_date = "Wajib diisi";
        if (!formData.entertainment_location?.trim())
            validationErrors.entertainment_location = "Wajib diisi";
        if (!formData.address?.trim()) validationErrors.address = "Wajib diisi";
        if (!formData.entertainment_type?.trim())
            validationErrors.entertainment_type = "Wajib diisi";
        if (!amountDisplay.trim())
            validationErrors.entertainment_amount = "Wajib diisi";
        if (!formData.related_party?.trim())
            validationErrors.related_party = "Wajib diisi";
        if (!formData.position?.trim())
            validationErrors.position = "Wajib diisi";
        if (!formData.company_name?.trim())
            validationErrors.company_name = "Wajib diisi";
        if (!formData.business_type?.trim())
            validationErrors.business_type = "Wajib diisi";
        if (!formData.notes?.trim()) validationErrors.notes = "Wajib diisi";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        const payload: Record<string, any> = {
            id: editData?.id || uuidv4(),
            spt_op_id: sptOpId,
            entertainment_date: formData.entertainment_date || null,
            entertainment_location: formData.entertainment_location || null,
            address: formData.address || null,
            entertainment_type: formData.entertainment_type || null,
            entertainment_amount: Number(formData.entertainment_amount ?? 0),
            related_party: formData.related_party || null,
            position: formData.position || null,
            company_name: formData.company_name || null,
            business_type: formData.business_type || null,
            notes: formData.notes || null,
        };

        if (editData?.id) {
            router.put(
                route("spt.op.l3da.update", { id: editData.id }),
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
            router.post(route("spt.op.l3da.store"), payload, {
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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-3xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        {editData?.id ? "Ubah" : "Tambah"} Data Bagian A
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Tanggal <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-between",
                                            !formData.entertainment_date &&
                                                "text-muted-foreground",
                                        )}
                                    >
                                        {formData.entertainment_date
                                            ? formatDateLabel(
                                                  formData.entertainment_date,
                                              )
                                            : "Pilih tanggal"}
                                        <CalendarIcon className="h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="p-0">
                                    <Calendar
                                        mode="single"
                                        selected={parseDateValue(
                                            formData.entertainment_date,
                                        )}
                                        onSelect={(value) => {
                                            const iso = value
                                                ? value
                                                      .toISOString()
                                                      .slice(0, 10)
                                                : null;
                                            handleChange(
                                                "entertainment_date",
                                                iso,
                                            );
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.entertainment_date && (
                                <p className="text-xs text-red-500">
                                    {errors.entertainment_date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Tempat <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.entertainment_location ?? ""}
                                onChange={(e) =>
                                    handleChange(
                                        "entertainment_location",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.entertainment_location && (
                                <p className="text-xs text-red-500">
                                    {errors.entertainment_location}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Alamat <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.address ?? ""}
                                onChange={(e) =>
                                    handleChange("address", e.target.value)
                                }
                            />
                            {errors.address && (
                                <p className="text-xs text-red-500">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Jenis Entertainment{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.entertainment_type ?? ""}
                                onChange={(e) =>
                                    handleChange(
                                        "entertainment_type",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.entertainment_type && (
                                <p className="text-xs text-red-500">
                                    {errors.entertainment_type}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Jumlah <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    value={amountDisplay}
                                    onChange={(e) => {
                                        const numeric = parseNumber(
                                            e.target.value,
                                        );
                                        handleChange(
                                            "entertainment_amount",
                                            numeric,
                                        );
                                        setAmountDisplay(
                                            formatRupiahInput(numeric),
                                        );
                                    }}
                                    inputMode="numeric"
                                    className={cn(
                                        "pl-10",
                                        errors.entertainment_amount &&
                                            "border-red-500",
                                    )}
                                />
                            </div>
                            {errors.entertainment_amount && (
                                <p className="text-xs text-red-500">
                                    {errors.entertainment_amount}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Pihak Relasi <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.related_party ?? ""}
                                onChange={(e) =>
                                    handleChange(
                                        "related_party",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.related_party && (
                                <p className="text-xs text-red-500">
                                    {errors.related_party}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Jabatan <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.position ?? ""}
                                onChange={(e) =>
                                    handleChange("position", e.target.value)
                                }
                            />
                            {errors.position && (
                                <p className="text-xs text-red-500">
                                    {errors.position}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Nama Perusahaan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.company_name ?? ""}
                                onChange={(e) =>
                                    handleChange("company_name", e.target.value)
                                }
                            />
                            {errors.company_name && (
                                <p className="text-xs text-red-500">
                                    {errors.company_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Jenis Usaha <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.business_type ?? ""}
                                onChange={(e) =>
                                    handleChange(
                                        "business_type",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.business_type && (
                                <p className="text-xs text-red-500">
                                    {errors.business_type}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Keterangan <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.notes ?? ""}
                                onChange={(e) =>
                                    handleChange("notes", e.target.value)
                                }
                            />
                            {errors.notes && (
                                <p className="text-xs text-red-500">
                                    {errors.notes}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-2 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-blue-950 hover:bg-blue-900"
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
