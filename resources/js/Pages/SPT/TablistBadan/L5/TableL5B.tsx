import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { L5BItem } from "./types";

const MONTHS = [
    { key: "january", label: "Jan" },
    { key: "february", label: "Feb" },
    { key: "march", label: "Mar" },
    { key: "april", label: "Apr" },
    { key: "may", label: "Mei" },
    { key: "june", label: "Jun" },
    { key: "july", label: "Jul" },
    { key: "august", label: "Agu" },
    { key: "september", label: "Sep" },
    { key: "october", label: "Okt" },
    { key: "november", label: "Nov" },
    { key: "december", label: "Des" },
] as const;

type MonthKey = (typeof MONTHS)[number]["key"];

const parseNum = (v: string | null | undefined): number =>
    parseFloat((v ?? "0").replace(/[^0-9.-]/g, "")) || 0;

const sumByMonth = (data: L5BItem[], key: MonthKey | "total"): number =>
    data.reduce((acc, item) => acc + parseNum(item[key]), 0);

const fmt = (n: number): string =>
    n === 0 ? "-" : n.toLocaleString("id-ID");

interface TableL5BProps {
    data: L5BItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L5BItem) => void;
    onDelete: (id: string) => void;
}

export function TableL5B({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL5BProps) {
    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < data.length;

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectChange(data.map((item) => item.id!).filter(Boolean));
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

    // Accumulated totals per month + grand total
    const jumlahPeredaranBruto = MONTHS.map((m) => sumByMonth(data, m.key));
    const jumlahPeredaranBrutoTotal = sumByMonth(data, "total");

    // These rows are hardcoded as 0 (no source fields yet — placeholders for future integration)
    const emptyMonths = MONTHS.map(() => 0);

    // SELISIH = JUMLAH PEREDARAN BRUTO - (PPh FINAL TERUTANG + PPh FINAL DISETOR + PPh FINAL DIPOTONG)
    // Since the other 3 rows are empty for now, SELISIH = JUMLAH PEREDARAN BRUTO
    const selisih = jumlahPeredaranBruto;
    const selisihTotal = jumlahPeredaranBrutoTotal;

    const SUMMARY_ROWS: { label: string; values: number[]; total: number }[] = [
        {
            label: "JUMLAH PEREDARAN BRUTO",
            values: jumlahPeredaranBruto,
            total: jumlahPeredaranBrutoTotal,
        },
        {
            label: "JUMLAH PPh BERSIFAT FINAL TERUTANG",
            values: emptyMonths,
            total: 0,
        },
        {
            label: "JUMLAH PPh BERSIFAT FINAL DISETOR SENDIRI",
            values: emptyMonths,
            total: 0,
        },
        {
            label: "JUMLAH PPh BERSIFAT FINAL DIPOTONG/DIPUNGUT PIHAK LAIN",
            values: emptyMonths,
            total: 0,
        },
        {
            label: "SELISIH",
            values: selisih,
            total: selisihTotal,
        },
    ];

    // Total cols = checkbox + No + Aksi + Nama TKU + 12 months + Total = 16
    const TOTAL_COLS = 16;

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={
                                    allSelected ||
                                    (someSelected && "indeterminate")
                                }
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead className="w-[80px]">Aksi</TableHead>
                        <TableHead>Nama TKU</TableHead>
                        {MONTHS.map((m) => (
                            <TableHead key={m.key} className="text-center">
                                {m.label}
                            </TableHead>
                        ))}
                        <TableHead className="text-center">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={TOTAL_COLS}
                                className="text-center text-sm text-muted-foreground h-24"
                            >
                                Belum ada data.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, idx) => (
                            <TableRow key={item.id ?? idx}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(item.id!)}
                                        onCheckedChange={(checked) =>
                                            handleSelectOne(item.id!, !!checked)
                                        }
                                    />
                                </TableCell>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
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
                                <TableCell>{item.tku_name}</TableCell>
                                {MONTHS.map((m) => (
                                    <TableCell key={m.key} className="text-center">
                                        {item[m.key] ?? "-"}
                                    </TableCell>
                                ))}
                                <TableCell className="text-center font-semibold">
                                    {item.total ?? "-"}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    {/* Summary accumulation rows */}
                    {SUMMARY_ROWS.map((row) => (
                        <TableRow key={row.label} className="bg-gray-100 dark:bg-gray-700">
                            <TableCell
                                colSpan={4}
                                className="text-xs font-semibold text-center uppercase"
                            >
                                {row.label}
                            </TableCell>
                            {row.values.map((val, i) => (
                                <TableCell key={i} className="text-center text-xs">
                                    {fmt(val)}
                                </TableCell>
                            ))}
                            <TableCell className="text-center text-xs font-semibold">
                                {fmt(row.total)}
                            </TableCell>
                        </TableRow>
                    ))}

                    {/* Full-width spanning rows */}
                    <TableRow className="bg-gray-200 dark:bg-gray-600">
                        <TableCell
                            colSpan={TOTAL_COLS - 1}
                            className="text-xs font-semibold uppercase"
                        >
                            SELISIH PADA SPT YANG DIBETULKAN
                        </TableCell>
                        <TableCell className="text-center text-xs">-</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-200 dark:bg-gray-600">
                        <TableCell
                            colSpan={TOTAL_COLS - 1}
                            className="text-xs font-semibold uppercase"
                        >
                            SELISIH KARENA PEMBETULAN
                        </TableCell>
                        <TableCell className="text-center text-xs">-</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL5B;
