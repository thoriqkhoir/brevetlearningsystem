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
import { L11A2Item } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (v: number | null | undefined) =>
    rupiahFormatter.format(v ?? 0);

const formatDate = (v: string | null | undefined) => {
    if (!v) return "-";
    return new Date(v).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

interface TableL11A2Props {
    data: L11A2Item[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L11A2Item) => void;
    onDelete: (id: string) => void;
}

export function TableL11A2({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL11A2Props) {
    const totalAmount = data.reduce((sum, i) => sum + (i.amount ?? 0), 0);

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
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Tempat</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead>Nama Penerima</TableHead>
                        <TableHead>Jabatan</TableHead>
                        <TableHead>Nama Perusahaan</TableHead>
                        <TableHead>Jenis Usaha</TableHead>
                        <TableHead>Keterangan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={13} className="text-center text-sm text-muted-foreground h-24">
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
                                <TableCell>{formatDate(item.date)}</TableCell>
                                <TableCell>{item.place || "-"}</TableCell>
                                <TableCell>{item.address || "-"}</TableCell>
                                <TableCell>{item.type || "-"}</TableCell>
                                <TableCell className="text-right">{formatMoney(item.amount)}</TableCell>
                                <TableCell>{item.name || "-"}</TableCell>
                                <TableCell>{item.position || "-"}</TableCell>
                                <TableCell>{item.company_name || "-"}</TableCell>
                                <TableCell>{item.business_type || "-"}</TableCell>
                                <TableCell>{item.notes || "-"}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {data.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={7} className="text-right font-semibold">Total</TableCell>
                            <TableCell className="text-right font-semibold">{formatMoney(totalAmount)}</TableCell>
                            <TableCell colSpan={5} />
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}

export default TableL11A2;
