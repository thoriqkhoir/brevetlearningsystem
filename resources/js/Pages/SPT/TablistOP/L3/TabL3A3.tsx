import { Button } from "@/Components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
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
import { router } from "@inertiajs/react";
import { Pencil, Save } from "lucide-react";
import { useMemo, useState, Fragment } from "react";
import {
    type L3AProps,
    type L3A13A1Item,
    type L3A13A2Item,
    type MasterAccount,
    A1_CATEGORIES_INDUSTRI,
    buildA1SyncRows,
    buildA2SyncRows,
    formatMoney,
    parseDigits,
    computeFiscalAmount,
} from "./types";
import FormL3A1Dialog from "./FormL3A1Dialog";
import { toast } from "react-hot-toast";
import { resolveL3A1AccountsByType, resolveL3A2AccountsByType } from "./layout";

const TYPE: "industri" = "industri";

export default function TabL3A3({
    user,
    spt,
    sptOpId,
    masterAccounts,
    l3a13a1,
    l3a13a2,
}: L3AProps) {
    const [isSaving, setIsSaving] = useState(false);

    // Group A.1 accounts by category (Industri specific)
    const a1Accounts = useMemo(() => {
        return resolveL3A1AccountsByType(
            TYPE,
            masterAccounts ?? [],
            (accounts, category) => {
                if (category !== "Biaya Overhead Pabrik") {
                    return [...accounts].sort(
                        (a, b) => Number(a.code) - Number(b.code),
                    );
                }

                return [...accounts].sort((a, b) => {
                    const codeA = String(a.code);
                    const codeB = String(b.code);
                    const numA = Number(codeA);
                    const numB = Number(codeB);

                    const groupOf = (code: string, num: number) => {
                        if (code.startsWith("4")) return 2;
                        if (num < 5050) return 1;
                        return 0;
                    };

                    const groupA = groupOf(codeA, numA);
                    const groupB = groupOf(codeB, numB);

                    if (groupA !== groupB) return groupA - groupB;

                    return numA - numB;
                });
            },
        );
    }, [masterAccounts]);

    // A.2 Neraca left side (Aset)
    const a2Left = useMemo(() => {
        return resolveL3A2AccountsByType(TYPE, "left", masterAccounts ?? []);
    }, [masterAccounts]);

    // A.2 Neraca right side (Liabilitas + Ekuitas)
    const a2Right = useMemo(() => {
        return resolveL3A2AccountsByType(TYPE, "right", masterAccounts ?? []);
    }, [masterAccounts]);

    // Map existing A.1 data by account_id
    const a1ByAccountId = useMemo(() => {
        const map = new Map<number, L3A13A1Item>();
        for (const raw of l3a13a1 ?? []) {
            if ((raw?.type ?? "") !== TYPE) continue;
            const accountId = Number(raw.account_id);
            if (!Number.isFinite(accountId)) continue;
            map.set(accountId, {
                id: raw.id,
                spt_op_id: String(raw.spt_op_id ?? sptOpId),
                account_id: accountId,
                type: TYPE,
                commercial_value: Number(raw.commercial_value ?? 0),
                non_taxable: Number(raw.non_taxable ?? 0),
                subject_to_final: Number(raw.subject_to_final ?? 0),
                non_final: Number(raw.non_final ?? 0),
                positive_fiscal: Number(raw.positive_fiscal ?? 0),
                negative_fiscal: Number(raw.negative_fiscal ?? 0),
                correction_code: raw.correction_code ?? "",
                fiscal_amount: Number(raw.fiscal_amount ?? 0),
            });
        }
        return map;
    }, [l3a13a1, sptOpId]);

    // Map existing A.2 data by account_id
    const a2ByAccountId = useMemo(() => {
        const map = new Map<number, L3A13A2Item>();
        for (const raw of l3a13a2 ?? []) {
            if ((raw?.type ?? "") !== TYPE) continue;
            const accountId = Number(raw.account_id);
            if (!Number.isFinite(accountId)) continue;
            map.set(accountId, {
                id: raw.id,
                spt_op_id: String(raw.spt_op_id ?? sptOpId),
                account_id: accountId,
                type: TYPE,
                amount: Number(raw.amount ?? 0),
            });
        }
        return map;
    }, [l3a13a2, sptOpId]);

    // Draft state
    const [a1Draft, setA1Draft] = useState<Map<number, L3A13A1Item>>(
        () => new Map(a1ByAccountId),
    );
    const [a2Draft, setA2Draft] = useState<Map<number, L3A13A2Item>>(
        () => new Map(a2ByAccountId),
    );

    // Edit dialog state
    const [openEdit, setOpenEdit] = useState(false);
    const [editAccount, setEditAccount] = useState<MasterAccount | null>(null);
    const [editForm, setEditForm] = useState<L3A13A1Item | null>(null);

    const openEditFor = (acc: MasterAccount) => {
        setEditAccount(acc);
        const accountId = Number(acc.id);
        const current = a1Draft.get(accountId) ??
            a1ByAccountId.get(accountId) ?? {
                spt_op_id: sptOpId,
                account_id: accountId,
                type: TYPE,
                commercial_value: 0,
                non_taxable: 0,
                subject_to_final: 0,
                non_final: 0,
                positive_fiscal: 0,
                negative_fiscal: 0,
                correction_code: "",
                fiscal_amount: 0,
            };
        const fiscal_amount = computeFiscalAmount(current);
        setEditForm({ ...current, fiscal_amount });
        setOpenEdit(true);
    };

    const handleSaveDraft = () => {
        if (!editForm) return;

        const updatedDraft = new Map(a1Draft);
        updatedDraft.set(editForm.account_id, {
            ...editForm,
            fiscal_amount: computeFiscalAmount(editForm),
        });
        setA1Draft(updatedDraft);

        if (!sptOpId) {
            setOpenEdit(false);
            return;
        }

        setIsSaving(true);

        const allRows: L3A13A1Item[] = buildA1SyncRows(updatedDraft, sptOpId, TYPE);

        const labaRugiAccount = masterAccounts?.find(
            (a) =>
                a.name.toLowerCase().includes("laba") &&
                a.name.toLowerCase().includes("sebelum pajak"),
        );

        if (labaRugiAccount) {
            const labaRugiAccountId = Number(labaRugiAccount.id);

            // Gunakan computedSummaryRowFromDraft dengan updatedDraft
            const labaRugiRow = computedSummaryRowFromDraft(
                { name: "Laba (Rugi) Sebelum Pajak" } as MasterAccount,
                updatedDraft,
            );

            if (labaRugiRow) {
                const newRow: L3A13A1Item = {
                    ...labaRugiRow,
                    spt_op_id: sptOpId,
                    account_id: labaRugiAccountId,
                    type: TYPE,
                    fiscal_amount: computeFiscalAmount(labaRugiRow),
                };

                const existingIdx = allRows.findIndex(
                    (r) => r.account_id === labaRugiAccountId,
                );

                if (existingIdx !== -1) {
                    allRows[existingIdx] = { ...allRows[existingIdx], ...newRow };
                } else {
                    allRows.push(newRow);
                }
            }
        }

        router.post(
            route("spt.op.l3a13a1.sync"),
            { spt_op_id: sptOpId, type: TYPE, rows: allRows },
            {
                preserveScroll: true,
                onSuccess: () => setOpenEdit(false),
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const handleA2Change = (accountId: number, value: string) => {
        const amount = parseDigits(value);
        setA2Draft((prev) => {
            const next = new Map(prev);
            next.set(accountId, {
                ...(next.get(accountId) ?? {
                    spt_op_id: sptOpId,
                    account_id: accountId,
                    type: TYPE,
                    amount: 0,
                }),
                amount,
            });
            return next;
        });
    };

    const handleSync = () => {
        if (!sptOpId) return;
        setIsSaving(true);

        const a1Rows: L3A13A1Item[] = buildA1SyncRows(a1Draft, sptOpId, TYPE);

        const labaRugiAccount = masterAccounts?.find(
            (a) =>
                a.name.toLowerCase().includes("laba") &&
                a.name.toLowerCase().includes("sebelum pajak"),
        );

        if (labaRugiAccount) {
            const labaRugiAccountId = Number(labaRugiAccount.id);

            // Gunakan computedSummaryRowFromDraft dengan a1Draft saat ini
            const labaRugiRow = computedSummaryRowFromDraft(
                { name: "Laba (Rugi) Sebelum Pajak" } as MasterAccount,
                a1Draft,
            );

            if (labaRugiRow) {
                const newRow: L3A13A1Item = {
                    ...labaRugiRow,
                    spt_op_id: sptOpId,
                    account_id: labaRugiAccountId,
                    type: TYPE,
                    fiscal_amount: computeFiscalAmount(labaRugiRow),
                };

                const existingIdx = a1Rows.findIndex(
                    (r) => r.account_id === labaRugiAccountId,
                );

                if (existingIdx !== -1) {
                    a1Rows[existingIdx] = { ...a1Rows[existingIdx], ...newRow };
                } else {
                    a1Rows.push(newRow);
                }
            }
        }

        const a2Rows: L3A13A2Item[] = buildA2SyncRows(a2Draft, sptOpId, TYPE);

        router.post(
            route("spt.op.l3a13a1.sync"),
            { spt_op_id: sptOpId, type: TYPE, rows: a1Rows },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.post(
                        route("spt.op.l3a13a2.sync"),
                        { spt_op_id: sptOpId, type: TYPE, rows: a2Rows },
                        {
                            preserveScroll: true,
                            onFinish: () => setIsSaving(false),
                        },
                    );
                },
                onError: () => setIsSaving(false),
            },
        );
    };

    const handleSyncA2 = () => {
        if (!sptOpId) return;
        setIsSaving(true);

        const a2Rows: L3A13A2Item[] = buildA2SyncRows(a2Draft, sptOpId, TYPE);

        router.post(
            route("spt.op.l3a13a2.sync"),
            { spt_op_id: sptOpId, type: TYPE, rows: a2Rows },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Untuk sementara gunakan alert sampai toast diperbaiki
                    toast.success("Data Neraca (A2) berhasil disimpan.");
                },
                onFinish: () => setIsSaving(false),
            },
        );
    };

    // Check if row is a summary row (bold, no edit button)
    const isSummaryRow = (acc: MasterAccount) => {
        const summaryNames = [
            "Penjualan Bruto",
            "Penjualan Bersih",
            "Total Biaya Overhead Pabrik",
            "Total Biaya Produksi",
            "Total Biaya Barang yang Diproduksi",
            "Total Biaya Dari Barang yang Dijual",
            "Jumlah HPP",
            "Jumlah Harga Pokok Penjualan",
            "Laba Kotor",
            "Jumlah Beban Usaha",
            "Laba (Rugi) Sebelum Pajak",
        ];
        return summaryNames.some(
            (n) =>
                acc.name.includes(n) ||
                acc.category.includes("Jumlah") ||
                acc.category.includes("Laba"),
        );
    };

    // Tambahkan helper functions setelah fungsi sumA1RowsByAccountNames (sekitar baris 360)

    // Helper: sum all rows in a specific category
    const sumA1RowsByCategory = (category: string): L3A13A1Item => {
        const sum: L3A13A1Item = {
            spt_op_id: sptOpId,
            account_id: 0,
            type: TYPE,
            commercial_value: 0,
            non_taxable: 0,
            subject_to_final: 0,
            non_final: 0,
            positive_fiscal: 0,
            negative_fiscal: 0,
            correction_code: "",
            fiscal_amount: 0,
        };
        const list = a1Accounts[category] ?? [];
        for (const acc of list) {
            if (isSummaryRow(acc)) continue; // skip summary rows themselves
            const accountId = Number(acc.id);
            const row = a1Draft.get(accountId) ?? a1ByAccountId.get(accountId);
            if (!row) continue;
            sum.commercial_value += Number(row.commercial_value ?? 0);
            sum.non_taxable += Number(row.non_taxable ?? 0);
            sum.subject_to_final += Number(row.subject_to_final ?? 0);
            sum.non_final += Number(row.non_final ?? 0);
            sum.positive_fiscal += Number(row.positive_fiscal ?? 0);
            sum.negative_fiscal += Number(row.negative_fiscal ?? 0);
        }
        return sum;
    };

    // Helper: subtract two L3A13A1Items (a - b)
    const subtractRows = (a: L3A13A1Item, b: L3A13A1Item): L3A13A1Item => ({
        ...a,
        commercial_value: a.commercial_value - b.commercial_value,
        non_taxable: a.non_taxable - b.non_taxable,
        subject_to_final: a.subject_to_final - b.subject_to_final,
        non_final: a.non_final - b.non_final,
        positive_fiscal: a.positive_fiscal - b.positive_fiscal,
        negative_fiscal: a.negative_fiscal - b.negative_fiscal,
    });

    // Helper: add two L3A13A1Items (a + b)
    const addRows = (a: L3A13A1Item, b: L3A13A1Item): L3A13A1Item => ({
        ...a,
        commercial_value: a.commercial_value + b.commercial_value,
        non_taxable: a.non_taxable + b.non_taxable,
        subject_to_final: a.subject_to_final + b.subject_to_final,
        non_final: a.non_final + b.non_final,
        positive_fiscal: a.positive_fiscal + b.positive_fiscal,
        negative_fiscal: a.negative_fiscal + b.negative_fiscal,
    });

    const emptyRow: L3A13A1Item = {
        spt_op_id: sptOpId,
        account_id: 0,
        type: TYPE,
        commercial_value: 0,
        non_taxable: 0,
        subject_to_final: 0,
        non_final: 0,
        positive_fiscal: 0,
        negative_fiscal: 0,
        correction_code: "",
        fiscal_amount: 0,
    };

    // Compute summary rows dynamically for INDUSTRI
    const computedSummaryRow = (acc: MasterAccount): L3A13A1Item | null => {
        const name = acc.name.toLowerCase();

        // Penjualan Bruto = Penjualan Domestik + Penjualan Ekspor
        if (name.includes("penjualan bruto")) {
            const { sum } = sumA1RowsByAccountNames([
                "penjualan domestik",
                "penjualan ekspor",
            ]);
            return sum;
        }

        // Total Biaya Overhead Pabrik
        if (name.includes("total biaya overhead pabrik")) {
            return sumA1RowsByCategory("Biaya Overhead Pabrik");
        }

            // Penjualan Bersih = sum kategori Dikurangi (retur, potongan)
            if (name.includes("penjualan bersih")) {
                const penjualanBruto =
                    computedSummaryRow({ name: "Penjualan Bruto" } as MasterAccount) ??
                    emptyRow;
                const { sum: returDanPotongan } = sumA1RowsByAccountNames([
                    "retur",
                    "potongan penjualan",
                ]);
                return subtractRows(penjualanBruto, returDanPotongan);
            }

        // Total Biaya Produksi = sum kategori Biaya Pabrikasi
        if (name.includes("total biaya produksi")) {
            return sumA1RowsByCategory("Biaya Pabrikasi");
        }

        // Total Biaya Barang yang Diproduksi = Jumlah Biaya Pabrikasi
        if (name.includes("total biaya barang yang diproduksi")) {
            const jumlahBiayaPabrikasi = computedSummaryRow({
                name: "Jumlah Biaya Pabrikasi",
            } as MasterAccount);
            return jumlahBiayaPabrikasi;
        }

        // Jumlah Biaya Pabrikasi = Total Biaya Overhead + Biaya Pabrikasi
        if (name.includes("jumlah biaya pabrikasi")) {
            const overhead =
                computedSummaryRow({
                    name: "Total Biaya Overhead Pabrik",
                } as MasterAccount) ?? emptyRow;
            const pabrikasi = sumA1RowsByCategory("Biaya Pabrikasi");
            return addRows(overhead, pabrikasi);
        }

        // Jumlah Biaya Produksi = Jumlah Biaya Pabrikasi
        if (name.includes("jumlah biaya produksi")) {
            return computedSummaryRow({
                name: "Jumlah Biaya Pabrikasi",
            } as MasterAccount);
        }

        // Total Biaya Dari Barang yang Dijual / Jumlah Harga Pokok Produksi
        if (
            name.includes("total biaya dari barang yang dijual") ||
            name.includes("jumlah harga pokok produksi")
        ) {
            return computedSummaryRow({
                name: "Jumlah Biaya Produksi",
            } as MasterAccount);
        }

        // Jumlah HPP / Jumlah Harga Pokok Penjualan
        if (
            name.includes("jumlah hpp") ||
            name.includes("jumlah harga pokok penjualan")
        ) {
            return computedSummaryRow({
                name: "Jumlah Harga Pokok Produksi",
            } as MasterAccount);
        }

        // Laba Kotor = Penjualan Bersih - Jumlah HPP
        if (name.includes("laba kotor")) {
            const penjualanBersih =
                computedSummaryRow({
                    name: "Penjualan Bersih",
                } as MasterAccount) ?? emptyRow;
            const jumlahHpp =
                computedSummaryRow({ name: "Jumlah HPP" } as MasterAccount) ??
                emptyRow;
            return subtractRows(penjualanBersih, jumlahHpp);
        }

        // Jumlah Beban Usaha
        if (name.includes("jumlah beban usaha")) {
            return sumA1RowsByCategory("Beban Usaha");
        }

        // Laba (Rugi) Sebelum Pajak = Laba Kotor - Jumlah Beban Usaha
        if (name.includes("laba") && name.includes("sebelum pajak")) {
            const labaKotor =
                computedSummaryRow({ name: "Laba Kotor" } as MasterAccount) ??
                emptyRow;
            const jumlahBebanUsaha =
                computedSummaryRow({
                    name: "Jumlah Beban Usaha",
                } as MasterAccount) ?? emptyRow;
            return subtractRows(labaKotor, jumlahBebanUsaha);
        }

        return null;
    };

    // Helper yang menerima draft eksplisit agar bisa dipakai sebelum setState selesai
    const computedSummaryRowFromDraft = (
        acc: MasterAccount,
        draft: Map<number, L3A13A1Item>,
    ): L3A13A1Item | null => {
        const name = acc.name.toLowerCase();

        const sumByNameFromDraft = (nameIncludes: string[]): L3A13A1Item => {
            const normalized = nameIncludes.map((n) => n.toLowerCase());
            const sum: L3A13A1Item = { ...emptyRow };
            for (const a of masterAccounts ?? []) {
                const aName = a.name.toLowerCase();
                if (!normalized.some((needle) => aName.includes(needle))) continue;
                const accountId = Number(a.id);
                const row = draft.get(accountId) ?? a1ByAccountId.get(accountId);
                if (!row) continue;
                sum.commercial_value  += Number(row.commercial_value ?? 0);
                sum.non_taxable       += Number(row.non_taxable ?? 0);
                sum.subject_to_final  += Number(row.subject_to_final ?? 0);
                sum.non_final         += Number(row.non_final ?? 0);
                sum.positive_fiscal   += Number(row.positive_fiscal ?? 0);
                sum.negative_fiscal   += Number(row.negative_fiscal ?? 0);
            }
            return sum;
        };

        const sumByCategoryFromDraft = (category: string): L3A13A1Item => {
            const sum: L3A13A1Item = { ...emptyRow };
            const list = a1Accounts[category] ?? [];
            for (const a of list) {
                if (isSummaryRow(a)) continue;
                const accountId = Number(a.id);
                const row = draft.get(accountId) ?? a1ByAccountId.get(accountId);
                if (!row) continue;
                sum.commercial_value  += Number(row.commercial_value ?? 0);
                sum.non_taxable       += Number(row.non_taxable ?? 0);
                sum.subject_to_final  += Number(row.subject_to_final ?? 0);
                sum.non_final         += Number(row.non_final ?? 0);
                sum.positive_fiscal   += Number(row.positive_fiscal ?? 0);
                sum.negative_fiscal   += Number(row.negative_fiscal ?? 0);
            }
            return sum;
        };

        const recurse = (name: string) =>
            computedSummaryRowFromDraft({ name } as MasterAccount, draft) ?? emptyRow;

        if (name.includes("penjualan bruto")) {
            return sumByNameFromDraft(["penjualan domestik", "penjualan ekspor"]);
        }

        if (name.includes("penjualan bersih")) {
            return subtractRows(
                recurse("Penjualan Bruto"),
                sumByNameFromDraft(["retur", "potongan penjualan"]),
            );
        }

        if (name.includes("jumlah hpp") || name.includes("jumlah harga pokok")) {
            return addRows(
                sumByCategoryFromDraft("Biaya Pabrikasi"),
                sumByCategoryFromDraft("Biaya Overhead Pabrik"),
            );
        }

        if (name.includes("laba kotor")) {
            return subtractRows(recurse("Penjualan Bersih"), recurse("Jumlah HPP"));
        }

        if (name.includes("jumlah beban usaha")) {
            return sumByCategoryFromDraft("Beban Usaha");
        }

        if (name.includes("laba") && name.includes("sebelum pajak")) {
            return subtractRows(
                recurse("Laba Kotor"),
                recurse("Jumlah Beban Usaha"),
            );
        }

        return null;
    };

    const sumA1RowsByAccountNames = (nameIncludes: string[]) => {
        const normalized = nameIncludes.map((name) => name.toLowerCase());
        const sum: L3A13A1Item = {
            spt_op_id: sptOpId,
            account_id: 0,
            type: TYPE,
            commercial_value: 0,
            non_taxable: 0,
            subject_to_final: 0,
            non_final: 0,
            positive_fiscal: 0,
            negative_fiscal: 0,
            correction_code: "",
            fiscal_amount: 0,
        };
        let found = false;

        for (const acc of masterAccounts ?? []) {
            const name = acc.name.toLowerCase();
            if (!normalized.some((needle) => name.includes(needle))) continue;
            found = true;
            const accountId = Number(acc.id);
            const row = a1Draft.get(accountId) ?? a1ByAccountId.get(accountId);
            if (!row) continue;
            sum.commercial_value += Number(row.commercial_value ?? 0);
            sum.non_taxable += Number(row.non_taxable ?? 0);
            sum.subject_to_final += Number(row.subject_to_final ?? 0);
            sum.non_final += Number(row.non_final ?? 0);
            sum.positive_fiscal += Number(row.positive_fiscal ?? 0);
            sum.negative_fiscal += Number(row.negative_fiscal ?? 0);
        }

        return { sum, found };
    };

        // A.2 helpers - Jumlah Aset
    const sumA2Left = () => {
        let total = 0;
        for (const acc of a2Left) {
            const accountId = Number(acc.id);
            const row = a2Draft.get(accountId) ?? a2ByAccountId.get(accountId);
            const amount = Number(row?.amount ?? 0);
            if (acc.name.toLowerCase().includes("dikurangi")) {
                total -= amount;
            } else {
                total += amount;
            }
        }
        return total;
    };

    // A.2 helpers - Sum by category prefix (Liabilitas / Ekuitas)
    const sumA2ByCategory = (category: string) => {
        let total = 0;
        for (const acc of a2Right) {
            if (!acc.category.toLowerCase().startsWith(category.toLowerCase())) continue;
            if (
                acc.name.toLowerCase().includes("jumlah liabilitas") ||
                acc.name.toLowerCase().includes("jumlah ekuitas")
            ) continue;
            const accountId = Number(acc.id);
            const row = a2Draft.get(accountId) ?? a2ByAccountId.get(accountId);
            const amount = Number(row?.amount ?? 0);
            total += amount;
        }
        return total;
    };

    const sumA2LiabilitasEkuitas = () => {
        return sumA2ByCategory("Liabilitas") + sumA2ByCategory("Ekuitas");
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
            <h2 className="text-xl font-semibold">
                REKONSILIASI LAPORAN KEUANGAN - (INDUSTRI)
            </h2>

            {/* Header */}
            <div>
                <div className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                    HEADER
                </div>
                <div className="p-4 bg-white w-full rounded-b-xl border border-t-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm">Tahun Pajak</Label>
                            <Input
                                type="text"
                                value={String(spt.year)}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                        <div>
                            <Label className="text-sm">
                                Nomor Identitas WP
                            </Label>
                            <Input
                                type="text"
                                value={user.npwp}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={["a"]}>
                <AccordionItem value="a">
                    <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                        A. PENGHASILAN NETO DARI USAHA DAN/ATAU PROFESI
                        BERDASARKAN LAPORAN KEUANGAN
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white w-full">
                        <Accordion type="multiple" defaultValue={["a1", "a2"]}>
                            {/* A.1 Laporan Laba Rugi */}
                            <AccordionItem value="a1">
                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                    A.1. LAPORAN LABA RUGI
                                </AccordionTrigger>
                                <AccordionContent className="p-4 bg-white w-full">
                                    <div className="w-full overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-center text-xs">
                                                        TINDAKAN
                                                    </TableHead>
                                                    <TableHead className="text-center text-xs">
                                                        KODE AKUN
                                                    </TableHead>
                                                    <TableHead className="text-center text-xs">
                                                        NAMA AKUN
                                                    </TableHead>
                                                    <TableHead className="text-center text-xs">
                                                        NILAI KOMERSIAL
                                                    </TableHead>
                                                    <TableHead className="text-center text-xs">
                                                        TIDAK TERMASUK OB JEK
                                                        PAJAK
                                                    </TableHead>
                                                    <TableHead className="text-center text-xs">
                                                        DIKENAKAN PPh BER SIFAT
                                                        FINAL
                                                    </TableHead>
                                                    <TableHead className="text-center text-xs">
                                                        OBJEK TIDAK FINAL
                                                    </TableHead>
                                                    <TableHead className="text-center text-xs">
                                                        PENYESUAIAN FISKAL
                                                        POSITIF
                                                    </TableHead>
                                                    <TableHead className="text-center text-xs">
                                                        PENYESUAIAN FISKAL
                                                        NEGATIF
                                                    </TableHead>
                                                    <TableHead className="text-center text-xs">
                                                        KODE PENYESUAIAN FISKAL
                                                    </TableHead>
                                                    <TableHead className="text-center text-xs">
                                                        NILAI FISKAL
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {A1_CATEGORIES_INDUSTRI.map(
                                                    (cat) => {
                                                        const list =
                                                            a1Accounts[cat] ??
                                                            [];
                                                        if (list.length === 0)
                                                            return null;

                                                        return (
                                                            <Fragment key={cat}>
                                                                <TableRow>
                                                                    <TableCell
                                                                        colSpan={
                                                                            11
                                                                        }
                                                                        className="font-semibold bg-gray-50"
                                                                    >
                                                                        {cat}
                                                                    </TableCell>
                                                                </TableRow>
                                                                {list.map(
                                                                    (acc) => {
                                                                        const accountId =
                                                                            Number(
                                                                                acc.id,
                                                                            );
                                                                        const row =
                                                                            a1Draft.get(
                                                                                accountId,
                                                                            ) ??
                                                                            a1ByAccountId.get(
                                                                                accountId,
                                                                            );
                                                                        const isSummary =
                                                                            isSummaryRow(
                                                                                acc,
                                                                            );
                                                                        const isPenjualanBruto =
                                                                            acc.name
                                                                                .toLowerCase()
                                                                                .includes(
                                                                                    "penjualan bruto",
                                                                                );
                                                                        const {
                                                                            sum: penjualanBrutoRow,
                                                                            found: hasPenjualanBrutoParts,
                                                                        } =
                                                                            isPenjualanBruto
                                                                                ? sumA1RowsByAccountNames(
                                                                                      [
                                                                                          "penjualan domestik",
                                                                                          "penjualan ekspor",
                                                                                      ],
                                                                                  )
                                                                                : {
                                                                                      sum: null,
                                                                                      found: false,
                                                                                  };
                                                                        const displayRow =
                                                                            isSummary
                                                                                ? (computedSummaryRow(
                                                                                      acc,
                                                                                  ) ??
                                                                                  row)
                                                                                : row;

                                                                        return (
                                                                            <TableRow
                                                                                key={
                                                                                    acc.id
                                                                                }
                                                                                className={
                                                                                    isSummary
                                                                                        ? "font-semibold"
                                                                                        : ""
                                                                                }
                                                                            >
                                                                                <TableCell className="text-center">
                                                                                    {!isSummary && (
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            size="icon"
                                                                                            onClick={() =>
                                                                                                openEditFor(
                                                                                                    acc,
                                                                                                )
                                                                                            }
                                                                                            className="h-7 w-7"
                                                                                        >
                                                                                            <Pencil className="w-3 h-3" />
                                                                                        </Button>
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell className="text-center">
                                                                                    {
                                                                                        acc.code
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {
                                                                                        acc.name
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {formatMoney(
                                                                                        displayRow?.commercial_value,
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {formatMoney(
                                                                                        displayRow?.non_taxable,
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {formatMoney(
                                                                                        displayRow?.subject_to_final,
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {formatMoney(
                                                                                        displayRow?.non_final,
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {formatMoney(
                                                                                        displayRow?.positive_fiscal,
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {formatMoney(
                                                                                        displayRow?.negative_fiscal,
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell className="text-center">
                                                                                    {displayRow?.correction_code ??
                                                                                        ""}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {formatMoney(
                                                                                        displayRow
                                                                                            ? computeFiscalAmount(
                                                                                                  displayRow,
                                                                                              )
                                                                                            : 0,
                                                                                    )}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    },
                                                                )}
                                                            </Fragment>
                                                        );
                                                    },
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* A.2 Neraca */}
                            <AccordionItem value="a2">
                                <AccordionTrigger className="bg-blue-950 text-white font-semibold p-4 w-full rounded">
                                    A.2. LAPORAN POSISI KEUANGAN (NERACA)
                                </AccordionTrigger>
                                <AccordionContent className="p-4 bg-white w-full">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Left - Aset */}
                                        <div className="w-full overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="text-center text-xs">
                                                            KODE AKUN
                                                        </TableHead>
                                                        <TableHead className="text-center text-xs">
                                                            DESKRIPSI
                                                        </TableHead>
                                                        <TableHead className="text-center text-xs"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(() => {
                                                        let currentCategory =
                                                            "";
                                                        return a2Left.map(
                                                            (acc) => {
                                                                const accountId =
                                                                    Number(
                                                                        acc.id,
                                                                    );
                                                                const row =
                                                                    a2Draft.get(
                                                                        accountId,
                                                                    ) ??
                                                                    a2ByAccountId.get(
                                                                        accountId,
                                                                    );
                                                                const amount =
                                                                    row?.amount ??
                                                                    0;
                                                                const showCategoryHeader =
                                                                    acc.category !==
                                                                    currentCategory;
                                                                currentCategory =
                                                                    acc.category;
                                                                                                                                const isJumlahAset =
                                                                    acc.name.toLowerCase().includes("jumlah aset");
                                                                const isTotal =
                                                                    acc.category === "Jumlah Aset";
                                                                const displayAmount = isJumlahAset
                                                                    ? sumA2Left()
                                                                    : amount;

                                                                return (
                                                                    <Fragment
                                                                        key={
                                                                            acc.id
                                                                        }
                                                                    >
                                                                        {showCategoryHeader && (
                                                                            <TableRow>
                                                                                <TableCell
                                                                                    colSpan={
                                                                                        3
                                                                                    }
                                                                                    className="font-semibold bg-gray-50"
                                                                                >
                                                                                    {
                                                                                        acc.category
                                                                                    }
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )}
                                                                        <TableRow
                                                                            className={
                                                                                isTotal
                                                                                    ? "font-bold"
                                                                                    : ""
                                                                            }
                                                                        >
                                                                            <TableCell className="text-center">
                                                                                {
                                                                                    acc.code
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {
                                                                                    acc.name
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell className="w-[140px]">
                                                                                <Input
                                                                                    value={formatMoney(
                                                                                        displayAmount,
                                                                                    )}
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        handleA2Change(
                                                                                            accountId,
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                    className={`text-right${isJumlahAset ? " bg-gray-100" : ""}`}
                                                                                    disabled={
                                                                                        isTotal || isJumlahAset
                                                                                    }
                                                                                    readOnly={isJumlahAset}
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </Fragment>
                                                                );
                                                            },
                                                        );
                                                    })()}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Right - Liabilitas + Ekuitas */}
                                        <div className="w-full overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="text-center text-xs">
                                                            KODE AKUN
                                                        </TableHead>
                                                        <TableHead className="text-center text-xs">
                                                            DESKRIPSI
                                                        </TableHead>
                                                        <TableHead className="text-center text-xs"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(() => {
                                                        let currentCategory =
                                                            "";
                                                        return a2Right.map(
                                                            (acc) => {
                                                                const accountId =
                                                                    Number(
                                                                        acc.id,
                                                                    );
                                                                const row =
                                                                    a2Draft.get(
                                                                        accountId,
                                                                    ) ??
                                                                    a2ByAccountId.get(
                                                                        accountId,
                                                                    );
                                                                const amount =
                                                                    row?.amount ??
                                                                    0;
                                                                const showCategoryHeader =
                                                                    acc.category !==
                                                                    currentCategory;
                                                                currentCategory =
                                                                    acc.category;
                                                                                                                                const isJumlahLiabEkuitas =
                                                                    acc.name.toLowerCase().includes("jumlah liabilitas") &&
                                                                    acc.name.toLowerCase().includes("ekuitas");
                                                                const isJumlahLiabilitas =
                                                                    !isJumlahLiabEkuitas &&
                                                                    acc.name.toLowerCase().includes("jumlah liabilitas");
                                                                const isJumlahEkuitas =
                                                                    !isJumlahLiabEkuitas &&
                                                                    acc.name.toLowerCase().includes("jumlah ekuitas");
                                                                const isTotal =
                                                                    acc.category === "Jumlah Liabilitas & Ekuitas";
                                                                const isSummaryA2 = isJumlahLiabEkuitas || isJumlahLiabilitas || isJumlahEkuitas;

                                                                const displayAmount = isJumlahLiabEkuitas
                                                                    ? sumA2LiabilitasEkuitas()
                                                                    : isJumlahLiabilitas
                                                                    ? sumA2ByCategory("Liabilitas")
                                                                    : isJumlahEkuitas
                                                                    ? sumA2ByCategory("Ekuitas")
                                                                    : amount;

                                                                return (
                                                                    <Fragment
                                                                        key={
                                                                            acc.id
                                                                        }
                                                                    >
                                                                        {showCategoryHeader && (
                                                                            <TableRow>
                                                                                <TableCell
                                                                                    colSpan={
                                                                                        3
                                                                                    }
                                                                                    className="font-semibold bg-gray-50"
                                                                                >
                                                                                    {
                                                                                        acc.category
                                                                                    }
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )}
                                                                        <TableRow
                                                                            className={
                                                                                isTotal
                                                                                    ? "font-bold"
                                                                                    : ""
                                                                            }
                                                                        >
                                                                            <TableCell className="text-center">
                                                                                {
                                                                                    acc.code
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {
                                                                                    acc.name
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell className="w-[140px]">
                                                                                <Input
                                                                                    value={formatMoney(
                                                                                        displayAmount,
                                                                                    )}
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        handleA2Change(
                                                                                            accountId,
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                    className={`text-right${isSummaryA2 ? " bg-gray-100" : ""}`}
                                                                                    disabled={
                                                                                        isTotal || isSummaryA2
                                                                                    }
                                                                                    readOnly={isSummaryA2}
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </Fragment>
                                                                );
                                                            },
                                                        );
                                                    })()}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        {/* <Button
                                            type="button"
                                            className="bg-blue-950 hover:bg-blue-900"
                                            onClick={handleSync}
                                            disabled={isSaving}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Simpan Konsep
                                        </Button> */}
                                        <Button
                                            type="button"
                                            className="bg-blue-950 hover:bg-blue-900"
                                            onClick={handleSyncA2}
                                            disabled={isSaving}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Simpan Neraca (A2)
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Edit Dialog */}
            <FormL3A1Dialog
                open={openEdit}
                onOpenChange={setOpenEdit}
                account={editAccount}
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={handleSaveDraft}
            />
        </div>
    );
}
