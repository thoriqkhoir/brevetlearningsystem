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
import { useMemo } from "react";
import {
    type BrutoType,
    type L3BItem,
    type MasterObject,
    type MasterTku,
    MONTH_KEYS,
    PROFESSION_TYPES,
    computeRowTotal,
    formatMoney,
    parseDigits,
} from "./types";

export default function FormL3BEditDialog({
    open,
    onOpenChange,
    brutoType,
    masterTku,
    masterObjects,
    value,
    onChange,
    onSubmit,
    userLabel,
}: {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    brutoType: BrutoType;
    masterTku: MasterTku[];
    masterObjects: MasterObject[];
    value: L3BItem;
    onChange: (next: L3BItem) => void;
    onSubmit: () => void;
    userLabel?: string;
}) {
    const tkuOptions = useMemo(() => {
        const list = masterTku ?? [];
        return [...list].sort((a, b) => Number(a.id) - Number(b.id));
    }, [masterTku]);

    const currentTkuLabel = useMemo(() => {
        // Always prefer the provided userLabel (matches REKAPITULASI PEREDARAN BRUTO TERTENTU)
        if (userLabel) return userLabel;

        const found = tkuOptions.find((t) => Number(t.id) === value.tku_id);
        if (!found) return "";
        const code = (found as any).code ?? found.id;
        return `${code} - ${found.name}`;
    }, [tkuOptions, value.tku_id, userLabel]);

    const total = useMemo(() => computeRowTotal(value), [value]);

    const showBookkeeping = brutoType === "b";
    const showBusinessType = brutoType === "c";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        {brutoType === "a"
                            ? "REKAPITULASI PEREDARAN BRUTO TERTENTU"
                            : brutoType === "b"
                              ? "PEREDARAN BRUTO WAJIB PAJAK ORANG PRIBADI PENGUSAHA TERTENTU (OPPT)"
                              : "PEREDARAN BRUTO UNTUK PENGGUNA NORMA PENGHITUNGAN PENGHASILAN NETO (NPPN)"}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                    <div className="border rounded">
                        <div className="bg-blue-950 text-white px-4 py-2 font-semibold">
                            {currentTkuLabel || ""}
                        </div>

                        <div className="p-4 space-y-3">
                            {(showBookkeeping || showBusinessType) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    {showBookkeeping && (
                                        <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                                            <Label>
                                                Metode Pembukuan/Pencatatan
                                            </Label>
                                            <Input
                                                value="1"
                                                disabled
                                                className="bg-gray-100"
                                            />
                                        </div>
                                    )}

                                    {showBusinessType && (
                                        <div className="grid grid-cols-[160px_1fr] items-center gap-4">
                                            <Label>
                                                Jenis Usaha/Pekerjaan Bebas
                                            </Label>
                                            <Select
                                                value={
                                                    value.business_type ?? ""
                                                }
                                                onValueChange={(val) =>
                                                    onChange({
                                                        ...value,
                                                        business_type:
                                                            val as (typeof PROFESSION_TYPES)[number],
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Silakan pilih" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PROFESSION_TYPES.map(
                                                        (label) => (
                                                            <SelectItem
                                                                key={label}
                                                                value={label}
                                                            >
                                                                {label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            )}

                            {MONTH_KEYS.map((key) => (
                                <div
                                    key={key}
                                    className="grid grid-cols-[160px_1fr] items-center gap-4"
                                >
                                    <div className="capitalize text-sm">
                                        {key}
                                    </div>
                                    <Input
                                        className="h-9 text-right"
                                        value={formatMoney((value as any)[key])}
                                        onChange={(e) =>
                                            onChange({
                                                ...value,
                                                [key]: parseDigits(
                                                    e.target.value,
                                                ),
                                            } as L3BItem)
                                        }
                                    />
                                </div>
                            ))}

                            <div className="grid grid-cols-[160px_1fr] items-center gap-4 pt-2 border-t">
                                <div className="text-sm font-semibold">
                                    JUMLAH
                                </div>
                                <Input
                                    className="h-9 text-right bg-gray-100"
                                    value={formatMoney(total)}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t p-4 gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Tutup
                    </Button>
                    <Button
                        type="button"
                        className="bg-blue-950 hover:bg-blue-900"
                        onClick={onSubmit}
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
