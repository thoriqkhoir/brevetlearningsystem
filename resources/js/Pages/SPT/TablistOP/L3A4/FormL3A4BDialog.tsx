import * as React from "react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { X } from "lucide-react";
import {
    type L3A4BItem,
    L3A4B_INCOME_TYPE_OPTIONS,
    formatMoney,
    parseDigits,
} from "./types";
import { router } from "@inertiajs/react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: L3A4BItem | null;
    setForm: React.Dispatch<React.SetStateAction<L3A4BItem | null>>;
    onSave: () => void;
    title?: string;
};

export default function FormL3A4BDialog({
    open,
    onOpenChange,
    form,
    setForm,
    onSave,
    title = "ADD B. PENGHASILAN NETO DALAM NEGERI LAINNYA",
}: Props) {
    const selectedKey = React.useMemo(() => {
        const code = form?.code ?? "";
        const label = form?.income_type ?? "";
        return code && label ? `${code}|${label}` : "";
    }, [form?.code, form?.income_type]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-2xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle className="text-lg font-semibold">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Kode</Label>
                        <Input
                            value={form?.code ?? ""}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Jenis Penghasilan *
                        </Label>
                        <Select
                            value={selectedKey}
                            onValueChange={(value) => {
                                const [code, label] = value.split("|");
                                setForm((prev) =>
                                    prev
                                        ? {
                                              ...prev,
                                              code,
                                              income_type: label,
                                          }
                                        : prev,
                                );
                            }}
                        >
                            <SelectTrigger>
                            <SelectValue
                                placeholder="Please Select"
                                // custom render
                                {...(form?.income_type
                                    ? {
                                        children:
                                            form.income_type.length > 50
                                                ? `${form.income_type.substring(0, 50)}...`
                                                : form.income_type,
                                    }
                                    : {})}
                            />
                        </SelectTrigger>
                            <SelectContent>
                                {L3A4B_INCOME_TYPE_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.code}
                                        value={`${opt.code}|${opt.label}`}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Penghasilan Neto *
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={formatMoney(form?.net_income)}
                                onChange={(e) =>
                                    setForm((prev) =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  net_income: parseDigits(
                                                      e.target.value,
                                                  ),
                                              }
                                            : prev,
                                    )
                                }
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t p-4 gap-2 flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Tutup
                    </Button>
                    <Button
                        type="button"
                        className="bg-blue-950 hover:bg-blue-900 gap-2"
                        onClick={() => {
                            if (!form) return;
                            
                            if (form.id) {
                                // Mode Edit - gunakan PUT
                                router.put(route("spt.op.l3a4b.update", { id: form.id }), form, {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        onOpenChange(false);
                                        onSave();
                                    },
                                });
                            } else {
                                // Mode Tambah - gunakan POST
                                router.post(route("spt.op.l3a4b.store"), form, {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        onOpenChange(false);
                                        onSave();
                                    },
                                });
                            }
                        }}
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
