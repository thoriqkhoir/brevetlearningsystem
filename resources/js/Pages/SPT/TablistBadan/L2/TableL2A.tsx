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
import { L2AItem } from "./types";
import { countries } from "@/data/spt-op-data";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const getCountryLabel = (code: string) =>
    countries.find((c) => c.value === code)?.label || code;

interface TableL2AProps {
    data: L2AItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L2AItem) => void;
    onDelete: (id: string) => void;
}

export function TableL2A({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL2AProps) {
    const totalModal = data.reduce(
        (sum, item) => sum + (item.paid_up_capital_amount ?? 0),
        0,
    );
    const totalDividen = data.reduce(
        (sum, item) => sum + (item.dividen ?? 0),
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
                        <TableHead>Nama</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Negara</TableHead>
                        <TableHead>NPWP</TableHead>
                        <TableHead>Jabatan</TableHead>
                        <TableHead className="text-right">Modal Disetor</TableHead>
                        <TableHead className="text-right">Persentase (%)</TableHead>
                        <TableHead className="text-right">Dividen</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={11}
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
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.address}</TableCell>
                                <TableCell>
                                    {getCountryLabel(item.country)}
                                </TableCell>
                                <TableCell>{item.npwp}</TableCell>
                                <TableCell>{item.position}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.paid_up_capital_amount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.paid_up_capital_percentage != null
                                        ? `${item.paid_up_capital_percentage}%`
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.dividen)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={8} className="font-semibold">
                            JUMLAH
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalModal)}
                        </TableCell>
                        <TableCell />
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalDividen)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL2A;
