import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

interface TableL1A7Props {
    totalAcquisitionCost: number;
    totalAmountNow: number;
}

export function TableL1A7({
    totalAcquisitionCost,
    totalAmountNow,
}: TableL1A7Props) {
    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Uraian</TableHead>
                        <TableHead className="text-right">
                            Harga Perolehan
                        </TableHead>
                        <TableHead className="text-right">
                            Nilai Saat Ini
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold">
                            JUMLAH HARTA PADA AKHIR TAHUN PAJAK
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalAcquisitionCost)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalAmountNow)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

export default TableL1A7;
