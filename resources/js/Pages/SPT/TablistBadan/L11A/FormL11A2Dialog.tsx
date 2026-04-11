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
import toast from "react-hot-toast";
import { format } from "date-fns";
import { CalendarIcon, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L11A2Item } from "./types";

interface FormL11A2DialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L11A2Item | null;
    onSuccess?: () => void;
}

type FormData = Omit<L11A2Item, "id" | "spt_badan_id">;

const defaultFormData: FormData = {
    date: null,
    place: null,
    address: null,
    type: null,
    amount: 0,
    name: "",
    position: null,
    company_name: null,
    business_type: null,
    notes: null,
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

export function FormL11A2Dialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL11A2DialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amountDisplay, setAmountDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDateCalendarOpen, setIsDateCalendarOpen] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                date: editData.date ? editData.date.substring(0, 10) : null,
                place: editData.place || null,
                address: editData.address || null,
                type: editData.type || null,
                amount: editData.amount || 0,
                name: editData.name || "",
                position: editData.position || null,
                company_name: editData.company_name || null,
                business_type: editData.business_type || null,
                notes: editData.notes || null,
            });
            setAmountDisplay(formatRupiahInput(editData.amount || 0));
        } else {
            setFormData(defaultFormData);
            setAmountDisplay("");
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

    const validate = () => {
        const errs: Record<string, string> = {};
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
            router.put(route("spt.badan.l11a2.update", editData.id), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data berhasil disimpan");
                    onSuccess?.();
                    onClose();
                },
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post(route("spt.badan.l11a2.store"), payload, {
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
                        {editData ? "Edit" : "Tambah"} Data Biaya Promosi
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 space-y-1 p-4">
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
                        <Label className={labelClass}>Tempat</Label>
                        <Input
                            value={formData.place ?? ""}
                            onChange={(e) =>
                                handleChange("place", e.target.value || null)
                            }
                            placeholder="Tempat"
                        />
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
                        <Label className={labelClass}>Jenis</Label>
                        <Input
                            value={formData.type ?? ""}
                            onChange={(e) =>
                                handleChange("type", e.target.value || null)
                            }
                            placeholder="Jenis promosi"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Jumlah (Rp)</Label>
                        <Input
                            value={amountDisplay}
                            onChange={(e) => {
                                const raw = e.target.value.replace(
                                    /[^0-9]/g,
                                    "",
                                );
                                const num = parseInt(raw) || 0;
                                setFormData((p) => ({ ...p, amount: num }));
                                setAmountDisplay(formatRupiahInput(num));
                            }}
                            placeholder="0"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Nama Penerima{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                placeholder="Nama penerima"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Jabatan</Label>
                        <Input
                            value={formData.position ?? ""}
                            onChange={(e) =>
                                handleChange("position", e.target.value || null)
                            }
                            placeholder="Jabatan"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Nama Perusahaan</Label>
                        <Input
                            value={formData.company_name ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "company_name",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Nama perusahaan"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Jenis Usaha</Label>
                        <Input
                            value={formData.business_type ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "business_type",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Jenis usaha"
                        />
                    </div>
                    <div className={rowClass}>
                        <Label className={labelClass}>Keterangan</Label>
                        <Input
                            value={formData.notes ?? ""}
                            onChange={(e) =>
                                handleChange("notes", e.target.value || null)
                            }
                            placeholder="Keterangan"
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

export default FormL11A2Dialog;
