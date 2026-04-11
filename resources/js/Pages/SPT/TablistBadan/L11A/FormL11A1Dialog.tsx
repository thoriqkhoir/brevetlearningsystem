import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
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
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { CalendarIcon, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L11A1Item } from "./types";

interface FormL11A1DialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L11A1Item | null;
    onSuccess?: () => void;
}

type FormData = Omit<L11A1Item, "id" | "spt_badan_id">;

const defaultFormData: FormData = {
    npwp: "",
    name: "",
    address: null,
    date: null,
    cost_type: null,
    amount: 0,
    note: null,
    pph: 0,
    witholding_tax_number: null,
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

export function FormL11A1Dialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL11A1DialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amountDisplay, setAmountDisplay] = useState("");
    const [pphDisplay, setPphDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDateCalendarOpen, setIsDateCalendarOpen] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                npwp: editData.npwp || "",
                name: editData.name || "",
                address: editData.address || null,
                date: editData.date ? editData.date.substring(0, 10) : null,
                cost_type: editData.cost_type || null,
                amount: editData.amount || 0,
                note: editData.note || null,
                pph: editData.pph || 0,
                witholding_tax_number: editData.witholding_tax_number || null,
            });
            setAmountDisplay(formatRupiahInput(editData.amount || 0));
            setPphDisplay(formatRupiahInput(editData.pph || 0));
        } else {
            setFormData(defaultFormData);
            setAmountDisplay("");
            setPphDisplay("");
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
        field: "amount" | "pph",
        setDisplay: (s: string) => void,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        const num = parseInt(raw) || 0;
        setFormData((prev) => ({ ...prev, [field]: num }));
        setDisplay(formatRupiahInput(num));
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!formData.npwp) errs.npwp = "NPWP wajib diisi";
        if (!formData.name) errs.name = "Nama wajib diisi";
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
            router.put(route("spt.badan.l11a1.update", editData.id), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                },
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post(route("spt.badan.l11a1.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
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
                        {editData ? "Edit" : "Tambah"} Data Biaya Bruto
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 space-y-1 p-4">
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            NPWP <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                value={formData.npwp}
                                onChange={(e) =>
                                    handleChange("npwp", e.target.value)
                                }
                                placeholder="Nomor NPWP"
                            />
                            {errors.npwp && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.npwp}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Nama <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                placeholder="Nama"
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
                        <Label className={labelClass}>Tanggal</Label>
                        <Popover
                            open={isDateCalendarOpen}
                            onOpenChange={setIsDateCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between pl-3 text-left font-normal",
                                        !formData.date &&
                                            "text-muted-foreground",
                                    )}
                                >
                                    {formData.date ? (
                                        format(
                                            new Date(formData.date),
                                            "yyyy-MM-dd",
                                        )
                                    ) : (
                                        <span>Pilih Tanggal</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                portalled={false}
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={
                                        formData.date
                                            ? new Date(formData.date)
                                            : undefined
                                    }
                                    onSelect={(date) => {
                                        handleChange(
                                            "date",
                                            date
                                                ? format(date, "yyyy-MM-dd")
                                                : null,
                                        );
                                        setIsDateCalendarOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Jenis Biaya</Label>
                        <Input
                            value={formData.cost_type ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "cost_type",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Jenis biaya"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Jumlah (Rp)</Label>
                        <Input
                            value={amountDisplay}
                            onChange={(e) =>
                                handleMoneyChange("amount", setAmountDisplay, e)
                            }
                            placeholder="0"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Keterangan</Label>
                        <Input
                            value={formData.note ?? ""}
                            onChange={(e) =>
                                handleChange("note", e.target.value || null)
                            }
                            placeholder="Keterangan"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>PPh (Rp)</Label>
                        <Input
                            value={pphDisplay}
                            onChange={(e) =>
                                handleMoneyChange("pph", setPphDisplay, e)
                            }
                            placeholder="0"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>No. Bukti Potong</Label>
                        <Input
                            value={formData.witholding_tax_number ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "witholding_tax_number",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Nomor bukti potong"
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

export default FormL11A1Dialog;
