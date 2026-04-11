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
import type { L14Item } from "./types";

const fmt = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
const formatMoney = (v: number | null | undefined) => fmt.format(v ?? 0);

interface TableL14Props {
    data: L14Item[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L14Item) => void;
    onDelete: (id: string) => void;
}

export function TableL14({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL14Props) {
    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

    // Footer totals
    const totalUnreplaced     = data.reduce((s, i) => s + (i.unreplaced_excess ?? 0), 0);             // a — col (9)
    const totalSurplus        = data.reduce((s, i) => s + (i.surplus_year_replanting_period ?? 0), 0); // b — col (10)
    const sisaLebihDigunakanKembali = totalUnreplaced - totalSurplus;

    return (
        <div className="w-full overflow-x-auto border">
            <Table className="min-w-[2000px] text-xs">
                <TableHeader>
                    {/* Row 1 */}
                    <TableRow className="bg-gray-100">
                        <TableHead rowSpan={3} className="border border-gray-300 w-8 text-center align-middle">
                            <Checkbox
                                checked={allSelected || (someSelected ? "indeterminate" : false)}
                                onCheckedChange={(c) =>
                                    onSelectChange(c ? data.map((i) => i.id!).filter(Boolean) : [])
                                }
                            />
                        </TableHead>
                        <TableHead rowSpan={3} className="border border-gray-300 text-center align-middle w-16">Aksi</TableHead>
                        <TableHead rowSpan={3} className="border border-gray-300 text-center align-middle">
                            TAHUN PAJAK/BAGIAN<br />TAHUN PAJAK<br />(1)
                        </TableHead>
                        <TableHead rowSpan={3} className="border border-gray-300 text-center align-middle">
                            PENYEDIAAN SISA LEBIH<br />UNTUK DITANAMKAN KEMBALI<br />SELAMA 4 TAHUN<br />(Rp)<br />(2)
                        </TableHead>
                        <TableHead rowSpan={3} className="border border-gray-300 text-center align-middle">
                            BENTUK PENANAMAN<br />KEMBALI<br />SISA LEBIH<br />(3)
                        </TableHead>
                        <TableHead colSpan={4} className="border border-gray-300 text-center">
                            PENGGUNAAN SISA LEBIH UNTUK PEMBANGUNAN DAN<br />PENGADAAN SARANA DAN PRASARANA
                        </TableHead>
                        <TableHead rowSpan={3} className="border border-gray-300 text-center align-middle">
                            JUMLAH PENGGUNAAN<br />SISA LEBIH<br />(Rp)<br />(8)
                        </TableHead>
                        <TableHead rowSpan={3} className="border border-gray-300 text-center align-middle">
                            SISA LEBIH YANG BELUM<br />DITANAMKAN KEMBALI<br />(Rp)<br />(9)
                        </TableHead>
                        <TableHead rowSpan={3} className="border border-gray-300 text-center align-middle">
                            SISA LEBIH YANG<br />MELEWATI JANGKA WAKTU<br />PENANAMAN KEMBALI<br />DALAM JANGKA<br />WAKTU 4 TAHUN<br />(Rp)<br />(10)
                        </TableHead>
                    </TableRow>
                    {/* Row 2 */}
                    <TableRow className="bg-gray-100">
                        <TableHead className="border border-gray-300 text-center">TAHUN KE-1<br />(Rp)<br />(4)</TableHead>
                        <TableHead className="border border-gray-300 text-center">TAHUN KE-2<br />(Rp)<br />(5)</TableHead>
                        <TableHead className="border border-gray-300 text-center">TAHUN KE-3<br />(Rp)<br />(6)</TableHead>
                        <TableHead className="border border-gray-300 text-center">TAHUN KE-4<br />(Rp)<br />(7)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={13} className="text-center text-muted-foreground h-16">
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
                                                    : selectedIds.filter((x) => x !== item.id!),
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell className="border border-gray-200">
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(item)}>
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => onDelete(item.id!)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="border border-gray-200">{item.tax_year ?? "-"}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.provision_remaining)}</TableCell>
                                <TableCell className="border border-gray-200">{item.replanting_form_surfer ?? "-"}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.year_1)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.year_2)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.year_3)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.year_4)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.remaining_amount)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.unreplaced_excess)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.surplus_year_replanting_period)}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={9} className="border border-gray-300 text-center font-semibold">
                            JUMLAH
                        </TableCell>
                        <TableCell className="border border-gray-300" />
                        <TableCell className="border border-gray-300 text-right font-semibold ">
                            {formatMoney(totalUnreplaced)} <span className="ml-1 text-yellow-700 font-bold"></span>
                        </TableCell>
                        <TableCell className="border border-gray-300 text-right font-semibold ">
                            {formatMoney(totalSurplus)} <span className="ml-1 text-yellow-700 font-bold"></span>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={9} className="border border-gray-300 text-center font-semibold">
                            SISA LEBIH YANG DAPAT DIGUNAKAN KEMBALI
                        </TableCell>
                        <TableCell className="border border-gray-300 text-center font-semibold text-yellow-700">
                            
                        </TableCell>
                        <TableCell colSpan={2} className="border border-gray-300 text-right font-semibold">
                            {formatMoney(sisaLebihDigunakanKembali)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
