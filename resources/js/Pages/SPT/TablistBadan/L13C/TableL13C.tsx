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
import type { L13CItem } from "./types";

const fmt = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
const formatMoney = (v: number | null | undefined) => fmt.format(v ?? 0);

const formatDate = (d: string | null | undefined) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

interface TableL13CProps {
    data: L13CItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L13CItem) => void;
    onDelete: (id: string) => void;
}

export function TableL13C({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL13CProps) {
    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < data.length;

    const totalTaxableIncome = data.reduce(
        (s, i) => s + (i.taxable_income ?? 0),
        0,
    );
    const totalPphPayable = data.reduce((s, i) => s + (i.pph_payable ?? 0), 0);
    const totalFacilitiesAmount = data.reduce(
        (s, i) => s + (i.facilities_amount ?? 0),
        0,
    );

    return (
        <div className="w-full overflow-x-auto border">
            <Table className="min-w-[1600px] text-xs">
                <TableHeader>
                    {/* Row 1 - Group headers */}
                    <TableRow className="bg-gray-100">
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 w-8 text-center align-middle"
                        >
                            <Checkbox
                                checked={
                                    allSelected ||
                                    (someSelected ? "indeterminate" : false)
                                }
                                onCheckedChange={(c) =>
                                    onSelectChange(
                                        c
                                            ? data
                                                  .map((i) => i.id!)
                                                  .filter(Boolean)
                                            : [],
                                    )
                                }
                            />
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 text-center align-middle w-16"
                        >
                            Aksi
                        </TableHead>
                        <TableHead
                            colSpan={2}
                            className="border border-gray-300 text-center"
                        >
                            KEPUTUSAN ATAU PEMBERITAHUAN PEMBERIAN FASILITAS
                        </TableHead>
                        <TableHead
                            colSpan={2}
                            className="border border-gray-300 text-center"
                        >
                            KEPUTUSAN PEMANFAATAN FASILITAS
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 text-center align-middle"
                        >
                            PERIODE FASILITAS
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 text-center align-middle"
                        >
                            TAHUN PEMANFAATAN
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 text-center align-middle"
                        >
                            PERSENTASE PENGURANGAN PPH (%)
                        </TableHead>
                        <TableHead
                            colSpan={3}
                            className="border border-gray-300 text-center"
                        >
                            FASILITAS PENGURANGAN PPH BADAN
                        </TableHead>
                    </TableRow>
                    <TableRow className="bg-gray-100">
                        <TableHead className="border border-gray-300 text-center">
                            NOMOR
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            TANGGAL
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            NOMOR
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            TANGGAL
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            PENGHASILAN KENA PAJAK (Rp)
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            PPH TERUTANG (Rp)
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            JUMLAH FASILITAS (Rp)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={13}
                                className="text-center text-muted-foreground h-16"
                            >
                                Belum ada data.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, idx) => (
                            <TableRow key={item.id ?? idx}>
                                <TableCell className="border border-gray-200">
                                    <Checkbox
                                        checked={selectedIds.includes(item.id!)}
                                        onCheckedChange={(c) =>
                                            onSelectChange(
                                                c
                                                    ? [...selectedIds, item.id!]
                                                    : selectedIds.filter(
                                                          (x) => x !== item.id!,
                                                      ),
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    <div className="flex gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7"
                                            onClick={() => onEdit(item)}
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-red-500"
                                            onClick={() => onDelete(item.id!)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.grant_facilities_number ?? "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {formatDate(item.grant_facilities_date)}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.utilization_facilities_number ?? "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {formatDate(
                                        item.utilization_facilities_date,
                                    )}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.facilities_period ?? "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.utilization_year ?? "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {item.pph_reducer_percentage ?? 0}%
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {formatMoney(item.taxable_income)}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {formatMoney(item.pph_payable)}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {formatMoney(item.facilities_amount)}
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
                                className="border border-gray-300 text-center font-semibold"
                            >
                                JUMLAH FASILITAS PENGURANGAN PPH BADAN
                            </TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">
                                {formatMoney(totalTaxableIncome)}
                            </TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">
                                {formatMoney(totalPphPayable)}
                            </TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">
                                {formatMoney(totalFacilitiesAmount)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}
