import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
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
import { CalendarIcon, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { L11A4BData } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const formatRupiahInput = (value: number) => {
    if (!value) return "0";
    return rupiahFormatter.format(value).replace("Rp", "").trim();
};

const parseNumber = (raw: string) => {
    const numeric = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
};

type MoneyKey =
    | "value_4a"
    | "value_4b"
    | "value_4c"
    | "value_4d"
    | "value_4e"
    | "value_4f";

const MONEY_LABELS: Record<MoneyKey, string> = {
    value_4a:
        "a. Tempat tinggal, termasuk perumahan untuk pegawai dan keluarganya",
    value_4b: "b. Pelayanan kesehatan",
    value_4c: "c. Pendidikan bagi pegawai dan keluarganya",
    value_4d: "d. Peribadatan",
    value_4e: "e. Pengangkutan bagi pegawai dan keluarganya",
    value_4f:
        "f. Olahraga bagi pegawai dan keluarganya, tidak termasuk golf, power boating, pacuan kuda, dan terbang layang",
};

const MONEY_KEYS: MoneyKey[] = [
    "value_4a",
    "value_4b",
    "value_4c",
    "value_4d",
    "value_4e",
    "value_4f",
];

interface FormL11A4BProps {
    sptBadanId: string;
    l11a4b: L11A4BData | null;
}

type FormState = Omit<L11A4BData, "id" | "spt_badan_id">;

const defaultState: FormState = {
    address: "",
    decision_areas_number: 0,
    decision_areas_date: "",
    decision_longer_areas_number: 0,
    decision_longer_areas_date: "",
    value_4a: 0,
    value_4b: 0,
    value_4c: 0,
    value_4d: 0,
    value_4e: 0,
    value_4f: 0,
    total: 0,
};

export function FormL11A4B({ sptBadanId, l11a4b }: FormL11A4BProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [state, setState] = useState<FormState>(defaultState);
    const [isDecisionAreasDateOpen, setIsDecisionAreasDateOpen] =
        useState(false);
    const [isDecisionLongerAreasDateOpen, setIsDecisionLongerAreasDateOpen] =
        useState(false);
    const [moneyDisplays, setMoneyDisplays] = useState<
        Record<MoneyKey, string>
    >({
        value_4a: "0",
        value_4b: "0",
        value_4c: "0",
        value_4d: "0",
        value_4e: "0",
        value_4f: "0",
    });

    useEffect(() => {
        const raw: Partial<L11A4BData> = l11a4b ?? {};
        const next: FormState = {
            address: (raw.address as string) ?? "",
            decision_areas_number: Number(raw.decision_areas_number ?? 0),
            decision_areas_date: raw.decision_areas_date
                ? String(raw.decision_areas_date).substring(0, 10)
                : "",
            decision_longer_areas_number: Number(
                raw.decision_longer_areas_number ?? 0,
            ),
            decision_longer_areas_date: raw.decision_longer_areas_date
                ? String(raw.decision_longer_areas_date).substring(0, 10)
                : "",
            value_4a: Number(raw.value_4a ?? 0),
            value_4b: Number(raw.value_4b ?? 0),
            value_4c: Number(raw.value_4c ?? 0),
            value_4d: Number(raw.value_4d ?? 0),
            value_4e: Number(raw.value_4e ?? 0),
            value_4f: Number(raw.value_4f ?? 0),
            total: Number(raw.total ?? 0),
        };
        setState(next);
        setMoneyDisplays({
            value_4a: formatRupiahInput(next.value_4a),
            value_4b: formatRupiahInput(next.value_4b),
            value_4c: formatRupiahInput(next.value_4c),
            value_4d: formatRupiahInput(next.value_4d),
            value_4e: formatRupiahInput(next.value_4e),
            value_4f: formatRupiahInput(next.value_4f),
        });
    }, [l11a4b]);

    // total = sum of all value_4x
    const computedTotal = useMemo(() => {
        return (
            state.value_4a +
            state.value_4b +
            state.value_4c +
            state.value_4d +
            state.value_4e +
            state.value_4f
        );
    }, [
        state.value_4a,
        state.value_4b,
        state.value_4c,
        state.value_4d,
        state.value_4e,
        state.value_4f,
    ]);

    const handleMoneyChange =
        (field: MoneyKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const numeric = parseNumber(e.target.value);
            setState((prev) => ({ ...prev, [field]: numeric }));
            setMoneyDisplays((prev) => ({
                ...prev,
                [field]: formatRupiahInput(numeric),
            }));
        };

    const handleTextChange =
        (field: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleNumberChange =
        (field: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const numeric = parseNumber(e.target.value);
            setState((prev) => ({ ...prev, [field]: numeric }));
        };

    const sync = () => {
        setIsSaving(true);

        const payload = {
            spt_badan_id: sptBadanId,
            address: state.address,
            decision_areas_number: state.decision_areas_number,
            decision_areas_date: state.decision_areas_date || null,
            decision_longer_areas_number: state.decision_longer_areas_number,
            decision_longer_areas_date:
                state.decision_longer_areas_date || null,
            value_4a: state.value_4a,
            value_4b: state.value_4b,
            value_4c: state.value_4c,
            value_4d: state.value_4d,
            value_4e: state.value_4e,
            value_4f: state.value_4f,
            total: computedTotal,
        };

        router.post(route("spt.badan.l11a4b.sync"), payload, {
            preserveScroll: true,
            onSuccess: () => toast.success("Data L11A-4B berhasil disimpan"),
            onError: () => toast.error("Gagal menyimpan data L11A-4B"),
            onFinish: () => setIsSaving(false),
        });
    };

    return (
        <div className="mt-4 border rounded-lg overflow-hidden">
            {/* 4B Header */}
            <div className="bg-blue-950 text-white font-semibold px-4 py-3 text-sm">
                4B. RINCIAN PENGGANTIAN ATAU IMBALAN DALAM BENTUK NATURA
                DAN/ATAU KENIKMATAN YANG DIBERIKAN BERKENAAN DENGAN PELAKSANAAN
                PEKERJAAN DI DAERAH TERTENTU
            </div>

            <div className="p-4 bg-white space-y-4">
                {/* Two-column layout: label + value */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-x-4 gap-y-3 items-start">
                    {/* Header row for NILAI column */}
                    <div className="hidden md:block" />
                    <div className="bg-blue-950 text-white text-xs font-semibold text-center px-3 py-1 rounded w-full md:w-auto">
                        NILAI (Rp)
                    </div>
                    {/* Row 1: Alamat Lokasi */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className=" text-black text-xs font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center">
                            1
                        </span>
                        <Label className="text-sm">Alamat Lokasi</Label>
                        <span className="text-muted-foreground">:</span>
                        <Input
                            type="text"
                            value={state.address ?? ""}
                            onChange={handleTextChange("address")}
                            className="w-full md:flex-1"
                            placeholder="Alamat lokasi"
                        />
                    </div>
                    <div /> {/* empty cell in nilai column */}
                    {/* Row 2: Keputusan Penetapan Daerah Tertentu */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className=" text-black text-xs font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center">
                            2
                        </span>
                        <Label className="text-sm">
                            Keputusan Penetapan Daerah Tertentu
                        </Label>
                        <span className="text-muted-foreground">:</span>
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <Label className="text-xs text-muted-foreground whitespace-nowrap">
                                Nomor
                            </Label>
                            <Input
                                type="number"
                                value={state.decision_areas_number || ""}
                                onChange={handleNumberChange(
                                    "decision_areas_number",
                                )}
                                className="w-full sm:w-32"
                                placeholder="Nomor"
                            />
                            <Label className="text-xs text-muted-foreground whitespace-nowrap">
                                Tanggal
                            </Label>
                            <Popover
                                open={isDecisionAreasDateOpen}
                                onOpenChange={setIsDecisionAreasDateOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full sm:w-40 justify-between pl-3 text-left font-normal text-xs",
                                            !state.decision_areas_date &&
                                                "text-muted-foreground",
                                        )}
                                    >
                                        {state.decision_areas_date ? (
                                            format(
                                                new Date(
                                                    state.decision_areas_date,
                                                ),
                                                "yyyy-MM-dd",
                                            )
                                        ) : (
                                            <span>Pilih Tanggal</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
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
                                            state.decision_areas_date
                                                ? new Date(
                                                      state.decision_areas_date,
                                                  )
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            setState((prev) => ({
                                                ...prev,
                                                decision_areas_date: date
                                                    ? format(date, "yyyy-MM-dd")
                                                    : "",
                                            }));
                                            setIsDecisionAreasDateOpen(false);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div />
                    {/* Row 3: Keputusan Perpanjangan */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className=" text-black text-xs font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center">
                            3
                        </span>
                        <Label className="text-sm">
                            Keputusan Perpanjangan Penetapan Daerah Tertentu
                        </Label>
                        <span className="text-muted-foreground">:</span>
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <Label className="text-xs text-muted-foreground whitespace-nowrap">
                                Nomor
                            </Label>
                            <Input
                                type="number"
                                value={state.decision_longer_areas_number || ""}
                                onChange={handleNumberChange(
                                    "decision_longer_areas_number",
                                )}
                                className="w-full sm:w-32"
                                placeholder="Nomor"
                            />
                            <Label className="text-xs text-muted-foreground whitespace-nowrap">
                                Tanggal
                            </Label>
                            <Popover
                                open={isDecisionLongerAreasDateOpen}
                                onOpenChange={setIsDecisionLongerAreasDateOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full sm:w-40 justify-between pl-3 text-left font-normal text-xs",
                                            !state.decision_longer_areas_date &&
                                                "text-muted-foreground",
                                        )}
                                    >
                                        {state.decision_longer_areas_date ? (
                                            format(
                                                new Date(
                                                    state.decision_longer_areas_date,
                                                ),
                                                "yyyy-MM-dd",
                                            )
                                        ) : (
                                            <span>Pilih Tanggal</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
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
                                            state.decision_longer_areas_date
                                                ? new Date(
                                                      state.decision_longer_areas_date,
                                                  )
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            setState((prev) => ({
                                                ...prev,
                                                decision_longer_areas_date: date
                                                    ? format(date, "yyyy-MM-dd")
                                                    : "",
                                            }));
                                            setIsDecisionLongerAreasDateOpen(
                                                false,
                                            );
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div />
                    {/* Row 4: Biaya yang dikeluarkan untuk header */}
                    <div className="flex items-start gap-2 col-span-full">
                        <span className=" text-black text-xs font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center">
                            4
                        </span>
                        <Label className="text-sm font-medium">
                            Biaya yang dikeluarkan untuk:
                        </Label>
                    </div>
                </div>

                {/* value_4a to value_4f rows */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-x-4 gap-y-2 items-start md:items-center">
                    {MONEY_KEYS.map((key) => (
                        <>
                            <div
                                key={`label-${key}`}
                                className="flex items-start gap-2 pl-2 md:pl-6"
                            >
                                <span className=" text-black text-xs font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center">
                                    {key.replace("value_", "")}
                                </span>
                                <Label className="text-sm leading-relaxed">
                                    {MONEY_LABELS[key]}
                                </Label>
                            </div>
                            <Input
                                key={`input-${key}`}
                                type="text"
                                value={moneyDisplays[key]}
                                onChange={handleMoneyChange(key)}
                                className="text-right"
                                placeholder="0"
                            />
                        </>
                    ))}

                    {/* Total row */}
                    <div className="flex items-center gap-1 pl-2 flex-wrap">
                        <Label className="text-sm font-semibold">
                            Jumlah Biaya yang dikeluarkan
                        </Label>
                        <span className="text-xs text-muted-foreground ml-1">
                            ( 4a + 4b + 4c + 4d + 4e + 4f )
                        </span>
                    </div>
                    <Input
                        type="text"
                        value={formatRupiahInput(computedTotal)}
                        readOnly
                        className="text-right bg-gray-100 font-semibold"
                    />
                </div>

                {/* Save button */}
                <div className="flex justify-end pt-2">
                    <Button
                        type="button"
                        className="bg-blue-950 hover:bg-blue-900 gap-2 w-full sm:w-auto"
                        onClick={sync}
                        disabled={isSaving}
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Menyimpan..." : "Simpan 4B"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default FormL11A4B;
