import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
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
                name="customer_id_type"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Nomor Identitas</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-2 gap-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="tin" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            NPWP/NIK
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Negara</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="indonesia">
                                    Indonesia
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
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
                            <FormLabel>Alamat Pembeli*</FormLabel>
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
                name="customer_email"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Email Pembeli*</FormLabel>
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
