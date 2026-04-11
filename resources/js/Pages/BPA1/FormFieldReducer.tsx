import { Button } from "@/Components/ui/button";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { useEffect } from "react";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const parseRupiah = (value: string) => {
    return Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

export default function FormFieldReducer({ form, objects, user }: any) {
    const { watch, setValue } = form;
    
    // Watch all reducer fields for calculation
    const position_allowance = watch("position_allowance") || 0;
    const pension_contribution = watch("pension_contribution") || 0;
    const zakat = watch("zakat") || 0;

    // Calculate total reducer
    useEffect(() => {
        const total = 
            Number(position_allowance) + 
            Number(pension_contribution) + 
            Number(zakat);
        
        setValue("amount_of_reduction", total);
    }, [position_allowance, pension_contribution, zakat, setValue]);

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="position_allowance"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Biaya Jabatan/Biaya Pensiun*
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

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="pension_contribution"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Iuran Terkait Pensiun atau Hari Tua*
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
                name="zakat"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Zakat atau Sumbangan Keagamaan yang Bersifat Wajib yang Dibayarkan Melalui Pemberi Kerja*
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
                name="amount_of_reduction"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Jumlah Pengurang*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                disabled
                                className="bg-gray-50"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
