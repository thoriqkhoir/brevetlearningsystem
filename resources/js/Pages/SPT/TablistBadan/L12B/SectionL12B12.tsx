import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { router } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { L12B12Item } from "./types";

interface SectionL12B12Props {
    data: L12B12Item[];
    sptBadanId: string;
    type: "taxpayer" | "company";
}

export function SectionL12B12({ data, sptBadanId, type }: SectionL12B12Props) {
    const existing = data.find((d) => d.type === type) ?? null;

    const [npwp, setNpwp] = useState(existing?.npwp ?? "");
    const [name, setName] = useState(existing?.name ?? "");
    const [address, setAddress] = useState(existing?.address ?? "");
    const [businessType, setBusinessType] = useState(existing?.business_type ?? "");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const rec = data.find((d) => d.type === type) ?? null;
        setNpwp(rec?.npwp ?? "");
        setName(rec?.name ?? "");
        setAddress(rec?.address ?? "");
        setBusinessType(rec?.business_type ?? "");
    }, [data, type]);

    const handleSave = () => {
        setIsSaving(true);
        const payload = {
            spt_badan_id: sptBadanId,
            type,
            npwp,
            name,
            address: address || null,
            business_type: businessType || null,
        };
        const afterSave = {
            preserveScroll: true,
            onSuccess: () => toast.success("Data berhasil disimpan"),
            onError: () => toast.error("Gagal menyimpan data"),
            onFinish: () => setIsSaving(false),
        };
        if (existing?.id) {
            router.put(route("spt.badan.l12b12.update", existing.id), payload, afterSave);
        } else {
            router.post(route("spt.badan.l12b12.store"), payload, afterSave);
        }
    };

    // Section I: NPWP, NAMA, ALAMAT, JENIS USAHA
    // Section II: NAMA, NPWP, ALAMAT, JENIS USAHA
    const rows =
        type === "taxpayer"
            ? [
                  { badge: "a", label: "NPWP", value: npwp, setter: setNpwp, placeholder: "" },
                  { badge: "b", label: "NAMA", value: name, setter: setName, placeholder: "" },
                  { badge: "c", label: "ALAMAT", value: address, setter: setAddress, placeholder: "" },
                  { badge: "d", label: "JENIS USAHA", value: businessType, setter: setBusinessType, placeholder: "" },
              ]
            : [
                  { badge: "a", label: "NAMA", value: name, setter: setName, placeholder: "" },
                  { badge: "b", label: "NPWP", value: npwp, setter: setNpwp, placeholder: "" },
                  { badge: "c", label: "ALAMAT", value: address, setter: setAddress, placeholder: "" },
                  { badge: "d", label: "JENIS USAHA", value: businessType, setter: setBusinessType, placeholder: "" },
              ];

    return (
        <div className="space-y-2">
            {rows.map((row) => (
                <div key={row.badge} className="grid grid-cols-[28px_200px_16px_1fr] items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded  font-bold text-gray-900">
                        {row.badge}
                    </span>
                    <Label className=" font-semibold tracking-wide uppercase">{row.label}</Label>
                    <span className=" text-center">:</span>
                    <Input
                        value={row.value}
                        onChange={(e) => row.setter(e.target.value)}
                        placeholder={row.placeholder}
                        className="h-8 text-sm"
                    />
                </div>
            ))}
            <div className="pt-3">
                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-950 hover:bg-blue-900"
                    size="sm"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Menyimpan..." : "Simpan"}
                </Button>
            </div>
        </div>
    );
}
