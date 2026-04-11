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
import { L7Item } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

interface TableL7Props {
    data: L7Item[];
    taxYear: number;
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L7Item) => void;
    onDelete: (id: string) => void;
}

export function TableL7({
    data,
    taxYear,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL7Props) {
    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < data.length;

    const yearY4 = taxYear - 4;
    const yearY3 = taxYear - 3;
    const yearY2 = taxYear - 2;
    const yearY1 = taxYear - 1;
    const totalTahunPajakIni = data.reduce(
        (sum, item) => sum + Number(item.current_tax_year ?? 0),
        0,
    );
    const totalTahunPajakBerjalan = data.reduce(
        (sum, item) => sum + Number(item.year_now ?? 0),
        0,
    );

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
        <div className="w-full overflow-x-auto border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead
                            rowSpan={2}
                            className="w-[50px] text-center align-middle"
                        >
                            <Checkbox
                                checked={
                                    allSelected ||
                                    (someSelected && "indeterminate")
                                }
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="w-[50px] text-center align-middle"
                        >
                            No
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="w-[80px] text-center align-middle"
                        >
                            Aksi
                        </TableHead>
                        <TableHead colSpan={2} className="text-center">
                            LABA (RUGI) NETO FISKAL
                        </TableHead>
                        <TableHead colSpan={6} className="text-center">
                            KOMPENSASI KERUGIAN FISKAL
                        </TableHead>
                    </TableRow>
                    <TableRow className="bg-gray-100">
                        <TableHead className="text-center">
                            TAHUN/BAGIAN TAHUN PAJAK
                        </TableHead>
                        <TableHead className="text-center">
                            NILAI (Rp)
                        </TableHead>
                        <TableHead className="text-center">
                            NILAI (Rp)
                            <br />
                            TAHUN {yearY4}
                        </TableHead>
                        <TableHead className="text-center">
                            NILAI (Rp)
                            <br />
                            TAHUN {yearY3}
                        </TableHead>
                        <TableHead className="text-center">
                            NILAI (Rp)
                            <br />
                            TAHUN {yearY2}
                        </TableHead>
                        <TableHead className="text-center">
                            NILAI (Rp)
                            <br />
                            TAHUN {yearY1}
                        </TableHead>
                        <TableHead className="text-center">
                            TAHUN PAJAK INI ({taxYear})
                        </TableHead>
                        <TableHead className="text-center">
                            TAHUN PAJAK BERJALAN ({taxYear + 1})
                        </TableHead>
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
                                <TableCell>
                                    {item.tax_year_part ?? "-"}
                                </TableCell>
                                <TableCell>
                                    {rupiahFormatter.format(item.amount)}
                                </TableCell>
                                <TableCell>
                                    {rupiahFormatter.format(item.fourth_year)}
                                </TableCell>
                                <TableCell>
                                    {rupiahFormatter.format(item.third_year)}
                                </TableCell>
                                <TableCell>
                                    {rupiahFormatter.format(item.second_year)}
                                </TableCell>
                                <TableCell>
                                    {rupiahFormatter.format(item.first_year)}
                                </TableCell>
                                <TableCell>
                                    {rupiahFormatter.format(
                                        item.current_tax_year,
                                    )}
                                </TableCell>
                                <TableCell>
                                    {rupiahFormatter.format(item.year_now)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {data.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                className="font-semibold text-center"
                            >
                                JUMLAH
                            </TableCell>
                            <TableCell className="font-semibold text-right">
                                {rupiahFormatter.format(totalTahunPajakIni)}
                            </TableCell>
                            <TableCell className="font-semibold text-right">
                                {rupiahFormatter.format(
                                    totalTahunPajakBerjalan,
                                )}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}

export default TableL7;
