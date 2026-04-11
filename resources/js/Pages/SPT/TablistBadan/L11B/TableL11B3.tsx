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
import type { L11B3Item } from "./types";

const fmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const formatMoney = (v: number | null | undefined) => fmt.format(v ?? 0);

interface TableL11B3Props {
    data: L11B3Item[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L11B3Item) => void;
    onDelete: (id: string) => void;
}

export function TableL11B3({ data, selectedIds, onSelectChange, onEdit, onDelete }: TableL11B3Props) {
    const totalAvgDebt    = data.reduce((s, i) => s + (i.average_debt_balance ?? 0), 0);
    const totalLoanCost   = data.reduce((s, i) => s + (i.loan_cost ?? 0), 0);
    const totalTax        = data.reduce((s, i) => s + (i.loan_cost_tax ?? 0), 0);
    const totalCannotRed  = data.reduce((s, i) => s + (i.loan_cost_cannot_reduced ?? 0), 0);

    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

    const handleSelectAll = (checked: boolean) =>
        onSelectChange(checked ? data.map((i) => i.id!).filter(Boolean) : []);
    const handleSelectOne = (id: string, checked: boolean) =>
        onSelectChange(checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id));

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]">
                            <Checkbox
                                checked={allSelected || (someSelected && "indeterminate")}
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead className="w-[40px]">No</TableHead>
                        <TableHead className="w-[70px]">Aksi</TableHead>
                        <TableHead>Pemberi Pinjaman</TableHead>
                        <TableHead className="text-right">Saldo Rata-rata Utang</TableHead>
                        <TableHead className="text-right">Biaya Pinjaman (Bunga)</TableHead>
                        <TableHead className="text-right">Biaya Pinjaman yang Dapat Diperhitungkan</TableHead>
                        <TableHead className="text-right">Biaya Pinjaman yang Tidak Dapat Diperhitungkan</TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead />
                        <TableHead className="text-center text-xs text-muted-foreground">(1)</TableHead>
                        <TableHead />
                        <TableHead className="text-center text-xs text-muted-foreground">(2)</TableHead>
                        <TableHead className="text-center text-xs text-muted-foreground">(3)</TableHead>
                        <TableHead className="text-center text-xs text-muted-foreground">(4)</TableHead>
                        <TableHead className="text-center text-xs text-muted-foreground">(5)</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-sm text-muted-foreground h-20">
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
                                <TableCell>{item.cost_provider}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.average_debt_balance)}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.loan_cost)}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.loan_cost_tax)}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.loan_cost_cannot_reduced)}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {data.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} className="text-right font-semibold">JUMLAH</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalAvgDebt)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalLoanCost)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalTax)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalCannotRed)}</TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}

export default TableL11B3;
