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
import { L11A4AItem } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (v: number | null | undefined) =>
    rupiahFormatter.format(v ?? 0);

interface TableL11A4AProps {
    data: L11A4AItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L11A4AItem) => void;
    onDelete: (id: string) => void;
}

export function TableL11A4A({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL11A4AProps) {
    const totalAcquisition = data.reduce((sum, i) => sum + (i.acquisition_value ?? 0), 0);
    const totalLastYear = data.reduce((sum, i) => sum + (i.depreciation_last_year ?? 0), 0);
    const totalThisYear = data.reduce((sum, i) => sum + (i.depreciation_this_year ?? 0), 0);
    const totalRemaining = data.reduce((sum, i) => sum + (i.depreciation_remaining ?? 0), 0);

    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

    const handleSelectAll = (checked: boolean) =>
        onSelectChange(checked ? data.map((i) => i.id!).filter(Boolean) : []);

    const handleSelectOne = (id: string, checked: boolean) =>
        onSelectChange(
            checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id),
        );

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={allSelected || (someSelected && "indeterminate")}
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead className="w-[80px]">Aksi</TableHead>
                        <TableHead>Jenis Harta</TableHead>
                        <TableHead>Tahun Perolehan</TableHead>
                        <TableHead className="text-right">Nilai Perolehan</TableHead>
                        <TableHead className="text-right">Penyusutan Tahun Lalu</TableHead>
                        <TableHead className="text-right">Penyusutan Tahun Ini</TableHead>
                        <TableHead className="text-right">Sisa Penyusutan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-sm text-muted-foreground h-24">
                                Belum ada data.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, idx) => (
                            <TableRow key={item.id ?? idx}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(item.id!)}
                                        onCheckedChange={(c) => handleSelectOne(item.id!, !!c)}
                                    />
                                </TableCell>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(item)}>
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => onDelete(item.id!)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{item.tangible_asset_type || "-"}</TableCell>
                                <TableCell>{item.acquisition_year || "-"}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.acquisition_value)}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.depreciation_last_year)}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.depreciation_this_year)}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.depreciation_remaining)}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {data.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5} className="text-right font-semibold">Total</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalAcquisition)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalLastYear)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalThisYear)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalRemaining)}</TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}

export default TableL11A4A;
