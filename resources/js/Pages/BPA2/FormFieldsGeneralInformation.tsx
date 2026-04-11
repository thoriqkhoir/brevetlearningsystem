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
import { ChevronsUpDown, Check } from "lucide-react";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";

export default function FormFieldsGeneralInformation({
    form,
    bupots,
    objects,
    isEditMode,
}: any) {
    const [isPopoverIsMoreOpen, setIsPopoverIsMoreOpen] = useState(false);
    const [isPopoverStartPeriodOpen, setIsPopoverStartPeriodOpen] = useState(false);
    const [isPopoverEndPeriodOpen, setIsPopoverEndPeriodOpen] = useState(false);
    const [isPopoverPtkpOpen, setIsPopoverPtkpOpen] = useState(false);
    const [isPopoverBupotTypesOpen, setIsPopoverBupotTypesOpen] = useState(false);
    const [isPopoverObjectIdOpen, setIsPopoverObjectIdOpen] = useState(false);

    const { watch, setValue } = form;

    const start_period = watch("start_period");
    const end_period = watch("end_period");
    const customer_id = watch("customer_id");
    const objectId = watch("object_id");
    
    useEffect(() => {
        if (!start_period || !end_period || !customer_id) {
            setValue("bupot_status", "normal");
            return;
        }

        if (bupots) {
            const bupot = bupots.find(
                (bupot: any) =>
                    bupot.start_period === start_period &&
                    bupot.end_period === end_period &&
                    bupot.customer_id === customer_id
            );

            if (!bupot) {
                setValue("bupot_status", "normal");
            } else {
                setValue("bupot_status", "perbaikan");
            }
        }
    }, [bupots, start_period, end_period, customer_id, setValue]);

    useEffect(() => {
        if (objectId) {
            const selectedObject = objects.find((object: any) => object.id === objectId);
            if (selectedObject) {
                setValue('tax_type', selectedObject.tax_type || '');
                setValue('tax_code', selectedObject.tax_code || '');
            }
        }
    }, [objectId, objects, setValue]);

    const isMoreOptions = [
        { value: "tidak", label: "Tidak" },
        { value: "ya", label: "Ya" },
    ];

    const ptkpOptions = [
        { value: "TK/0", label: "TK/0" },
        { value: "TK/1", label: "TK/1" },
        { value: "TK/2", label: "TK/2" },
        { value: "TK/3", label: "TK/3" },
        { value: "K/0", label: "K/0" },
        { value: "K/1", label: "K/1" },
        { value: "K/2", label: "K/2" },
        { value: "K/3", label: "K/3" },
    ];

    const bupotTypesOptions = [
        { value: "Kurang dari Setahun", label: "Kurang dari Setahun" },
        { value: "Kurang dari Setahun yang penghasilannya disetahunkan", label: "Kurang dari Setahun yang penghasilannya disetahunkan" },
        { value: "Setahun Penuh", label: "Setahun Penuh" },
    ];

    // Generate periode options
    const currentYear = new Date().getFullYear();
    
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const generatePeriodOptions = () => {
        const options: { value: string; label: string }[] = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-based index
        
        // Generate for 3 years back until current month
        const startYear = currentYear - 3;
        
        for (let year = startYear; year <= currentYear; year++) {
            // Determine the last month for each year
            const lastMonth = year === currentYear ? currentMonth : 11; // If current year, stop at current month, else go to December
            
            for (let monthIndex = 0; monthIndex <= lastMonth; monthIndex++) {
                const month = months[monthIndex];
                const value = `${month} ${year}`;
                const label = `${month} ${year}`;
                options.push({ value, label });
            }
        }
        
        // Sort options by year and month (most recent first)
        options.sort((a, b) => {
            const [monthA, yearA] = a.value.split(' ');
            const [monthB, yearB] = b.value.split(' ');
            
            if (yearA !== yearB) {
                return parseInt(yearB) - parseInt(yearA); // Tahun terbaru dulu
            }
            
            const monthIndexA = months.indexOf(monthA);
            const monthIndexB = months.indexOf(monthB);
            return monthIndexB - monthIndexA; // Bulan terbaru dulu dalam tahun yang sama
        });
        
        return options;
    };

    const generateEndPeriodOptions = (startPeriod: string) => {
        if (!startPeriod) return [];
        
        const options: { value: string; label: string }[] = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-based index
        
        // Parse start period
        const [startMonthName, startYearStr] = startPeriod.split(' ');
        const startYear = parseInt(startYearStr);
        const startMonthIndex = months.indexOf(startMonthName);
        
        // Generate options from start period to current month
        for (let year = startYear; year <= currentYear; year++) {
            const firstMonth = year === startYear ? startMonthIndex : 0;
            const lastMonth = year === currentYear ? currentMonth : 11;
            
            for (let monthIndex = firstMonth; monthIndex <= lastMonth; monthIndex++) {
                const month = months[monthIndex];
                const value = `${month} ${year}`;
                const label = `${month} ${year}`;
                options.push({ value, label });
            }
        }
        
        // Sort options by year and month (most recent first)
        options.sort((a, b) => {
            const [monthA, yearA] = a.value.split(' ');
            const [monthB, yearB] = b.value.split(' ');
            
            if (yearA !== yearB) {
                return parseInt(yearB) - parseInt(yearA); // Tahun terbaru dulu
            }
            
            const monthIndexA = months.indexOf(monthA);
            const monthIndexB = months.indexOf(monthB);
            return monthIndexB - monthIndexA; // Bulan terbaru dulu dalam tahun yang sama
        });
        
        return options;
    };

    const periodOptions = generatePeriodOptions();
    const endPeriodOptions = generateEndPeriodOptions(start_period);

    // Auto-reset end_period if it's before start_period
    useEffect(() => {
        if (start_period && end_period) {
            const [startMonth, startYear] = start_period.split(' ');
            const [endMonth, endYear] = end_period.split(' ');
            
            const startMonthIndex = months.indexOf(startMonth);
            const endMonthIndex = months.indexOf(endMonth);
            
            const startDate = new Date(parseInt(startYear), startMonthIndex);
            const endDate = new Date(parseInt(endYear), endMonthIndex);
            
            if (endDate < startDate) {
                setValue("end_period", "");
            }
        }
    }, [start_period, end_period, setValue]);



    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="is_more"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">
                            Bekerja di lebih dari satu pemberi kerja*
                        </FormLabel>
                        <Popover
                            open={isPopoverIsMoreOpen}
                            onOpenChange={setIsPopoverIsMoreOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !form.watch("is_more") &&
                                                "text-muted-foreground",
                                            "whitespace-normal break-words"
                                        )}
                                        disabled={isEditMode}
                                    >
                                        <span className="truncate">
                                            {form.watch("is_more")
                                                ? isMoreOptions.find(
                                                    (option) =>
                                                        option.value === form.watch("is_more")
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
                                        placeholder="Cari Opsi..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada opsi yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {isMoreOptions.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => {
                                                        form.setValue(
                                                            "is_more",
                                                            option.value
                                                        );
                                                        setIsPopoverIsMoreOpen(
                                                            false
                                                        );
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
                name="start_period"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Masa Pajak Awal*</FormLabel>
                        <Popover
                            open={isPopoverStartPeriodOpen}
                            onOpenChange={setIsPopoverStartPeriodOpen}
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
                                        disabled={isEditMode}
                                    >
                                        <span className="truncate">
                                            {field.value || "Pilih Periode Mulai"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Periode..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada periode yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {periodOptions.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => {
                                                        field.onChange(option.value);
                                                        setIsPopoverStartPeriodOpen(false);
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
                name="end_period"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Masa Pajak Akhir*</FormLabel>
                        <Popover
                            open={isPopoverEndPeriodOpen}
                            onOpenChange={setIsPopoverEndPeriodOpen}
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
                                        disabled={isEditMode || !start_period}
                                    >
                                        <span className="truncate">
                                            {field.value 
                                                ? field.value 
                                                : !start_period 
                                                    ? "Pilih periode mulai dulu"
                                                    : "Pilih Periode Akhir"
                                            }
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Periode..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            {!start_period 
                                                ? "Pilih periode mulai terlebih dahulu."
                                                : "Tidak ada periode yang tersedia."
                                            }
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {endPeriodOptions.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => {
                                                        field.onChange(option.value);
                                                        setIsPopoverEndPeriodOpen(false);
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
                name="nip"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">NIP/NRP*</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={isEditMode} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="rank_group"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Pangkat/Golongan*</FormLabel>
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
                            open={isPopoverPtkpOpen}
                            onOpenChange={setIsPopoverPtkpOpen}
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
                                        disabled={isEditMode}
                                    >
                                        <span className="truncate">
                                            {field.value || "Pilih Status PTKP"}
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
                                            Tidak ada status PTKP yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {ptkpOptions.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => {
                                                        field.onChange(option.value);
                                                        setIsPopoverPtkpOpen(false);
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

            <FormField
                control={form.control}
                name="object_id"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Nama Objek Pajak*</FormLabel>
                        <Popover
                            open={isPopoverObjectIdOpen}
                            onOpenChange={setIsPopoverObjectIdOpen}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-full justify-between",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        disabled={isEditMode}
                                    >
                                        {field.value
                                            ? objects.find(
                                                (object: any) => object.id === field.value
                                              )?.tax_name
                                            : "Pilih Nama Objek Pajak"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                            Tidak ada objek pajak yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {objects
                                            .filter((object: any) => 
                                                !object.tax_name?.toLowerCase().includes('daerah')
                                            )       
                                            .map((object: any) => (
                                                <CommandItem
                                                    value={object.tax_name}
                                                    key={object.id}
                                                    onSelect={() => {
                                                        form.setValue("object_id", object.id);
                                                        setIsPopoverObjectIdOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            object.id === field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {object.tax_name}
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
                name="tax_type"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Jenis Pajak</FormLabel>
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
                        <FormLabel className="md:w-1/4">Kode Objek Pajak*</FormLabel>
                        <FormControl>
                            <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="bupot_types"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                        <FormLabel className="md:w-1/4">Jenis Pemotongan*</FormLabel>
                        <Popover
                            open={isPopoverBupotTypesOpen}
                            onOpenChange={setIsPopoverBupotTypesOpen}
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
                                        disabled={isEditMode}
                                    >
                                        <span className="truncate">
                                            {field.value
                                                ? bupotTypesOptions.find(
                                                      (option) => option.value === field.value
                                                  )?.label
                                                : "Pilih Jenis Pemotongan"}
                                        </span>
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Jenis Pemotongan..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada jenis pemotongan yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {bupotTypesOptions.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => {
                                                        field.onChange(option.value);
                                                        setIsPopoverBupotTypesOpen(false);
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
        </div>
    );
}