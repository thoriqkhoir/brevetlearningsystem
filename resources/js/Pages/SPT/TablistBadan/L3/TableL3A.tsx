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
import { L3AItem, TYPE_INCOME_OPTIONS } from "./types";
import { countries } from "@/data/spt-op-data";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const getCountryLabel = (code: string | null) =>
    countries.find((c) => c.value === code)?.label || code || "-";

const getTypeIncomeLabel = (value: string | null) =>
    TYPE_INCOME_OPTIONS.find((o) => o.value === value)?.label || value || "-";

interface TableL3AProps {
    data: L3AItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L3AItem) => void;
    onDelete: (id: string) => void;
}

export function TableL3A({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL3AProps) {
    const totalNetIncome = data.reduce(
        (sum, item) => sum + (item.net_income ?? 0),
        0,
    );
    const totalPphAmount = data.reduce(
        (sum, item) => sum + (item.pph_amount ?? 0),
        0,
    );
    const totalPphForeignAmount = data.reduce(
        (sum, item) => sum + (item.pph_foreign_amount ?? 0),
        0,
    );
    const totalTaxCredit = data.reduce(
        (sum, item) => sum + (item.tax_credit ?? 0),
        0,
    );

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

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead
                            rowSpan={2}
                            className="w-[50px] text-center align-middle"
                        >
                            <Checkbox
                                checked={
                                    allSelected ||
                                    (someSelected && "indeterminate")
                                }
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="w-[50px] text-center align-middle"
                        >
                            No
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="w-[80px] text-center align-middle"
                        >
                            Aksi
                        </TableHead>
                        <TableHead colSpan={2} className="text-center">
                            PEMOTONG PAJAK
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="text-center align-middle"
                        >
                            TANGGAL PAJAK PENGHASILAN TERUTANG/DIBAYAR/DIPOTONG
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="text-center align-middle"
                        >
                            JENIS PENGHASILAN
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="text-center align-middle"
                        >
                            PENGHASILAN NETO (Rp)
                        </TableHead>
                        <TableHead colSpan={3} className="text-center">
                            PAJAK PENGHASILAN TERUTANG/DIBAYAR/DIPOTONG DI LUAR
                            NEGERI
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="text-center align-middle"
                        >
                            KREDIT PAJAK YANG DAPAT DIPERHITUNGKAN (Rp)
                        </TableHead>
                    </TableRow>
                    <TableRow className="bg-gray-100">
                        <TableHead className="text-center">NAMA</TableHead>
                        <TableHead className="text-center">NEGARA</TableHead>
                        <TableHead className="text-center">
                            NILAI (Rp)
                        </TableHead>
                        <TableHead className="text-center">MATA UANG</TableHead>
                        <TableHead className="text-center">
                            NILAI (DALAM MATA UANG ASING)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={12}
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
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    {getCountryLabel(item.country)}
                                </TableCell>
                                <TableCell>{item.pph_date ?? "-"}</TableCell>
                                <TableCell>
                                    {getTypeIncomeLabel(item.type_income)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.net_income)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.pph_amount)}
                                </TableCell>
                                <TableCell>
                                    {item.pph_currency ?? "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.pph_foreign_amount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.tax_credit)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7} className="font-semibold">
                            JUMLAH
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalNetIncome)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalPphAmount)}
                        </TableCell>
                        <TableCell />
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalPphForeignAmount)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalTaxCredit)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL3A;
