import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
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
import { countries } from "@/data/spt-op-data";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L10CItem } from "./types";

interface FormL10CDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L10CItem | null;
    onSuccess?: () => void;
}

type FormData = Omit<L10CItem, "id" | "spt_badan_id">;

const defaultFormData: FormData = {
    partner_name: "",
    transaction_type: "",
    country: null,
    transaction_amount: 0,
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

export function FormL10CDialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL10CDialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amountDisplay, setAmountDisplay] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openCountry, setOpenCountry] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                partner_name: editData.partner_name || "",
                transaction_type: editData.transaction_type || "",
                country: editData.country || null,
                transaction_amount: editData.transaction_amount || 0,
            });
            setAmountDisplay(
                formatRupiahInput(editData.transaction_amount || 0),
            );
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
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        const num = parseInt(raw) || 0;
        setFormData((prev) => ({ ...prev, transaction_amount: num }));
        setAmountDisplay(formatRupiahInput(num));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.partner_name)
            newErrors.partner_name = "Nama mitra wajib diisi";
        if (!formData.transaction_type)
            newErrors.transaction_type = "Jenis transaksi wajib diisi";
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
                route("spt.badan.l10c.update", { id: editData.id }),
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
            router.post(route("spt.badan.l10c.store"), payload, {
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
        setAmountDisplay("");
        setErrors({});
        onClose();
    };

    const selectedCountryLabel =
        countries.find((c) => c.value === formData.country)?.label || "";

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        {editData ? "Edit" : "Tambah"} Data Transaksi Mitra
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 p-4">
                    {/* Nama Mitra */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Nama Mitra <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                value={formData.partner_name}
                                onChange={(e) =>
                                    handleChange("partner_name", e.target.value)
                                }
                                placeholder="Nama mitra transaksi"
                            />
                            {errors.partner_name && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.partner_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Jenis Transaksi */}
                    <div className={rowClass}>
                        <Label className={labelClass}>
                            Jenis Transaksi{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                value={formData.transaction_type}
                                onChange={(e) =>
                                    handleChange(
                                        "transaction_type",
                                        e.target.value,
                                    )
                                }
                                placeholder="Jenis transaksi"
                            />
                            {errors.transaction_type && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.transaction_type}
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
                                value={amountDisplay}
                                onChange={handleAmountChange}
                                placeholder="0"
                                className="rounded-l-none text-right"
                            />
                        </div>
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

export default FormL10CDialog;
