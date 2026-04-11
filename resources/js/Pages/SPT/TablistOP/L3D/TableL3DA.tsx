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
import { L3DAItem } from "./types";

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

export function TableL3DA({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: {
    data: L3DAItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L3DAItem) => void;
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

    const colCount = 12;

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
                            TANGGAL
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            TEMPAT
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            ALAMAT
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            JENIS ENTERTAINMENT
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            JUMLAH (RP)
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            PIHAK RELASI
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            JABATAN
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            NAMA PERUSAHAAN
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            JENIS USAHA
                        </TableHead>
                        <TableHead className="text-center text-xs">
                            KETERANGAN
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
                                    {formatDate(item.entertainment_date)}
                                </TableCell>
                                <TableCell>
                                    {item.entertainment_location || "-"}
                                </TableCell>
                                <TableCell>{item.address || "-"}</TableCell>
                                <TableCell>
                                    {item.entertainment_type || "-"}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    {formatMoney(item.entertainment_amount)}
                                </TableCell>
                                <TableCell>
                                    {item.related_party || "-"}
                                </TableCell>
                                <TableCell>{item.position || "-"}</TableCell>
                                <TableCell>
                                    {item.company_name || "-"}
                                </TableCell>
                                <TableCell>
                                    {item.business_type || "-"}
                                </TableCell>
                                <TableCell>{item.notes || "-"}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
