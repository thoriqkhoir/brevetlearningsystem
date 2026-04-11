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

const calculatePS17Tax = (pkp: number) => {
    let tax = 0;

    if (pkp <= 60000000) {
        tax = pkp * 0.05;
    } else if (pkp <= 250000000) {
        tax = 60000000 * 0.05 + (pkp - 60000000) * 0.15;
    } else if (pkp <= 500000000) {
        tax =
            60000000 * 0.05 +
            (250000000 - 60000000) * 0.15 +
            (pkp - 250000000) * 0.25;
    } else if (pkp <= 5000000000) {
        tax =
            60000000 * 0.05 +
            (250000000 - 60000000) * 0.15 +
            (500000000 - 250000000) * 0.25 +
            (pkp - 500000000) * 0.3;
    } else {
        tax =
            60000000 * 0.05 +
            (250000000 - 60000000) * 0.15 +
            (500000000 - 250000000) * 0.25 +
            (5000000000 - 500000000) * 0.3 +
            (pkp - 5000000000) * 0.35;
    }

    return Math.round(tax);
};

const calculateHarianTax = (dpp: number) => {
    if (dpp <= 450000) {
        return 0;
    } else if (dpp <= 2500000) {
        return dpp * 0.005;
    } else {
        const pkp = dpp / 2;
        const calculatedTax = calculatePS17Tax(pkp);
        return Math.round(calculatedTax);
    }
};

const calculatePesangonTax = (dpp: number) => {
    let tax = 0;

    if (dpp <= 50000000) {
        tax = 0;
    } else if (dpp <= 100000000) {
        tax = (dpp - 50000000) * 0.05;
    } else if (dpp <= 500000000) {
        tax = (100000000 - 50000000) * 0.05 + (dpp - 100000000) * 0.15;
    } else {
        tax =
            (100000000 - 50000000) * 0.05 +
            (500000000 - 100000000) * 0.15 +
            (dpp - 500000000) * 0.25;
    }

    return Math.round(tax);
};

const calculatePensiunTax = (dpp: number) => {
    if (dpp <= 50000000) {
        return 0;
    } else {
        return Math.round(dpp * 0.05);
    }
};

const getDisplayRates = (rates: number, objectId: number, objects: any[]) => {
    if (!objectId) return rates.toString();

    const selectedObject = objects.find((obj: any) => obj.id === objectId);
    if (!selectedObject) return rates.toString();

    const taxRates = selectedObject.tax_rates;

    if (taxRates === "PS17") return "PS17";
    if (taxRates === "PS175") return "PS17";
    if (taxRates === "HARIAN") return "HARIAN";
    if (taxRates === "PESANGON") return "PESANGON";
    if (taxRates === "PENSIUN") return "PENSIUN";
    if (taxRates === "TER") return "TER";

    return rates.toString();
};

