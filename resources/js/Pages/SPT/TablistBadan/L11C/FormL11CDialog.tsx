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
import type { L11CItem } from "./types";

const fmt = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
const formatRupiahInput = (v: number) =>
    fmt
        .format(v ?? 0)
        .replace("Rp", "")
        .trim();
const parseNumber = (raw: string) => {
    const n = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) ? n : 0;
};

interface FormL11CDialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData: L11CItem | null;
}

export function FormL11CDialog({
    open,
    onClose,
    sptBadanId,
    editData,
}: FormL11CDialogProps) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [region, setRegion] = useState("");
    const [currencyCode, setCurrencyCode] = useState("");
    const [currencyEndYear, setCurrencyEndYear] = useState(0);
    const [currencyEndYearDisplay, setCurrencyEndYearDisplay] = useState("0");
    const [debtStart, setDebtStart] = useState(0);
    const [debtStartDisplay, setDebtStartDisplay] = useState("0");
    const [debtAddition, setDebtAddition] = useState(0);
    const [debtAdditionDisplay, setDebtAdditionDisplay] = useState("0");
    const [debtReducer, setDebtReducer] = useState(0);
    const [debtReducerDisplay, setDebtReducerDisplay] = useState("0");
    const [debtEnd, setDebtEnd] = useState(0);
    const [debtEndDisplay, setDebtEndDisplay] = useState("0");
    const [startLoanTerm, setStartLoanTerm] = useState("");
    const [endLoanTerm, setEndLoanTerm] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [interestAmount, setInterestAmount] = useState(0);
    const [interestAmountDisplay, setInterestAmountDisplay] = useState("0");
    const [costOther, setCostOther] = useState(0);
    const [costOtherDisplay, setCostOtherDisplay] = useState("0");
    const [loanAllocation, setLoanAllocation] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isStartLoanTermCalendarOpen, setIsStartLoanTermCalendarOpen] =
        useState(false);
    const [isEndLoanTermCalendarOpen, setIsEndLoanTermCalendarOpen] =
        useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setName(editData.name ?? "");
            setAddress(editData.address ?? "");
            setRegion(editData.region ?? "");
            setCurrencyCode(editData.currency_code ?? "");
            setCurrencyEndYear(editData.currency_end_year ?? 0);
            setCurrencyEndYearDisplay(
                formatRupiahInput(editData.currency_end_year ?? 0),
            );
            setDebtStart(editData.principal_debt_start_year ?? 0);
            setDebtStartDisplay(
                formatRupiahInput(editData.principal_debt_start_year ?? 0),
            );
            setDebtAddition(editData.principal_debt_addition ?? 0);
            setDebtAdditionDisplay(
                formatRupiahInput(editData.principal_debt_addition ?? 0),
            );
            setDebtReducer(editData.principal_debt_reducer ?? 0);
            setDebtReducerDisplay(
                formatRupiahInput(editData.principal_debt_reducer ?? 0),
            );
            setDebtEnd(editData.principal_debt_end_year ?? 0);
            setDebtEndDisplay(
                formatRupiahInput(editData.principal_debt_end_year ?? 0),
            );
            setStartLoanTerm(
                editData.start_loan_term
                    ? editData.start_loan_term.substring(0, 10)
                    : "",
            );
            setEndLoanTerm(
                editData.end_loan_term
                    ? editData.end_loan_term.substring(0, 10)
                    : "",
            );
            setInterestRate(String(editData.interest_rate ?? ""));
            setInterestAmount(editData.interest_amount ?? 0);
            setInterestAmountDisplay(
                formatRupiahInput(editData.interest_amount ?? 0),
            );
            setCostOther(editData.cost_other ?? 0);
            setCostOtherDisplay(formatRupiahInput(editData.cost_other ?? 0));
            setLoanAllocation(editData.loan_allocation ?? "");
        } else {
            setName("");
            setAddress("");
            setRegion("");
            setCurrencyCode("");
            setCurrencyEndYear(0);
            setCurrencyEndYearDisplay("0");
            setDebtStart(0);
            setDebtStartDisplay("0");
            setDebtAddition(0);
            setDebtAdditionDisplay("0");
            setDebtReducer(0);
            setDebtReducerDisplay("0");
            setDebtEnd(0);
            setDebtEndDisplay("0");
            setStartLoanTerm("");
            setEndLoanTerm("");
            setInterestRate("");
            setInterestAmount(0);
            setInterestAmountDisplay("0");
            setCostOther(0);
            setCostOtherDisplay("0");
            setLoanAllocation("");
        }
    }, [open, editData]);

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
        if (!name.trim()) {
            toast.error("Nama wajib diisi");
            return;
        }
        setIsSaving(true);
        const payload = {
            spt_badan_id: sptBadanId,
            name,
            address: address || null,
            region: region || null,
            currency_code: currencyCode || null,
            currency_end_year: currencyEndYear,
            principal_debt_start_year: debtStart,
            principal_debt_addition: debtAddition,
            principal_debt_reducer: debtReducer,
            principal_debt_end_year: debtEnd,
            start_loan_term: startLoanTerm || null,
            end_loan_term: endLoanTerm || null,
            interest_rate: interestRate || null,
            interest_amount: interestAmount,
            cost_other: costOther,
            loan_allocation: loanAllocation || null,
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
                route("spt.badan.l11c.update", editData.id),
                payload,
                afterSave,
            );
        } else {
            router.post(route("spt.badan.l11c.store"), payload, afterSave);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle className="text-lg font-semibold">
                        {editData ? "UBAH" : "TAMBAH"}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {/* PEMBERI PINJAMAN */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Pemberi Pinjaman
                    </p>

                    {/* Nama */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Nama <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Alamat */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">Alamat</Label>
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    {/* Negara / Yurisdiksi */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Negara / Yurisdiksi
                        </Label>
                        <Input
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        />
                    </div>

                    {/* MATA UANG */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Mata Uang
                    </p>

                    {/* Kode Mata Uang */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Kode Mata Uang
                        </Label>
                        <Input
                            value={currencyCode}
                            onChange={(e) => setCurrencyCode(e.target.value)}
                            placeholder="IDR, USD, ..."
                        />
                    </div>

                    {/* Kurs Akhir Tahun */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Kurs Akhir Tahun
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={currencyEndYearDisplay}
                                onChange={makeMoneyHandler(
                                    setCurrencyEndYear,
                                    setCurrencyEndYearDisplay,
                                )}
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* POKOK UTANG */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Pokok Utang
                    </p>

                    {/* Awal Tahun */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Awal Tahun
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={debtStartDisplay}
                                onChange={makeMoneyHandler(
                                    setDebtStart,
                                    setDebtStartDisplay,
                                )}
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* Penambahan (Mutasi) */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Penambahan (Mutasi)
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={debtAdditionDisplay}
                                onChange={makeMoneyHandler(
                                    setDebtAddition,
                                    setDebtAdditionDisplay,
                                )}
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* Pengurangan (Mutasi) */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Pengurangan (Mutasi)
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={debtReducerDisplay}
                                onChange={makeMoneyHandler(
                                    setDebtReducer,
                                    setDebtReducerDisplay,
                                )}
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* Akhir Tahun */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Akhir Tahun
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={debtEndDisplay}
                                onChange={makeMoneyHandler(
                                    setDebtEnd,
                                    setDebtEndDisplay,
                                )}
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* JANGKA WAKTU PINJAMAN */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Jangka Waktu Pinjaman
                    </p>

                    {/* Tanggal Mulai */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Tanggal Mulai
                        </Label>
                        <Popover
                            open={isStartLoanTermCalendarOpen}
                            onOpenChange={setIsStartLoanTermCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between pl-3 text-left font-normal",
                                        !startLoanTerm && "text-muted-foreground",
                                    )}
                                >
                                    {startLoanTerm ? (
                                        format(new Date(startLoanTerm), "yyyy-MM-dd")
                                    ) : (
                                        <span>Pilih Tanggal</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                portalled={false}
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={
                                        startLoanTerm
                                            ? new Date(startLoanTerm)
                                            : undefined
                                    }
                                    onSelect={(date) => {
                                        setStartLoanTerm(
                                            date ? format(date, "yyyy-MM-dd") : "",
                                        );
                                        setIsStartLoanTermCalendarOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Tanggal Jatuh Tempo */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Tanggal Jatuh Tempo
                        </Label>
                        <Popover
                            open={isEndLoanTermCalendarOpen}
                            onOpenChange={setIsEndLoanTermCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between pl-3 text-left font-normal",
                                        !endLoanTerm && "text-muted-foreground",
                                    )}
                                >
                                    {endLoanTerm ? (
                                        format(new Date(endLoanTerm), "yyyy-MM-dd")
                                    ) : (
                                        <span>Pilih Tanggal</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                portalled={false}
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={
                                        endLoanTerm
                                            ? new Date(endLoanTerm)
                                            : undefined
                                    }
                                    onSelect={(date) => {
                                        setEndLoanTerm(
                                            date ? format(date, "yyyy-MM-dd") : "",
                                        );
                                        setIsEndLoanTermCalendarOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* BUNGA */}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Bunga
                    </p>

                    {/* Tingkat Bunga */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Tingkat Bunga (%)
                        </Label>
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className="text-right"
                        />
                    </div>

                    {/* Jumlah Bunga */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Jumlah Bunga
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={interestAmountDisplay}
                                onChange={makeMoneyHandler(
                                    setInterestAmount,
                                    setInterestAmountDisplay,
                                )}
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* Biaya Lain */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Biaya Terkait Perolehan Pinjaman Selain Bunga
                        </Label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                                Rp.
                            </span>
                            <Input
                                value={costOtherDisplay}
                                onChange={makeMoneyHandler(
                                    setCostOther,
                                    setCostOtherDisplay,
                                )}
                                className="rounded-l-none text-right"
                            />
                        </div>
                    </div>

                    {/* Peruntukan Pinjaman */}
                    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-4">
                        <Label className="text-sm font-normal">
                            Peruntukan Pinjaman
                        </Label>
                        <Input
                            value={loanAllocation}
                            onChange={(e) => setLoanAllocation(e.target.value)}
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
                        className="bg-blue-950 hover:bg-blue-900 gap-2"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <span>💾</span>
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FormL11CDialog;
