import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/Components/ui/checkbox";
import { useEffect, useState } from "react";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const parseRupiah = (value: string) => {
    return Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

export default function FormFieldPph21({ form }: any) {
    const { watch, setValue } = form;

    // Watch customer_id dan customer_name untuk auto-fill KAP dan NITKU
    const customerId = watch("customer_id");
    const customerName = watch("customer_name");

    // Auto-fill KAP dan NITKU saat NPWP dan Nama diisi
    useEffect(() => {
        if (customerId && customerName) {
            // KAP format: 411121-<2 digit pertama NPWP>
            const npwpPrefix = customerId.substring(0, 2);
            const kapValue = `411121-100`;
            setValue("kap", kapValue);

            // NITKU format: <NPWP> <Nama>
            const nitkuValue = `${customerId} - ${customerName}`;
            setValue("nitku", nitkuValue);
        }
    }, [customerId, customerName, setValue]);

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="neto"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Jumlah Penghasilan Neto
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                disabled
                                className="bg-gray-100"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="proof_number"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Nomor Bukti Pemotongan BPA2 dari Pemberi Kerja Sebelumnya (Apabila ada)
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                autoComplete="off"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="before_neto"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Penghasilan Neto dari Pemotongan Sebelumnya
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="total_neto"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Jumlah Penghasilan Neto untuk Perhitungan PPh Pasal 21 (Setahun/Disetahunkan)
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                disabled
                                className="bg-gray-100"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="non_taxable_income"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Penghasilan Tidak Kena Pajak
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                disabled
                                className="bg-gray-100"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            
            <FormField
                control={form.control}
                name="taxable_income"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Penghasilan Kena Pajak Setahun / Disetahunkan
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                disabled
                                className="bg-gray-100"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="pph_taxable_income"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 atas Penghasilan Kena Pajak Setahun/Disetahunkan
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                disabled
                                className="bg-gray-100"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="pph_owed"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 Terutang
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled
                                className="bg-gray-100"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="pph_deducted"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 Dipotong dari Bukti Pemotongan Sebelumnya
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="pph_deducted_withholding"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 Terutang pada Bukti Pemotongan Ini (Dapat Dikreditkan Pada SPT Tahunan)
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                disabled
                                className="bg-gray-100"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="pph_hasbeen_deducted"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 yang Telah Dipotong
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="pph_desember"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 Kurang (Lebih) Dipotong pada Masa Pajak Desember / Masa Pajak Terakhir*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                disabled
                                className="bg-gray-100"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="kap"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            KAP-KJS*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                autoComplete="off"
                                disabled
                                className="bg-gray-100"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="nitku"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            NITKU/Nomor Identitas Sub Unit Organisasi*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                autoComplete="off"
                                disabled
                                className="bg-gray-100"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}