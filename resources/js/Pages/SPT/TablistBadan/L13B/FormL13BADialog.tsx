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
import { CalendarIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { L13BAItem } from "./types";

interface FormL13BADialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData: L13BAItem | null;
}

const emptyForm = (): Omit<L13BAItem, "id" | "spt_badan_id"> => ({
    coorperation_agreement_number: "",
    coorperation_agreement_date: "",
    actiity_partner: "",
    note: "",
});

export function FormL13BADialog({
    open,
    onClose,
    sptBadanId,
    editData,
}: FormL13BADialogProps) {
    const [form, setForm] = useState(emptyForm());
    const [isSaving, setIsSaving] = useState(false);
    const [isAgreementDateCalendarOpen, setIsAgreementDateCalendarOpen] =
        useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setForm({
                coorperation_agreement_number:
                    editData.coorperation_agreement_number ?? "",
                coorperation_agreement_date:
                    editData.coorperation_agreement_date
                        ? editData.coorperation_agreement_date.substring(0, 10)
                        : "",
                actiity_partner: editData.actiity_partner ?? "",
                note: editData.note ?? "",
            });
        } else {
            setForm(emptyForm());
        }
    }, [open, editData]);

    const set = (key: keyof typeof form, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSave = () => {
        setIsSaving(true);
        const payload = { spt_badan_id: sptBadanId, ...form };
        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data berhasil disimpan");
                onClose();
            },
            onError: (errors: Record<string, string>) => {
                const firstMsg = Object.values(errors)[0];
                toast.error(firstMsg ?? "Gagal menyimpan data");
            },
            onFinish: () => setIsSaving(false),
        };
        if (editData?.id) {
            router.put(
                route("spt.badan.l13ba.update", editData.id),
                payload,
                opts,
            );
        } else {
            router.post(route("spt.badan.l13ba.store"), payload, opts);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle className="text-lg font-semibold">
                        {editData ? "UBAH" : "TAMBAH"}
                    </DialogTitle>
                </DialogHeader>
                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Nomor Perjanjian */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Nomor Perjanjian Kerja Sama
                        </Label>
                        <Input
                            value={form.coorperation_agreement_number ?? ""}
                            onChange={(e) =>
                                set("coorperation_agreement_number", e.target.value)
                            }
                        />
                    </div>

                    {/* Tanggal Perjanjian */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Tanggal Perjanjian Kerja Sama
                        </Label>
                        <Popover
                            open={isAgreementDateCalendarOpen}
                            onOpenChange={setIsAgreementDateCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between pl-3 text-left font-normal",
                                        !form.coorperation_agreement_date &&
                                            "text-muted-foreground",
                                    )}
                                >
                                    {form.coorperation_agreement_date ? (
                                        format(
                                            new Date(form.coorperation_agreement_date),
                                            "yyyy-MM-dd",
                                        )
                                    ) : (
                                        <span>Pilih Tanggal</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={
                                        form.coorperation_agreement_date
                                            ? new Date(form.coorperation_agreement_date)
                                            : undefined
                                    }
                                    onSelect={(date) => {
                                        set(
                                            "coorperation_agreement_date",
                                            date ? format(date, "yyyy-MM-dd") : "",
                                        );
                                        setIsAgreementDateCalendarOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Mitra Kegiatan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Mitra Kegiatan
                        </Label>
                        <Input
                            value={form.actiity_partner ?? ""}
                            onChange={(e) => set("actiity_partner", e.target.value)}
                        />
                    </div>

                    {/* Keterangan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Keterangan
                        </Label>
                        <Input
                            value={form.note ?? ""}
                            onChange={(e) => set("note", e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="border-t p-4 gap-2 flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Tutup
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-950 hover:bg-blue-900 gap-2"
                    >
                        <span>💾</span>
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
