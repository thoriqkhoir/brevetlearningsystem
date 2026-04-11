import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
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

export default function FormFieldsTransactionDocument({
    transactions,
    form,
    invoiceCount,
}: any) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [paymentType, setPaymentType] = useState("lunas");

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
        const uangMuka = form.watch("payment_type") === "uang muka";
        const pelunasan = form.watch("payment_type") === "pelunasan";

        if (uangMuka) {
            setPaymentType("uang muka");
        } else if (pelunasan) {
            setPaymentType("pelunasan");
        } else {
            setPaymentType("lunas");
        }
    }, []);

    useEffect(() => {
        form.setValue("payment_type", paymentType);
    }, [paymentType]);

    useEffect(() => {
        const transactionId = form.watch("transaction_id");
        const invoiceYear = form.watch("invoice_year");
        const correctionCode = form.watch("correction_number");
        if (transactionId && invoiceYear) {
            const transaction = transactions.find(
                (t: any) => t.id === transactionId
            );
            if (transaction) {
                const transactionCode = transaction.code;
                const yearCode = invoiceYear.slice(-2);
                const invoiceNumber = generateInvoiceNumber(
                    transactionCode,
                    yearCode,
                    invoiceCount,
                    correctionCode
                );
                form.setValue("invoice_number", invoiceNumber);
            }
        }
    }, [
        form.watch("transaction_id"),
        form.watch("invoice_year"),
        form.watch("correction_number"),
    ]);

    useEffect(() => {
        const correctionNumber = form.watch("correction_number");
        if (correctionNumber >= 1) {
            form.setValue("correction_number", correctionNumber);
        } else {
            form.setValue("correction_number", 0);
        }
    }, [form.watch("correction_number")]);

    const generateInvoiceNumber = (
        transactionCode: string,
        yearCode: string,
        count: number,
        correctionCode: number
    ) => {
        const countString = (count + 1).toString().padStart(8, "0");
        const correctionCodeString = correctionCode.toString().padStart(2, "0");
        return `${transactionCode}.${correctionCodeString}.${yearCode}.000-${countString}`;
    };

    useEffect(() => {
        const transactionId = form.watch("transaction_id");
        if (transactionId) {
            const transaction = transactions.find(
                (t: any) => t.id === transactionId
            );
            if (transaction) {
                form.setValue("transaction_code", transaction.code);
            }
        }
    }, [form.watch("transaction_id")]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            <FormField
                control={form.control}
                name="down_payment"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Uang Muka</FormLabel>
                            <FormControl>
                                <Checkbox
                                    checked={paymentType === "uang muka"}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setPaymentType("uang muka");
                                        } else {
                                            setPaymentType("lunas");
                                        }
                                    }}
                                    className="block"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={form.control}
                name="rest_of_payment"
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Pelunasan</FormLabel>
                            <FormControl>
                                <Checkbox
                                    checked={paymentType === "pelunasan"}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setPaymentType("pelunasan");
                                        } else {
                                            setPaymentType("lunas");
                                        }
                                    }}
                                    className="block"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            <FormField
                control={form.control}
                name="invoice_number"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nomor Faktur</FormLabel>
                        <FormControl>
                            <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="transaction_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Kode Transaksi*</FormLabel>
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
                                    >
                                        <span className="truncate">
                                            {field.value
                                                ? transactions.find(
                                                      (transaction: any) =>
                                                          transaction.id ===
                                                          parseInt(
                                                              field.value,
                                                              10
                                                          )
                                                  )?.code +
                                                  " - " +
                                                  transactions.find(
                                                      (transaction: any) =>
                                                          transaction.id ===
                                                          parseInt(
                                                              field.value,
                                                              10
                                                          )
                                                  )?.name
                                                : "Pilih Kode Transaksi"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Kode Transaksi..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada transaksi yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {transactions?.length > 0 ? (
                                                transactions.map(
                                                    (transaction: any) => (
                                                        <CommandItem
                                                            key={transaction.id}
                                                            value={
                                                                transaction.id
                                                            }
                                                            onSelect={() => {
                                                                field.onChange(
                                                                    transaction.id
                                                                );
                                                                setIsPopoverOpen(
                                                                    false
                                                                );
                                                            }}
                                                        >
                                                            {transaction.code +
                                                                " - " +
                                                                transaction.name}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    transaction.id ===
                                                                        parseInt(
                                                                            field.value,
                                                                            10
                                                                        )
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    )
                                                )
                                            ) : (
                                                <CommandItem value="">
                                                    Tidak ada transaksi yang
                                                    tersedia.
                                                </CommandItem>
                                            )}
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
                name="correction_number"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipe Faktur</FormLabel>
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
                                <SelectItem value="0">Faktur Normal</SelectItem>
                                {[...Array(99)].map((_, index) => (
                                    <SelectItem
                                        key={index + 1}
                                        value={(index + 1).toString()}
                                    >
                                        Faktur Pembetulan
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="invoice_period"
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
                name="invoice_year"
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
            <FormField
                control={form.control}
                name="invoice_reference"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Referensi Faktur</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="user_address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="transaction_code"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Kode Bisnis</FormLabel>
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
