import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { useEffect, useState } from "react";
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
import {
    type L1A1Item,
    type MasterAccount,
    formatMoney,
    parseDigits,
    computeFiscalAmount,
    KODE_PENYESUAIAN_FISKAL_OPTIONS,
} from "./types";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: MasterAccount | null;
    editForm: L1A1Item | null;
    setEditForm: React.Dispatch<React.SetStateAction<L1A1Item | null>>;
    onSave: () => void;
};

const computeNonFinal = (item: L1A1Item) =>
    Number(item.amount ?? 0) -
    Number(item.non_taxable ?? 0) -
    Number(item.subject_to_final ?? 0);


export default function FormL1ADialog({
    open,
    onOpenChange,
    account,
    editForm,
    setEditForm,
    onSave,
}: Props) {
    const [openFiscalCode, setOpenFiscalCode] = useState(false);

    const setEditMoney = (field: keyof L1A1Item, value: string) => {
        setEditForm((prev) => {
            if (!prev) return prev;
            const next = {
                ...prev,
                amount: Number(prev.amount ?? 0),
                non_taxable: Number(prev.non_taxable ?? 0),
                subject_to_final: Number(prev.subject_to_final ?? 0),
                non_final: Number(prev.non_final ?? 0),
                fiscal_positive: Number(prev.fiscal_positive ?? 0),
                fiscal_negative: Number(prev.fiscal_negative ?? 0),
                fiscal_amount: Number(prev.fiscal_amount ?? 0),
                [field]: parseDigits(value),
            } as L1A1Item;
            next.non_final = computeNonFinal(next);
            next.fiscal_amount = computeFiscalAmount(next);
            return next;
        });
    };

    useEffect(() => {
        setEditForm((prev) => {
            if (!prev) return prev;

            const normalized = {
                ...prev,
                amount: Number(prev.amount ?? 0),
                non_taxable: Number(prev.non_taxable ?? 0),
                subject_to_final: Number(prev.subject_to_final ?? 0),
                non_final: Number(prev.non_final ?? 0),
                fiscal_positive: Number(prev.fiscal_positive ?? 0),
                fiscal_negative: Number(prev.fiscal_negative ?? 0),
                fiscal_amount: Number(prev.fiscal_amount ?? 0),
            };

            const nonFinal = computeNonFinal(normalized);
            const fiscal = computeFiscalAmount({ ...normalized, non_final: nonFinal });

            if (normalized.non_final === nonFinal && normalized.fiscal_amount === fiscal) {
                return normalized;
            }

            return {
                ...normalized,
                non_final: nonFinal,
                fiscal_amount: fiscal,
            };
        });
    }, [
        open,
        editForm?.amount,
        editForm?.non_taxable,
        editForm?.subject_to_final,
        editForm?.fiscal_positive,
        editForm?.fiscal_negative,
        setEditForm,
    ]);

    const accountCategory = (account?.category ?? "")
        .toString()
        .trim()
        .toLowerCase();

    const disableTaxInputs = accountCategory.trim() !== "penjualan";

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
                                value={formatMoney(editForm?.amount)}
                                onChange={(e) =>
                                    setEditMoney(
                                        "amount",
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
                                value={formatMoney(editForm?.fiscal_positive)}
                                onChange={(e) =>
                                    setEditMoney(
                                        "fiscal_positive",
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
                                value={formatMoney(editForm?.fiscal_negative)}
                                onChange={(e) =>
                                    setEditMoney(
                                        "fiscal_negative",
                                        e.target.value,
                                    )
                                }
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* KODE PENYESUAIAN FISKAL */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            KODE PENYESUAIAN FISKAL
                        </Label>
                        <Popover open={openFiscalCode} onOpenChange={setOpenFiscalCode}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openFiscalCode}
                                    className="w-full justify-between font-normal"
                                >
                                    <span className="truncate text-left">
                                        {editForm?.fiscal_code
                                            ? editForm.fiscal_code
                                                  .split(",")
                                                  .filter(Boolean)
                                                  .join(", ")
                                            : "Silakan Pilih"}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                portalled={false}
                                className="w-[min(90vw,400px)] p-0 max-h-[60vh] overflow-y-auto overscroll-contain pointer-events-auto"
                            >
                                <Command>
                                    <CommandInput placeholder="Cari kode..." />
                                    <CommandList>
                                        <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                        <CommandGroup>
                                            {KODE_PENYESUAIAN_FISKAL_OPTIONS.filter(
                                                (opt) => opt.value !== "",
                                            ).map((opt) => {
                                                const selected = (
                                                    editForm?.fiscal_code ?? ""
                                                )
                                                    .split(",")
                                                    .filter(Boolean)
                                                    .includes(opt.value);
                                                return (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.label}
                                                        onSelect={() => {
                                                            setEditForm((prev) => {
                                                                if (!prev) return prev;
                                                                const current = (
                                                                    prev.fiscal_code ?? ""
                                                                )
                                                                    .split(",")
                                                                    .filter(Boolean);
                                                                const next = selected
                                                                    ? current.filter(
                                                                          (v) =>
                                                                              v !== opt.value,
                                                                      )
                                                                    : [...current, opt.value];
                                                                return {
                                                                    ...prev,
                                                                    fiscal_code:
                                                                        next.join(","),
                                                                };
                                                            });
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selected
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {opt.label}
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
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
