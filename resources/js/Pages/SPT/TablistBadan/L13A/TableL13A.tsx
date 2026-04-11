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
import type { L13AItem } from "./types";

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

interface TableL13AProps {
    data: L13AItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L13AItem) => void;
    onDelete: (id: string) => void;
}

export function TableL13A({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL13AProps) {
    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < data.length;

    const totalInForeign = data.reduce(
        (s, i) => s + (i.amount_capital_naming_in_foreign ?? 0),
        0,
    );
    const totalEquivalen = data.reduce(
        (s, i) => s + (i.amount_capital_naming_equivalen ?? 0),
        0,
    );
    const totalInRupiah = data.reduce(
        (s, i) => s + (i.amount_capital_naming_in_rupiah ?? 0),
        0,
    );
    const totalCapital = data.reduce(
        (s, i) => s + (i.amount_capital_naming_total ?? 0),
        0,
    );
    const totalRealization = data.reduce(
        (s, i) => s + (i.realization_capital_naming_acumulation ?? 0),
        0,
    );
    const totalReducerAmount = data.reduce(
        (s, i) => s + (i.reducer_net_income_amount ?? 0),
        0,
    );

    return (
        <div className="w-full overflow-x-auto border">
            <Table className="min-w-[2400px] text-xs">
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
                            className="border border-gray-300 text-center align-middle w-8"
                        >
                            No.
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
                            colSpan={4}
                            className="border border-gray-300 text-center"
                        >
                            JUMLAH PENANAMAN MODAL YANG DISETUJUI
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 text-center align-middle"
                        >
                            BENTUK PENANAMAN MODAL
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 text-center align-middle"
                        >
                            DI BIDANG DAN/ATAU DAERAH
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 text-center align-middle"
                        >
                            FASILITAS YANG DIBERIKAN
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 text-center align-middle"
                        >
                            PERSENTASE PENGURANGAN PENGHASILAN NETO
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 text-center align-middle"
                        >
                            PENAMBAHAN JANGKA WAKTU KOMPENSASI KERUGIAN
                        </TableHead>
                        <TableHead
                            colSpan={2}
                            className="border border-gray-300 text-center"
                        >
                            REALISASI PENANAMAN MODAL
                        </TableHead>
                        <TableHead
                            rowSpan={2}
                            className="border border-gray-300 text-center align-middle"
                        >
                            SAAT MULAI BERPRODUKSI KOMERSIAL
                        </TableHead>
                        <TableHead
                            colSpan={2}
                            className="border border-gray-300 text-center"
                        >
                            FASILITAS PENGURANGAN PENGHASILAN NETO
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
                            DALAM MATA UANG ASING
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            EKUIVALEN
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            DALAM RUPIAH
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            JUMLAH (Rp)
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            AKUMULASI S.D. TAHUN INI
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            PADA SAAT MULAI BERPRODUKSI KOMERSIAL
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            TAHUN KE-
                        </TableHead>
                        <TableHead className="border border-gray-300 text-center">
                            JUMLAH (Rp)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={21}
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
                                <TableCell className="border border-gray-200 text-center">
                                    {idx + 1}
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
                                    {item.decision_grant_facilities_number ??
                                        "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {formatDate(
                                        item.decision_grant_facilities_date,
                                    )}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.decision_utilization_facilities_number ??
                                        "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {formatDate(
                                        item.decision_utilization_facilities_date,
                                    )}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {formatMoney(
                                        item.amount_capital_naming_in_foreign,
                                    )}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {formatMoney(
                                        item.amount_capital_naming_equivalen,
                                    )}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {formatMoney(
                                        item.amount_capital_naming_in_rupiah,
                                    )}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {formatMoney(
                                        item.amount_capital_naming_total,
                                    )}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.capital_naming ?? "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.field ?? "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.facilities ?? "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {item.reduce_net_income_persentage ?? 0}%
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.additional_period ?? "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {formatMoney(
                                        item.realization_capital_naming_acumulation,
                                    )}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.realization_capital_naming_start_production ??
                                        "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    {item.start_comercial_production ?? "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-center">
                                    {item.reducer_net_income_year ?? "-"}
                                </TableCell>
                                <TableCell className="border border-gray-200 text-right">
                                    {formatMoney(
                                        item.reducer_net_income_amount,
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {data.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="border border-gray-300 text-center font-semibold"
                            >
                                JUMLAH FASILITAS PENGURANGAN PENGHASILAN NETO
                            </TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">
                                {formatMoney(totalInForeign)}
                            </TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">
                                {formatMoney(totalEquivalen)}
                            </TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">
                                {formatMoney(totalInRupiah)}
                            </TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">
                                {formatMoney(totalCapital)}
                            </TableCell>
                            <TableCell
                                colSpan={5}
                                className="border border-gray-300"
                            />
                            <TableCell className="border border-gray-300 text-right font-semibold">
                                {formatMoney(totalRealization)}
                            </TableCell>
                            <TableCell
                                colSpan={3}
                                className="border border-gray-300"
                            />
                            <TableCell className="border border-gray-300 text-right font-semibold">
                                {formatMoney(totalReducerAmount)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}
