import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check, Plus, Trash2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { z } from "zod";

import SourceIncomeDialog from "./SourceIncomeDialog";
import EconomySearchDialog from "./EconomySearchDialog";

const economicDataSchema = z.object({
    accounting_method: z
        .string()
        .min(1, "Metode Pembukuan/Pencatatan harus dipilih"),
    currency: z.string().min(1, "Mata Uang Pembukuan harus dipilih"),
    accounting_period: z.string().min(1, "Periode Pembukuan harus dipilih"),
    source_incomes: z
        .array(
            z.object({
                id: z.string().optional(),
                source_income: z
                    .string()
                    .min(1, "Sumber penghasilan harus dipilih"),
                workplace: z.string().min(1, "Tempat kerja harus diisi"),
                monthly_income: z
                    .string()
                    .min(1, "Penghasilan per bulan harus diisi"),
                economy_ids: z
                    .array(z.string())
                    .min(1, "Minimal pilih satu kode ekonomi"),
                economies: z
                    .array(
                        z.object({
                            id: z.string(),
                            code: z.string(),
                            name: z.string(),
                            description: z.string(),
                            start_date: z.string(),
                        })
                    )
                    .optional(),
            })
        )
        .min(1, "Minimal harus menambahkan satu sumber penghasilan"),
});

interface TaxpayerEconomy {
    id: string;
    code: string;
    name: string;
    description: string;
    start_date: string;
}

interface SourceIncomeItem {
    id?: string;
    source_income: string;
    workplace: string;
    monthly_income: string;
    economy_ids: string[];
    economies?: TaxpayerEconomy[];
}

interface Props {
    onNext: (responseData?: any) => void;
    existingData?: any;
    taxpayerEconomies: TaxpayerEconomy[];
}

