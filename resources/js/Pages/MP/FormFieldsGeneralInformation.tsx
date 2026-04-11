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
import InputMask from "react-input-mask";

export default function FormFieldsGeneralInformation({
    form,
    bupots,
    ter,
    isEditMode,
}: any) {
    const [isPopoverPeriodOpen, setIsPopoverPeriodOpen] = useState(false);
    const [isPopoverYearOpen, setIsPopoverYearOpen] = useState(false);
    const [isPopoverForeignOpen, setIsPopoverForeignOpen] = useState(false);
    const [isPopoverPTKPOpen, setIsPopoverPTKPOpen] = useState(false);

    const { watch, setValue } = form;

    const isForeign = watch("is_foreign");
    const bupot_period = watch("bupot_period");
    const bupot_year = watch("bupot_year");
    const customer_id = watch("customer_id");
    const customer_passport = watch("customer_passport");

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

    useEffect(() => {
        if (isEditMode) {
            const country = watch("customer_country");
            if (country === "Indonesia") {
                setValue("is_foreign", "false");
            } else {
                setValue("is_foreign", "true");
            }
        } else {
            if (isForeign === "false") {
                setValue("customer_country", "Indonesia");
            } else {
                setValue("customer_country", "");
            }
        }
    }, [isEditMode, isForeign, setValue, watch]);

    useEffect(() => {
        const kategoriA = ["TK/0", "TK/1", "K/0"];
        const kategoriB = ["TK/2", "TK/3", "K/1", "K/2"];
        const kategoriC = ["K/3"];

        const ptkp = watch("customer_ptkp");
        const dpp = Number(watch("dpp"));

        if (!dpp || dpp <= 0) {
            setValue("rates", 0);
            return;
        }

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
    }, [watch("customer_ptkp"), watch("dpp"), ter, setValue]);

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

    const foreigns = [
        { value: "false", label: "Tidak" },
        { value: "true", label: "Ya" },
    ];

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
            <FormField
                control={form.control}
                name="is_foreign"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Pegawai Asing*
                        </FormLabel>
                        <Popover
                            open={isPopoverForeignOpen}
                            onOpenChange={setIsPopoverForeignOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !form.watch("is_foreign") &&
                                                "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                        disabled={isEditMode}
                                    >
                                        <span className="truncate">
                                            {form.watch("is_foreign")
                                                ? foreigns.find(
                                                      (foreign) =>
                                                          foreign.value ===
                                                          form.watch(
                                                              "is_foreign"
                                                          )
                                                  )?.label
                                                : "Apakah Anda Pegawai Asing?"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Apakah Anda Pegawai Asing?"
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada opsi yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {foreigns.map((foreign) => (
                                                <CommandItem
                                                    key={foreign.value}
                                                    onSelect={() => {
                                                        form.setValue(
                                                            "is_foreign",
                                                            foreign.value
                                                        );
                                                        setIsPopoverForeignOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    {foreign.label}
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
                name="customer_id"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">NPWP*</FormLabel>
                        <FormControl>
                            {isEditMode ? (
                                <Input {...field} disabled />
                            ) : (
                                <InputMask
                                    mask="9999999999999999"
                                    value={field.value}
                                    onChange={field.onChange}
                                    autoComplete="off"
                                >
                                    {(inputProps) => <Input {...inputProps} />}
                                </InputMask>
                            )}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Nama*</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={isEditMode} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="customer_address"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Alamat*</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={isEditMode} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {(isForeign === "true" || customer_passport) && (
                <FormField
                    control={form.control}
                    name="customer_passport"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                            <FormLabel className="md:w-1/4">
                                Nomor Paspor*
                            </FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isEditMode} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            <FormField
                control={form.control}
                name="customer_country"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Negara*</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={isEditMode} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
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
                                        disabled={isEditMode}
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
                name="customer_position"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Posisi*</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={isEditMode} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
