import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { cn } from "@/lib/utils";
import { X, ChevronsUpDown, Check } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { z } from "zod";
import { useState, useEffect } from "react";

const sourceIncomeSchema = z.object({
    source_income: z.string().min(1, "Sumber penghasilan harus dipilih"),
    workplace: z.string().min(1, "Tempat kerja harus diisi"),
    monthly_income: z.string().min(1, "Penghasilan per bulan harus dipilih"),
    economy_ids: z.array(z.string()).min(1, "Minimal pilih satu kode ekonomi"),
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
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: SourceIncomeItem) => void;
    onOpenEconomySearch: () => void;
    editingItem?: SourceIncomeItem | null;
    selectedEconomies: TaxpayerEconomy[];
    onRemoveEconomy: (economyId: string) => void;
}

export default function SourceIncomeDialog({
    isOpen,
    onClose,
    onSave,
    onOpenEconomySearch,
    editingItem,
    selectedEconomies,
    onRemoveEconomy,
}: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>(
        {}
    );

    const { data, setData, reset } = useForm({
        source_income: "",
        workplace: "",
        monthly_income: "",
        economy_ids: [] as string[],
    });

    useEffect(() => {
        if (editingItem) {
            setData({
                source_income: editingItem.source_income,
                workplace: editingItem.workplace,
                monthly_income: editingItem.monthly_income,
                economy_ids: editingItem.economy_ids,
            });
        } else {
            reset();
        }
    }, [editingItem]);

    const sourceIncomeOptions = [
        { value: "Pekerjaan", label: "Pekerjaan" },
        { value: "Pekerjaan Bebas", label: "Pekerjaan Bebas" },
        { value: "Kegiatan Usaha", label: "Kegiatan Usaha" },
    ];

    const monthlyIncomeOptions = [
        { value: "Kurang dari 4.500.000", label: "Kurang dari 4.500.000" },
        {
            value: "Rp 4.500.000 - Rp 9.999.999",
            label: "Rp 4.500.000 - Rp 9.999.999",
        },
        {
            value: "Rp 10.000.000 - Rp 14.999.999",
            label: "Rp 10.000.000 - Rp 14.999.999",
        },
        {
            value: "Rp 15.000.000 - Rp 19.999.999",
            label: "Rp 15.000.000 - Rp 19.999.999",
        },
        { value: "20.000.000 atau lebih", label: "Rp 20.000.000 atau lebih" },
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

    const handleSave = () => {
        try {
            const dataToValidate = {
                ...data,
                economy_ids: selectedEconomies.map((e) => e.id),
            };

            const validatedData = sourceIncomeSchema.parse(dataToValidate);
            setErrors({});

            const sourceIncomeItem: SourceIncomeItem = {
                ...validatedData,
                economies: selectedEconomies,
                id: editingItem?.id || Date.now().toString(),
            };

            onSave(sourceIncomeItem);
            handleClose();
        } catch (error) {
            console.error("Validation error:", error);
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    console.log("Field error:", err.path, err.message);
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
            }
        }
    };

    const handleClose = () => {
        setErrors({});
        setOpenPopovers({});
        reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingItem
                            ? "Edit Sumber Penghasilan"
                            : "Tambah Sumber Penghasilan"}
                    </DialogTitle>
                    <DialogDescription>
                        Masukkan informasi sumber penghasilan wajib pajak
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Sumber Penghasilan */}
                    <div className="space-y-2">
                        <Label>
                            Sumber Penghasilan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.source_income}
                            onOpenChange={() => togglePopover("source_income")}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.source_income &&
                                            "text-muted-foreground",
                                        errors.source_income && "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.source_income ||
                                            "Pilih sumber penghasilan"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari sumber penghasilan..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada sumber penghasilan yang
                                            tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {sourceIncomeOptions.map(
                                                (option) => (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.value}
                                                        onSelect={() => {
                                                            setData(
                                                                "source_income",
                                                                option.value as any
                                                            );
                                                            closePopover(
                                                                "source_income"
                                                            );
                                                        }}
                                                    >
                                                        {option.label}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                data.source_income ===
                                                                    option.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                )
                                            )}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.source_income && (
                            <p className="text-sm text-red-500">
                                {errors.source_income}
                            </p>
                        )}
                    </div>

                    {/* Kode KLU */}
                    <div className="space-y-2">
                        <Label>
                            Kode KLU <span className="text-red-500">*</span>
                        </Label>

                        {/* Show selected economies */}
                        {selectedEconomies.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    {selectedEconomies.map((economy) => (
                                        <div
                                            key={economy.id}
                                            className="flex items-center bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm"
                                        >
                                            <span className="mr-2">
                                                {economy.code} - {economy.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onRemoveEconomy(economy.id)
                                                }
                                                className="text-blue-900 hover:text-blue-800"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={onOpenEconomySearch}
                            className={cn(
                                "w-full justify-start",
                                errors.economy_ids && "border-red-500"
                            )}
                        >
                            {selectedEconomies.length > 0
                                ? "Tambah Kode Ekonomi Lain"
                                : "Pilih Kode Ekonomi"}
                        </Button>
                        {errors.economy_ids && (
                            <p className="text-sm text-red-500">
                                {errors.economy_ids}
                            </p>
                        )}
                    </div>

                    {/* Tempat Kerja */}
                    <div className="space-y-2">
                        <Label>
                            Tempat Kerja <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Silakan masukkan nama tempat kerja Anda"
                            value={data.workplace}
                            onChange={(e) =>
                                setData("workplace", e.target.value)
                            }
                            className={cn(errors.workplace && "border-red-500")}
                        />
                        {errors.workplace && (
                            <p className="text-sm text-red-500">
                                {errors.workplace}
                            </p>
                        )}
                    </div>

                    {/* Penghasilan per bulan */}
                    <div className="space-y-2">
                        <Label>
                            Penghasilan per bulan{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover
                            open={openPopovers.monthly_income}
                            onOpenChange={() => togglePopover("monthly_income")}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !data.monthly_income &&
                                            "text-muted-foreground",
                                        errors.monthly_income &&
                                            "border-red-500"
                                    )}
                                >
                                    <span className="truncate">
                                        {data.monthly_income ||
                                            "Pilih range penghasilan per bulan"}
                                    </span>
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Cari range penghasilan..."
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            Tidak ada range penghasilan yang
                                            tersedia.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {monthlyIncomeOptions.map(
                                                (option) => (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.value}
                                                        onSelect={() => {
                                                            setData(
                                                                "monthly_income",
                                                                option.value
                                                            );
                                                            closePopover(
                                                                "monthly_income"
                                                            );
                                                        }}
                                                    >
                                                        {option.label}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                data.monthly_income ===
                                                                    option.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                )
                                            )}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.monthly_income && (
                            <p className="text-sm text-red-500">
                                {errors.monthly_income}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        className="bg-blue-900 hover:bg-blue-800"
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
