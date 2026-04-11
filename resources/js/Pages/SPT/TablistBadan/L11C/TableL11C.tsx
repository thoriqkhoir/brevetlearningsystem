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
import type { L11CItem } from "./types";

const fmt = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
const formatMoney = (v: number | null | undefined) => fmt.format(v ?? 0);
const formatDate = (v: string | null | undefined) => {
    if (!v) return "-";
    return new Date(v).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
};

interface TableL11CProps {
    data: L11CItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L11CItem) => void;
    onDelete: (id: string) => void;
}

export function TableL11C({ data, selectedIds, onSelectChange, onEdit, onDelete }: TableL11CProps) {
    const totalCurrencyEndYear         = data.reduce((s, i) => s + (i.currency_end_year ?? 0), 0);
    const totalDebtStart               = data.reduce((s, i) => s + (i.principal_debt_start_year ?? 0), 0);
    const totalDebtAddition            = data.reduce((s, i) => s + (i.principal_debt_addition ?? 0), 0);
    const totalDebtReducer             = data.reduce((s, i) => s + (i.principal_debt_reducer ?? 0), 0);
    const totalDebtEnd                 = data.reduce((s, i) => s + (i.principal_debt_end_year ?? 0), 0);
    const totalInterestAmount          = data.reduce((s, i) => s + (i.interest_amount ?? 0), 0);
    const totalCostOther               = data.reduce((s, i) => s + (i.cost_other ?? 0), 0);

    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

    const handleSelectAll = (checked: boolean) =>
        onSelectChange(checked ? data.map((i) => i.id!).filter(Boolean) : []);
    const handleSelectOne = (id: string, checked: boolean) =>
        onSelectChange(checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id));

    return (
        <div className="w-full overflow-x-auto border">
            <Table className="min-w-[1800px] text-xs">
                <TableHeader>
                    {/* Row 1 — Group headers */}
                    <TableRow className="bg-gray-100">
                        <TableHead rowSpan={2} className="border border-gray-300 text-center w-[40px]">
                            <Checkbox
                                checked={allSelected || (someSelected && "indeterminate")}
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead rowSpan={2} className="border border-gray-300 text-center w-[40px]">NO.</TableHead>
                        <TableHead rowSpan={2} className="border border-gray-300 text-center w-[70px]">Aksi</TableHead>
                        {/* PEMBERI PINJAMAN */}
                        <TableHead colSpan={3} className="border border-gray-300 text-center font-semibold">
                            PEMBERI PINJAMAN
                        </TableHead>
                        {/* MATA UANG */}
                        <TableHead colSpan={2} className="border border-gray-300 text-center font-semibold">
                            MATA UANG
                        </TableHead>
                        {/* POKOK UTANG */}
                        <TableHead colSpan={4} className="border border-gray-300 text-center font-semibold">
                            POKOK UTANG (Rp)
                        </TableHead>
                        {/* JANGKA WAKTU */}
                        <TableHead colSpan={2} className="border border-gray-300 text-center font-semibold">
                            JANGKA WAKTU PINJAMAN
                        </TableHead>
                        {/* BUNGA */}
                        <TableHead colSpan={2} className="border border-gray-300 text-center font-semibold">
                            BUNGA
                        </TableHead>
                        {/* BIAYA TERKAIT */}
                        <TableHead rowSpan={2} className="border border-gray-300 text-center font-semibold max-w-[120px]">
                            BIAYA TERKAIT PEROLEHAN PINJAMAN SELAIN BUNGA (Rp)
                        </TableHead>
                        {/* PERUNTUKAN */}
                        <TableHead rowSpan={2} className="border border-gray-300 text-center font-semibold max-w-[100px]">
                            PERUNTUKAN PINJAMAN
                        </TableHead>
                    </TableRow>
                    {/* Row 2 — Sub-headers */}
                    <TableRow className="bg-gray-100">
                        {/* PEMBERI PINJAMAN */}
                        <TableHead className="border border-gray-300 text-center">NAMA</TableHead>
                        <TableHead className="border border-gray-300 text-center">ALAMAT</TableHead>
                        <TableHead className="border border-gray-300 text-center">NEGARA/<br/>YURISDIKSI</TableHead>
                        {/* MATA UANG */}
                        <TableHead className="border border-gray-300 text-center">KODE</TableHead>
                        <TableHead className="border border-gray-300 text-center">KURS AKHIR<br/>TAHUN</TableHead>
                        {/* POKOK UTANG */}
                        <TableHead className="border border-gray-300 text-center">AWAL TAHUN</TableHead>
                        <TableHead className="border border-gray-300 text-center">PENAMBAHAN</TableHead>
                        <TableHead className="border border-gray-300 text-center">PENGURANGAN</TableHead>
                        <TableHead className="border border-gray-300 text-center">AKHIR TAHUN</TableHead>
                        {/* JANGKA WAKTU */}
                        <TableHead className="border border-gray-300 text-center">TANGGAL<br/>MULAI</TableHead>
                        <TableHead className="border border-gray-300 text-center">TANGGAL<br/>JATUH TEMPO</TableHead>
                        {/* BUNGA */}
                        <TableHead className="border border-gray-300 text-center">TINGKAT<br/>(%)</TableHead>
                        <TableHead className="border border-gray-300 text-center">JUMLAH<br/>(Rp)</TableHead>
                    </TableRow>
                    {/* Row 3 — Column numbers */}
                    
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={18} className="text-center text-sm text-muted-foreground h-20">
                                Belum ada data.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, idx) => (
                            <TableRow key={item.id ?? idx}>
                                <TableCell className="border border-gray-200">
                                    <Checkbox
                                        checked={selectedIds.includes(item.id!)}
                                        onCheckedChange={(c) => handleSelectOne(item.id!, !!c)}
                                    />
                                </TableCell>
                                <TableCell className="border border-gray-200 text-center">{idx + 1}</TableCell>
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
                                <TableCell className="border border-gray-200">{item.name}</TableCell>
                                <TableCell className="border border-gray-200">{item.address ?? "-"}</TableCell>
                                <TableCell className="border border-gray-200">{item.region ?? "-"}</TableCell>
                                <TableCell className="border border-gray-200 text-center">{item.currency_code ?? "-"}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.currency_end_year)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.principal_debt_start_year)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.principal_debt_addition)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.principal_debt_reducer)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.principal_debt_end_year)}</TableCell>
                                <TableCell className="border border-gray-200 text-center">{formatDate(item.start_loan_term)}</TableCell>
                                <TableCell className="border border-gray-200 text-center">{formatDate(item.end_loan_term)}</TableCell>
                                <TableCell className="border border-gray-200 text-center">{item.interest_rate ?? 0}%</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.interest_amount)}</TableCell>
                                <TableCell className="border border-gray-200 text-right">{formatMoney(item.cost_other)}</TableCell>
                                <TableCell className="border border-gray-200">{item.loan_allocation ?? "-"}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {data.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={7} className="border border-gray-300 text-right font-semibold">
                                JUMLAH
                            </TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">{formatMoney(totalCurrencyEndYear)}</TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">{formatMoney(totalDebtStart)}</TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">{formatMoney(totalDebtAddition)}</TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">{formatMoney(totalDebtReducer)}</TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">{formatMoney(totalDebtEnd)}</TableCell>
                            <TableCell className="border border-gray-300" />
                            <TableCell className="border border-gray-300" />
                            <TableCell className="border border-gray-300" />
                            <TableCell className="border border-gray-300 text-right font-semibold">{formatMoney(totalInterestAmount)}</TableCell>
                            <TableCell className="border border-gray-300 text-right font-semibold">{formatMoney(totalCostOther)}</TableCell>
                            <TableCell className="border border-gray-300" />
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}

export default TableL11C;
