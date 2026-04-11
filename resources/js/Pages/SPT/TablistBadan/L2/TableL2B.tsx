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
import { L2BItem } from "./types";
import { countries } from "@/data/spt-op-data";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const getCountryLabel = (code: string) =>
    countries.find((c) => c.value === code)?.label || code;

interface TableL2BProps {
    data: L2BItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L2BItem) => void;
    onDelete: (id: string) => void;
}

export function TableL2B({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL2BProps) {
    const totalEquity = data.reduce(
        (sum, item) => sum + (item.equity_capital_amount ?? 0),
        0,
    );
    const totalDebt = data.reduce(
        (sum, item) => sum + (item.debt_amount ?? 0),
        0,
    );
    const totalDebtInterest = data.reduce(
        (sum, item) => sum + (item.debt_interest ?? 0),
        0,
    );
    const totalReceivables = data.reduce(
        (sum, item) => sum + (item.receivables_amount ?? 0),
        0,
    );
    const totalReceivablesInterest = data.reduce(
        (sum, item) => sum + (item.receivables_interest ?? 0),
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
                    <TableRow>
                        <TableHead className="w-[50px]" rowSpan={2}>
                            <Checkbox
                                checked={
                                    allSelected ||
                                    (someSelected && "indeterminate")
                                }
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead className="w-[50px]" rowSpan={2}>
                            No
                        </TableHead>
                        <TableHead className="w-[80px]" rowSpan={2}>
                            Aksi
                        </TableHead>
                        <TableHead rowSpan={2}>Nama</TableHead>
                        <TableHead rowSpan={2}>Negara</TableHead>
                        <TableHead rowSpan={2}>NPWP/NIK</TableHead>
                        <TableHead rowSpan={2}>Jabatan</TableHead>
                        <TableHead className="text-center" colSpan={2}>
                            Penyertaan Modal
                        </TableHead>
                        <TableHead className="text-center" colSpan={3}>
                            Utang
                        </TableHead>
                        <TableHead className="text-center" colSpan={3}>
                            Piutang
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-right">Nilai (Rp)</TableHead>
                        <TableHead className="text-right">%</TableHead>
                        <TableHead className="text-right">Nilai (Rp)</TableHead>
                        <TableHead>Tahun/Bagian Tahun Pajak</TableHead>
                        <TableHead className="text-right">
                            Bunga Utang/Tahun
                        </TableHead>
                        <TableHead className="text-right">Nilai (Rp)</TableHead>
                        <TableHead>Tahun/Bagian Tahun Pajak</TableHead>
                        <TableHead className="text-right">
                            Bunga Piutang/Tahun
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={15}
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
                                <TableCell>{item.npwp}</TableCell>
                                <TableCell>{item.position}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.equity_capital_amount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.equity_capital_percentage != null
                                        ? `${item.equity_capital_percentage}%`
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.debt_amount)}
                                </TableCell>
                                <TableCell>{item.debt_year || "-"}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.debt_interest)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.receivables_amount)}
                                </TableCell>
                                <TableCell>
                                    {item.receivables_year || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.receivables_interest)}
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
                            {formatMoney(totalEquity)}
                        </TableCell>
                        <TableCell />
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalDebt)}
                        </TableCell>
                        <TableCell />
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalDebtInterest)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalReceivables)}
                        </TableCell>
                        <TableCell />
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalReceivablesInterest)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL2B;
