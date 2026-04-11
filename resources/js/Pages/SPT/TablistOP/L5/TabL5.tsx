import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import { router } from "@inertiajs/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FormL5ADialog from "./FormL5ADialog";
import FormL5BCDialog from "./FormL5BCDialog";
import {
    COMPENSATION_KEYS,
    L5B_TYPE_OF_INCOME_OPTIONS,
    L5C_TYPE_OF_INCOME_OPTIONS,
    type L5ARecord,
    type L5BCRecord,
    type L5ReducerType,
    emptyL5ARow,
    formatRupiah,
    makeCompensationYears,
    makeTaxYearRows,
} from "./types";

const sum = (items: number[]) =>
    items.reduce((a, b) => a + (Number(b) || 0), 0);

export default function TabL5({
    user,
    spt,
    sptOpId,
    l5a,
    l5bc,
}: {
    user: { npwp: string };
    spt: { year: number };
    sptOpId: string;
    l5a: L5ARecord[];
    l5bc: L5BCRecord[];
}) {
    const taxYear = Number(spt.year);
    // Tahun acuan untuk range Lampiran 5A mengikuti "tahun berjalan" saat pelaporan.
    // Untuk SPT tahun pajak 2025, pelaporan terjadi di 2026.
    const filingYear = taxYear + 1;

    const taxYears = useMemo(() => makeTaxYearRows(filingYear), [filingYear]);
    const compYears = useMemo(
        () => makeCompensationYears(filingYear),
        [filingYear],
    );

    const [draftA, setDraftA] = useState<Record<string, L5ARecord>>({});

    const [aDialogOpen, setADialogOpen] = useState(false);
    const [editingTaxYear, setEditingTaxYear] = useState<string>(
        taxYears[0] ?? "",
    );

    const [dialogBOpen, setDialogBOpen] = useState(false);
    const [dialogCOpen, setDialogCOpen] = useState(false);
    const [editingBC, setEditingBC] = useState<L5BCRecord | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const map: Record<string, L5ARecord> = {};
        for (const year of taxYears) {
            map[year] = emptyL5ARow(year);
        }
        for (const row of l5a ?? []) {
            if (row?.tax_year && map[row.tax_year]) {
                map[row.tax_year] = {
                    ...map[row.tax_year],
                    ...row,
                    tax_year: String(row.tax_year),
                };
            }
        }
        setDraftA(map);
    }, [l5a, taxYears]);

    const aRows = useMemo(
        () => taxYears.map((y) => draftA[y] ?? emptyL5ARow(y)),
        [taxYears, draftA],
    );

    const totalsA = useMemo(() => {
        const fiscal = sum(aRows.map((r) => r.fiscal_amount));
        const comps = COMPENSATION_KEYS.map((k) =>
            sum(aRows.map((r) => (r as any)[k] ?? 0)),
        );
        return { fiscal, comps };
    }, [aRows]);

    const totalCompensationRunningYear =
        totalsA.comps[totalsA.comps.length - 1] ?? 0;

    const openEditA = (taxYear: string) => {
        setEditingTaxYear(taxYear);
        setADialogOpen(true);
    };

    const persistA = (nextMap: Record<string, L5ARecord>) => {
        const rows = taxYears.map((year) => {
            const r = nextMap[year] ?? emptyL5ARow(year);
            return {
                tax_year: year,
                fiscal_amount: Number(r.fiscal_amount ?? 0),
                compensation_year_a: Number(r.compensation_year_a ?? 0),
                compensation_year_b: Number(r.compensation_year_b ?? 0),
                compensation_year_c: Number(r.compensation_year_c ?? 0),
                compensation_year_d: Number(r.compensation_year_d ?? 0),
                compensation_year_e: Number(r.compensation_year_e ?? 0),
                compensation_year_f: Number(r.compensation_year_f ?? 0),
            };
        });

        router.post(
            route("spt.op.l5a.sync"),
            { spt_op_id: sptOpId, rows } as Record<string, any>,
            { preserveScroll: true },
        );
    };

    const saveARecord = (record: L5ARecord) => {
        const next = { ...draftA, [record.tax_year]: record };
        setDraftA(next);
        persistA(next);
    };

    const listB = useMemo(
        () => (l5bc ?? []).filter((x) => x.type_of_reducer === "neto"),
        [l5bc],
    );
    const listC = useMemo(
        () => (l5bc ?? []).filter((x) => x.type_of_reducer === "pph"),
        [l5bc],
    );

    const totalB = useMemo(
        () => sum(listB.map((x) => x.amount_of_reducer ?? 0)),
        [listB],
    );
    const totalC = useMemo(
        () => sum(listC.map((x) => x.amount_of_reducer ?? 0)),
        [listC],
    );

    const upsertBC = (reducerType: L5ReducerType, item: L5BCRecord) => {
        if (item.id) {
            router.put(
                route("spt.op.l5bc.update", item.id),
                {
                    type_of_reducer: reducerType,
                    code: item.code,
                    type_of_income: item.type_of_income,
                    amount_of_reducer: Number(item.amount_of_reducer ?? 0),
                } as Record<string, any>,
                { preserveScroll: true },
            );
            return;
        }

        router.post(
            route("spt.op.l5bc.store"),
            {
                spt_op_id: sptOpId,
                type_of_reducer: reducerType,
                code: item.code,
                type_of_income: item.type_of_income,
                amount_of_reducer: Number(item.amount_of_reducer ?? 0),
            } as Record<string, any>,
            { preserveScroll: true },
        );
    };

    const removeBC = (id?: string) => {
        if (!id) return;
        setDeleteId(id);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!deleteId) return;
        router.delete(route("spt.op.l5bc.destroy", deleteId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteConfirmOpen(false);
                setDeleteId(null);
            },
        });
    };

    const compensationSubLabel = (year: number) => {
        if (year === filingYear) return "TAHUN PAJAK BERJALAN - Nilai (Rp)";
        if (year === filingYear - 1) return "TAHUN PAJAK INI - Nilai (Rp)";
        return "NILAI (Rp)";
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                    HEADER
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tahun Pajak</Label>
                        <Input
                            value={String(taxYear)}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>NPWP</Label>
                        <Input
                            value={user.npwp ?? ""}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>
                </div>
            </div>

            <Accordion
                type="multiple"
                className="w-full"
                defaultValue={["a", "b", "c"]}
            >
                <AccordionItem value="a">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold px-4 rounded">
                        A. PENGHITUNGAN KOMPENSASI KERUGIAN FISKAL
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="p-4 bg-white rounded-lg shadow">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[90px]">
                                            Tindakan
                                        </TableHead>
                                        <TableHead className="w-[60px]">
                                            No.
                                        </TableHead>
                                        <TableHead
                                            className="text-center"
                                            colSpan={2}
                                        >
                                            LABA/RUGI NETO FISKAL
                                        </TableHead>
                                        <TableHead
                                            className="text-center"
                                            colSpan={6}
                                        >
                                            JUMLAH KOMPENSASI KERUGIAN FISKAL
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead />
                                        <TableHead />
                                        <TableHead className="text-center">
                                            Tahun Pajak/Bagian Tahun Pajak
                                        </TableHead>
                                        <TableHead className="text-center">
                                            NILAI (RUPIAH)
                                        </TableHead>
                                        {compYears.map((year) => (
                                            <TableHead
                                                key={year}
                                                className="text-center"
                                            >
                                                TAHUN {year}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableHead />
                                        <TableHead />
                                        <TableHead />
                                        <TableHead className="text-center">
                                            NILAI (Rp)
                                        </TableHead>
                                        {compYears.map((year) => (
                                            <TableHead
                                                key={year}
                                                className="text-center"
                                            >
                                                {compensationSubLabel(year)}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {aRows.map((row, idx) => (
                                        <TableRow key={row.tax_year}>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        openEditA(row.tax_year)
                                                    }
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell className="text-center">
                                                {row.tax_year}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatRupiah(
                                                    row.fiscal_amount ?? 0,
                                                )}
                                            </TableCell>
                                            {COMPENSATION_KEYS.map((k) => (
                                                <TableCell
                                                    key={k}
                                                    className="text-right"
                                                >
                                                    {formatRupiah(
                                                        (row as any)[k] ?? 0,
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}

                                    <TableRow>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell
                                            className="font-semibold text-right"
                                            colSpan={1}
                                        >
                                            JUMLAH BAGIAN A
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatRupiah(totalsA.fiscal)}
                                        </TableCell>
                                        {totalsA.comps.map((v, idx) => (
                                            <TableCell
                                                key={idx}
                                                className="text-right font-semibold"
                                            >
                                                {formatRupiah(v)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <FormL5ADialog
                            open={aDialogOpen}
                            onOpenChange={setADialogOpen}
                            currentYear={filingYear}
                            taxYear={editingTaxYear}
                            value={
                                draftA[editingTaxYear] ??
                                emptyL5ARow(editingTaxYear)
                            }
                            onSave={(next) =>
                                saveARecord({
                                    ...next,
                                    tax_year: editingTaxYear,
                                })
                            }
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="b">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold px-4 rounded">
                        B. PENGURANG PENGHASILAN NETO
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="p-4 bg-white rounded-lg shadow space-y-4">
                            <div>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setEditingBC(null);
                                        setDialogBOpen(true);
                                    }}
                                    className="bg-blue-950 hover:bg-blue-900 gap-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Tambah
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[90px]">
                                            Tindakan
                                        </TableHead>
                                        <TableHead className="w-[60px]">
                                            No.
                                        </TableHead>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>
                                            Jenis Pengurang Penghasilan Neto
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Jumlah Pengurang Penghasilan Neto
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead />
                                        <TableHead />
                                        <TableHead>
                                            <Input
                                                disabled
                                                className="h-8 bg-gray-100"
                                            />
                                        </TableHead>
                                        <TableHead>
                                            <Input
                                                disabled
                                                className="h-8 bg-gray-100"
                                            />
                                        </TableHead>
                                        <TableHead>
                                            <Input
                                                disabled
                                                className="h-8 bg-gray-100"
                                            />
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {listB.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center text-gray-500"
                                            >
                                                Tidak ada data untuk
                                                ditampilkan.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {listB.map((item, idx) => (
                                        <TableRow key={item.id ?? idx}>
                                            <TableCell className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingBC(item);
                                                        setDialogBOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeBC(item.id)
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>{item.code}</TableCell>
                                            <TableCell>
                                                {item.type_of_income}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatRupiah(
                                                    item.amount_of_reducer ?? 0,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-right font-semibold"
                                        >
                                            JUMLAH
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatRupiah(totalB)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div className="space-y-2">
                                    <Label>
                                        JUMLAH KOMPENSASI KERUGIAN FISKAL
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-2 border rounded bg-gray-100 text-sm">
                                            Rp
                                        </div>
                                        <Input
                                            disabled
                                            className="bg-gray-100"
                                            value={formatRupiah(
                                                totalCompensationRunningYear,
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        JUMLAH PENGURANG PENGHASILAN NETO
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-2 border rounded bg-gray-100 text-sm">
                                            Rp
                                        </div>
                                        <Input
                                            disabled
                                            className="bg-gray-100"
                                            value={formatRupiah(totalB)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <FormL5BCDialog
                                open={dialogBOpen}
                                onOpenChange={setDialogBOpen}
                                mode={editingBC?.id ? "edit" : "create"}
                                reducerType="neto"
                                options={L5B_TYPE_OF_INCOME_OPTIONS}
                                value={editingBC}
                                onSubmit={(next) => upsertBC("neto", next)}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="c">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold px-4 rounded">
                        C. PENGURANG PPh TERUTANG
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="p-4 bg-white rounded-lg shadow space-y-4">
                            <div>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setEditingBC(null);
                                        setDialogCOpen(true);
                                    }}
                                    className="bg-blue-950 hover:bg-blue-900 gap-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Tambah
                                </Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[90px]">
                                            Tindakan
                                        </TableHead>
                                        <TableHead className="w-[60px]">
                                            No.
                                        </TableHead>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>
                                            Jenis Pengurang PPh Terutang
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Jumlah Pengurang PPh Terutang
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead />
                                        <TableHead />
                                        <TableHead>
                                            <Input
                                                disabled
                                                className="h-8 bg-gray-100"
                                            />
                                        </TableHead>
                                        <TableHead>
                                            <Input
                                                disabled
                                                className="h-8 bg-gray-100"
                                            />
                                        </TableHead>
                                        <TableHead>
                                            <Input
                                                disabled
                                                className="h-8 bg-gray-100"
                                            />
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {listC.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center text-gray-500"
                                            >
                                                Tidak ada data untuk
                                                ditampilkan.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {listC.map((item, idx) => (
                                        <TableRow key={item.id ?? idx}>
                                            <TableCell className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingBC(item);
                                                        setDialogCOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeBC(item.id)
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>{item.code}</TableCell>
                                            <TableCell>
                                                {item.type_of_income}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatRupiah(
                                                    item.amount_of_reducer ?? 0,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-right font-semibold"
                                        >
                                            JUMLAH
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {formatRupiah(totalC)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <FormL5BCDialog
                                open={dialogCOpen}
                                onOpenChange={setDialogCOpen}
                                mode={editingBC?.id ? "edit" : "create"}
                                reducerType="pph"
                                options={L5C_TYPE_OF_INCOME_OPTIONS}
                                value={editingBC}
                                onSubmit={(next) => upsertBC("pph", next)}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <ConfirmDialog
                open={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false);
                    setDeleteId(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Data"
                description="Apakah Anda yakin ingin menghapus data ini?"
            />
        </div>
    );
}
