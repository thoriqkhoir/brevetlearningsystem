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
import { useEffect, useState } from "react";

export default function FormFieldsGeneralInformation({
    form,
    bupots,
    isEditMode,
}: any) {
    const [isPopoverPeriodOpen, setIsPopoverPeriodOpen] = useState(false);
    const [isPopoverYearOpen, setIsPopoverYearOpen] = useState(false);

    const { watch, setValue } = form;

    const bupot_period = watch("bupot_period");
    const bupot_year = watch("bupot_year");
    const customer_id = watch("customer_id");

    useEffect(() => {
        if (!bupot_period || !bupot_year || !customer_id) {
            setValue("bupot_status", "normal");
            return;
        }

        if (bupots) {
            const bupot = bupots.find(
                (bupot: any) =>
                    bupot.bupot_period === bupot_period &&
                    bupot.bupot_year === bupot_year &&
                    bupot.customer_id === customer_id
            );

            if (!bupot) {
                setValue("bupot_status", "normal");
            } else {
                setValue("bupot_status", "perbaikan");
            }
        }
    }, [bupots, bupot_period, bupot_year, customer_id, setValue]);

    const months = [
        { value: "Januari", label: "Januari" },
        { value: "Februari", label: "Februari" },
        { value: "Maret", label: "Maret" },
        { value: "April", label: "April" },
        { value: "Mei", label: "Mei" },
        { value: "Juni", label: "Juni" },
        { value: "Juli", label: "Juli" },
        { value: "Agustus", label: "Agustus" },
        { value: "September", label: "September" },
        { value: "Oktober", label: "Oktober" },
        { value: "November", label: "November" },
        { value: "Desember", label: "Desember" },
    ];

    const currentYear = new Date().getFullYear() - 8;
    const years = Array.from({ length: 10 }, (_, i) =>
        (currentYear + i).toString()
    );

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="bupot_period"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Masa Pajak*</FormLabel>
                        <Popover
                            open={isPopoverPeriodOpen}
                            onOpenChange={setIsPopoverPeriodOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !form.watch("bupot_period") &&
                                                "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                        disabled={isEditMode}
                                    >
                                        <span className="truncate">
                                            {form.watch("bupot_period")
                                                ? months.find(
                                                      (month) =>
                                                          month.value ===
                                                          form.watch(
                                                              "bupot_period"
                                                          )
                                                  )?.label
                                                : "Pilih Masa Pajak"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Masa Pajak..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada item yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {months.map((month) => (
                                                <CommandItem
                                                    key={month.value}
                                                    onSelect={() => {
                                                        form.setValue(
                                                            "bupot_period",
                                                            month.value
                                                        );
                                                        setIsPopoverPeriodOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    {month.label}
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
                name="bupot_year"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Tahun*</FormLabel>
                        <Popover
                            open={isPopoverYearOpen}
                            onOpenChange={setIsPopoverYearOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !form.watch("bupot_year") &&
                                                "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                        disabled={isEditMode}
                                    >
                                        <span className="truncate">
                                            {form.watch("bupot_year")
                                                ? form.watch("bupot_year")
                                                : "Pilih Tahun Pajak"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Tahun Pajak..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada tahun yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {years.map((year) => (
                                                <CommandItem
                                                    key={year}
                                                    onSelect={() => {
                                                        form.setValue(
                                                            "bupot_year",
                                                            year
                                                        );
                                                        setIsPopoverYearOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    {year}
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
                name="bupot_status"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Status*</FormLabel>
                        <FormControl>
                            <Input {...field} disabled className="capitalize" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
