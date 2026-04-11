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
import { L10AItem } from "./types";
import { countries } from "@/data/spt-op-data";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const getCountryLabel = (code: string | null) =>
    countries.find((c) => c.value === code)?.label || code || "-";

interface TableL10AProps {
    data: L10AItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L10AItem) => void;
    onDelete: (id: string) => void;
}

export function TableL10A({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL10AProps) {
    const totalValue = data.reduce(
        (sum, item) => sum + (item.transaction_value ?? 0),
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
                        <TableHead>NPWP</TableHead>
                        <TableHead>Negara</TableHead>
                        <TableHead>Hubungan Istimewa</TableHead>
                        <TableHead>Kegiatan Usaha</TableHead>
                        <TableHead>Jenis Transaksi</TableHead>
                        <TableHead className="text-right">Nilai Transaksi</TableHead>
                        <TableHead>Metode TP</TableHead>
                        <TableHead>Alasan Penggunaan</TableHead>
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
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.npwp}</TableCell>
                                <TableCell>{getCountryLabel(item.country)}</TableCell>
                                <TableCell>{item.relationship ?? "-"}</TableCell>
                                <TableCell>{item.business_activities ?? "-"}</TableCell>
                                <TableCell>{item.transaction_type ?? "-"}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.transaction_value)}
                                </TableCell>
                                <TableCell>{item.transfer_pricing_method ?? "-"}</TableCell>
                                <TableCell>{item.reason_using_method ?? "-"}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={9} className="font-semibold">
                            JUMLAH
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalValue)}
                        </TableCell>
                        <TableCell colSpan={2} />
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL10A;
