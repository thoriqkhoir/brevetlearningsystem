import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { Button } from "@/Components/ui/button";
import { CalendarIcon } from "lucide-react";
import { addYears, format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { BankFormValues } from "./schema";

export default function FormFieldsBank({
    form,
}: {
    form: UseFormReturn<BankFormValues>;
}) {
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    const minDate = new Date("1900-01-01");
    const maxDate = addYears(new Date(), 20);

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
                        <FormLabel className="md:w-1/4 pt-2 md:pt-0">
                            Nama Bank*
                        </FormLabel>
                        <div className="flex-1 space-y-1">
                            <FormControl>
                                <Input {...field} placeholder="Nama bank" />
                            </FormControl>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
                        <FormLabel className="md:w-1/4 pt-2 md:pt-0">
                            Nomor Rekening*
                        </FormLabel>
                        <div className="flex-1 space-y-1">
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Nomor rekening"
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="account_name"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
                        <FormLabel className="md:w-1/4 pt-2 md:pt-0">
                            Nama Pemilik Rekening*
                        </FormLabel>
                        <div className="flex-1 space-y-1">
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Nama pemilik rekening"
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="account_type"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
                        <FormLabel className="md:w-1/4 pt-2 md:pt-0">
                            Jenis Rekening*
                        </FormLabel>
                        <div className="flex-1 space-y-1">
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis rekening" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="tabungan">
                                        Tabungan
                                    </SelectItem>
                                    <SelectItem value="giro">Giro</SelectItem>
                                    <SelectItem value="deposito">
                                        Deposito
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="is_primary"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
                        <FormLabel className="md:w-1/4 pt-2 md:pt-0">
                            Rekening Utama
                        </FormLabel>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Checkbox
                                        id="is_primary"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <label
                                    htmlFor="is_primary"
                                    className="text-sm text-muted-foreground cursor-pointer"
                                >
                                    Jadikan sebagai rekening utama
                                </label>
                            </div>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
                        <FormLabel className="md:w-1/4 md:pt-2">
                            Keterangan
                        </FormLabel>
                        <div className="flex-1 space-y-1">
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value || ""}
                                    placeholder="Keterangan (opsional)"
                                    className="resize-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
                        <FormLabel className="md:w-1/4 pt-2 md:pt-0">
                            Tanggal Mulai
                        </FormLabel>
                        <div className="flex-1 space-y-1">
                            <Popover
                                open={startOpen}
                                onOpenChange={setStartOpen}
                            >
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value &&
                                                    "text-muted-foreground",
                                            )}
                                            onClick={() => setStartOpen(true)}
                                        >
                                            {field.value ? (
                                                format(
                                                    new Date(field.value),
                                                    "yyyy-MM-dd",
                                                )
                                            ) : (
                                                <span>Pilih tanggal mulai</span>
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
                                        selected={
                                            field.value
                                                ? new Date(field.value)
                                                : undefined
                                        }
                                        fromYear={minDate.getFullYear()}
                                        toYear={maxDate.getFullYear()}
                                        onSelect={(date) => {
                                            field.onChange(
                                                date
                                                    ? format(date, "yyyy-MM-dd")
                                                    : "",
                                            );
                                            setStartOpen(false);
                                        }}
                                        fromDate={minDate}
                                        toDate={maxDate}
                                        disabled={(date) =>
                                            date > maxDate || date < minDate
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
                        <FormLabel className="md:w-1/4 pt-2 md:pt-0">
                            Tanggal Berakhir
                        </FormLabel>
                        <div className="flex-1 space-y-1">
                            <Popover open={endOpen} onOpenChange={setEndOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value &&
                                                    "text-muted-foreground",
                                            )}
                                            onClick={() => setEndOpen(true)}
                                        >
                                            {field.value ? (
                                                format(
                                                    new Date(field.value),
                                                    "yyyy-MM-dd",
                                                )
                                            ) : (
                                                <span>
                                                    Pilih tanggal berakhir
                                                </span>
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
                                        selected={
                                            field.value
                                                ? new Date(field.value)
                                                : undefined
                                        }
                                        fromYear={minDate.getFullYear()}
                                        toYear={maxDate.getFullYear()}
                                        onSelect={(date) => {
                                            field.onChange(
                                                date
                                                    ? format(date, "yyyy-MM-dd")
                                                    : "",
                                            );
                                            setEndOpen(false);
                                        }}
                                        fromDate={minDate}
                                        toDate={maxDate}
                                        disabled={(date) =>
                                            date > maxDate || date < minDate
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
        </div>
    );
}
