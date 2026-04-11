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
import { L1DItem } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const netIncome = (item: L1DItem) => {
    if (typeof item.net_income === "number") return item.net_income;
    const gross = item.gross_income ?? 0;
    const deduction = item.deduction_gross_income ?? 0;
    return Math.max(0, gross - deduction);
};

interface TableL1DProps {
    data: L1DItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L1DItem) => void;
    onDelete: (id: string) => void;
}

export function TableL1D({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL1DProps) {
    const totalNetIncome = data.reduce((sum, item) => sum + netIncome(item), 0);

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
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={
                                    allSelected ||
                                    (someSelected && "indeterminate")
                                }
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead className="w-[80px]">Aksi</TableHead>
                        <TableHead>Nama Pemberi Kerja</TableHead>
                        <TableHead>Nomor Identitas Pemberi Kerja</TableHead>
                        <TableHead className="text-right">
                            Penghasilan Bruto
                        </TableHead>
                        <TableHead className="text-right">
                            Pengurang Penghasilan Bruto
                        </TableHead>
                        <TableHead className="text-right">
                            Penghasilan Neto
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={8}
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
                                <TableCell>{item.employer_name}</TableCell>
                                <TableCell>{item.employer_id}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.gross_income)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.deduction_gross_income)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(netIncome(item))}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7} className="font-semibold">
                            JUMLAH BAGIAN D
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalNetIncome)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL1D;
