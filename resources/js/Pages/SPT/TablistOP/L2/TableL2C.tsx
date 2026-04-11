import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { countries } from "@/data/spt-op-data";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { L2C_INCOME_TYPE_OPTIONS, type L2CItem } from "./types";

const uniqueCurrencies = Array.from(
    new Set(
        countries
            .filter((c) => (c.currency ?? "").trim())
            .map((c) => `${c.currency} ${c.label}`),
    ),
).sort();

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const getCountryLabel = (value: string) =>
    countries.find((c) => c.value === value)?.label || value;

interface TableL2CProps {
    data: L2CItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L2CItem) => void;
    onDelete: (id: string) => void;
}

export function TableL2C({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL2CProps) {
    const [filterName, setFilterName] = useState("");
    const [filterCountry, setFilterCountry] = useState<string>("");
    const [filterIncomeType, setFilterIncomeType] = useState<string>("");
    const [filterCurrency, setFilterCurrency] = useState<string>("");

    const [openCountry, setOpenCountry] = useState(false);
    const [openIncomeType, setOpenIncomeType] = useState(false);
    const [openCurrency, setOpenCurrency] = useState(false);

    const rows = useMemo(() => {
        const name = filterName.trim().toLowerCase();
        const country = filterCountry.trim();
        const incomeType = filterIncomeType.trim();
        const currency = filterCurrency.trim();

        return data.filter((item) => {
            if (
                name &&
                !(item.provider_name ?? "").toLowerCase().includes(name)
            )
                return false;
            if (country && (item.country ?? "") !== country) return false;
            if (incomeType && (item.income_type ?? "") !== incomeType)
                return false;
            if (currency && (item.currency ?? "") !== currency) return false;
            return true;
        });
    }, [data, filterName, filterCountry, filterIncomeType, filterCurrency]);

    const totals = useMemo(() => {
        return rows.reduce(
            (acc, item) => {
                acc.net_income += Number(item.net_income ?? 0);
                acc.amount += Number(item.amount ?? 0);
                acc.tax_credit += Number(item.tax_credit ?? 0);
                return acc;
            },
            { net_income: 0, amount: 0, tax_credit: 0 },
        );
    }, [rows]);

    const allSelected = rows.length > 0 && selectedIds.length === rows.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < rows.length;

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectChange(rows.map((item) => item.id!).filter(Boolean));
        } else {
            onSelectChange([]);
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            onSelectChange([...selectedIds, id]);
        } else {
            onSelectChange(selectedIds.filter((i) => i !== id));
        }
    };

    const headerClass = "text-black font-semibold";

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            rowSpan={2}
                            className={`w-[110px] ${headerClass}`}
                        >
                            TINDAKAN
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className={`w-[60px] ${headerClass}`}
                        >
                            NO.
                        </TableHead>

                        <TableHead
                            colSpan={2}
                            className={`${headerClass} text-center`}
                        >
                            SUMBER/PEMBERI PENGHASILAN
                        </TableHead>

                        <TableHead rowSpan={2} className={headerClass}>
                            TANGGAL TRANSAKSI
                        </TableHead>
                        <TableHead rowSpan={2} className={headerClass}>
                            JENIS PENGHASILAN
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className={`${headerClass} text-right`}
                        >
                            PENGHASILAN NETO (RUPIAH)
                        </TableHead>

                        <TableHead
                            colSpan={3}
                            className={`${headerClass} text-center`}
                        >
                            PPh YANG DIBAYAR/DIPOTONG/TERUTANG DI LUAR NEGERI
                        </TableHead>

                        <TableHead
                            rowSpan={2}
                            className={`${headerClass} text-right`}
                        >
                            KREDIT PAJAK YANG DAPAT DIPERHITUNGKAN
                        </TableHead>
                    </TableRow>

                    <TableRow>
                        <TableHead className={headerClass}>NAMA</TableHead>
                        <TableHead className={headerClass}>NEGARA</TableHead>
                        <TableHead className={headerClass}>
                            NILAI DALAM MATA UANG ASING
                        </TableHead>
                        <TableHead className={headerClass}>
                            NILAI DALAM RUPIAH
                        </TableHead>
                        <TableHead className={headerClass}>
                            MATA UANG ASING
                        </TableHead>
                    </TableRow>

                    <TableRow>
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white" />

                        <TableHead className="bg-white">
                            <Input
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                placeholder="Cari..."
                                className="h-8"
                            />
                        </TableHead>
                        <TableHead className="bg-white">
                            <Popover
                                open={openCountry}
                                onOpenChange={setOpenCountry}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCountry}
                                        className="h-8 w-full justify-between font-normal"
                                    >
                                        {filterCountry
                                            ? getCountryLabel(filterCountry)
                                            : "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[420px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Cari negara..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="(kosong)"
                                                    onSelect={() => {
                                                        setFilterCountry("");
                                                        setOpenCountry(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            !filterCountry
                                                                ? "opacity-100"
                                                                : "opacity-0",
                                                        )}
                                                    />
                                                    Semua
                                                </CommandItem>
                                                {countries.map((opt) => (
                                                    <CommandItem
                                                        key={opt.value}
                                                        value={opt.label}
                                                        onSelect={() => {
                                                            setFilterCountry(
                                                                opt.value,
                                                            );
                                                            setOpenCountry(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                filterCountry ===
                                                                    opt.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {opt.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </TableHead>
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white">
                            <Popover
                                open={openIncomeType}
                                onOpenChange={setOpenIncomeType}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openIncomeType}
                                        className="h-8 w-full justify-between font-normal"
                                    >
                                        {filterIncomeType || "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[520px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Cari jenis penghasilan..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="(kosong)"
                                                    onSelect={() => {
                                                        setFilterIncomeType("");
                                                        setOpenIncomeType(
                                                            false,
                                                        );
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            !filterIncomeType
                                                                ? "opacity-100"
                                                                : "opacity-0",
                                                        )}
                                                    />
                                                    Semua
                                                </CommandItem>
                                                {L2C_INCOME_TYPE_OPTIONS.map(
                                                    (opt) => (
                                                        <CommandItem
                                                            key={opt.code}
                                                            value={opt.name}
                                                            onSelect={() => {
                                                                setFilterIncomeType(
                                                                    opt.name,
                                                                );
                                                                setOpenIncomeType(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    filterIncomeType ===
                                                                        opt.name
                                                                        ? "opacity-100"
                                                                        : "opacity-0",
                                                                )}
                                                            />
                                                            {opt.name}
                                                        </CommandItem>
                                                    ),
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </TableHead>
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white">
                            <Popover
                                open={openCurrency}
                                onOpenChange={setOpenCurrency}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCurrency}
                                        className="h-8 w-full justify-between font-normal"
                                    >
                                        {filterCurrency || "Silakan Pilih"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[320px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Cari mata uang..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Tidak ditemukan.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="(kosong)"
                                                    onSelect={() => {
                                                        setFilterCurrency("");
                                                        setOpenCurrency(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            !filterCurrency
                                                                ? "opacity-100"
                                                                : "opacity-0",
                                                        )}
                                                    />
                                                    Semua
                                                </CommandItem>
                                                {uniqueCurrencies.map((cur) => (
                                                    <CommandItem
                                                        key={cur}
                                                        value={cur}
                                                        onSelect={() => {
                                                            setFilterCurrency(
                                                                cur,
                                                            );
                                                            setOpenCurrency(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                filterCurrency ===
                                                                    cur
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        {cur}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={11}
                                className="text-center text-sm text-muted-foreground h-24"
                            >
                                Tidak ada data untuk ditampilkan.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((item, idx) => (
                            <TableRow key={item.id ?? idx}>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                item.id!,
                                            )}
                                            onCheckedChange={(checked) =>
                                                handleSelectOne(
                                                    item.id!,
                                                    !!checked,
                                                )
                                            }
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8"
                                            onClick={() => onEdit(item)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-500 hover:text-red-600"
                                            onClick={() => onDelete(item.id!)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>

                                <TableCell>{idx + 1}</TableCell>

                                <TableCell>{item.provider_name}</TableCell>
                                <TableCell>
                                    {item.country
                                        ? getCountryLabel(item.country)
                                        : ""}
                                </TableCell>
                                <TableCell>
                                    {item.transaction_date
                                        ? item.transaction_date
                                        : ""}
                                </TableCell>
                                <TableCell>{item.income_type ?? ""}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.net_income)}
                                </TableCell>

                                <TableCell>
                                    {item.tax_foreign_currency ?? ""}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.amount)}
                                </TableCell>
                                <TableCell>{item.currency ?? ""}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.tax_credit)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}

                    <TableRow>
                        <TableCell
                            colSpan={6}
                            className="text-right font-semibold text-sm"
                        >
                            JUMLAH PENGHASILAN NETO (Rupiah)
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totals.net_income)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm">
                            JUMLAH PAJAK PENGHASILAN DIBAYAR/DIPOTONG/TERUTANG
                            DI LUAR NEGERI (Rupiah)
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totals.amount)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm">
                            JUMLAH KREDIT PAJAK YANG DAPAT DIPERHITUNGKAN
                            (Rupiah)
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totals.tax_credit)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

export default TableL2C;
