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
import { countries } from "@/data/spt-op-data";
import {
    L1A5Item,
    L1A5_CODE_OPTIONS,
    NOTES_OPTIONS,
    OWNERSHIP_OPTIONS,
} from "./types";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const formatMoney = (value: number | null | undefined) =>
    rupiahFormatter.format(value ?? 0);

const getCodeLabel = (code: string) =>
    L1A5_CODE_OPTIONS.find((opt) => opt.value === code)?.label || code;

const getCountryLabel = (code: string) =>
    countries.find((opt) => opt.value === code)?.label || code;

const getOwnershipSourceLabel = (value: string) =>
    OWNERSHIP_OPTIONS.find(
        (opt) => opt.type === "harta tidak bergerak" && opt.value === value,
    )?.label || value;

const getNotesLabel = (code: string) =>
    NOTES_OPTIONS.find((opt) => opt.value === code)?.label || code;

interface TableL1A5Props {
    data: L1A5Item[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L1A5Item) => void;
    onDelete: (id: string) => void;
}

export function TableL1A5({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL1A5Props) {
    const totalHargaPerolehan = data.reduce(
        (sum, item) => sum + (item.acquisition_cost ?? 0),
        0,
    );
    const totalNilaiSaatIni = data.reduce(
        (sum, item) => sum + (item.amount_now ?? 0),
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
                        <TableHead className="w-[60px]">No</TableHead>
                        <TableHead className="w-[80px]">Aksi</TableHead>
                        <TableHead>Kode</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Lokasi Harta</TableHead>
                        <TableHead>Ukuran Tanah</TableHead>
                        <TableHead>Ukuran Bangunan</TableHead>
                        <TableHead>Sumber Kepemilikan</TableHead>
                        <TableHead>No. Sertifikat</TableHead>
                        <TableHead>Tahun</TableHead>
                        <TableHead className="text-right">
                            Harga Perolehan
                        </TableHead>
                        <TableHead className="text-right">
                            Nilai Saat Ini
                        </TableHead>
                        <TableHead>Keterangan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={14}
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
                                <TableCell>{getCodeLabel(item.code)}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>
                                    {getCountryLabel(item.country)}
                                </TableCell>
                                <TableCell>{item.land_size}</TableCell>
                                <TableCell>{item.building_size}</TableCell>
                                <TableCell>
                                    {getOwnershipSourceLabel(
                                        item.ownership_source,
                                    )}
                                </TableCell>
                                <TableCell>{item.certificate_number}</TableCell>
                                <TableCell>{item.acquisition_year}</TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.acquisition_cost)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(item.amount_now)}
                                </TableCell>
                                <TableCell>
                                    {getNotesLabel(item.notes)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={11} className="font-semibold">
                            JUMLAH BAGIAN A5
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalHargaPerolehan)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatMoney(totalNilaiSaatIni)}
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

export default TableL1A5;
