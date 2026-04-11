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
import { L11A4AItem } from "./types";

interface FormL11A4ADialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L11A4AItem | null;
    onSuccess?: () => void;
}

type FormData = Omit<L11A4AItem, "id" | "spt_badan_id">;

const defaultFormData: FormData = {
    tangible_asset_type: null,
    acquisition_year: null,
    acquisition_value: 0,
    depreciation_last_year: 0,
    depreciation_this_year: 0,
    depreciation_remaining: 0,
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

export function FormL11A4ADialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL11A4ADialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [displays, setDisplays] = useState({
        acquisition_value: "",
        depreciation_last_year: "",
        depreciation_this_year: "",
        depreciation_remaining: "",
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                tangible_asset_type: editData.tangible_asset_type || null,
                acquisition_year: editData.acquisition_year || null,
                acquisition_value: editData.acquisition_value || 0,
                depreciation_last_year: editData.depreciation_last_year || 0,
                depreciation_this_year: editData.depreciation_this_year || 0,
                depreciation_remaining: editData.depreciation_remaining || 0,
            });
            setDisplays({
                acquisition_value: formatRupiahInput(
                    editData.acquisition_value || 0,
                ),
                depreciation_last_year: formatRupiahInput(
                    editData.depreciation_last_year || 0,
                ),
                depreciation_this_year: formatRupiahInput(
                    editData.depreciation_this_year || 0,
                ),
                depreciation_remaining: formatRupiahInput(
                    editData.depreciation_remaining || 0,
                ),
            });
        } else {
            setFormData(defaultFormData);
            setDisplays({
                acquisition_value: "",
                depreciation_last_year: "",
                depreciation_this_year: "",
                depreciation_remaining: "",
            });
        }
    }, [editData, open]);

    const handleChange = (
        field: keyof FormData,
        value: string | number | null,
    ) => setFormData((prev) => ({ ...prev, [field]: value }));

    const handleMoneyChange = (
        field:
            | "acquisition_value"
            | "depreciation_last_year"
            | "depreciation_this_year"
            | "depreciation_remaining",
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        const num = parseInt(raw) || 0;
        setFormData((p) => ({ ...p, [field]: num }));
        setDisplays((p) => ({ ...p, [field]: formatRupiahInput(num) }));
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const payload = {
            id: editData?.id ?? uuidv4(),
            spt_badan_id: sptBadanId,
            ...formData,
        };
        if (editData?.id) {
            router.put(route("spt.badan.l11a4a.update", editData.id), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data berhasil disimpan");
                    onSuccess?.();
                    onClose();
                },
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post(route("spt.badan.l11a4a.store"), payload, {
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
                        {editData ? "Edit" : "Tambah"} Data Penyusutan Harta
                        Berwujud
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 space-y-1 p-4">
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Jenis Harta Berwujud
                        </Label>
                        <Input
                            value={formData.tangible_asset_type ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "tangible_asset_type",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Jenis harta"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Tahun Perolehan</Label>
                        <Input
                            value={formData.acquisition_year ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "acquisition_year",
                                    e.target.value || null,
                                )
                            }
                            placeholder="YYYY"
                            maxLength={4}
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Nilai Perolehan (Rp)
                        </Label>
                        <Input
                            value={displays.acquisition_value}
                            onChange={(e) =>
                                handleMoneyChange("acquisition_value", e)
                            }
                            placeholder="0"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Penyusutan Tahun Lalu (Rp)
                        </Label>
                        <Input
                            value={displays.depreciation_last_year}
                            onChange={(e) =>
                                handleMoneyChange("depreciation_last_year", e)
                            }
                            placeholder="0"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Penyusutan Tahun Ini (Rp)
                        </Label>
                        <Input
                            value={displays.depreciation_this_year}
                            onChange={(e) =>
                                handleMoneyChange("depreciation_this_year", e)
                            }
                            placeholder="0"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Sisa Penyusutan (Rp)
                        </Label>
                        <Input
                            value={displays.depreciation_remaining}
                            onChange={(e) =>
                                handleMoneyChange("depreciation_remaining", e)
                            }
                            placeholder="0"
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

export default FormL11A4ADialog;
