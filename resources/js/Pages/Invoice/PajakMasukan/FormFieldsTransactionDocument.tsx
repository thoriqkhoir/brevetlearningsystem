import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, getMonth, getYear } from "date-fns";
import { Button } from "@/Components/ui/button";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";

export default function FormFieldsTransactionDocument({ form }: any) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        const invoiceDate = form.watch("invoice_date");
        if (invoiceDate) {
            const monthNames = [
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
            ];
            const month = monthNames[getMonth(invoiceDate)];
            const year = getYear(invoiceDate).toString();
            form.setValue("invoice_period", month);
            form.setValue("invoice_year", year);
        }
    }, [form.watch("invoice_date")]);

    useEffect(() => {
        const correctionNumber = form.watch("correction_number");
        if (correctionNumber >= 1) {
            form.setValue("correction_number", correctionNumber);
        } else {
            form.setValue("correction_number", 0);
        }
    }, [form.watch("correction_number")]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            <FormField
                control={form.control}
                name="invoice_number"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nomor Faktur*</FormLabel>
                        <FormControl>
                            <InputMask
                                mask="99.99.99.999-99999999"
                                value={field.value}
                                onChange={field.onChange}
                                autoComplete="off"
                            >
                                {(inputProps) => <Input {...inputProps} />}
                            </InputMask>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="invoice_date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tanggal Faktur*</FormLabel>
                        <Popover
                            open={isCalendarOpen}
                            onOpenChange={setIsCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value &&
                                                "text-muted-foreground"
                                        )}
                                        onClick={() => setIsCalendarOpen(true)}
                                    >
                                        {field.value ? (
                                            format(field.value, "yyyy-MM-dd")
                                        ) : (
                                            <span>Pilih Tanggal Faktur</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                        field.onChange(date);
                                        setIsCalendarOpen(false);
                                    }}
                                    disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="invoice_period"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Masa Pajak*</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Januari">Januari</SelectItem>
                                <SelectItem value="Februari">
                                    Februari
                                </SelectItem>
                                <SelectItem value="Maret">Maret</SelectItem>
                                <SelectItem value="April">April</SelectItem>
                                <SelectItem value="Mei">Mei</SelectItem>
                                <SelectItem value="Juni">Juni</SelectItem>
                                <SelectItem value="Juli">Juli</SelectItem>
                                <SelectItem value="Agustus">Agustus</SelectItem>
                                <SelectItem value="September">
                                    September
                                </SelectItem>
                                <SelectItem value="Oktober">Oktober</SelectItem>
                                <SelectItem value="November">
                                    November
                                </SelectItem>
                                <SelectItem value="Desember">
                                    Desember
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="invoice_year"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tahun*</FormLabel>
                        <FormControl>
                            <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
