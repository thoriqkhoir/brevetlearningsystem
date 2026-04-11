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
import { L4AItem } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const formatRate = (value: number | null | undefined) =>
    `${value ?? 0}%`;

interface TableL4AProps {
    data: L4AItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L4AItem) => void;
    onDelete: (id: string) => void;
}

export function TableL4A({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL4AProps) {
    const totalDpp = data.reduce((sum, item) => sum + (item.dpp ?? 0), 0);
    const totalPphPayable = data.reduce(
        (sum, item) => sum + (item.pph_payable ?? 0),
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
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={
                                    allSelected ||
                                    (someSelected && "indeterminate")
                                }
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead className="w-[80px]">Aksi</TableHead>
                        <TableHead>NPWP</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kode Objek Pajak</TableHead>
                        <TableHead>Nama Objek Pajak</TableHead>
                        <TableHead className="text-right">DPP</TableHead>
                        <TableHead className="text-right">Tarif</TableHead>
                        <TableHead className="text-right">PPh Terutang</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={10}
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
                                <TableCell>{item.npwp}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.tax_object_code ?? "-"}</TableCell>
                                <TableCell>{item.tax_object_name ?? "-"}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.dpp)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatRate(item.rate)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.pph_payable)}
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
                            {formatMoney(totalDpp)}
                        </TableCell>
                        <TableCell />
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalPphPayable)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL4A;
