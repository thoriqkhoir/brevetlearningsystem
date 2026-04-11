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
import type { L2AItem, MasterObjectOption } from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

interface TableL2AProps {
    data: L2AItem[];
    masterObjects: MasterObjectOption[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L2AItem) => void;
    onDelete: (id: string) => void;
}

export function TableL2A({
    data,
    masterObjects,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL2AProps) {
    const [filterNpwp, setFilterNpwp] = useState("");
    const [filterName, setFilterName] = useState("");
    const [filterObjectCode, setFilterObjectCode] = useState("");

    const rows = useMemo(() => {
        const npwp = filterNpwp.trim();
        const name = filterName.trim().toLowerCase();
        const code = filterObjectCode.trim().toLowerCase();

        return data.filter((item) => {
            const masterObject = masterObjects.find(
                (m) => Number(m.id) === Number(item.object_id),
            );
            const objectCode = (masterObject?.code ?? "").toLowerCase();
            const objectName = (masterObject?.name ?? "").toLowerCase();
            const withholderName = (
                item.tax_withholder_name ?? ""
            ).toLowerCase();

            if (npwp && !(item.tax_withholder_id ?? "").includes(npwp))
                return false;
            if (name && !withholderName.includes(name)) return false;
            if (
                code &&
                !objectCode.includes(code) &&
                !objectName.includes(code)
            )
                return false;

            return true;
        });
    }, [data, masterObjects, filterNpwp, filterName, filterObjectCode]);

    const totals = useMemo(() => {
        return rows.reduce(
            (acc, item) => {
                acc.dpp += Number(item.dpp ?? 0);
                acc.pph_owed += Number(item.pph_owed ?? 0);
                return acc;
            },
            { dpp: 0, pph_owed: 0 },
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
                        <TableHead className={`w-[50px] ${headerClass}`}>
                            <Checkbox
                                checked={
                                    allSelected ||
                                    (someSelected && "indeterminate")
                                }
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead className={`w-[60px] ${headerClass}`}>
                            No.
                        </TableHead>
                        <TableHead className={`w-[80px] ${headerClass}`}>
                            Aksi
                        </TableHead>
                        <TableHead className={headerClass}>
                            NPWP Pemotong/Pemungut
                        </TableHead>
                        <TableHead className={headerClass}>
                            Nama Pemotong/Pemungut
                        </TableHead>
                        <TableHead className={headerClass}>
                            Kode Objek Pajak
                        </TableHead>
                        <TableHead className={headerClass}>
                            Jenis Penghasilan
                        </TableHead>
                        <TableHead className={`${headerClass} text-right`}>
                            Dasar Pengenaan Pajak (Rupiah)
                        </TableHead>
                        <TableHead className={`${headerClass} text-right`}>
                            PPh Terutang
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white" />
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
                        <TableHead className="bg-white">
                            <Input
                                value={filterObjectCode}
                                onChange={(e) =>
                                    setFilterObjectCode(e.target.value)
                                }
                                placeholder="Cari..."
                                className="h-8"
                            />
                        </TableHead>
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white" />
                        <TableHead className="bg-white" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={9}
                                className="text-center text-sm text-muted-foreground h-24"
                            >
                                Tidak ada data yang ditemukan.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((item, idx) => {
                            const masterObject = masterObjects.find(
                                (m) => Number(m.id) === Number(item.object_id),
                            );

                            return (
                                <TableRow key={item.id ?? idx}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                item.id!,
                                            )}
                                            onCheckedChange={(checked) =>
                                                handleSelectOne(
                                                    item.id!,
                                                    !!checked,
                                                )
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
                                                onClick={() =>
                                                    onDelete(item.id!)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.tax_withholder_id}
                                    </TableCell>
                                    <TableCell>
                                        {item.tax_withholder_name}
                                    </TableCell>
                                    <TableCell>
                                        {masterObject?.code ?? ""}
                                    </TableCell>
                                    <TableCell>
                                        {masterObject?.name ?? ""}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatMoney(item.dpp)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatMoney(item.pph_owed)}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}

                    <TableRow>
                        <TableCell
                            colSpan={7}
                            className="text-right font-semibold"
                        >
                            JUMLAH TABEL A
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totals.dpp)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totals.pph_owed)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

export default TableL2A;
