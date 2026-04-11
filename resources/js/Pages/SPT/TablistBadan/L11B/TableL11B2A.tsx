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
import type { L11B2AItem } from "./types";

const fmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const formatMoney = (v: number | null | undefined) => fmt.format(v ?? 0);

const MONTHS = [1,2,3,4,5,6,7,8,9,10,11,12] as const;

interface TableL11B2AProps {
    data: L11B2AItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L11B2AItem) => void;
    onDelete: (id: string) => void;
}

export function TableL11B2A({ data, selectedIds, onSelectChange, onEdit, onDelete }: TableL11B2AProps) {
    const totalAvg = data.reduce((s, i) => s + (i.average_balance ?? 0), 0);
    const totals = MONTHS.map((m) => data.reduce((s, i) => s + ((i as any)[`month_balance_${m}`] ?? 0), 0));

    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

    const handleSelectAll = (checked: boolean) =>
        onSelectChange(checked ? data.map((i) => i.id!).filter(Boolean) : []);
    const handleSelectOne = (id: string, checked: boolean) =>
        onSelectChange(checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id));

    return (
        <div className="w-full overflow-x-auto">
            <Table className="min-w-[1400px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]" rowSpan={2}>
                            <Checkbox
                                checked={allSelected || (someSelected && "indeterminate")}
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead className="w-[40px]" rowSpan={2}>No</TableHead>
                        <TableHead className="w-[70px]" rowSpan={2}>Aksi</TableHead>
                        <TableHead className="text-center" colSpan={3}>PEMBERI PINJAMAN</TableHead>
                        <TableHead className="text-center" colSpan={13}>SALDO UTANG TIAP AKHIR BULAN (Rp)</TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead>Nomor Identitas</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Hubungan</TableHead>
                        {MONTHS.map((m) => <TableHead key={m} className="text-right whitespace-nowrap">Bulan {m}</TableHead>)}
                        <TableHead className="text-right">Rata-rata</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={19} className="text-center text-sm text-muted-foreground h-20">
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
                                <TableCell>{item.number_id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.relationship || "-"}</TableCell>
                                {MONTHS.map((m) => (
                                    <TableCell key={m} className="text-right">
                                        {formatMoney((item as any)[`month_balance_${m}`])}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right">{formatMoney(item.average_balance)}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {data.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6} className="text-right font-semibold">JUMLAH</TableCell>
                            {totals.map((t, i) => (
                                <TableCell key={i} className="text-right font-semibold">{formatMoney(t)}</TableCell>
                            ))}
                            <TableCell className="text-right font-semibold">{formatMoney(totalAvg)}</TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}

export default TableL11B2A;
