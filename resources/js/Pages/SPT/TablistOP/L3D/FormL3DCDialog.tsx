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
import { router } from "@inertiajs/react";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import {
    DEDUCTION_METHOD_OPTIONS,
    L3DCItem,
    TYPE_OF_PROOF_OPTIONS,
} from "./types";

type FormState = Omit<L3DCItem, "id" | "spt_op_id">;

const defaultFormData: FormState = {
    npwp: "",
    debtor_name: "",
    debtor_address: "",
    amount_of_debt: 0,
    bad_debt: 0,
    deduction_method: null,
    type_of_proof: null,
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

export function FormL3DCDialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L3DCItem | null;
    onSuccess?: () => void;
}) {
    const [formData, setFormData] = useState<FormState>(defaultFormData);
    const [amountDebtDisplay, setAmountDebtDisplay] = useState("");
    const [badDebtDisplay, setBadDebtDisplay] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editData) {
            const amount = Number(editData.amount_of_debt ?? 0);
            const bad = Number(editData.bad_debt ?? 0);
            setFormData({
                npwp: editData.npwp ?? "",
                debtor_name: editData.debtor_name ?? "",
                debtor_address: editData.debtor_address ?? "",
                amount_of_debt: amount,
                bad_debt: bad,
                deduction_method: editData.deduction_method ?? null,
                type_of_proof: editData.type_of_proof ?? null,
            });
            setAmountDebtDisplay(formatRupiahInput(amount));
            setBadDebtDisplay(formatRupiahInput(bad));
        } else {
            setFormData(defaultFormData);
            setAmountDebtDisplay("");
            setBadDebtDisplay("");
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
        if (!formData.debtor_name?.trim())
            validationErrors.debtor_name = "Wajib diisi";
        if (!formData.debtor_address?.trim())
            validationErrors.debtor_address = "Wajib diisi";
        if (!amountDebtDisplay.trim())
            validationErrors.amount_of_debt = "Wajib diisi";
        if (!badDebtDisplay.trim()) validationErrors.bad_debt = "Wajib diisi";
        if (!formData.deduction_method)
            validationErrors.deduction_method = "Wajib diisi";
        if (!formData.type_of_proof)
            validationErrors.type_of_proof = "Wajib diisi";

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
            debtor_name: formData.debtor_name || null,
            debtor_address: formData.debtor_address || null,
            amount_of_debt: Number(formData.amount_of_debt ?? 0),
            bad_debt: Number(formData.bad_debt ?? 0),
            deduction_method: formData.deduction_method || null,
            type_of_proof: formData.type_of_proof || null,
        };

        if (editData?.id) {
            router.put(
                route("spt.op.l3dc.update", { id: editData.id }),
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
            router.post(route("spt.op.l3dc.store"), payload, {
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
                        {editData?.id ? "Ubah" : "Tambah"} Data Bagian C
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
                            Nama Debitur <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.debtor_name ?? ""}
                                onChange={(e) =>
                                    handleChange("debtor_name", e.target.value)
                                }
                            />
                            {errors.debtor_name && (
                                <p className="text-xs text-red-500">
                                    {errors.debtor_name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Alamat Debitur{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.debtor_address ?? ""}
                                onChange={(e) =>
                                    handleChange(
                                        "debtor_address",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.debtor_address && (
                                <p className="text-xs text-red-500">
                                    {errors.debtor_address}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Jumlah Piutang{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    value={amountDebtDisplay}
                                    onChange={(e) => {
                                        const numeric = parseNumber(
                                            e.target.value,
                                        );
                                        handleChange("amount_of_debt", numeric);
                                        setAmountDebtDisplay(
                                            formatRupiahInput(numeric),
                                        );
                                    }}
                                    inputMode="numeric"
                                    className={cn(
                                        "pl-10",
                                        errors.amount_of_debt &&
                                            "border-red-500",
                                    )}
                                />
                            </div>
                            {errors.amount_of_debt && (
                                <p className="text-xs text-red-500">
                                    {errors.amount_of_debt}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Piutang Tak Tertagih{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                </span>
                                <Input
                                    value={badDebtDisplay}
                                    onChange={(e) => {
                                        const numeric = parseNumber(
                                            e.target.value,
                                        );
                                        handleChange("bad_debt", numeric);
                                        setBadDebtDisplay(
                                            formatRupiahInput(numeric),
                                        );
                                    }}
                                    inputMode="numeric"
                                    className={cn(
                                        "pl-10",
                                        errors.bad_debt && "border-red-500",
                                    )}
                                />
                            </div>
                            {errors.bad_debt && (
                                <p className="text-xs text-red-500">
                                    {errors.bad_debt}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Metode Pengurangan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Select
                                value={formData.deduction_method ?? ""}
                                onValueChange={(v) =>
                                    handleChange("deduction_method", v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih metode" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEDUCTION_METHOD_OPTIONS.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.deduction_method && (
                                <p className="text-xs text-red-500">
                                    {errors.deduction_method}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label>
                            Jenis Bukti <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Select
                                value={formData.type_of_proof ?? ""}
                                onValueChange={(v) =>
                                    handleChange("type_of_proof", v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis bukti" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPE_OF_PROOF_OPTIONS.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type_of_proof && (
                                <p className="text-xs text-red-500">
                                    {errors.type_of_proof}
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
