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

export default function FormFieldTransactionDetail({ form, isEditMode }: any) {
    const { watch, setValue } = form;
    const dpp = watch("dpp");
    const dpp_lain = watch("dpp_lain");
    const ppn_rate = 12;

    useEffect(() => {
        const dppLainValue = Number(dpp_lain) || 0;
        const ppn = Math.round((dppLainValue * ppn_rate) / 100);
        setValue("ppn", ppn);
    }, [dpp_lain, ppn_rate, setValue]);

    const handleDppLainChange = (value: string) => {
        const parsedValue = parseRupiah(value);
        if (parsedValue <= dpp) {
            setValue("dpp_lain", parsedValue);
        } else {
            setValue("dpp_lain", dpp);
        }
    };

    useEffect(() => {
        if (isEditMode) {
            setValue("dpp_lain", dpp_lain);
        } else {
            setValue("dpp_lain", dpp);
        }
    }, [dpp, setValue, isEditMode]);

    console.log(isEditMode);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
            <FormField
                control={form.control}
                name="dpp"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>DPP*</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    value={rupiahFormatter.format(
                                        field.value || 0
                                    )}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseRupiah(e.target.value)
                                        )
                                    }
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={form.control}
                name="dpp_lain"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>DPP Lain*</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    value={rupiahFormatter.format(
                                        field.value || 0
                                    )}
                                    onChange={(e) =>
                                        handleDppLainChange(e.target.value)
                                    }
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={form.control}
                name="ppn"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>PPn*</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    value={rupiahFormatter.format(
                                        field.value || 0
                                    )}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseRupiah(e.target.value)
                                        )
                                    }
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={form.control}
                name="ppnbm"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>PPnBM*</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    value={rupiahFormatter.format(
                                        field.value || 0
                                    )}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseRupiah(e.target.value)
                                        )
                                    }
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        </div>
    );
}
