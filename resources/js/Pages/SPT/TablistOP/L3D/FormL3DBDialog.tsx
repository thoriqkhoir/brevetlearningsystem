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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
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
import { L3DBItem, TYPE_OF_COST_OPTIONS } from "./types";

type FormState = Omit<L3DBItem, "id" | "spt_op_id">;

const defaultFormData: FormState = {
    npwp: "",
    name: "",
    address: "",
    date: null,
    type_of_cost: null,
    amount: 0,
    notes: "",
    income_tax_with_holding: 0,
    with_holding_slip_number: "",
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

const normalizeNpwp = (raw: string) =>
    String(raw ?? "")
        .replace(/\D/g, "")
        .slice(0, 16);

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

export function FormL3DBDialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L3DBItem | null;
    onSuccess?: () => void;
}) {
    const [formData, setFormData] = useState<FormState>(defaultFormData);
    const [amountDisplay, setAmountDisplay] = useState("");
    const [withHoldingDisplay, setWithHoldingDisplay] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editData) {
            const amount = Number(editData.amount ?? 0);
            const withHolding = Number(editData.income_tax_with_holding ?? 0);
            setFormData({
                npwp: editData.npwp ?? "",
                name: editData.name ?? "",
                address: editData.address ?? "",
                date: editData.date ?? null,
                type_of_cost: editData.type_of_cost ?? null,
                amount,
                notes: editData.notes ?? "",
                income_tax_with_holding: withHolding,
                with_holding_slip_number:
                    editData.with_holding_slip_number ?? "",
            });
            setAmountDisplay(formatRupiahInput(amount));
            setWithHoldingDisplay(formatRupiahInput(withHolding));
        } else {
            setFormData(defaultFormData);
            setAmountDisplay("");
            setWithHoldingDisplay("");
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

        const npwpDigits = normalizeNpwp(formData.npwp ?? "");
        if (!npwpDigits) validationErrors.npwp = "Wajib diisi";
        if (npwpDigits.length !== 16)
            validationErrors.npwp = "NPWP harus 16 digit";
        if (!formData.name?.trim()) validationErrors.name = "Wajib diisi";
        if (!formData.address?.trim()) validationErrors.address = "Wajib diisi";
        if (!formData.date) validationErrors.date = "Wajib diisi";
        if (!formData.type_of_cost)
            validationErrors.type_of_cost = "Wajib diisi";
        if (!amountDisplay.trim()) validationErrors.amount = "Wajib diisi";
        if (!formData.notes?.trim()) validationErrors.notes = "Wajib diisi";
        if (!withHoldingDisplay.trim())
            validationErrors.income_tax_with_holding = "Wajib diisi";
        if (!formData.with_holding_slip_number?.trim())
            validationErrors.with_holding_slip_number = "Wajib diisi";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        const payload: Record<string, any> = {
            id: editData?.id || uuidv4(),
            spt_op_id: sptOpId,
            npwp: formData.npwp || null,
            name: formData.name || null,
            address: formData.address || null,
            date: formData.date || null,
            type_of_cost: formData.type_of_cost || null,
            amount: Number(formData.amount ?? 0),
            notes: formData.notes || null,
            income_tax_with_holding: Number(
                formData.income_tax_with_holding ?? 0,
            ),
            with_holding_slip_number: formData.with_holding_slip_number || null,
        };

        if (editData?.id) {
            router.put(
                route("spt.op.l3db.update", { id: editData.id }),
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
            router.post(route("spt.op.l3db.store"), payload, {
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
                        {editData?.id ? "Ubah" : "Tambah"} Data Bagian B
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            NPWP <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.npwp ?? ""}
                                onChange={(e) =>
                                    handleChange(
                                        "npwp",
                                        normalizeNpwp(e.target.value),
                                    )
                                }
                                inputMode="numeric"
                                maxLength={16}
                            />
                            {errors.npwp && (
                                <p className="text-xs text-red-500">
                                    {errors.npwp}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Nama<span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.name ?? ""}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Alamat<span className="text-red-500">*</span>
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
                            Tanggal<span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-between",
                                            !formData.date &&
                                                "text-muted-foreground",
                                        )}
                                    >
                                        {formData.date
                                            ? formatDateLabel(formData.date)
                                            : "Pilih tanggal"}
                                        <CalendarIcon className="h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="p-0">
                                    <Calendar
                                        mode="single"
                                        selected={parseDateValue(formData.date)}
                                        onSelect={(value) => {
                                            const iso = value
                                                ? value
                                                      .toISOString()
                                                      .slice(0, 10)
                                                : null;
                                            handleChange("date", iso);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.date && (
                                <p className="text-xs text-red-500">
                                    {errors.date}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Jenis Biaya<span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Select
                                value={formData.type_of_cost ?? ""}
                                onValueChange={(v) =>
                                    handleChange("type_of_cost", v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis biaya" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPE_OF_COST_OPTIONS.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type_of_cost && (
                                <p className="text-xs text-red-500">
                                    {errors.type_of_cost}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Jumlah<span className="text-red-500">*</span>
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
                                        handleChange("amount", numeric);
                                        setAmountDisplay(
                                            formatRupiahInput(numeric),
                                        );
                                    }}
                                    inputMode="numeric"
                                    className={cn(
                                        "pl-10",
                                        errors.amount && "border-red-500",
                                    )}
                                />
                            </div>
                            {errors.amount && (
                                <p className="text-xs text-red-500">
                                    {errors.amount}
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
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            PPh Dipotong <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    value={withHoldingDisplay}
                                    onChange={(e) => {
                                        const numeric = parseNumber(
                                            e.target.value,
                                        );
                                        handleChange(
                                            "income_tax_with_holding",
                                            numeric,
                                        );
                                        setWithHoldingDisplay(
                                            formatRupiahInput(numeric),
                                        );
                                    }}
                                    inputMode="numeric"
                                    className={cn(
                                        "pl-10",
                                        errors.income_tax_with_holding &&
                                            "border-red-500",
                                    )}
                                />
                            </div>
                            {errors.income_tax_with_holding && (
                                <p className="text-xs text-red-500">
                                    {errors.income_tax_with_holding}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            No. Bukti Potong{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.with_holding_slip_number ?? ""}
                                onChange={(e) =>
                                    handleChange(
                                        "with_holding_slip_number",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.with_holding_slip_number && (
                                <p className="text-xs text-red-500">
                                    {errors.with_holding_slip_number}
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
