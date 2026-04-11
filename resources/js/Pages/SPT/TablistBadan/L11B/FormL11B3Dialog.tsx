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
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { L11B3Item } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
const formatRupiahInput = (v: number) =>
    rupiahFormatter
        .format(v ?? 0)
        .replace("Rp", "")
        .trim();
const parseNumber = (raw: string) => {
    const n = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

interface FormL11B3DialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData: L11B3Item | null;
    existingItems: L11B3Item[];
    ebtidaLimit: number;
    derValue: number | null;
    derCap: number;
    totalDebtAverage: number;
    totalEquityAverage: number;
}

const DER_LIMIT = 4;

function clampToInteger(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.round(value));
}

function deriveDeductibleLoanCost({
    averageDebt,
    loanCost,
    ebtidaLimit,
    totalEquityAverage,
    totalDebtAverage,
    existingItems,
    currentAverageDebt,
    currentId,
}: {
    averageDebt: number;
    loanCost: number;
    ebtidaLimit: number;
    totalEquityAverage: number;
    totalDebtAverage: number;
    existingItems: L11B3Item[];
    currentAverageDebt: number;
    currentId?: string;
}) {
    const otherItems = existingItems.filter((item) => item.id !== currentId);
    const otherLoanCostTax = otherItems.reduce(
        (sum, item) => sum + (item.loan_cost_tax ?? 0),
        0,
    );
    const projectedTotalDebt = Math.max(
        totalDebtAverage - currentAverageDebt + averageDebt,
        0,
    );
    const projectedDer =
        totalEquityAverage > 0 ? projectedTotalDebt / totalEquityAverage : null;
    const derFactor =
        projectedDer === null || projectedDer <= 0
            ? 0
            : projectedDer <= DER_LIMIT
              ? 1
              : DER_LIMIT / projectedDer;
    const remainingEbtida = Math.max(ebtidaLimit - otherLoanCostTax, 0);
    const deductible = clampToInteger(
        Math.min(
            loanCost,
            remainingEbtida,
            derFactor >= 1 ? loanCost : loanCost * derFactor,
        ),
    );

    return {
        deductible,
        nonDeductible: Math.max(loanCost - deductible, 0),
    };
}

function MoneyField({
    label,
    value,
    onChange,
    readOnly = false,
}: {
    label: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
}) {
    return (
        <div className="grid gap-2 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
            <Label className="text-sm font-medium uppercase leading-6 text-gray-700">
                {label}
            </Label>
            <div className="grid grid-cols-[56px_minmax(0,1fr)]">
                <div className="flex items-center justify-center rounded-l-md border border-r-0 border-input bg-gray-100 text-sm font-medium text-gray-600">
                    Rp.
                </div>
                <Input
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    className={`rounded-l-none text-right ${readOnly ? "bg-gray-100 font-semibold text-gray-700" : ""}`}
                />
            </div>
        </div>
    );
}

export function FormL11B3Dialog({
    open,
    onClose,
    sptBadanId,
    editData,
    existingItems,
    ebtidaLimit,
    derValue,
    derCap,
    totalDebtAverage,
    totalEquityAverage,
}: FormL11B3DialogProps) {
    const [cost_provider, setCostProvider] = useState("");
    const [avg_debt, setAvgDebt] = useState(0);
    const [avgDebtDisplay, setAvgDebtDisplay] = useState("0");
    const [loan_cost, setLoanCost] = useState(0);
    const [loanCostDisplay, setLoanCostDisplay] = useState("0");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setCostProvider(editData.cost_provider);
            setAvgDebt(editData.average_debt_balance ?? 0);
            setAvgDebtDisplay(
                formatRupiahInput(editData.average_debt_balance ?? 0),
            );
            setLoanCost(editData.loan_cost ?? 0);
            setLoanCostDisplay(formatRupiahInput(editData.loan_cost ?? 0));
        } else {
            setCostProvider("");
            setAvgDebt(0);
            setAvgDebtDisplay("0");
            setLoanCost(0);
            setLoanCostDisplay("0");
        }
    }, [open, editData]);

    const derivedCost = useMemo(
        () =>
            deriveDeductibleLoanCost({
                averageDebt: avg_debt,
                loanCost: loan_cost,
                ebtidaLimit,
                totalEquityAverage,
                totalDebtAverage,
                existingItems,
                currentAverageDebt: editData?.average_debt_balance ?? 0,
                currentId: editData?.id,
            }),
        [
            avg_debt,
            loan_cost,
            ebtidaLimit,
            totalEquityAverage,
            totalDebtAverage,
            existingItems,
            editData?.average_debt_balance,
            editData?.id,
        ],
    );

    const loanCostTaxDisplay = formatRupiahInput(derivedCost.deductible);
    const loanCostCannotDisplay = formatRupiahInput(derivedCost.nonDeductible);
    const derDescription =
        derValue === null ? "N/A" : `${derValue.toFixed(2)} : 1`;

    const makeMoneyHandler =
        (
            setter: React.Dispatch<React.SetStateAction<number>>,
            displaySetter: React.Dispatch<React.SetStateAction<string>>,
        ) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const n = parseNumber(e.target.value);
            setter(n);
            displaySetter(formatRupiahInput(n));
        };

    const handleSave = () => {
        if (!cost_provider.trim()) {
            toast.error("Pemberi Pinjaman wajib diisi");
            return;
        }
        setIsSaving(true);
        const payload = {
            spt_badan_id: sptBadanId,
            cost_provider,
            average_debt_balance: avg_debt,
            loan_cost,
            loan_cost_tax: derivedCost.deductible,
            loan_cost_cannot_reduced: derivedCost.nonDeductible,
        };
        const afterSave = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data berhasil disimpan");
                onClose();
            },
            onError: () => toast.error("Gagal menyimpan data"),
            onFinish: () => setIsSaving(false),
        };
        if (editData?.id) {
            router.put(
                route("spt.badan.l11b3.update", editData.id),
                payload,
                afterSave,
            );
        } else {
            router.post(route("spt.badan.l11b3.store"), payload, afterSave);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle className="font-semibold">
                        {editData ? "Edit" : "Add"} Penghitungan Biaya Pinjaman
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto min-h-0 space-y-6 p-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
                            <Label className="text-sm font-medium uppercase leading-6 text-gray-700">
                                Pemberi Pinjaman
                            </Label>
                            <Input
                                value={cost_provider}
                                onChange={(e) =>
                                    setCostProvider(e.target.value)
                                }
                            />
                        </div>
                        <MoneyField
                            label="Saldo Rata-Rata Utang"
                            value={avgDebtDisplay}
                            onChange={makeMoneyHandler(
                                setAvgDebt,
                                setAvgDebtDisplay,
                            )}
                        />
                        <MoneyField
                            label="Biaya Pinjaman (Bunga)"
                            value={loanCostDisplay}
                            onChange={makeMoneyHandler(
                                setLoanCost,
                                setLoanCostDisplay,
                            )}
                        />
                        <MoneyField
                            label="Biaya Pinjaman Yang Dapat Diperhitungkan Dalam Menghitung Penghasilan Kena Pajak"
                            value={loanCostTaxDisplay}
                            readOnly
                        />
                        <MoneyField
                            label="Biaya Pinjaman Yang Tidak Dapat Dikurangkan"
                            value={loanCostCannotDisplay}
                            readOnly
                        />
                    </div>
                </div>
                <DialogFooter className="border-t p-4 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Tutup
                    </Button>
                    <Button
                        className="bg-blue-950 hover:bg-blue-900 gap-2"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FormL11B3Dialog;
