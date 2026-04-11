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
import { cn } from "@/lib/utils";
import { familyRelationships, occupations } from "@/data/taxpayer-data";
import { router } from "@inertiajs/react";
import { Check, ChevronsUpDown, Save, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { L1CItem } from "./types";

interface FormL1CDialogProps {
    open: boolean;
    onClose: () => void;
    sptOpId: string;
    editData?: L1CItem | null;
    onSuccess?: () => void;
}

type FormData = {
    name: string;
    nik: string;
    date_of_birth: string;
    relationship: string;
    job: string;
};

const defaultFormData: FormData = {
    name: "",
    nik: "",
    date_of_birth: "",
    relationship: "",
    job: "",
};

const getNikFromItem = (item: L1CItem) => item.nik || item.npwp || "";

export function FormL1CDialog({
    open,
    onClose,
    sptOpId,
    editData,
    onSuccess,
}: FormL1CDialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [openRelationship, setOpenRelationship] = useState(false);
    const [openJob, setOpenJob] = useState(false);

    const relationshipLabel = useMemo(() => {
        return familyRelationships.find(
            (r) => r.value === formData.relationship,
        )?.label;
    }, [formData.relationship]);

    const jobLabel = useMemo(() => {
        return occupations.find((o) => o.value === formData.job)?.label;
    }, [formData.job]);

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                nik: getNikFromItem(editData),
                date_of_birth: editData.date_of_birth || "",
                relationship: editData.relationship || "",
                job: editData.job || "",
            });
        } else {
            setFormData(defaultFormData);
        }
        setErrors({});
    }, [editData, open]);

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleNikChange = (e: ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
        handleChange("nik", digits);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name) {
            newErrors.name = "Nama wajib diisi";
        }
        if (!formData.nik) {
            newErrors.nik = "NIK wajib diisi";
        } else if (formData.nik.length !== 16) {
            newErrors.nik = "NIK harus 16 digit";
        }
        if (!formData.date_of_birth) {
            newErrors.date_of_birth = "Tanggal Lahir wajib diisi";
        }
        if (!formData.relationship) {
            newErrors.relationship = "Hubungan Dengan Wajib Pajak wajib diisi";
        }
        if (!formData.job) {
            newErrors.job = "Pekerjaan wajib diisi";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const payload = {
            id: editData?.id || uuidv4(),
            spt_op_id: sptOpId,
            name: formData.name,
            nik: formData.nik,
            date_of_birth: formData.date_of_birth,
            relationship: formData.relationship,
            job: formData.job,
        };

        if (editData?.id) {
            router.put(
                route("spt.op.l1c.update", { id: editData.id }),
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
            router.post(route("spt.op.l1c.store"), payload, {
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
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-2xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        DAFTAR ANGGOTA KELUARGA YANG MENJADI TANGGUNGAN
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                placeholder="Masukkan nama"
                                className={cn(
                                    errors.name && "border-red-500"
                                )}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            NIK <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                inputMode="numeric"
                                value={formData.nik}
                                onChange={handleNikChange}
                                maxLength={16}
                                placeholder="Masukkan NIK"
                                className={cn(
                                    errors.nik && "border-red-500"
                                )}
                            />
                            {errors.nik && (
                                <p className="text-sm text-red-500">
                                    {errors.nik}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Tanggal Lahir <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) =>
                                    handleChange("date_of_birth", e.target.value)
                                }
                                className={cn(
                                    errors.date_of_birth && "border-red-500"
                                )}
                            />
                            {errors.date_of_birth && (
                                <p className="text-sm text-red-500">
                                    {errors.date_of_birth}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Hubungan Dengan Wajib Pajak{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover
                                open={openRelationship}
                                onOpenChange={setOpenRelationship}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openRelationship}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.relationship && "border-red-500"
                                        )}
                                    >
                                        {relationshipLabel || "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari hubungan..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {familyRelationships.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.label}
                                                        onSelect={() => {
                                                            handleChange(
                                                                "relationship",
                                                                opt.value,
                                                            );
                                                            setOpenRelationship(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.relationship ===
                                                                    opt.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {opt.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.relationship && (
                                <p className="text-sm text-red-500">
                                    {errors.relationship}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Pekerjaan <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Popover open={openJob} onOpenChange={setOpenJob}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openJob}
                                        className={cn(
                                            "w-full justify-between font-normal",
                                            errors.job && "border-red-500"
                                        )}
                                    >
                                        {jobLabel || "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    portalled={false}
                                    className="w-[min(90vw,520px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Cari pekerjaan..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {occupations.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.label}
                                                        onSelect={() => {
                                                            handleChange(
                                                                "job",
                                                                opt.value,
                                                            );
                                                            setOpenJob(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.job ===
                                                                    opt.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {opt.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.job && (
                                <p className="text-sm text-red-500">
                                    {errors.job}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t p-4 gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Tutup
                    </Button>
                    <Button
                        className="bg-blue-950 hover:bg-blue-900"
                        onClick={handleSubmit}
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

export default FormL1CDialog;