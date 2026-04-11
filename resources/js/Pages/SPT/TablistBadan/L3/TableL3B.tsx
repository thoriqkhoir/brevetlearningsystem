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
import { L3BItem, TAX_TYPE_OPTIONS } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const getTaxTypeLabel = (value: string | null) =>
    TAX_TYPE_OPTIONS.find((o) => o.value === value)?.label || value || "-";

interface TableL3BProps {
    data: L3BItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L3BItem) => void;
    onDelete: (id: string) => void;
}

export function TableL3B({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL3BProps) {
    const totalDpp = data.reduce((sum, item) => sum + (item.dpp ?? 0), 0);
    const totalIncomeTax = data.reduce(
        (sum, item) => sum + (item.income_tax ?? 0),
        0,
    );
    const totalKreditPajak = totalDpp + totalIncomeTax;

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
                            className="w-[80px] text-center align-middle"
                        >
                            Aksi
                        </TableHead>
                        <TableHead colSpan={2} className="text-center">
                            PEMOTONG/PEMUNGUT PAJAK
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="text-center align-middle"
                        >
                            JENIS PAJAK
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="text-center align-middle"
                        >
                            DASAR PENGENAAN PAJAK (Rp)
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="text-center align-middle"
                        >
                            PPh YANG DIPOTONG/DIPUNGUT (Rp)
                        </TableHead>
                        <TableHead colSpan={2} className="text-center">
                            BUKTI PEMOTONGAN/SSP/SSPCP
                        </TableHead>
                    </TableRow>
                    <TableRow className="bg-gray-100">
                        <TableHead className="text-center">NAMA</TableHead>
                        <TableHead className="text-center">NPWP</TableHead>
                        <TableHead className="text-center">NOMOR</TableHead>
                        <TableHead className="text-center">TANGGAL</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={9}
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
                                <TableCell>{item.npwp ?? "-"}</TableCell>
                                <TableCell>
                                    {getTaxTypeLabel(item.tax_type)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.dpp)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.income_tax)}
                                </TableCell>
                                <TableCell>
                                    {item.number_of_provement ?? "-"}
                                </TableCell>
                                <TableCell>
                                    {item.date_of_provement ?? "-"}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5} className="font-semibold">
                            JUMLAH
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalDpp)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalIncomeTax)}
                        </TableCell>
                        <TableCell colSpan={2} />
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={6} className="font-semibold">
                            JUMLAH KREDIT PAJAK
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalKreditPajak)}
                        </TableCell>
                        <TableCell colSpan={2} />
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL3B;
