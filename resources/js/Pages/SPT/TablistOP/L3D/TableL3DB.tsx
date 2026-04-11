import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { L3DBItem } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const toNumber = (value: unknown) => {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
};

const formatMoney = (value: unknown) => rupiahFormatter.format(toNumber(value));

const formatDate = (value: unknown) => {
    if (!value) return "-";
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return String(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const renderFilterRow = (colCount: number) => (
    <TableRow>
        {Array.from({ length: colCount }).map((_, idx) => (
            <TableCell key={idx} className="p-2">
                <Input className="h-7" disabled value="" />
            </TableCell>
        ))}
    </TableRow>
);

export function TableL3DB({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: {
    data: L3DBItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L3DBItem) => void;
    onDelete: (id: string) => void;
}) {
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

    const colCount = 11;

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
                        <TableHead className="text-center text-xs w-[90px]">
                            TINDAKAN
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            NPWP
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            NAMA
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            ALAMAT
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            TANGGAL
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            JENIS BIAYA
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            JUMLAH (RP)
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            KETERANGAN
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            PPh DIPOTONG
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            NO. BUKTI POTONG
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {renderFilterRow(colCount)}
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={colCount}
                                className="text-center text-sm text-muted-foreground h-20"
                            >
                                Tidak ada data yang ditemukan.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, idx) => (
                            <TableRow key={item.id ?? idx}>
                                <TableCell>
                                    <Checkbox
                                        checked={
                                            !!item.id &&
                                            selectedIds.includes(item.id)
                                        }
                                        onCheckedChange={(checked) =>
                                            item.id &&
                                            handleSelectOne(item.id, !!checked)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1 justify-center">
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
                                            onClick={() =>
                                                item.id && onDelete(item.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {item.npwp || "-"}
                                </TableCell>
                                <TableCell>{item.name || "-"}</TableCell>
                                <TableCell>{item.address || "-"}</TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {formatDate(item.date)}
                                </TableCell>
                                <TableCell>
                                    {item.type_of_cost || "-"}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    {formatMoney(item.amount)}
                                </TableCell>
                                <TableCell>{item.notes || "-"}</TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    {formatMoney(item.income_tax_with_holding)}
                                </TableCell>
                                <TableCell>
                                    {item.with_holding_slip_number || "-"}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
