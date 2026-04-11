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
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, getMonth, getYear } from "date-fns";
import { Button } from "@/Components/ui/button";
import { useEffect, useState } from "react";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";

export default function FormFieldsTransactionDocument({ form }: any) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isTypePopoverOpen, setIsTypePopoverOpen] = useState(false);
    const [isDetailPopoverOpen, setIsDetailPopoverOpen] = useState(false);
    const [isDocPopoverOpen, setIsDocPopoverOpen] = useState(false);

    useEffect(() => {
        const invoiceDate = form.watch("other_date");
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
            form.setValue("other_period", month);
            form.setValue("other_year", year);
        }
    }, [form.watch("other_date")]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
            <FormField
                control={form.control}
                name="transaction_type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Jenis Transaksi</FormLabel>
                        <Select
                            onValueChange={() => field.onChange("Ekspor")}
                            value={field.value}
                            disabled
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Ekspor">Ekspor</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="correction_number"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Jenis Dokumen</FormLabel>
                        <Select
                            onValueChange={(value) =>
                                field.onChange(parseInt(value, 10))
                            }
                            value={field.value?.toString()}
                            disabled
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="0">Normal</SelectItem>
                                <SelectItem value="1">Pembetulan</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="transaction_detail"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Detail Transaksi*</FormLabel>
                        <Popover
                            open={isDetailPopoverOpen}
                            onOpenChange={setIsDetailPopoverOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !field.value &&
                                                "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                    >
                                        <span className="truncate">
                                            {field.value ||
                                                "Pilih Detail Transaksi"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandList>
                                        <CommandGroup>
                                            <CommandItem
                                                value="01 - Ekspor BKP Berwujud"
                                                onSelect={() => {
                                                    field.onChange(
                                                        "01 - Ekspor BKP Berwujud"
                                                    );
                                                    setIsDetailPopoverOpen(
                                                        false
                                                    );
                                                }}
                                            >
                                                01 - Ekspor BKP Berwujud
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        field.value ===
                                                            "01 - Ekspor BKP Berwujud"
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                            <CommandItem
                                                value="02 - Ekspor BKP Tidak Berwujud"
                                                onSelect={() => {
                                                    field.onChange(
                                                        "02 - Ekspor BKP Tidak Berwujud"
                                                    );
                                                    setIsDetailPopoverOpen(
                                                        false
                                                    );
                                                }}
                                            >
                                                02 - Ekspor BKP Tidak Berwujud
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        field.value ===
                                                            "02 - Ekspor BKP Tidak Berwujud"
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                            <CommandItem
                                                value="03 - Ekspor JKP"
                                                onSelect={() => {
                                                    field.onChange(
                                                        "03 - Ekspor JKP"
                                                    );
                                                    setIsDetailPopoverOpen(
                                                        false
                                                    );
                                                }}
                                            >
                                                03 - Ekspor JKP
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        field.value ===
                                                            "03 - Ekspor JKP"
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="transaction_doc"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dokumen Transaksi*</FormLabel>
                        <Popover
                            open={isDocPopoverOpen}
                            onOpenChange={setIsDocPopoverOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !field.value &&
                                                "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                    >
                                        <span className="truncate">
                                            {field.value ||
                                                "Pilih Dokumen Transaksi"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandList>
                                        <CommandGroup>
                                            <CommandItem
                                                value="01 - Dokumen Ekspor (PEB)"
                                                onSelect={() => {
                                                    field.onChange(
                                                        "01 - Dokumen Ekspor (PEB)"
                                                    );
                                                    setIsDocPopoverOpen(false);
                                                }}
                                            >
                                                01 - Dokumen Ekspor (PEB)
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        field.value ===
                                                            "01 - Dokumen Ekspor (PEB)"
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="other_no"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nomor Dokumen*</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="other_date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tanggal Dokumen*</FormLabel>
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
                                            <span>Pilih Tanggal Dokumen</span>
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
                name="other_period"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Masa Pajak</FormLabel>
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
                name="other_year"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tahun</FormLabel>
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