export default function EconomicData({
    onNext,
    existingData,
    taxpayerEconomies,
}: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>(
        {}
    );

    const [isSourceIncomeDialogOpen, setIsSourceIncomeDialogOpen] =
        useState(false);
    const [editingSourceIncome, setEditingSourceIncome] =
        useState<SourceIncomeItem | null>(null);
    const [sourceIncomes, setSourceIncomes] = useState<SourceIncomeItem[]>(
        existingData?.source_incomes || []
    );

    const [isEconomySearchOpen, setIsEconomySearchOpen] = useState(false);
    const [availableEconomies, setAvailableEconomies] = useState<
        TaxpayerEconomy[]
    >(taxpayerEconomies || []);
    const [selectedEconomies, setSelectedEconomies] = useState<
        TaxpayerEconomy[]
    >([]);

    const { data, setData } = useForm({
        accounting_method: existingData?.accounting_method || "Pencatatan",
        currency: existingData?.currency || "Rupiah Indonesia",
        accounting_period: existingData?.accounting_period || "01-12",
    });

    useEffect(() => {
        if (taxpayerEconomies && taxpayerEconomies.length > 0) {
            setAvailableEconomies(taxpayerEconomies);
        }

        const savedData = sessionStorage.getItem("economicData");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);

                setData({
                    accounting_method:
                        parsedData.accounting_method || "Pencatatan",
                    currency: parsedData.currency || "Rupiah Indonesia",
                    accounting_period: parsedData.accounting_period || "01-12",
                });

                if (parsedData.source_incomes) {
                    setSourceIncomes(parsedData.source_incomes);
                }
            } catch (error) {
                console.error("Error loading saved economic data:", error);
            }
        }
    }, [taxpayerEconomies]);

    useEffect(() => {
        const economicData = {
            accounting_method: data.accounting_method,
            currency: data.currency,
            accounting_period: data.accounting_period,
            source_incomes: sourceIncomes,
        };

        sessionStorage.setItem("economicData", JSON.stringify(economicData));

        const registrationData = JSON.parse(
            sessionStorage.getItem("registrationData") || "{}"
        );
        registrationData.step4 = economicData;
        sessionStorage.setItem(
            "registrationData",
            JSON.stringify(registrationData)
        );
    }, [data, sourceIncomes]);

    const accountingMethods = [
        { value: "Pencatatan", label: "Pencatatan" },
        { value: "Pembukuan", label: "Pembukuan" },
    ];

    const currencies = [
        { value: "IDR", label: "Rupiah Indonesia" },
        { value: "USD", label: "US Dollar" },
        { value: "EUR", label: "Euro" },
        { value: "JPY", label: "Japanese Yen" },
        { value: "GBP", label: "British Pound" },
        { value: "AUD", label: "Australian Dollar" },
        { value: "CAD", label: "Canadian Dollar" },
        { value: "CHF", label: "Swiss Franc" },
        { value: "CNY", label: "Chinese Yuan" },
        { value: "KRW", label: "South Korean Won" },
        { value: "SGD", label: "Singapore Dollar" },
        { value: "MYR", label: "Malaysian Ringgit" },
        { value: "THB", label: "Thai Baht" },
        { value: "PHP", label: "Philippine Peso" },
        { value: "VND", label: "Vietnamese Dong" },
        { value: "INR", label: "Indian Rupee" },
        { value: "HKD", label: "Hong Kong Dollar" },
        { value: "NZD", label: "New Zealand Dollar" },
        { value: "TWD", label: "Taiwan Dollar" },
        { value: "SAR", label: "Saudi Riyal" },
        { value: "AED", label: "UAE Dirham" },
        { value: "QAR", label: "Qatari Riyal" },
        { value: "KWD", label: "Kuwaiti Dinar" },
        { value: "BHD", label: "Bahraini Dinar" },
        { value: "OMR", label: "Omani Rial" },
    ];

    const accountingPeriods = [
        { value: "01-12", label: "01-12" },
        { value: "02-01", label: "02-01" },
        { value: "03-02", label: "03-02" },
        { value: "04-03", label: "04-03" },
        { value: "05-04", label: "05-04" },
        { value: "06-05", label: "06-05" },
        { value: "07-06", label: "07-06" },
        { value: "08-07", label: "08-07" },
        { value: "09-08", label: "09-08" },
        { value: "10-09", label: "10-09" },
        { value: "11-10", label: "11-10" },
        { value: "12-11", label: "12-11" },
    ];

    const togglePopover = (field: string) => {
        setOpenPopovers((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const closePopover = (field: string) => {
        setOpenPopovers((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    const handleOpenSourceIncomeDialog = (item?: SourceIncomeItem) => {
        setEditingSourceIncome(item || null);
        if (item) {
            setSelectedEconomies(item.economies || []);
        } else {
            setSelectedEconomies([]);
        }
        setIsSourceIncomeDialogOpen(true);
    };

    const handleCloseSourceIncomeDialog = () => {
        setIsSourceIncomeDialogOpen(false);
        setEditingSourceIncome(null);
        setSelectedEconomies([]);
    };

    const handleSaveSourceIncome = (sourceIncomeItem: SourceIncomeItem) => {
        if (editingSourceIncome) {
            setSourceIncomes((items) =>
                items.map((item) =>
                    item.id === editingSourceIncome.id ? sourceIncomeItem : item
                )
            );
            toast.success("Sumber penghasilan berhasil diperbarui!");
        } else {
            setSourceIncomes((items) => [...items, sourceIncomeItem]);
            toast.success("Sumber penghasilan berhasil ditambahkan!");
        }
    };

    const handleDeleteSourceIncome = (id: string) => {
        setSourceIncomes((items) => items.filter((item) => item.id !== id));
        toast.success("Sumber penghasilan berhasil dihapus!");
    };

    const handleOpenEconomySearch = () => {
        setIsEconomySearchOpen(true);
    };

    const handleCloseEconomySearch = () => {
        setIsEconomySearchOpen(false);
    };

    const handleSelectEconomy = (economy: TaxpayerEconomy) => {
        if (!selectedEconomies.find((e) => e.id === economy.id)) {
            setSelectedEconomies((prev) => [...prev, economy]);
        }
    };

    const handleRemoveEconomy = (economyId: string) => {
        setSelectedEconomies((prev) => prev.filter((e) => e.id !== economyId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!sourceIncomes || sourceIncomes.length === 0) {
                toast.error(
                    "Minimal harus menambahkan satu sumber penghasilan"
                );
                return;
            }

            const validatedData = economicDataSchema.parse({
                ...data,
                source_incomes: sourceIncomes,
            });

            setErrors({});
            setProcessing(true);

            const economicData = {
                ...validatedData,
                source_incomes: sourceIncomes,
            };

            sessionStorage.setItem(
                "economicData",
                JSON.stringify(economicData)
            );

            const registrationData = JSON.parse(
                sessionStorage.getItem("registrationData") || "{}"
            );
            registrationData.step4 = economicData;
            sessionStorage.setItem(
                "registrationData",
                JSON.stringify(registrationData)
            );

            toast.success("Data ekonomi berhasil disimpan!");

            onNext(economicData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
                toast.error("Mohon periksa kembali data yang diisi");
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Masukkan data ekonomi wajib pajak.
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                        <Label>
                            Metode Pembukuan/Pencatatan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.accounting_method}
                            onOpenChange={() =>
                                togglePopover("accounting_method")
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.accounting_method &&
                                            "text-muted-foreground",
                                        errors.accounting_method &&
                                            "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.accounting_method ||
                                            "Pilih metode pembukuan/pencatatan"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari metode..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada metode yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {accountingMethods.map((method) => (
                                                <CommandItem
                                                    key={method.value}
                                                    value={method.value}
                                                    onSelect={() => {
                                                        setData(
                                                            "accounting_method",
                                                            method.value
                                                        );
                                                        closePopover(
                                                            "accounting_method"
                                                        );
                                                    }}
                                                >
                                                    {method.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            data.accounting_method ===
                                                                method.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.accounting_method && (
                            <p className="text-sm text-red-500">
                                {errors.accounting_method}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Mata Uang Pembukuan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.currency}
                            onOpenChange={() => togglePopover("currency")}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.currency &&
                                            "text-muted-foreground",
                                        errors.currency && "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.currency
                                            ? currencies.find(
                                                  (c) =>
                                                      c.value === data.currency
                                              )?.label || data.currency
                                            : "Pilih mata uang pembukuan"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari mata uang..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada mata uang yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {currencies.map((currency) => (
                                                <CommandItem
                                                    key={currency.value}
                                                    value={currency.value}
                                                    onSelect={() => {
                                                        setData(
                                                            "currency",
                                                            currency.value
                                                        );
                                                        closePopover(
                                                            "currency"
                                                        );
                                                    }}
                                                >
                                                    {currency.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            data.currency ===
                                                                currency.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.currency && (
                            <p className="text-sm text-red-500">
                                {errors.currency}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Periode Pembukuan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.accounting_period}
                            onOpenChange={() =>
                                togglePopover("accounting_period")
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.accounting_period &&
                                            "text-muted-foreground",
                                        errors.accounting_period &&
                                            "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.accounting_period || "01-12"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari periode..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada periode yang tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {accountingPeriods.map((period) => (
                                                <CommandItem
                                                    key={period.value}
                                                    value={period.value}
                                                    onSelect={() => {
                                                        setData(
                                                            "accounting_period",
                                                            period.value
                                                        );
                                                        closePopover(
                                                            "accounting_period"
                                                        );
                                                    }}
                                                >
                                                    {period.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            data.accounting_period ===
                                                                period.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.accounting_period && (
                            <p className="text-sm text-red-500">
                                {errors.accounting_period}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <Button
                        type="button"
                        onClick={() => handleOpenSourceIncomeDialog()}
                        className="bg-blue-900 hover:bg-blue-800 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Sumber Penghasilan
                    </Button>
                </div>

                <div className="mb-6 border rounded-lg bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="min-w-[1000px]">
                            <div className="bg-yellow-100 border-b">
                                <div className="grid grid-cols-8 gap-3 p-3 text-sm font-medium text-gray-700">
                                    <div className="min-w-[70px] text-center">
                                        Aksi
                                    </div>
                                    <div className="min-w-[130px]">
                                        Sumber
                                        <br />
                                        Penghasilan
                                    </div>{" "}
                                    <div className="min-w-[80px] text-center">
                                        Kode
                                        <br />
                                        KLU
                                    </div>
                                    <div className="min-w-[100px] text-center">
                                        Jumlah
                                        <br />
                                        Karyawan
                                    </div>
                                    <div className="min-w-[110px] text-center">
                                        Omset per
                                        <br />
                                        tahun
                                    </div>
                                    <div className="min-w-[140px] text-center">
                                        Perkiraan
                                        <br />
                                        Penghasilan
                                        <br />
                                        Per Bulan
                                    </div>
                                    <div className="min-w-[100px] text-center">
                                        Tempat
                                        <br />
                                        Kerja
                                    </div>
                                    <div className="min-w-[150px]">
                                        Aktivitas
                                        <br />
                                        Ekonomi
                                    </div>
                                </div>
                            </div>
                            {/* Table body */}
                            <div className="divide-y">
                                {sourceIncomes.length > 0 ? (
                                    sourceIncomes.map((item, index) => (
                                        <div
                                            key={item.id || index}
                                            className="grid grid-cols-8 gap-3 p-3 text-xs items-center hover:bg-gray-50" // Reduced padding and font size
                                        >
                                            <div className="flex space-x-1 min-w-[70px] justify-center">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleOpenSourceIncomeDialog(
                                                            item
                                                        )
                                                    }
                                                    className="px-1 h-7 w-7" // Smaller buttons
                                                    title="Edit"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteSourceIncome(
                                                            item.id!
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-700 px-1 h-7 w-7" // Smaller buttons
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>

                                            <div className="min-w-[130px] break-words">
                                                {item.source_income}
                                            </div>

                                            <div className="min-w-[80px] text-xs font-mono text-center">
                                                {item.economies
                                                    ?.map((e) => e.code)
                                                    .join(", ") || "-"}
                                            </div>

                                            <div className="min-w-[100px] text-center">
                                                -
                                            </div>

                                            <div className="min-w-[110px] text-center">
                                                -
                                            </div>

                                            <div className="min-w-[140px] font-medium text-center">
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                        minimumFractionDigits: 0,
                                                    }
                                                ).format(
                                                    parseInt(
                                                        item.monthly_income
                                                    ) || 0
                                                )}
                                            </div>

                                            <div className="min-w-[100px] break-words text-center">
                                                {item.workplace}
                                            </div>

                                            <div className="min-w-[150px] break-words">
                                                {item.economies
                                                    ?.map((e) => e.name)
                                                    .join(", ") || "-"}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="text-gray-400 mb-2">
                                            <svg
                                                className="w-12 h-12 mx-auto"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="md:text-base text-sm text-gray-500 mb-2">
                                            Belum ada sumber penghasilan
                                        </p>
                                        <p className="md:text-sm text-xs text-gray-400">
                                            Klik "Tambah Sumber Penghasilan"
                                            untuk memulai
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center pt-6">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-900 hover:bg-blue-800"
                    >
                        {processing ? "Memvalidasi..." : "Lanjut"}
                    </Button>
                </div>
            </form>

            <SourceIncomeDialog
                isOpen={isSourceIncomeDialogOpen}
                onClose={handleCloseSourceIncomeDialog}
                onSave={handleSaveSourceIncome}
                onOpenEconomySearch={handleOpenEconomySearch}
                editingItem={editingSourceIncome}
                selectedEconomies={selectedEconomies}
                onRemoveEconomy={handleRemoveEconomy}
            />

            <EconomySearchDialog
                isOpen={isEconomySearchOpen}
                onClose={handleCloseEconomySearch}
                availableEconomies={availableEconomies}
                onSelectEconomy={handleSelectEconomy}
            />
        </div>
    );
}
