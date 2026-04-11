import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import InputMask from "react-input-mask";

export default function FormFieldBuyerInformation({ form }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
            <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>NPWP/NIK*</FormLabel>
                            <FormControl>
                                <InputMask
                                    mask="9999999999999999"
                                    value={field.value}
                                    onChange={field.onChange}
                                    autoComplete="off"
                                >
                                    {(inputProps) => <Input {...inputProps} />}
                                </InputMask>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Nama*</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={form.control}
                name="customer_address"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Alamat*</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        </div>
    );
}
