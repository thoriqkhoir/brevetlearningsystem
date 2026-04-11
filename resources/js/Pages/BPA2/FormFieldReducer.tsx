import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { useEffect } from "react";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const parseRupiah = (value: string) => {
    return Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

export default function FormFieldReducer({ form }: any) {
    const { watch, setValue } = form;
    
    // Watch gross_income_amount for position_allowance calculation
    const grossIncomeAmount = watch("gross_income_amount") || 0;
    
    // Watch all reducer fields for calculation
    const position_cost = watch("position_cost") || 0;
    const pension_contribution = watch("pension_contribution") || 0;
    const zakat_donation = watch("zakat_donation") || 0;

    // Calculate position_cost as 5% of gross_income_amount (max 6 million)
    useEffect(() => {
        if (grossIncomeAmount && grossIncomeAmount > 0) {
            const calculatedAllowance = Math.round(grossIncomeAmount * 0.05);
            const positionCost = Math.min(calculatedAllowance, 6000000);
            setValue("position_cost", positionCost);
        } else {
            setValue("position_cost", 0);
        }
    }, [grossIncomeAmount, setValue]);

    // Calculate total reducer
    useEffect(() => {
        const total = 
            Number(position_cost) + 
            Number(pension_contribution) + 
            Number(zakat_donation);
        
        setValue("amount_of_reduction", total);
    }, [position_cost, pension_contribution, zakat_donation, setValue]);

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="position_cost"
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
                                className="bg-gray-100"
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
                            Iuran Pensiun atau Iuran THT/JHT*
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
                name="zakat_donation"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Zakat atau Sumbangan Keagamaan yang Bersifat Wajib*
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