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
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    invoice_id: z.string(),
    item_type: z.enum(["barang", "jasa"]),
    item_id: z.number().int(),
    unit_id: z.number().int(),
    item_name: z.string(),
    item_quantity: z.number().int(),
    item_price: z.number().int(),
    item_discount: z.number().int(),
    dpp: z.number().int(),
    ppn_rate: z.number().int(),
    ppn: z.number().int(),
    ppnbm_rate: z.number().int(),
    ppnbm: z.number().int(),
    dpp_lain: z.number().int(),
    total_price: z.number().int(),
});

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

const parseRupiah = (value: string) => {
    return Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

const quantityFormatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const parseQuantity = (value: string) => {
    return Number(value.replace(/[^0-9]/g, ""));
};

export default function FormTransactionItems({
    invoiceId,
    itemTransactions,
    unitTransactions,
    addItem,
    selectedTransactionCode,
}: {
    invoiceId: string;
    itemTransactions: any[];
    unitTransactions: any[];
    addItem: (item: any) => void;
    selectedTransactionCode?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isItemPopoverOpen, setIsItemPopoverOpen] = useState(false);
    const [isUnitPopoverOpen, setIsUnitPopoverOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState(itemTransactions);
    const isDppLainDisabled = !["02", "03", "04", "07", "08", "09"].includes(
        selectedTransactionCode || ""
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            invoice_id: invoiceId,
            item_type: "barang",
            item_discount: 0,
            item_quantity: 1,
            dpp: 0,
            ppn_rate: 12,
            ppn: 0,
            ppnbm_rate: 0,
            ppnbm: 0,
            dpp_lain: 0,
            total_price: 0,
        },
    });

    const { watch, setValue } = form;
    const item_price = watch("item_price");
    const item_quantity = watch("item_quantity");
    const item_discount = watch("item_discount");
    const ppn_rate = watch("ppn_rate");
    const ppnbm_rate = watch("ppnbm_rate");
    const dpp = watch("dpp");
    const dpp_lain = watch("dpp_lain");
    const item_type = watch("item_type");

    useEffect(() => {
        const total_price = item_price * item_quantity - item_discount;
        const dpp = total_price;
        const ppnbm = Math.round((dpp_lain * ppnbm_rate) / 100);
        const remaining_after_ppnbm = dpp_lain - ppnbm;
        const ppn = Math.round((remaining_after_ppnbm * ppn_rate) / 100);

        setValue("total_price", total_price);
        setValue("dpp", dpp);
        setValue("ppn", ppn);
        setValue("ppnbm", ppnbm);
    }, [
        item_price,
        item_quantity,
        item_discount,
        ppn_rate,
        ppnbm_rate,
        dpp_lain,
        setValue,
    ]);

    useEffect(() => {
        if (isDppLainDisabled) {
            setValue("dpp_lain", dpp);
        } else {
            setValue("dpp_lain", item_price * item_quantity - item_discount);
        }
    }, [
        dpp,
        item_price,
        item_quantity,
        item_discount,
        setValue,
        isDppLainDisabled,
    ]);

    const handleDppLainChange = (value: string) => {
        const parsedValue = parseRupiah(value);
        if (parsedValue <= dpp) {
            setValue("dpp_lain", parsedValue);
        } else {
            setValue("dpp_lain", dpp);
        }
    };

    useEffect(() => {
        setFilteredItems(
            itemTransactions.filter((item) => item.type === item_type)
        );
    }, [item_type, itemTransactions]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        addItem(values);
        form.reset();
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus /> Tambah Item
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
                onWheel={(e) => {
                    if (isItemPopoverOpen || isUnitPopoverOpen) {
                        e.stopPropagation();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Tambah Barang / Jasa</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit(onSubmit)(e);
                        }}
                    >
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <FormField
                                control={form.control}
                                name="item_type"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Tipe</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-2 gap-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="barang" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Barang
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="jasa" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Jasa
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <p className="text-sm text-center">PPn dan PPnBM</p>
                            <FormField
                                control={form.control}
                                name="item_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kode Item</FormLabel>
                                        <Popover
                                            open={isItemPopoverOpen}
                                            onOpenChange={setIsItemPopoverOpen}
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
                                                                ? itemTransactions.find(
                                                                      (
                                                                          item: any
                                                                      ) =>
                                                                          item.id ===
                                                                          field.value
                                                                  )?.description
                                                                : "Pilih Kode Item"}
                                                        </span>
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Cari Kode Item..."
                                                        className="h-9"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            Tidak ada item yang
                                                            tersedia.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {filteredItems?.length >
                                                            0 ? (
                                                                filteredItems.map(
                                                                    (
                                                                        item: any
                                                                    ) => (
                                                                        <CommandItem
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            value={
                                                                                item.id
                                                                            }
                                                                            onSelect={() => {
                                                                                field.onChange(
                                                                                    item.id
                                                                                );
                                                                                setIsItemPopoverOpen(
                                                                                    false
                                                                                );
                                                                            }}
                                                                            className="max-w-md"
                                                                        >
                                                                            {
                                                                                item.description
                                                                            }
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    item.id ===
                                                                                        field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    )
                                                                )
                                                            ) : (
                                                                <CommandItem value="">
                                                                    Tidak ada
                                                                    item yang
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
                                name="dpp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>DPP (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                value={rupiahFormatter.format(
                                                    field.value || 0
                                                )}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseRupiah(
                                                            e.target.value
                                                        )
                                                    )
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
                                name="item_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dpp_lain"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>DPP Lain (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                value={rupiahFormatter.format(
                                                    field.value || 0
                                                )}
                                                onChange={(e) =>
                                                    handleDppLainChange(
                                                        e.target.value
                                                    )
                                                }
                                                autoComplete="off"
                                                disabled={isDppLainDisabled}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Satuan</FormLabel>
                                        <Popover
                                            open={isUnitPopoverOpen}
                                            onOpenChange={setIsUnitPopoverOpen}
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
                                                                ? unitTransactions.find(
                                                                      (
                                                                          unit: any
                                                                      ) =>
                                                                          unit.id ===
                                                                          field.value
                                                                  )?.description
                                                                : "Pilih Satuan"}
                                                        </span>
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Cari Satuan..."
                                                        className="h-9"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            Tidak ada satuan
                                                            yang tersedia.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {unitTransactions?.length >
                                                            0 ? (
                                                                unitTransactions.map(
                                                                    (
                                                                        unit: any
                                                                    ) => (
                                                                        <CommandItem
                                                                            key={
                                                                                unit.id
                                                                            }
                                                                            value={
                                                                                unit.id
                                                                            }
                                                                            onSelect={() => {
                                                                                field.onChange(
                                                                                    unit.id
                                                                                );
                                                                                setIsUnitPopoverOpen(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            {
                                                                                unit.description
                                                                            }
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    unit.id ===
                                                                                        field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    )
                                                                )
                                                            ) : (
                                                                <CommandItem value="">
                                                                    Tidak ada
                                                                    satuan yang
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
                                name="ppn_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PPn Rate (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        )
                                                    )
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
                                name="item_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harga (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                value={rupiahFormatter.format(
                                                    field.value || 0
                                                )}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseRupiah(
                                                            e.target.value
                                                        )
                                                    )
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
                                name="ppn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PPn (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                value={rupiahFormatter.format(
                                                    field.value || 0
                                                )}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseRupiah(
                                                            e.target.value
                                                        )
                                                    )
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
                                name="item_quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kuantitas</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                value={quantityFormatter.format(
                                                    field.value || 0
                                                )}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseQuantity(
                                                            e.target.value
                                                        )
                                                    )
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
                                name="ppnbm_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PPnBM Rate (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        )
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="total_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Harga (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                value={rupiahFormatter.format(
                                                    field.value || 0
                                                )}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseRupiah(
                                                            e.target.value
                                                        )
                                                    )
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
                                name="ppnbm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PPnBM (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                value={rupiahFormatter.format(
                                                    field.value || 0
                                                )}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseRupiah(
                                                            e.target.value
                                                        )
                                                    )
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
                                name="item_discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Diskon (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                value={rupiahFormatter.format(
                                                    field.value || 0
                                                )}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseRupiah(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
