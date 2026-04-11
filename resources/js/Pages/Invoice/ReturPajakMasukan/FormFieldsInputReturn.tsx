import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
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
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const parseRupiah = (value: string) => {
    return Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

export default function FormFieldsInputReturn({
    form,
    invoices,
    isEditMode,
}: any) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [maxDpp, setMaxDpp] = useState(0);
    const [maxDppLain, setMaxDppLain] = useState(0);
    const [maxPpn, setMaxPpn] = useState(0);

    const { watch, setValue } = form;
    const dpp = watch("dpp");
    const dpp_lain = watch("dpp_lain");
    const ppn_rate = 12;

    useEffect(() => {
        const dppLainValue = Number(dpp_lain) || 0;
        const ppn = Math.round((dppLainValue * ppn_rate) / 100);

        if (ppn > maxPpn) {
            setValue("ppn", maxPpn);
        } else {
            setValue("ppn", ppn);
        }
    }, [dpp, dpp_lain, ppn_rate, maxDppLain, maxPpn, setValue]);

    useEffect(() => {
        if (dpp > maxDppLain) {
            setValue("dpp_lain", maxDppLain);
        } else {
            setValue("dpp_lain", dpp);
        }
    }, [dpp, setValue]);

    useEffect(() => {
        const returDate = form.watch("retur_date");
        if (returDate) {
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
            const month = monthNames[getMonth(returDate)];
            const year = getYear(returDate).toString();
            form.setValue("retur_period", month);
            form.setValue("retur_year", year);
        }
    }, [form.watch("retur_date")]);

    const handleInvoiceSelect = (invoice: any) => {
        setValue("invoice_id", invoice.id);
        setMaxDpp(invoice.dpp);
        setMaxDppLain(invoice.dpp_lain);
        setMaxPpn(invoice.ppn);
        setIsPopoverOpen(false);
    };

    const handleDppChange = (value: string) => {
        const parsedValue = parseRupiah(value);
        if (parsedValue <= maxDpp) {
            setValue("dpp", parsedValue);
        }
    };

    const handleDppLainChange = (value: string) => {
        const parsedValue = parseRupiah(value);
        if (parsedValue <= maxDppLain) {
            setValue("dpp_lain", parsedValue);
        }
    };

    const handlePpnChange = (value: string) => {
        const parsedValue = parseRupiah(value);
        if (parsedValue <= maxPpn) {
            setValue("ppn", parsedValue);
        }
    };

    useEffect(() => {
        if (isEditMode) {
            const selectedInvoice = invoices.find(
                (invoice: any) => invoice.id === form.getValues("invoice_id")
            );
            if (selectedInvoice) {
                setMaxDpp(selectedInvoice.dpp);
                setMaxDppLain(selectedInvoice.dpp_lain);
                setMaxPpn(selectedInvoice.ppn);
            }
            setValue("dpp_lain", dpp_lain);
        }
    }, [isEditMode, form, invoices]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            <FormField
                control={form.control}
                name="invoice_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>No Seri Faktur</FormLabel>
                        <Popover
                            open={isPopoverOpen}
                            onOpenChange={setIsPopoverOpen}
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
                                        disabled={isEditMode}
                                    >
                                        <span className="truncate">
                                            {field.value
                                                ? invoices.find(
                                                      (invoice: any) =>
                                                          invoice.id ===
                                                          field.value
                                                  )?.invoice_number +
                                                  " - " +
                                                  invoices.find(
                                                      (invoice: any) =>
                                                          invoice.id ===
                                                          field.value
                                                  )?.invoice_period +
                                                  " " +
                                                  invoices.find(
                                                      (invoice: any) =>
                                                          invoice.id ===
                                                          field.value
                                                  )?.invoice_year
                                                : "Pilih No Seri Faktur"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            {!isEditMode && (
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Cari No Seri Faktur..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ada item yang tersedia.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {invoices?.length > 0 ? (
                                                    invoices.map(
                                                        (invoice: any) => (
                                                            <CommandItem
                                                                key={
                                                                    invoice.invoice_number
                                                                }
                                                                value={
                                                                    invoice.invoice_number
                                                                }
                                                                onSelect={() => {
                                                                    field.onChange(
                                                                        invoice.id
                                                                    );
                                                                    setIsPopoverOpen(
                                                                        false
                                                                    );
                                                                    handleInvoiceSelect(
                                                                        invoice
                                                                    );
                                                                }}
                                                                className="max-w-md"
                                                            >
                                                                {invoice.invoice_number +
                                                                    " - " +
                                                                    invoice.invoice_period +
                                                                    " " +
                                                                    invoice.invoice_year}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        invoice.id ===
                                                                            field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        )
                                                    )
                                                ) : (
                                                    <CommandItem value="">
                                                        Tidak faktur yang
                                                        tersedia.
                                                    </CommandItem>
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            )}
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="retur_number"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Nomor Retur*</FormLabel>
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
                name="retur_date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tanggal Retur*</FormLabel>
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
                                            <span>Pilih Tanggal Retur</span>
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
                name="retur_period"
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
                name="retur_year"
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
            <FormField
                control={form.control}
                name="dpp"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>DPP (Rp)</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    handleDppChange(e.target.value)
                                }
                                autoComplete="off"
                            />
                        </FormControl>
                        <FormDescription>
                            Maksimal : Rp {maxDpp.toLocaleString()}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="dpp_lain"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>DPP Lain (Rp)</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    handleDppLainChange(e.target.value)
                                }
                                autoComplete="off"
                            />
                        </FormControl>
                        <FormDescription>
                            Maksimal : Rp {maxDppLain.toLocaleString()}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="ppn"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>PPn (Rp)</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    handlePpnChange(e.target.value)
                                }
                                autoComplete="off"
                            />
                        </FormControl>
                        <FormDescription>
                            Maksimal : Rp {maxPpn.toLocaleString()}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="ppnbm"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>PPnBM (Rp)</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
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
        </div>
    );
}
