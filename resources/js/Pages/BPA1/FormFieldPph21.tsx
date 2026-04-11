import { Button } from "@/Components/ui/button";
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
import { ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/Components/ui/checkbox";
import { useEffect, useState } from "react";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const parseRupiah = (value: string) => {
    return Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

export default function FormFieldPph21({ form, objects, user }: any) {
    const { watch, setValue } = form;
    const [isPopoverFacilityOpen, setIsPopoverFacilityOpen] = useState(false);

    const facilityOptions = [
        { value: "tanpa fasilitas", label: "Tanpa Fasilitas" },
        { value: "ditanggung pemerintah", label: "Ditanggung Pemerintah" },
        { value: "fasilitas lain", label: "Fasilitas Lain" },
    ];

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="neto"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Jumlah Penghasilan Neto*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="total_neto"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Jumlah Penghasilan Neto untuk Perhitungan PPh Pasal 21 (Setahun/Disetahunkan))*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="non_taxable_income"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Penghasilan Tidak Kena Pajak*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {/* <FormField
                control={form.control}
                name="before_neto"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Penghasilan Neto dari Pemotongan Sebelumnya*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            /> */}
            
            
            <FormField
                control={form.control}
                name="taxable_income"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Penghasilan Kena Pajak Setahun/Disetahunkan
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled
                                

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="pph_taxable_income"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 Atas Penghasilan Kena Pajak Setahun/Disetahunkan*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="pph_owed"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 Terutang
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="pph_deducted"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 Dipotong dari Bukti Pemotongan Sebelumnya*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="pph_deducted_withholding"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 Terutang pada Bukti Pemotongan Ini (Dapat Dikreditkan pada SPT Tahunan)*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="pph_government"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 yang Dipotong/Ditanggung Pemerintah*
                        </FormLabel>
                        <FormControl>
                            <Input
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
            <FormField
                control={form.control}
                name="pph_desember"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            PPh Pasal 21 Kurang (Lebih) Dipotong pada Masa Pajak Desember/Masa Pajak Terakhir*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                autoComplete="off"
                                disabled

                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="facility"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Jenis Fasilitas pada Masa Pajak Desember/Masa Pajak Terakhir*
                        </FormLabel>
                        <Popover
                            open={isPopoverFacilityOpen}
                            onOpenChange={setIsPopoverFacilityOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !field.value && "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                    >
                                        <span className="truncate">
                                            {form.watch("facility") && form.watch("facility") !== ""
                                                ? facilityOptions.find(
                                                    (option) =>
                                                        option.value === form.watch("facility")
                                                )?.label
                                                : "Pilih Opsi"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Jenis Fasilitas..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada jenis fasilitas yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {facilityOptions.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => {
                                                        field.onChange(option.value);
                                                        setIsPopoverFacilityOpen(false);
                                                    }}
                                                >
                                                    {option.label}
                                                </CommandItem>
                                            ))}
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
                name="kap"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            KAP-KJS*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                disabled
                                autoComplete="off"
                            />
                        </FormControl>
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
                            NITKU/Nomor Identitas Sub Unit Organisasi*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                autoComplete="off"
                                disabled
                                className="bg-muted cursor-not-allowed"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
