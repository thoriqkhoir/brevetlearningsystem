import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import InputMask from "react-input-mask";
import type { UseFormReturn } from "react-hook-form";
import type { BusinessEntityFormValues } from "./schema.ts";

export default function FormFieldsBusinessEntity({
    form,
}: {
    form: UseFormReturn<BusinessEntityFormValues>;
}) {
    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Nama*</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Nama badan usaha" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="npwp"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">NPWP*</FormLabel>
                        <FormControl>
                            <InputMask
                                mask="9999999999999999"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            >
                                {(inputProps: any) => (
                                    <Input
                                        {...inputProps}
                                        inputMode="numeric"
                                        placeholder="16 digit NPWP"
                                    />
                                )}
                            </InputMask>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Alamat (opsional)
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                value={field.value}
                                placeholder="Alamat badan usaha"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
