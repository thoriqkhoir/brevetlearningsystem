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
import { L1EItem, L1E_TAX_TYPE_OPTIONS } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const taxTypeLabel = (value: string) =>
    L1E_TAX_TYPE_OPTIONS.find((opt) => opt.value === value)?.label || value;

interface TableL1EProps {
    data: L1EItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L1EItem) => void;
    onDelete: (id: string) => void;
}

export function TableL1E({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL1EProps) {
    const totalPenghasilanBruto = data.reduce(
        (sum, item) => sum + (item.gross_income ?? 0),
        0,
    );
    const totalPphDipungut = data.reduce(
        (sum, item) => sum + (item.amount ?? 0),
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
                        <TableHead className="w-[60px]">No.</TableHead>
                        <TableHead className="w-[80px]">Tindakan</TableHead>
                        <TableHead>Nama Pemotong/Pemungut PPh</TableHead>
                        <TableHead>NPWP Pemotong/Pemungut PPh</TableHead>
                        <TableHead>Nomor Bukti Pemotongan/Pemungutan</TableHead>
                        <TableHead>
                            Tanggal Bukti Pemotongan/Pemungutan
                        </TableHead>
                        <TableHead>Jenis Pajak</TableHead>
                        <TableHead className="text-right">
                            Penghasilan Bruto
                        </TableHead>
                        <TableHead className="text-right">
                            PPh yang Dipotong/Dipungut
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                className="text-center text-sm text-muted-foreground h-24"
                            >
                                Tidak ada data yang ditemukan.
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
                                    {item.tax_withholder_name}
                                </TableCell>
                                <TableCell>{item.tax_withholder_id}</TableCell>
                                <TableCell>
                                    {item.tax_withholder_slip_number}
                                </TableCell>
                                <TableCell>
                                    {formatDate(item.tax_withholder_slip_date)}
                                </TableCell>
                                <TableCell>
                                    {item.tax_type
                                        ? taxTypeLabel(item.tax_type)
                                        : ""}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.gross_income)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.amount)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={8} className="font-semibold">
                            JUMLAH BAGIAN E
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalPenghasilanBruto)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalPphDipungut)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL1E;
