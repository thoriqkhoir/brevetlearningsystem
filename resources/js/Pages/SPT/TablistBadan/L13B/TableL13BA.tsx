import { Checkbox } from "@/Components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { L13BAItem } from "./types";

interface TableL13BAProps {
    data: L13BAItem[];
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
    onEdit: (item: L13BAItem) => void;
    onDelete: (id: string) => void;
}

export function TableL13BA({
    data,
    selectedIds,
    onSelectChange,
    onEdit,
    onDelete,
}: TableL13BAProps) {
    const toggleAll = () => {
        if (selectedIds.length === data.length) {
            onSelectChange([]);
        } else {
            onSelectChange(data.map((d) => d.id!).filter(Boolean));
        }
    };

    const toggleOne = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelectChange(selectedIds.filter((x) => x !== id));
        } else {
            onSelectChange([...selectedIds, id]);
        }
    };

    return (
        <div className="overflow-x-auto">
            <Table className="text-xs border">
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="w-8 text-center border">
                            <Checkbox
                                checked={
                                    data.length > 0 &&
                                    selectedIds.length === data.length
                                }
                                onCheckedChange={toggleAll}
                            />
                        </TableHead>
                        <TableHead className="text-center border">
                            <div className="font-semibold">
                                PERJANJIAN KERJA SAMA
                            </div>
                            <div className="flex">
                                <span className="flex-1 text-center border-r py-1">
                                    NOMOR
                                </span>
                                <span className="flex-1 text-center py-1">
                                    TANGGAL
                                </span>
                            </div>
                        </TableHead>
                        <TableHead className="text-center border">
                            MITRA KEGIATAN
                        </TableHead>
                        <TableHead className="text-center border">
                            KETERANGAN
                        </TableHead>
                        <TableHead className="text-center border w-20">
                            Aksi
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center text-muted-foreground py-4"
                            >
                                Belum ada data
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, i) => (
                            <TableRow key={row.id ?? i}>
                                <TableCell className="text-center border">
                                    <Checkbox
                                        checked={selectedIds.includes(row.id!)}
                                        onCheckedChange={() =>
                                            toggleOne(row.id!)
                                        }
                                    />
                                </TableCell>
                                <TableCell className="border p-0">
                                    <div className="flex">
                                        <span className="flex-1 border-r px-2 py-2">
                                            {row.coorperation_agreement_number ??
                                                "-"}
                                        </span>
                                        <span className="flex-1 px-2 py-2">
                                            {row.coorperation_agreement_date
                                                ? row.coorperation_agreement_date.substring(
                                                      0,
                                                      10,
                                                  )
                                                : "-"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="border">
                                    {row.actiity_partner ?? "-"}
                                </TableCell>
                                <TableCell className="border">
                                    {row.note ?? "-"}
                                </TableCell>
                                <TableCell className="border text-center">
                                    <div className="flex justify-center gap-1">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7"
                                            onClick={() => onEdit(row)}
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-red-500 hover:text-red-700"
                                            onClick={() => onDelete(row.id!)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