export default function FormFieldsIncomeTax({ form, objects, ter }: any) {
    const [isPopoverPTKPOpen, setIsPopoverPTKPOpen] = useState(false);
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
                setValue("kap", selectedObject.kap || "");
            }
        }
    }, [objectId, objects, setValue]);

    useEffect(() => {
        const kategoriA = ["TK/0", "TK/1", "K/0"];
        const kategoriB = ["TK/2", "TK/3", "K/1", "K/2"];
        const kategoriC = ["K/3"];

        const ptkp = watch("customer_ptkp");
        const objectId = Number(watch("object_id"));
        const dpp = Number(watch("dpp"));

        if (!dpp || dpp <= 0) {
            setValue("tax", 0);
            setValue("rates", 0);
            return;
        }

        if (objectId) {
            const selectedObject = objects.find(
                (object: any) => object.id === objectId
            );

            if (selectedObject) {
                const taxRates = selectedObject.tax_rates;

                if (taxRates === "TER") {
                    if (!ptkp || !ter) {
                        setValue("rates", 0);
                        return;
                    }

                    let kategori = null;
                    if (kategoriA.includes(ptkp)) kategori = "A";
                    else if (kategoriB.includes(ptkp)) kategori = "B";
                    else if (kategoriC.includes(ptkp)) kategori = "C";

                    if (kategori && dpp > 0) {
                        const found = ter.find(
                            (item: any) =>
                                item.category === kategori &&
                                dpp > item.start &&
                                dpp <= item.end
                        );
                        if (found) {
                            setValue("rates", found.rates);
                        } else {
                            setValue("rates", 0);
                        }
                    } else {
                        setValue("rates", 0);
                    }
                } else if (taxRates === "PS17") {
                    const calculatedTax = calculatePS17Tax(dpp);
                    setValue("tax", calculatedTax);
                    setValue("rates", 0);
                } else if (taxRates === "PS175") {
                    const pkp = dpp / 2;
                    const calculatedTax = calculatePS17Tax(pkp);
                    setValue("tax", calculatedTax);
                    setValue("rates", 0);
                } else if (taxRates === "HARIAN") {
                    const calculatedTax = calculateHarianTax(dpp);
                    setValue("tax", calculatedTax);
                    setValue("rates", 0);
                } else if (taxRates === "PESANGON") {
                    const calculatedTax = calculatePesangonTax(dpp);
                    setValue("tax", calculatedTax);
                    setValue("rates", 0);
                } else if (taxRates === "PENSIUN") {
                    const calculatedTax = calculatePensiunTax(dpp);
                    setValue("tax", calculatedTax);
                    setValue("rates", 0);
                } else {
                    const numericRate = Number(taxRates);
                    setValue("rates", isNaN(numericRate) ? 0 : numericRate);
                }
            }
        } else {
            setValue("rates", 0);
        }
    }, [
        watch("customer_ptkp"),
        watch("object_id"),
        watch("dpp"),
        ter,
        setValue,
        objects,
    ]);

    useEffect(() => {
        const dppValue = Number(dpp) || 0;
        const ratesValue = Number(rates) || 0;
        const objectId = Number(watch("object_id"));

        if (objectId) {
            const selectedObject = objects.find(
                (object: any) => object.id === objectId
            );

            if (
                selectedObject?.tax_rates &&
                ["PS17", "PS175", "HARIAN", "PESANGON", "PENSIUN"].includes(
                    selectedObject.tax_rates
                )
            ) {
                return;
            }
        }

        if (ratesValue > 0) {
            const tax = Math.round((dppValue * ratesValue) / 100);
            setValue("tax", tax);
        }
    }, [dpp, rates, setValue, watch, objects]);

    const ptkps = [
        { value: "TK/0", label: "TK/0" },
        { value: "TK/1", label: "TK/1" },
        { value: "TK/2", label: "TK/2" },
        { value: "TK/3", label: "TK/3" },
        { value: "K/0", label: "K/0" },
        { value: "K/1", label: "K/1" },
        { value: "K/2", label: "K/2" },
        { value: "K/3", label: "K/3" },
    ];

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
                name="customer_ptkp"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Status PTKP*</FormLabel>
                        <Popover
                            open={isPopoverPTKPOpen}
                            onOpenChange={setIsPopoverPTKPOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !form.watch("customer_ptkp") &&
                                                "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                    >
                                        <span className="truncate">
                                            {form.watch("customer_ptkp")
                                                ? ptkps.find(
                                                      (ptkp) =>
                                                          ptkp.value ===
                                                          form.watch(
                                                              "customer_ptkp"
                                                          )
                                                  )?.label
                                                : "Pilih Status PTKP"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Status PTKP..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada PTKP yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {ptkps.map((ptkp) => (
                                                <CommandItem
                                                    key={ptkp.value}
                                                    onSelect={() => {
                                                        form.setValue(
                                                            "customer_ptkp",
                                                            ptkp.value
                                                        );
                                                        setIsPopoverPTKPOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    {ptkp.label}
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
                            <Input
                                value={getDisplayRates(
                                    field.value,
                                    watch("object_id"),
                                    objects
                                )}
                                disabled
                            />
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
