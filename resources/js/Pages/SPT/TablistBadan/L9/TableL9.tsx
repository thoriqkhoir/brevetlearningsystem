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
import { L9Item } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const formatDate = (value: string | null | undefined) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

interface TableL9Props {
    data: L9Item[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L9Item) => void;
    onDelete: (id: string) => void;
}

export function TableL9({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL9Props) {
    const totalCost = data.reduce(
        (sum, item) => sum + (item.cost_aquisition ?? 0),
        0,
    );
    const totalResidual = data.reduce(
        (sum, item) => sum + (item.residual_value ?? 0),
        0,
    );
    const totalDepreciation = data.reduce(
        (sum, item) => sum + (item.depreciation_this_year ?? 0),
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
                        <TableHead>Kode Harta</TableHead>
                        <TableHead>Jenis Harta</TableHead>
                        <TableHead>Tgl Perolehan</TableHead>
                        <TableHead className="text-right">Harga Perolehan</TableHead>
                        <TableHead className="text-right">Nilai Sisa</TableHead>
                        <TableHead>Metode Komersial</TableHead>
                        <TableHead>Metode Fiskal</TableHead>
                        <TableHead className="text-right">Penyusutan Tahun Ini</TableHead>
                        <TableHead>Keterangan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={12}
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
                                <TableCell>{item.treasure_code}</TableCell>
                                <TableCell>{item.treasure_type}</TableCell>
                                <TableCell>{formatDate(item.period_aquisition)}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.cost_aquisition)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.residual_value)}
                                </TableCell>
                                <TableCell>
                                    {item.comercial_depreciation_method ?? "-"}
                                </TableCell>
                                <TableCell>
                                    {item.fiscal_depreciation_method ?? "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.depreciation_this_year)}
                                </TableCell>
                                <TableCell>{item.note ?? "-"}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6} className="font-semibold">
                            JUMLAH
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalCost)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalResidual)}
                        </TableCell>
                        <TableCell colSpan={2} />
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalDepreciation)}
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL9;
