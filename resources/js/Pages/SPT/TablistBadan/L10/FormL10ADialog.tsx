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
import toast from "react-hot-toast";
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { L10AItem } from "./types";
import { countries } from "@/data/spt-op-data";
import { cn } from "@/lib/utils";

interface FormL10ADialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L10AItem | null;
    onSuccess?: () => void;
}

type FormData = Omit<L10AItem, "id" | "spt_badan_id">;

const defaultFormData: FormData = {
    name: "",
    npwp: "",
    country: null,
    relationship: null,
    business_activities: null,
    transaction_type: null,
    transaction_value: 0,
    transfer_pricing_method: null,
    reason_using_method: null,
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

const rowClass = "grid grid-cols-[240px_1fr] items-start gap-x-4 py-2";
const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 pt-2";

export function FormL10ADialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL10ADialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [valueDisplay, setValueDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openCountry, setOpenCountry] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                npwp: editData.npwp || "",
                country: editData.country || null,
                relationship: editData.relationship || null,
                business_activities: editData.business_activities || null,
                transaction_type: editData.transaction_type || null,
                transaction_value: editData.transaction_value || 0,
                transfer_pricing_method:
                    editData.transfer_pricing_method || null,
                reason_using_method: editData.reason_using_method || null,
            });
            setValueDisplay(formatRupiahInput(editData.transaction_value || 0));
        } else {
            setFormData(defaultFormData);
            setValueDisplay("");
        }
        setErrors({});
    }, [editData, open]);

    const handleChange = (
        field: keyof FormData,
        value: string | number | null,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        const num = parseInt(raw) || 0;
        setFormData((prev) => ({ ...prev, transaction_value: num }));
        setValueDisplay(formatRupiahInput(num));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "Nama wajib diisi";
        if (!formData.npwp) newErrors.npwp = "NPWP wajib diisi";
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
                route("spt.badan.l10a.update", { id: editData.id }),
                payload,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Data berhasil disimpan");
                        setIsSubmitting(false);
                        onSuccess?.();
                        onClose();
                    },
                    onError: () => setIsSubmitting(false),
                },
            );
        } else {
            router.post(route("spt.badan.l10a.store"), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data berhasil disimpan");
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
        setValueDisplay("");
        setErrors({});
        onClose();
    };

    const selectedCountryLabel =
        countries.find((c) => c.value === formData.country)?.label || "";

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        {editData ? "Edit" : "Tambah"} Data Transaksi Hubungan
                        Istimewa
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 p-4">
                    {/* Nama */}
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
                                placeholder="Nama pihak yang memiliki hubungan istimewa"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* NPWP */}
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
                                placeholder="NPWP"
                            />
                            {errors.npwp && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.npwp}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Negara */}
                    <div className={rowClass}>
                        <Label className={labelClass}>Negara</Label>
                        <Popover
                            open={openCountry}
                            onOpenChange={setOpenCountry}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between font-normal"
                                >
                                    {selectedCountryLabel || "Pilih negara..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-full p-0"
                                align="start"
                            >
                                <Command>
                                    <CommandInput placeholder="Cari negara..." />
                                    <CommandList>
                                        <CommandEmpty>
                                            Negara tidak ditemukan.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {countries.map((c) => (
                                                <CommandItem
                                                    key={c.value}
                                                    value={c.label}
                                                    onSelect={() => {
                                                        handleChange(
                                                            "country",
                                                            c.value,
                                                        );
                                                        setOpenCountry(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            formData.country ===
                                                                c.value
                                                                ? "opacity-100"
                                                                : "opacity-0",
                                                        )}
                                                    />
                                                    {c.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Hubungan Istimewa */}
                    <div className={rowClass}>
                        <Label className={labelClass}>Hubungan Istimewa</Label>
                        <Input
                            value={formData.relationship ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "relationship",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Jenis hubungan istimewa"
                        />
                    </div>

                    {/* Kegiatan Usaha */}
                    <div className={rowClass}>
                        <Label className={labelClass}>Kegiatan Usaha</Label>
                        <Input
                            value={formData.business_activities ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "business_activities",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Kegiatan usaha"
                        />
                    </div>

                    {/* Jenis Transaksi */}
                    <div className={rowClass}>
                        <Label className={labelClass}>Jenis Transaksi</Label>
                        <Input
                            value={formData.transaction_type ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "transaction_type",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Jenis transaksi"
                        />
                    </div>

                    {/* Nilai Transaksi */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Nilai Transaksi (Rp)
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-gray-100 text-sm text-gray-600">
                                Rp.
                            </span>
                            <Input
                                value={valueDisplay}
                                onChange={handleValueChange}
                                placeholder="0"
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* Metode Transfer Pricing */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Metode Transfer Pricing
                        </Label>
                        <Input
                            value={formData.transfer_pricing_method ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "transfer_pricing_method",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Metode TP yang digunakan"
                        />
                    </div>

                    {/* Alasan Penggunaan Metode */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Alasan Penggunaan Metode
                        </Label>
                        <Input
                            value={formData.reason_using_method ?? ""}
                            onChange={(e) =>
                                handleChange(
                                    "reason_using_method",
                                    e.target.value || null,
                                )
                            }
                            placeholder="Alasan penggunaan metode"
                        />
                    </div>
                </div>

                <DialogFooter className="border-t p-4 flex justify-end gap-2">
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

export default FormL10ADialog;
