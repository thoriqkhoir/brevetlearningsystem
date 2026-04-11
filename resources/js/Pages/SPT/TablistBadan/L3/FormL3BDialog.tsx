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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { CalendarIcon, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { L3BItem, TAX_TYPE_OPTIONS } from "./types";
import { cn } from "@/lib/utils";

interface FormL3BDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L3BItem | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L3BItem, "id" | "spt_badan_id"> = {
    name: "",
    npwp: null,
    tax_type: null,
    dpp: 0,
    income_tax: 0,
    number_of_provement: null,
    date_of_provement: null,
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

export function FormL3BDialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL3BDialogProps) {
    const [formData, setFormData] =
        useState<Omit<L3BItem, "id" | "spt_badan_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dppDisplay, setDppDisplay] = useState("");
    const [incomeTaxDisplay, setIncomeTaxDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                npwp: editData.npwp || null,
                tax_type: editData.tax_type || null,
                dpp: editData.dpp || 0,
                income_tax: editData.income_tax || 0,
                number_of_provement: editData.number_of_provement || null,
                date_of_provement: editData.date_of_provement
                    ? editData.date_of_provement.substring(0, 10)
                    : null,
            });
            setDppDisplay(formatRupiahInput(editData.dpp || 0));
            setIncomeTaxDisplay(formatRupiahInput(editData.income_tax || 0));
        } else {
            setFormData(defaultFormData);
            setDppDisplay("");
            setIncomeTaxDisplay("");
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
    const handleIncomeTaxChange = makeMoneyHandler(
        "income_tax",
        setIncomeTaxDisplay,
    );

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
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
                route("spt.badan.l3b.update", { id: editData.id }),
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
            router.post(route("spt.badan.l3b.store"), payload, {
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
        setIncomeTaxDisplay("");
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-3xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        PPH YANG DIPOTONG/DIPUNGUT OLEH PIHAK LAIN
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Nama */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama Pemotong/Pemungut Pajak{" "}
                            <span className="text-red-500">*</span>
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

                    {/* NPWP */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            NPWP<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={formData.npwp ?? ""}
                            onChange={(e) =>
                                handleChange("npwp", e.target.value || null)
                            }
                        />
                    </div>

                    {/* Jenis Pajak */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Jenis Pajak <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.tax_type ?? ""}
                            onValueChange={(val) =>
                                handleChange("tax_type", val || null)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Silakan Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                                {TAX_TYPE_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* DPP */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
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

                    {/* PPh Terutang */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">Pajak Penghasilan (Rp)</Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={incomeTaxDisplay}
                                onChange={handleIncomeTaxChange}
                                className="rounded-l-none text-right"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Nomor Bukti Potong */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nomor Bukti Pemotongan/SSP/SSPCP{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={formData.number_of_provement ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "number_of_provement",
                                    e.target.value || null,
                                )
                            }
                        />
                    </div>

                    {/* Tanggal Bukti Potong */}
                    <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Tanggal Bukti Pemotongan/SSP/SSPCP{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={isCalendarOpen}
                            onOpenChange={setIsCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between pl-3 text-left font-normal",
                                        !formData.date_of_provement &&
                                            "text-muted-foreground",
                                    )}
                                    onClick={() => setIsCalendarOpen(true)}
                                >
                                    {formData.date_of_provement ? (
                                        format(
                                            new Date(
                                                formData.date_of_provement,
                                            ),
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
                                        formData.date_of_provement
                                            ? new Date(
                                                  formData.date_of_provement,
                                              )
                                            : undefined
                                    }
                                    onSelect={(date) => {
                                        handleChange(
                                            "date_of_provement",
                                            date
                                                ? format(date, "yyyy-MM-dd")
                                                : null,
                                        );
                                        setIsCalendarOpen(false);
                                    }}
                                    disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
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
                        Tutup
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

export default FormL3BDialog;
