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
import { L11A3Item } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (v: number | null | undefined) =>
    rupiahFormatter.format(v ?? 0);

interface TableL11A3Props {
    data: L11A3Item[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L11A3Item) => void;
    onDelete: (id: string) => void;
}

export function TableL11A3({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL11A3Props) {
    const totalCeiling = data.reduce((sum, i) => sum + (i.receivable_ceiling ?? 0), 0);
    const totalBadDebts = data.reduce((sum, i) => sum + (i.bad_debts ?? 0), 0);

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
                        <TableHead>Identitas Debitur</TableHead>
                        <TableHead>Nama Debitur</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead className="text-right">Plafon Piutang</TableHead>
                        <TableHead className="text-right">Piutang Tak Tertagih</TableHead>
                        <TableHead>Cara Pembebanan</TableHead>
                        <TableHead>Syarat Penghapusan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center text-sm text-muted-foreground h-24">
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
                                <TableCell>{item.number_id || "-"}</TableCell>
                                <TableCell>{item.name || "-"}</TableCell>
                                <TableCell>{item.address || "-"}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.receivable_ceiling)}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.bad_debts)}</TableCell>
                                <TableCell>{item.loading_method || "-"}</TableCell>
                                <TableCell>{item.document_method || "-"}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {data.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6} className="text-right font-semibold">Total</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalCeiling)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalBadDebts)}</TableCell>
                            <TableCell colSpan={2} />
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}

export default TableL11A3;
