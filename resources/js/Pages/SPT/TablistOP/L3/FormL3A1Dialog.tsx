import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { X } from "lucide-react";
import {
    type L3A13A1Item,
    type MasterAccount,
    KODE_PENYESUAIAN_FISKAL_OPTIONS,
    formatMoney,
    parseDigits,
    computeFiscalAmount,
} from "./types";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: MasterAccount | null;
    editForm: L3A13A1Item | null;
    setEditForm: React.Dispatch<React.SetStateAction<L3A13A1Item | null>>;
    onSave: () => void;
};

const computeNonFinal = (item: L3A13A1Item) =>
    (item.commercial_value ?? 0) -
    (item.non_taxable ?? 0) -
    (item.subject_to_final ?? 0);


export default function FormL3A1Dialog({
    open,
    onOpenChange,
    account,
    editForm,
    setEditForm,
    onSave,
}: Props) {
    const setEditMoney = (field: keyof L3A13A1Item, value: string) => {
        setEditForm((prev) => {
            if (!prev) return prev;
            const next = {
                ...prev,
                [field]: parseDigits(value),
            } as L3A13A1Item;
            next.non_final = computeNonFinal(next);
            next.fiscal_amount = computeFiscalAmount(next);
            return next;
        });
    };

    useEffect(() => {
        setEditForm((prev) => {
            if (!prev) return prev;

            const nonFinal = computeNonFinal(prev);
            const fiscal = computeFiscalAmount({ ...prev, non_final: nonFinal });

            if (prev.non_final === nonFinal && prev.fiscal_amount === fiscal) {
                return prev;
            }

            return {
                ...prev,
                non_final: nonFinal,
                fiscal_amount: fiscal,
            };
        });
    }, [
        open,
        editForm?.commercial_value,
        editForm?.non_taxable,
        editForm?.subject_to_final,
        editForm?.positive_fiscal,
        editForm?.negative_fiscal,
        setEditForm,
    ]);

    const selectedCorrectionCodes = (editForm?.correction_code ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

    const setCorrectionCodes = (values: string[]) => {
        setEditForm((prev) =>
            prev ? { ...prev, correction_code: values.join(",") } : prev,
        );
    };

    const toggleCorrectionCode = (code: string, checked: boolean) => {
        if (disableCorrectionCodes) return;

        const nextValues = checked
            ? Array.from(new Set([...selectedCorrectionCodes, code]))
            : selectedCorrectionCodes.filter((value) => value !== code);

        setCorrectionCodes(nextValues);
    };

    const accountCategory = (account?.category ?? "")
        .toString()
        .trim()
        .toLowerCase();

    const disableTaxInputs = accountCategory.trim() !== "penjualan";

    const hasFiscalAdjustment =
    (editForm?.positive_fiscal ?? 0) !== 0 ||
    (editForm?.negative_fiscal ?? 0) !== 0;

    const disableCorrectionCodes = !hasFiscalAdjustment;

    useEffect(() => {
        if (!hasFiscalAdjustment) {
            setEditForm((prev) => {
                if (!prev || !prev.correction_code) return prev;
                return { ...prev, correction_code: "" };
            });
        }
    }, [hasFiscalAdjustment, setEditForm]);

    

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle className="text-lg font-semibold">
                        UBAH
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* Kode Akun */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Kode Akun</Label>
                        <Input
                            value={account?.code ?? ""}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    {/* Keterangan */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Keterangan
                        </Label>
                        <Input
                            value={account?.name ?? ""}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    {/* NILAI (KOMERSIAL) */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            NILAI (KOMERSIAL)
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={formatMoney(editForm?.commercial_value)}
                                onChange={(e) =>
                                    setEditMoney(
                                        "commercial_value",
                                        e.target.value,
                                    )
                                }
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* NON OBJEK PAJAK */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            NON OBJEK PAJAK
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={formatMoney(editForm?.non_taxable)}
                                onChange={(e) => setEditMoney("non_taxable", e.target.value)}
                                className={`rounded-l-none text-right ${disableTaxInputs ? "bg-gray-100" : ""}`}
                                disabled={disableTaxInputs}
                            />
                        </div>
                    </div>

                    {/* DIKENAKAN PPh FINAL */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            DIKENAKAN PPh FINAL
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={formatMoney(editForm?.subject_to_final)}
                                onChange={(e) => setEditMoney("subject_to_final", e.target.value)}
                                className={`rounded-l-none text-right ${disableTaxInputs ? "bg-gray-100" : ""}`}
                                disabled={disableTaxInputs}
                            />
                        </div>
                    </div>

                    {/* TIDAK FINAL */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            TIDAK FINAL
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={formatMoney(editForm?.non_final)}
                                className="rounded-l-none text-right bg-gray-100"
                                disabled
                                readOnly
                            />              
                        </div>
                    </div>

                    {/* PENYESUAIAN FISKAL POSITIF */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            PENYESUAIAN FISKAL POSITIF
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={formatMoney(editForm?.positive_fiscal)}
                                onChange={(e) =>
                                    setEditMoney(
                                        "positive_fiscal",
                                        e.target.value,
                                    )
                                }
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* PENYESUAIAN FISKAL NEGATIF */}
                    <div className="grid grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            PENYESUAIAN FISKAL NEGATIF
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={formatMoney(editForm?.negative_fiscal)}
                                onChange={(e) =>
                                    setEditMoney(
                                        "negative_fiscal",
                                        e.target.value,
                                    )
                                }
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-start gap-4">
                        <Label className="text-sm font-normal pt-2">
                            KODE PENYESUAIAN FISKAL
                        </Label>

                        <div className={`space-y-2 max-h-40 overflow-y-auto rounded-md border border-input p-3 ${disableCorrectionCodes ? "opacity-60" : ""}`}>
                            {KODE_PENYESUAIAN_FISKAL_OPTIONS.filter((opt) => opt.value !== "").map(
                                (opt) => {
                                    const checked = selectedCorrectionCodes.includes(opt.value);

                                    return (
                                        <label
                                            key={opt.value}
                                            className="flex items-start gap-2 text-sm cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={checked}
                                                disabled={disableCorrectionCodes}
                                                onCheckedChange={(value) =>
                                                    toggleCorrectionCode(opt.value, value === true)
                                                }
                                            />
                                            <span>{opt.label}</span>
                                        </label>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    {/* NILAI FISKAL */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            NILAI FISKAL (Sebelum Fasilitas Perpajakan)
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={formatMoney(editForm?.fiscal_amount)}
                                disabled
                                readOnly
                                className="rounded-l-none text-right bg-gray-100"
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
                        onClick={onSave}
                    >
                        <span>💾</span>
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
