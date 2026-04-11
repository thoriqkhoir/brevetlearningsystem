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
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const parseRupiah = (value: string) => {
    return Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

export default function FormFieldsIncomeTax({ form, objects }: any) {
    const [isPopoverFasilityOpen, setIsPopoverFasilityOpen] = useState(false);
    const [isPopoverObjectOpen, setIsPopoverObjectOpen] = useState(false);

    const { watch, setValue } = form;

    const objectId = watch("object_id");
    const dpp = watch("dpp");
    const rates = watch("rates");

    useEffect(() => {
        if (objectId) {
            const selectedObject = objects.find(
                (object: any) => object.id === parseInt(objectId, 10)
            );

            if (selectedObject) {
                setValue("tax_type", selectedObject.tax_type || "");
                setValue("tax_code", selectedObject.tax_code || "");
                setValue("tax_nature", selectedObject.tax_nature || "");
                setValue("rates", Number(selectedObject.tax_rates) || 0);
                setValue("kap", selectedObject.kap || "");
            }
        }
    }, [objectId, objects, setValue]);

    useEffect(() => {
        const dppValue = Number(dpp) || 0;
        const ratesValue = Number(rates) || 0;

        const tax = Math.round((dppValue * ratesValue) / 100);

        setValue("tax", tax);
    }, [dpp, rates, setValue]);

    const fasilitas = [
        { value: "fasilitas lainnya", label: "Fasilitas Lainnya" },
        {
            value: "pph ditanggung pemerintah",
            label: "PPh Ditanggung Pemerintah (DTP)",
        },
        { value: "tanpa fasilitas", label: "Tanpa Fasilitas" },
    ];

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="facility"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Fasilitas Pajak yang Dimiliki oleh Penerima
                            Penghasilan*
                        </FormLabel>
                        <Popover
                            open={isPopoverFasilityOpen}
                            onOpenChange={setIsPopoverFasilityOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !form.watch("facility") &&
                                                "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                    >
                                        <span className="truncate">
                                            {form.watch("facility")
                                                ? fasilitas.find(
                                                      (taxFacility) =>
                                                          taxFacility.value ===
                                                          form.watch("facility")
                                                  )?.label
                                                : "Pilih Fasilitas Pajak"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Fasilitas Pajak..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada fasilitas yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {fasilitas.map((fasilitasPajak) => (
                                                <CommandItem
                                                    key={fasilitasPajak.value}
                                                    onSelect={() => {
                                                        form.setValue(
                                                            "facility",
                                                            fasilitasPajak.value
                                                        );
                                                        setIsPopoverFasilityOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    {fasilitasPajak.label}
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
                name="object_id"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Nama Objek Pajak*
                        </FormLabel>
                        <Popover
                            open={isPopoverObjectOpen}
                            onOpenChange={setIsPopoverObjectOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between truncate",
                                            !field.value &&
                                                "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                    >
                                        <span className="truncate">
                                            {field.value
                                                ? objects.find(
                                                      (object: any) =>
                                                          object.id ===
                                                          parseInt(
                                                              field.value,
                                                              10
                                                          )
                                                  )?.tax_name
                                                : "Pilih Objek Pajak"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Objek Pajak..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada transaksi yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup className="max-w-[860px]">
                                            {objects?.length > 0 ? (
                                                objects.map((object: any) => (
                                                    <CommandItem
                                                        key={object.id}
                                                        value={object.id}
                                                        onSelect={() => {
                                                            field.onChange(
                                                                object.id
                                                            );
                                                            form.setValue(
                                                                "tax_type",
                                                                object.tax_type ||
                                                                    ""
                                                            );
                                                            form.setValue(
                                                                "tax_code",
                                                                object.tax_code ||
                                                                    ""
                                                            );
                                                            form.setValue(
                                                                "tax_nature",
                                                                object.tax_nature ||
                                                                    ""
                                                            );
                                                            form.setValue(
                                                                "rates",
                                                                Number(
                                                                    object.tax_rates
                                                                ) || ""
                                                            );
                                                            form.setValue(
                                                                "kap",
                                                                object.kap || ""
                                                            );

                                                            setIsPopoverObjectOpen(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        {object.tax_name}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                object.id ===
                                                                    parseInt(
                                                                        field.value,
                                                                        10
                                                                    )
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))
                                            ) : (
                                                <CommandItem value="">
                                                    Tidak ada objek pajak yang
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
                name="tax_type"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Jenis Pajak*</FormLabel>
                        <FormControl>
                            <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="tax_code"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Kode Objek Pajak*
                        </FormLabel>
                        <FormControl>
                            <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="tax_nature"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Sifat Pajak Penghasilan*
                        </FormLabel>
                        <FormControl>
                            <Input {...field} disabled className="capitalize" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="dpp"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Dasar Pengenaan Pajak (Rp)*
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
                name="rates"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Tarif (%)*</FormLabel>
                        <FormControl>
                            <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Pajak Penghasilan*
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={rupiahFormatter.format(field.value || 0)}
                                onChange={(e) =>
                                    field.onChange(parseRupiah(e.target.value))
                                }
                                disabled
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="kap"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">KAP*</FormLabel>
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
