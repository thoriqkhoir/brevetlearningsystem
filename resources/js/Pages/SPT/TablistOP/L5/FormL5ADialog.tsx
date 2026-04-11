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
import { useEffect, useMemo, useState } from "react";
import {
    COMPENSATION_KEYS,
    type L5ARecord,
    formatRupiah,
    parseDigits,
} from "./types";

export default function FormL5ADialog({
    open,
    onOpenChange,
    currentYear,
    taxYear,
    value,
    onSave,
}: {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    currentYear: number;
    taxYear: string;
    value: L5ARecord;
    onSave: (next: L5ARecord) => void;
}) {
    const compYears = useMemo(() => {
        const start = currentYear - 5;
        return Array.from({ length: 6 }, (_, idx) => start + idx);
    }, [currentYear]);

    const [draft, setDraft] = useState<L5ARecord>(value);
    const [fiscalDisplay, setFiscalDisplay] = useState("0");
    const [compDisplay, setCompDisplay] = useState<
        Record<(typeof COMPENSATION_KEYS)[number], string>
    >(Object.fromEntries(COMPENSATION_KEYS.map((k) => [k, "0"])) as any);

    useEffect(() => {
        if (!open) return;
        setDraft(value);
        setFiscalDisplay(formatRupiah(value.fiscal_amount ?? 0));
        setCompDisplay(
            Object.fromEntries(
                COMPENSATION_KEYS.map((k) => [
                    k,
                    formatRupiah((value as any)[k] ?? 0),
                ]),
            ) as any,
        );
    }, [open, value]);

    const saveAndClose = () => {
        onSave(draft);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-3xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle>
                        PENGHITUNGAN KOMPENSASI KERUGIAN FISKAL
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-6 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tahun Pajak</Label>
                            <Input
                                value={taxYear}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Laba/Rugi Penghasilan Fiskal *</Label>
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-2 border rounded bg-gray-100 text-sm">
                                    Rp
                                </div>
                                <Input
                                    value={fiscalDisplay}
                                    onChange={(e) => {
                                        const n = parseDigits(e.target.value);
                                        setFiscalDisplay(formatRupiah(n));
                                        setDraft((prev) => ({
                                            ...prev,
                                            fiscal_amount: n,
                                        }));
                                    }}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border rounded">
                        <div className="bg-blue-950 text-white font-semibold p-3">
                            Jumlah Kompensasi Kerugian Fiskal
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {compYears.map((year, idx) => {
                                const key = COMPENSATION_KEYS[idx];
                                return (
                                    <div key={year} className="space-y-2">
                                        <Label>Tahun {year}</Label>
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-2 border rounded bg-gray-100 text-sm">
                                                Rp
                                            </div>
                                            <Input
                                                value={compDisplay[key] ?? "0"}
                                                onChange={(e) => {
                                                    const n = parseDigits(
                                                        e.target.value,
                                                    );
                                                    setCompDisplay((prev) => ({
                                                        ...prev,
                                                        [key]: formatRupiah(n),
                                                    }));
                                                    setDraft(
                                                        (prev) =>
                                                            ({
                                                                ...prev,
                                                                [key]: n,
                                                            }) as any,
                                                    );
                                                }}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
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
                        onClick={saveAndClose}
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
