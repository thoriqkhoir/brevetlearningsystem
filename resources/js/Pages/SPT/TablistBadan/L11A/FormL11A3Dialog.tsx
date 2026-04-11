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
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L11A3Item } from "./types";

interface FormL11A3DialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L11A3Item | null;
    onSuccess?: () => void;
}

type FormData = Omit<L11A3Item, "id" | "spt_badan_id">;

const defaultFormData: FormData = {
    number_id: "",
    name: "",
    address: null,
    receivable_ceiling: 0,
    bad_debts: 0,
    loading_method: null,
    document_method: null,
};

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const formatRupiahInput = (v: number) =>
    v ? rupiahFormatter.format(v).replace("Rp", "").trim() : "";

const rowClass = "grid grid-cols-[220px_1fr] items-start gap-x-4 py-2";
const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 pt-2";

export function FormL11A3Dialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL11A3DialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ceilingDisplay, setCeilingDisplay] = useState("");
    const [badDebtsDisplay, setBadDebtsDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editData) {
            setFormData({
                number_id: editData.number_id || "",
                name: editData.name || "",
                address: editData.address || null,
                receivable_ceiling: editData.receivable_ceiling || 0,
                bad_debts: editData.bad_debts || 0,
                loading_method: editData.loading_method || null,
                document_method: editData.document_method || null,
            });
            setCeilingDisplay(
                formatRupiahInput(editData.receivable_ceiling || 0),
            );
            setBadDebtsDisplay(formatRupiahInput(editData.bad_debts || 0));
        } else {
            setFormData(defaultFormData);
            setCeilingDisplay("");
            setBadDebtsDisplay("");
        }
        setErrors({});
    }, [editData, open]);

    const handleChange = (
        field: keyof FormData,
        value: string | number | null,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field])
            setErrors((prev) => {
                const n = { ...prev };
                delete n[field];
                return n;
            });
    };

    const handleMoneyChange = (
        field: "receivable_ceiling" | "bad_debts",
        setDisplay: (s: string) => void,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        const num = parseInt(raw) || 0;
        setFormData((p) => ({ ...p, [field]: num }));
        setDisplay(formatRupiahInput(num));
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!formData.number_id)
            errs.number_id = "Identitas debitur wajib diisi";
        if (!formData.name) errs.name = "Nama debitur wajib diisi";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        setIsSubmitting(true);
        const payload = {
            id: editData?.id ?? uuidv4(),
            spt_badan_id: sptBadanId,
            ...formData,
        };
        if (editData?.id) {
            router.put(route("spt.badan.l11a3.update", editData.id), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data berhasil disimpan");
                    onSuccess?.();
                    onClose();
                },
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post(route("spt.badan.l11a3.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data berhasil disimpan");
                    onSuccess?.();
                    onClose();
                },
                onFinish: () => setIsSubmitting(false),
            });
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                if (!o) onClose();
            }}
        >
            <DialogContent className="max-w-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        {editData ? "Edit" : "Tambah"} Data Piutang Tak Tertagih
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 space-y-1 p-4">
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Identitas Debitur{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                value={formData.number_id}
                                onChange={(e) =>
                                    handleChange("number_id", e.target.value)
                                }
                                placeholder="NIK/NPWP"
                            />
                            {errors.number_id && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.number_id}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Nama Debitur <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                placeholder="Nama debitur"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Alamat</Label>
                        <Input
                            value={formData.address ?? ""}
                            onChange={(e) =>
                                handleChange("address", e.target.value || null)
                            }
                            placeholder="Alamat"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Plafon Piutang (Rp)
                        </Label>
                        <Input
                            value={ceilingDisplay}
                            onChange={(e) =>
                                handleMoneyChange(
                                    "receivable_ceiling",
                                    setCeilingDisplay,
                                    e,
                                )
                            }
                            placeholder="0"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Piutang Tak Tertagih (Rp)
                        </Label>
                        <Input
                            value={badDebtsDisplay}
                            onChange={(e) =>
                                handleMoneyChange(
                                    "bad_debts",
                                    setBadDebtsDisplay,
                                    e,
                                )
                            }
                            placeholder="0"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Cara Pembebanan</Label>
                        <Input
                            value={formData.loading_method ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "loading_method",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Cara pembebanan"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Syarat Penghapusan</Label>
                        <Input
                            value={formData.document_method ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "document_method",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Syarat penghapusan"
                        />
                    </div>
                </div>

                <DialogFooter className="border-t p-4 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <X className="w-4 h-4 mr-2" /> Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-blue-950 hover:bg-blue-900"
                    >
                        <Save className="w-4 h-4 mr-2" />{" "}
                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FormL11A3Dialog;
