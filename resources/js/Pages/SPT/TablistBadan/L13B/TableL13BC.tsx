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
import type { L13BCItem } from "./types";

const fmt = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
const formatMoney = (v: number | null | undefined) => fmt.format(v ?? 0);

interface TableL13BCProps {
    data: L13BCItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L13BCItem) => void;
    onDelete: (id: string) => void;
}

export function TableL13BC({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL13BCProps) {
    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectChange(data.map((d) => d.id!).filter(Boolean));
        } else {
            onSelectChange([]);
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            onSelectChange([...selectedIds, id]);
        } else {
            onSelectChange(selectedIds.filter((x) => x !== id));
        }
    };

    const totalAdditionalGrossIncome = data.reduce(
        (sum, d) => sum + Number(d.additional_gross_income ?? 0),
        0,
    );

    return (
        <div className="w-full overflow-x-auto">
            <Table className="text-xs border">
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="w-8 text-center border">
                            <Checkbox
                                checked={allSelected || (someSelected && "indeterminate")}
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead className="text-center border w-10">No</TableHead>
                        <TableHead className="text-center border w-16">Aksi</TableHead>
                        <TableHead className="text-center border">
                            NOMOR PROPOSAL
                            <br />
                            <span className="font-normal text-[10px]">(1)</span>
                        </TableHead>
                        <TableHead className="text-center border p-0">
                            <div className="font-semibold py-1">JANGKA WAKTU PENGELUARAN BIAYA</div>
                            <div className="flex border-t text-[10px]">
                                <span className="flex-1 text-center border-r py-1">DARI TAHUN (2)</span>
                                <span className="flex-1 text-center py-1">SAMPAI TAHUN (3)</span>
                            </div>
                        </TableHead>
                        <TableHead className="text-center border">
                            JUMLAH BIAYA
                            <br />
                            <span className="font-normal text-[10px]">(4)</span>
                        </TableHead>
                        <TableHead className="text-center border">
                            TAHUN PEROLEHAN
                            <br />
                            HAKI/KOMERSIALISASI
                            <br />
                            <span className="font-normal text-[10px]">(5)</span>
                        </TableHead>
                        <TableHead className="text-center border">
                            PERSENTASE
                            <br />
                            FASILITAS
                            <br />
                            <span className="font-normal text-[10px]">(6)</span>
                        </TableHead>
                        <TableHead className="text-center border">
                            TAMBAHAN PENGURANGAN
                            <br />
                            PENGHASILAN BRUTO
                            <br />
                            PENELITIAN DAN
                            <br />
                            PENGEMBANGAN
                            <br />
                            <span className="font-normal text-[10px]">(7)</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                className="text-center text-muted-foreground py-4 text-sm"
                            >
                                Belum ada data.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, idx) => (
                            <TableRow key={item.id ?? idx}>
                                <TableCell className="text-center border">
                                    <Checkbox
                                        checked={selectedIds.includes(item.id!)}
                                        onCheckedChange={(checked) =>
                                            handleSelectOne(item.id!, !!checked)
                                        }
                                    />
                                </TableCell>
                                <TableCell className="text-center border">{idx + 1}</TableCell>
                                <TableCell className="border">
                                    <div className="flex justify-center gap-1">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7"
                                            onClick={() => onEdit(item)}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-red-500 hover:text-red-600"
                                            onClick={() => onDelete(item.id!)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="border">
                                    {item.proposal_number ?? "-"}
                                </TableCell>
                                <TableCell className="border p-0">
                                    <div className="flex">
                                        <span className="flex-1 border-r px-2 py-2 text-center">
                                            {item.expenses_start_period ?? "-"}
                                        </span>
                                        <span className="flex-1 px-2 py-2 text-center">
                                            {item.expenses_end_period ?? "-"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="border text-right">
                                    {formatMoney(item.total_cost)}
                                </TableCell>
                                <TableCell className="border text-center">
                                    {item.year_acquisition ?? "-"}
                                </TableCell>
                                <TableCell className="border text-center">
                                    {item.facilities_percentage ?? 0}%
                                </TableCell>
                                <TableCell className="border text-right">
                                    {formatMoney(Number(item.additional_gross_income ?? 0))}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={8} className="font-semibold text-center">
                            JUMLAH TAMBAHAN PENGURANGAN PENGHASILAN BRUTO PENELITIAN DAN PENGEMBANGAN
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalAdditionalGrossIncome)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL13BC;
