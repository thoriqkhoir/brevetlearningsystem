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
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { L5AItem } from "./types";
import { cn } from "@/lib/utils";

interface FormL5ADialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData?: L5AItem | null;
    onSuccess?: () => void;
}

const defaultFormData: Omit<L5AItem, "id" | "spt_badan_id"> = {
    nitku: "",
    tku_name: "",
    address: null,
    village: null,
    district: null,
    regency: null,
    province: null,
};

export function FormL5ADialog({
    open,
    onClose,
    sptBadanId,
    editData,
    onSuccess,
}: FormL5ADialogProps) {
    const [formData, setFormData] =
        useState<Omit<L5AItem, "id" | "spt_badan_id">>(defaultFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editData) {
            setFormData({
                nitku: editData.nitku || "",
                tku_name: editData.tku_name || "",
                address: editData.address || null,
                village: editData.village || null,
                district: editData.district || null,
                regency: editData.regency || null,
                province: editData.province || null,
            });
        } else {
            setFormData(defaultFormData);
        }
        setErrors({});
    }, [editData, open]);

    const handleChange = (
        field: keyof typeof formData,
        value: string | null,
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.nitku) newErrors.nitku = "NITKU wajib diisi";
        if (!formData.tku_name) newErrors.tku_name = "Nama TKU wajib diisi";
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
                route("spt.badan.l5a.update", { id: editData.id }),
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
            router.post(route("spt.badan.l5a.store"), payload, {
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
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-visible flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        Daftar Tempat Kegiatan Usaha (TKU)
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* NITKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            NITKU <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.nitku}
                                onChange={(e) =>
                                    handleChange("nitku", e.target.value)
                                }
                                placeholder="Masukkan NITKU"
                                className={cn(errors.nitku && "border-red-500")}
                            />
                            {errors.nitku && (
                                <p className="text-sm text-red-500">
                                    {errors.nitku}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Nama TKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">
                            Nama TKU <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-1">
                            <Input
                                value={formData.tku_name}
                                onChange={(e) =>
                                    handleChange("tku_name", e.target.value)
                                }
                                placeholder="Masukkan nama TKU"
                                className={cn(errors.tku_name && "border-red-500")}
                            />
                            {errors.tku_name && (
                                <p className="text-sm text-red-500">
                                    {errors.tku_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Alamat */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">Alamat</Label>
                        <Input
                            value={formData.address ?? ""}
                            onChange={(e) =>
                                handleChange("address", e.target.value || null)
                            }
                            placeholder="Masukkan alamat"
                        />
                    </div>

                    {/* Kelurahan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">Kelurahan</Label>
                        <Input
                            value={formData.village ?? ""}
                            onChange={(e) =>
                                handleChange("village", e.target.value || null)
                            }
                            placeholder="Masukkan kelurahan"
                        />
                    </div>

                    {/* Kecamatan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">Kecamatan</Label>
                        <Input
                            value={formData.district ?? ""}
                            onChange={(e) =>
                                handleChange("district", e.target.value || null)
                            }
                            placeholder="Masukkan kecamatan"
                        />
                    </div>

                    {/* Kab/Kota */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">Kab/Kota</Label>
                        <Input
                            value={formData.regency ?? ""}
                            onChange={(e) =>
                                handleChange("regency", e.target.value || null)
                            }
                            placeholder="Masukkan kab/kota"
                        />
                    </div>

                    {/* Provinsi */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="pt-2">Provinsi</Label>
                        <Input
                            value={formData.province ?? ""}
                            onChange={(e) =>
                                handleChange("province", e.target.value || null)
                            }
                            placeholder="Masukkan provinsi"
                        />
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
                        Batal
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

export default FormL5ADialog;
