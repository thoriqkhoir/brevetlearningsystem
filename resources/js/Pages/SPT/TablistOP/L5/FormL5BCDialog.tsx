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
import { useEffect, useMemo, useState } from "react";
import {
    type L5BCRecord,
    type L5ReducerType,
    type L5IncomeOption,
    formatRupiah,
    parseDigits,
} from "./types";

const emptyItem = (type: L5ReducerType): L5BCRecord => ({
    type_of_reducer: type,
    code: "",
    type_of_income: "",
    amount_of_reducer: 0,
});

export default function FormL5BCDialog({
    open,
    onOpenChange,
    mode,
    reducerType,
    options,
    value,
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    mode: "create" | "edit";
    reducerType: L5ReducerType;
    options: readonly L5IncomeOption[];
    value: L5BCRecord | null;
    onSubmit: (next: L5BCRecord) => void;
}) {
    const initial = useMemo(
        () => value ?? emptyItem(reducerType),
        [value, reducerType],
    );

    const [draft, setDraft] = useState<L5BCRecord>(initial);
    const [amountDisplay, setAmountDisplay] = useState(
        formatRupiah(initial.amount_of_reducer ?? 0),
    );

    useEffect(() => {
        const next = value ?? emptyItem(reducerType);
        setDraft(next);
        setAmountDisplay(formatRupiah(next.amount_of_reducer ?? 0));
    }, [value, reducerType, open]);

    const title =
        reducerType === "neto"
            ? "PENGURANG PENGHASILAN NETO"
            : "PENGURANG PPh TERUTANG";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-2xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Kode *</Label>
                            <Input
                                value={draft.code ?? ""}
                                onChange={(e) =>
                                    setDraft((p) => ({
                                        ...p,
                                        code: e.target.value,
                                    }))
                                }
                                placeholder="Kode"
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>
                                {reducerType === "neto"
                                    ? "Jenis Pengurang Penghasilan Neto *"
                                    : "Jenis Pengurang PPh Terutang *"}
                            </Label>
                            <Select
                                value={draft.type_of_income ?? ""}
                                onValueChange={(val) => {
                                    const selected = options.find(
                                        (opt) => opt.label === val,
                                    );
                                    setDraft((p) => ({
                                        ...p,
                                        type_of_income: val,
                                        code: selected?.code ?? p.code,
                                    }));
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Silakan pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map((opt) => (
                                        <SelectItem
                                            key={opt.code}
                                            value={opt.label}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            {reducerType === "neto"
                                ? "Jumlah Pengurang Penghasilan Neto *"
                                : "Jumlah Pengurang PPh Terutang *"}
                        </Label>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-2 border rounded bg-gray-100 text-sm">
                                Rp
                            </div>
                            <Input
                                value={amountDisplay}
                                onChange={(e) => {
                                    const n = parseDigits(e.target.value);
                                    setAmountDisplay(formatRupiah(n));
                                    setDraft((p) => ({
                                        ...p,
                                        amount_of_reducer: n,
                                    }));
                                }}
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t p-4 gap-2">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => onOpenChange(false)}
                    >
                        Tutup
                    </Button>
                    <Button
                        type="button"
                        className="bg-blue-950 hover:bg-blue-900"
                        onClick={() => {
                            onSubmit({
                                ...(draft as any),
                                type_of_reducer: reducerType,
                            });
                            onOpenChange(false);
                        }}
                        disabled={!draft.code || !draft.type_of_income}
                    >
                        {mode === "create" ? "Simpan" : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
