import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function FormFieldsReferenceDocument({ form, user }: any) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const { watch, setValue } = form;

    const npwp = user?.npwp || "";
    const name = user?.name || "";
    const nitku = watch("nitku");

    useEffect(() => {
        if (npwp && name) {
            const nitku = `${npwp}000000 - ${name}`;
            setValue("nitku", nitku);
        } else {
            setValue("nitku", "");
        }
    }, [npwp, name, nitku, setValue]);

    const types = [
        { value: "Akta Perjanjian", label: "Akta Perjanjian" },
        {
            value: "Akta Rapat Umum Pemegang Saham",
            label: "Akta Rapat Umum Pemegang Saham",
        },
        { value: "Bukti Pembayaran", label: "Bukti Pembayaran" },
        {
            value: "Dokumen Ketentuan Peraturan Perpajakan",
            label: "Dokumen Ketentuan Peraturan Perpajakan",
        },
        { value: "Dokumen Lainnya", label: "Dokumen Lainnya" },
        {
            value: "Dokumen Pemberian Fasilitas Lainnya",
            label: "Dokumen Pemberian Fasilitas Lainnya",
        },
        { value: "Faktur Pajak", label: "Faktur Pajak" },
        { value: "Jasa Giro", label: "Jasa Giro" },
        { value: "Kontrak", label: "Kontrak" },
        { value: "Pengumuman", label: "Pengumuman" },
        { value: "Surat Keputusan", label: "Surat Keputusan" },
        { value: "Surat Pernyataan", label: "Surat Pernyataan" },
        { value: "Surat Tagihan", label: "Surat Tagihan" },
        { value: "Trade Confirmation", label: "Trade Confirmation" },
    ];

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="doc_type"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Jenis Dokumen*
                        </FormLabel>
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
                                            !form.watch("doc_type") &&
                                                "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                    >
                                        <span className="truncate">
                                            {form.watch("doc_type")
                                                ? types.find(
                                                      (type) =>
                                                          type.value ===
                                                          form.watch("doc_type")
                                                  )?.label
                                                : "Pilih Jenis Dokumen"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Jenis Dokumen..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada jenis dokumen yang
                                            tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {types.map((type) => (
                                                <CommandItem
                                                    key={type.value}
                                                    onSelect={() => {
                                                        form.setValue(
                                                            "doc_type",
                                                            type.value
                                                        );
                                                        setIsPopoverOpen(false);
                                                    }}
                                                >
                                                    {type.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="doc_no"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Nomor Dokumen*
                        </FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="doc_date"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Tanggal Dokumen*
                        </FormLabel>
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
                name="nitku"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            NITKU / Nomor Identitas Sub Unit Organisasi*
                        </FormLabel>
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
