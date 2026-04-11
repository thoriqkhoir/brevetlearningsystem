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
import { L3DCItem } from "./types";

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

const renderFilterRow = (colCount: number) => (
    <TableRow>
        {Array.from({ length: colCount }).map((_, idx) => (
            <TableCell key={idx} className="p-2">
                <Input className="h-7" disabled value="" />
            </TableCell>
        ))}
    </TableRow>
);

export function TableL3DC({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: {
    data: L3DCItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L3DCItem) => void;
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

    const colCount = 9;

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
                            NAMA DEBITUR
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            ALAMAT DEBITUR
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            JUMLAH PIUTANG
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            PIUTANG TAK TERTAGIH
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            METODE PENGURANGAN
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            JENIS BUKTI
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
                                <TableCell>{item.debtor_name || "-"}</TableCell>
                                <TableCell>
                                    {item.debtor_address || "-"}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    {formatMoney(item.amount_of_debt)}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    {formatMoney(item.bad_debt)}
                                </TableCell>
                                <TableCell>
                                    {item.deduction_method || "-"}
                                </TableCell>
                                <TableCell>
                                    {item.type_of_proof || "-"}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
