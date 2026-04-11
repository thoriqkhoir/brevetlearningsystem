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
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { L14Item } from "./types";

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

interface FormL14DialogProps {
    open: boolean;
    onClose: () => void;
    sptBadanId: string;
    editData: L14Item | null;
}

type MoneyKey =
    | "provision_remaining"
    | "year_1"
    | "year_2"
    | "year_3"
    | "year_4"
    | "remaining_amount"
    | "unreplaced_excess"
    | "surplus_year_replanting_period";

const emptyForm = (): Omit<L14Item, "id" | "spt_badan_id"> => ({
    tax_year: "",
    provision_remaining: 0,
    replanting_form_surfer: "",
    year_1: 0,
    year_2: 0,
    year_3: 0,
    year_4: 0,
    remaining_amount: 0,
    unreplaced_excess: 0,
    surplus_year_replanting_period: 0,
});

export function FormL14Dialog({
    open,
    onClose,
    sptBadanId,
    editData,
}: FormL14DialogProps) {
    const [form, setForm] = useState(emptyForm());
    const [displays, setDisplays] = useState<Record<MoneyKey, string>>({
        provision_remaining: "",
        year_1: "",
        year_2: "",
        year_3: "",
        year_4: "",
        remaining_amount: "",
        unreplaced_excess: "",
        surplus_year_replanting_period: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (editData) {
            setForm({
                tax_year: editData.tax_year ?? "",
                provision_remaining: editData.provision_remaining ?? 0,
                replanting_form_surfer: editData.replanting_form_surfer ?? "",
                year_1: editData.year_1 ?? 0,
                year_2: editData.year_2 ?? 0,
                year_3: editData.year_3 ?? 0,
                year_4: editData.year_4 ?? 0,
                remaining_amount: editData.remaining_amount ?? 0,
                unreplaced_excess: editData.unreplaced_excess ?? 0,
                surplus_year_replanting_period:
                    editData.surplus_year_replanting_period ?? 0,
            });
            setDisplays({
                provision_remaining: formatRupiahInput(
                    editData.provision_remaining ?? 0,
                ),
                year_1: formatRupiahInput(editData.year_1 ?? 0),
                year_2: formatRupiahInput(editData.year_2 ?? 0),
                year_3: formatRupiahInput(editData.year_3 ?? 0),
                year_4: formatRupiahInput(editData.year_4 ?? 0),
                remaining_amount: formatRupiahInput(
                    editData.remaining_amount ?? 0,
                ),
                unreplaced_excess: formatRupiahInput(
                    editData.unreplaced_excess ?? 0,
                ),
                surplus_year_replanting_period: formatRupiahInput(
                    editData.surplus_year_replanting_period ?? 0,
                ),
            });
        } else {
            setForm(emptyForm());
            setDisplays({
                provision_remaining: "",
                year_1: "",
                year_2: "",
                year_3: "",
                year_4: "",
                remaining_amount: "",
                unreplaced_excess: "",
                surplus_year_replanting_period: "",
            });
        }
    }, [open, editData]);

    const setMoney = (key: MoneyKey, raw: string) => {
        const n = parseNumber(raw);
        setForm((prev) => ({ ...prev, [key]: n }));
        setDisplays((prev) => ({ ...prev, [key]: formatRupiahInput(n) }));
    };

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
                console.error("L14 save errors:", errors);
                const firstMsg = Object.values(errors)[0];
                toast.error(firstMsg ?? "Gagal menyimpan data");
            },
            onFinish: () => setIsSaving(false),
        };
        if (editData?.id) {
            router.put(
                route("spt.badan.l14.update", editData.id),
                payload,
                opts,
            );
        } else {
            router.post(route("spt.badan.l14.store"), payload, opts);
        }
    };

    const textField = (
        label: string,
        key: "tax_year" | "replanting_form_surfer",
    ) => (
        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
            <Label className="text-sm font-normal">{label}</Label>
            <Input
                type="text"
                value={(form[key] as string) ?? ""}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
            />
        </div>
    );

    const moneyField = (label: string, key: MoneyKey) => (
        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-4">
            <Label className="text-sm font-normal">{label}</Label>
            <div className="flex">
                <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 rounded-l-md">
                    Rp.
                </span>
                <Input
                    value={displays[key]}
                    onChange={(e) => setMoney(key, e.target.value)}
                    className="rounded-l-none text-right"
                />
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="w-[95vw] max-w-xl sm:w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-blue-950 text-white p-4">
                    <DialogTitle className="text-lg font-semibold">
                        {editData ? "UBAH" : "TAMBAH"}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0">
                    {textField("Tahun Pajak/Bagian Tahun Pajak", "tax_year")}
                    {moneyField("Penyediaan Sisa Lebih Selama 4 Tahun", "provision_remaining")}
                    {textField("Bentuk Penanaman Kembali Sisa Lebih", "replanting_form_surfer")}

                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Penggunaan Sisa Lebih untuk Pembangunan dan Pengadaan Sarana dan Prasarana
                    </p>
                    {moneyField("Tahun Ke-1", "year_1")}
                    {moneyField("Tahun Ke-2", "year_2")}
                    {moneyField("Tahun Ke-3", "year_3")}
                    {moneyField("Tahun Ke-4", "year_4")}
                    {moneyField("Jumlah Penggunaan Sisa Lebih", "remaining_amount")}
                    {moneyField("Sisa Lebih Yang Belum Ditanamkan Kembali", "unreplaced_excess")}
                    {moneyField("Sisa Lebih Yang Melewati Jangka Waktu 4 Tahun", "surplus_year_replanting_period")}
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
