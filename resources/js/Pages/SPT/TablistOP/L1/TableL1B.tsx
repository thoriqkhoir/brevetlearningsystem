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
import { countries } from "@/data/spt-op-data";
import { Pencil, Trash2 } from "lucide-react";
import { L1BItem, NOTES_OPTIONS } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const getCountryLabel = (value: string) =>
    countries.find((c) => c.value === value)?.label || value;

const getNotesLabel = (value: string) =>
    NOTES_OPTIONS.find((opt) => opt.value === value)?.label || value;

interface TableL1BProps {
    data: L1BItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L1BItem) => void;
    onDelete: (id: string) => void;
}

export function TableL1B({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL1BProps) {
    const totalSaldo = data.reduce((sum, item) => sum + (item.balance ?? 0), 0);

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
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead className="w-[80px]">Aksi</TableHead>
                        <TableHead>Kode</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Nomor Identitas WP</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Negara Kreditur</TableHead>
                        <TableHead>Tahun Peminjaman</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                        <TableHead>Keterangan</TableHead>
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
                                <TableCell>{item.code}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.creditor_id}</TableCell>
                                <TableCell>{item.creditor_name}</TableCell>
                                <TableCell>
                                    {item.creditor_country
                                        ? getCountryLabel(item.creditor_country)
                                        : ""}
                                </TableCell>
                                <TableCell>{item.loan_year}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.balance)}
                                </TableCell>
                                <TableCell>
                                    {item.notes
                                        ? getNotesLabel(item.notes)
                                        : ""}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={9} className="font-semibold">
                            JUMLAH BAGIAN B
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalSaldo)}
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL1B;
