import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { L3CItem } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const toNumber = (value: unknown) => {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
};

const formatMoney = (value: unknown) => rupiahFormatter.format(toNumber(value));

const renderFilterRow = (colCount: number) => (
    <TableRow>
        {Array.from({ length: colCount }).map((_, idx) => (
            <TableCell key={idx} className="p-2">
                <Input className="h-7" disabled value="" />
            </TableCell>
        ))}
    </TableRow>
);

interface TableL3CProps {
    data: L3CItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L3CItem) => void;
    onDelete: (id: string) => void;
}

export function TableL3C({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL3CProps) {
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

    const colCount = 11;

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
                        <TableHead className="text-center text-xs w-[90px]">
                            TINDAKAN
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            KODE HARTA
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            KELOMPOK/JENIS HARTA
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            BULAN/TAHUN PEROLEHAN
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            HARGA PEROLEHAN
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            NILAI SISA BUKU FISKAL AWAL TAHUN
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            KOMERSIAL
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            FISKAL
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            PENYUSUTAN/AMORTISASI FISKAL TAHUN INI
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            KETERANGAN
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {renderFilterRow(colCount)}
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={colCount}
                                className="text-center text-sm text-muted-foreground h-20"
                            >
                                Tidak ada data yang ditemukan.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, idx) => (
                            <TableRow key={item.id ?? idx}>
                                <TableCell>
                                    <Checkbox
                                        checked={
                                            !!item.id &&
                                            selectedIds.includes(item.id)
                                        }
                                        onCheckedChange={(checked) =>
                                            item.id &&
                                            handleSelectOne(item.id, !!checked)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1 justify-center">
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
                                            onClick={() =>
                                                item.id && onDelete(item.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {item.code}
                                </TableCell>
                                <TableCell>{item.asset_type}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {item.period_acquisition}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    {formatMoney(item.cost_acquisition)}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    {formatMoney(item.begining_fiscal_book)}
                                </TableCell>
                                <TableCell>
                                    {item.method_commercial || "-"}
                                </TableCell>
                                <TableCell>
                                    {item.method_fiscal || "-"}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    {formatMoney(item.fiscal_depreciation)}
                                </TableCell>
                                <TableCell>{item.notes || "-"}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default TableL3C;
