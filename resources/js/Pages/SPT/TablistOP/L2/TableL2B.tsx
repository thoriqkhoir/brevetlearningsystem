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
import { useMemo, useState } from "react";
import type { L2BItem } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

interface TableL2BProps {
    data: L2BItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L2BItem) => void;
    onDelete: (id: string) => void;
}

export function TableL2B({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL2BProps) {
    const [filterCode, setFilterCode] = useState("");
    const [filterIncomeType, setFilterIncomeType] = useState("");
    const [filterNpwp, setFilterNpwp] = useState("");
    const [filterName, setFilterName] = useState("");

    const rows = useMemo(() => {
        const code = filterCode.trim().toLowerCase();
        const incomeType = filterIncomeType.trim().toLowerCase();
        const npwp = filterNpwp.trim();
        const name = filterName.trim().toLowerCase();

        return data.filter((item) => {
            if (code && !(item.code ?? "").toLowerCase().includes(code))
                return false;
            if (
                incomeType &&
                !(item.income_type ?? "").toLowerCase().includes(incomeType)
            )
                return false;
            if (npwp && !(item.npwp ?? "").includes(npwp)) return false;
            if (name && !(item.name ?? "").toLowerCase().includes(name))
                return false;
            return true;
        });
    }, [data, filterCode, filterIncomeType, filterNpwp, filterName]);

    const totalGross = useMemo(() => {
        return rows.reduce(
            (sum, item) => sum + Number(item.gross_income ?? 0),
            0,
        );
    }, [rows]);

    const allSelected = rows.length > 0 && selectedIds.length === rows.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < rows.length;

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectChange(rows.map((item) => item.id!).filter(Boolean));
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

    const headerClass = "text-black font-semibold";

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            rowSpan={2}
                            className={`w-[50px] ${headerClass}`}
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
                            className={`w-[60px] ${headerClass}`}
                        >
                            No.
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className={`w-[80px] ${headerClass}`}
                        >
                            Aksi
                        </TableHead>
                        <TableHead rowSpan={2} className={headerClass}>
                            Kode
                        </TableHead>
                        <TableHead rowSpan={2} className={headerClass}>
                            Jenis Penghasilan
                        </TableHead>
                        <TableHead
                            colSpan={2}
                            className={`${headerClass} text-center`}
                        >
                            Sumber Penghasilan
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className={`${headerClass} text-right`}
                        >
                            Penghasilan Bruto
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className={headerClass}>NIK/NPWP</TableHead>
                        <TableHead className={headerClass}>Nama</TableHead>
                    </TableRow>

                    <TableRow>
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white">
                            <Input
                                value={filterCode}
                                onChange={(e) => setFilterCode(e.target.value)}
                                placeholder="Cari..."
                                className="h-8"
                            />
                        </TableHead>
                        <TableHead className="bg-white">
                            <Input
                                value={filterIncomeType}
                                onChange={(e) =>
                                    setFilterIncomeType(e.target.value)
                                }
                                placeholder="Cari..."
                                className="h-8"
                            />
                        </TableHead>
                        <TableHead className="bg-white">
                            <Input
                                value={filterNpwp}
                                onChange={(e) =>
                                    setFilterNpwp(
                                        e.target.value
                                            .replace(/[^0-9]/g, "")
                                            .slice(0, 16),
                                    )
                                }
                                placeholder="Cari..."
                                className="h-8"
                                inputMode="numeric"
                            />
                        </TableHead>
                        <TableHead className="bg-white">
                            <Input
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                placeholder="Cari..."
                                className="h-8"
                            />
                        </TableHead>
                        <TableHead className="bg-white" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="text-center text-sm text-muted-foreground h-24"
                            >
                                Tidak ada data untuk ditampilkan.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((item, idx) => (
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
                                <TableCell>{item.income_type ?? ""}</TableCell>
                                <TableCell>{item.npwp ?? ""}</TableCell>
                                <TableCell>{item.name ?? ""}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.gross_income)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}

                    <TableRow>
                        <TableCell
                            colSpan={7}
                            className="text-right font-semibold"
                        >
                            JUMLAH TABEL B
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalGross)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

export default TableL2B;
