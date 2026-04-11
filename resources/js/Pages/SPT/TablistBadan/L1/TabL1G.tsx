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
    type L1AProps,
    type L1A1Item,
    type L1A2Item,
    type MasterAccount,
    A1G,
    A2_LEFT_CATEGORIES,
    A2_RIGHT_CATEGORIES,
    formatMoney,
    parseDigits,
    computeFiscalAmount,
} from "./types";
import FormL1ADialog from "./FormL1ADialog";
import toast from "react-hot-toast";
import TabL1AComponent from "./TabL1A";

export default function TabL1G(props: L1AProps) {
    return (
        <TabL1AComponent
            {...props}
            sectorCode="g"
            a1Categories={A1G}
            heading="REKONSILIASI LAPORAN KEUANGAN - ASURANSI"
        />
    );
}

const CODE: "g" = "g";

function LegacyTabL1G({
    user,
    spt,
    sptBadanId,
    masterAccounts,
    l1a1,
    l1a2,
}: L1AProps) {
    const [isSaving, setIsSaving] = useState(false);

    // Group A.1 accounts by category
    const a1Accounts = useMemo(() => {
        const byCategory: Record<string, MasterAccount[]> = {};
        for (const acc of masterAccounts ?? []) {
            const cats = A1G as readonly string[];
            if (!cats.includes(acc.category)) continue;
            if (acc.category === "Dikurangi :" && Number(acc.code) >= 5000) continue;
            byCategory[acc.category] = byCategory[acc.category] ?? [];
            byCategory[acc.category].push(acc);
        }
        for (const cat of Object.keys(byCategory)) {
            if (cat === "Harga Pokok Penjualan (HPP)") {
                // Special sorting for HPP: non-4 codes first, then 4-codes
                byCategory[cat].sort((a, b) => {
                    const codeA = String(a.code);
                    const codeB = String(b.code);
                    const startsWithA = codeA.startsWith("4");
                    const startsWithB = codeB.startsWith("4");

                    // If one starts with 4 and other doesn't, non-4 comes first
                    if (startsWithA && !startsWithB) return 1;
                    if (!startsWithA && startsWithB) return -1;

                    // Otherwise sort numerically within their group
                    return Number(a.code) - Number(b.code);
                });
            } else {
                byCategory[cat].sort((a, b) => Number(a.code) - Number(b.code));
            }
        }
        return byCategory;
    }, [masterAccounts]);

    // A.2 Neraca left side (Aset)
    const a2Left = useMemo(() => {
        return (masterAccounts ?? [])
            .filter((a) => A2_LEFT_CATEGORIES.includes(a.category))
            .sort((a, b) => Number(a.code) - Number(b.code));
    }, [masterAccounts]);

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

    const sumA2ByCategory = (category: string) => {
    let total = 0;
    for (const acc of a2Right) {
        // Cek awalan kategori, bukan exact match
        if (!acc.category.toLowerCase().startsWith(category.toLowerCase())) continue;
        if (
            acc.name.toLowerCase().includes("jumlah liabilitas") ||
            acc.name.toLowerCase().includes("jumlah ekuitas")
        ) continue; // skip summary rows themselves
        const accountId = Number(acc.id);
        const row = a2Draft.get(accountId) ?? a2ByAccountId.get(accountId);
        const amount = Number(row?.amount ?? 0);

        // Debug log
        
        total += amount;
    }
    
    return total;
};

const sumA2LiabilitasEkuitas = () => {
    const liabilitas = sumA2ByCategory("Liabilitas");
    const ekuitas = sumA2ByCategory("Ekuitas");
    const total = liabilitas + ekuitas;

    // Cek kategori apa saja yang ada di a2Right
    
    return total;
};
    

    // A.2 Neraca right side (Liabilitas + Ekuitas)
    const a2Right = useMemo(() => {
        return (masterAccounts ?? [])
            .filter((a) => A2_RIGHT_CATEGORIES.includes(a.category))
            .sort((a, b) => Number(a.code) - Number(b.code));
    }, [masterAccounts]);

    // Map existing A.1 data by account_id
    const a1ByAccountId = useMemo(() => {
        const map = new Map<number, L1A1Item>();
        for (const raw of l1a1 ?? []) {
            if ((raw?.code ?? "") !== CODE) continue;
            const accountId = Number(raw.account_id);
            if (!Number.isFinite(accountId)) continue;
            map.set(accountId, {
                id: raw.id,
                spt_badan_id: String(raw.spt_badan_id ?? sptBadanId),
                account_id: accountId,
                code: CODE,
                amount: Number(raw.amount ?? 0),
                non_taxable: Number(raw.non_taxable ?? 0),
                subject_to_final: Number(raw.subject_to_final ?? 0),
                non_final: Number(raw.non_final ?? 0),
                fiscal_positive: Number(raw.fiscal_positive ?? 0),
                fiscal_negative: Number(raw.fiscal_negative ?? 0),
                fiscal_code: raw.fiscal_code ?? null,
                fiscal_amount: Number(raw.fiscal_amount ?? 0),
            });
        }
        return map;
    }, [l1a1, sptBadanId]);

    // Map existing A.2 data by account_id
    const a2ByAccountId = useMemo(() => {
        const map = new Map<number, L1A2Item>();
        for (const raw of l1a2 ?? []) {
            if ((raw?.code ?? "") !== CODE) continue;
            const accountId = Number(raw.account_id);
            if (!Number.isFinite(accountId)) continue;
            map.set(accountId, {
                id: raw.id,
                spt_badan_id: String(raw.spt_badan_id ?? sptBadanId),
                account_id: accountId,
                code: CODE,
                amount: Number(raw.amount ?? 0),
            });
        }
        return map;
    }, [l1a2, sptBadanId]);

    // Draft state
    const [a1Draft, setA1Draft] = useState<Map<number, L1A1Item>>(
        () => new Map(a1ByAccountId),
    );
    const [a2Draft, setA2Draft] = useState<Map<number, L1A2Item>>(
        () => new Map(a2ByAccountId),
    );

    // Edit dialog state
    const [openEdit, setOpenEdit] = useState(false);
    const [editAccount, setEditAccount] = useState<MasterAccount | null>(null);
    const [editForm, setEditForm] = useState<L1A1Item | null>(null);

    const openEditFor = (acc: MasterAccount) => {
        setEditAccount(acc);
        const accountId = Number(acc.id);
        const current = a1Draft.get(accountId) ??
            a1ByAccountId.get(accountId) ?? {
                spt_badan_id: sptBadanId,
                account_id: accountId,
                code: CODE,
                amount: 0,
                non_taxable: 0,
                subject_to_final: 0,
                non_final: 0,
                fiscal_positive: 0,
                fiscal_negative: 0,
                fiscal_code: null,
                fiscal_amount: 0,
            };
        const normalized: L1A1Item = {
            ...current,
            spt_badan_id: String(current.spt_badan_id ?? sptBadanId),
            account_id: accountId,
            code: CODE,
            amount: Number(current.amount ?? 0),
            non_taxable: Number(current.non_taxable ?? 0),
            subject_to_final: Number(current.subject_to_final ?? 0),
            non_final: Number(current.non_final ?? 0),
            fiscal_positive: Number(current.fiscal_positive ?? 0),
            fiscal_negative: Number(current.fiscal_negative ?? 0),
            fiscal_code: current.fiscal_code ?? null,
            fiscal_amount: Number(current.fiscal_amount ?? 0),
        };
        const fiscal_amount = computeFiscalAmount(normalized);
        setEditForm({ ...normalized, fiscal_amount });
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

        if (!sptBadanId) {
            setOpenEdit(false);
            return;
        }

        setIsSaving(true);

        const allRows: L1A1Item[] = [];
        for (const [accountId, row] of updatedDraft.entries()) {
            allRows.push({
                ...row,
                spt_badan_id: sptBadanId,
                account_id: accountId,
                code: CODE,
                amount: Number(row.amount ?? 0),
                non_taxable: Number(row.non_taxable ?? 0),
                subject_to_final: Number(row.subject_to_final ?? 0),
                non_final: Number(row.non_final ?? 0),
                fiscal_positive: Number(row.fiscal_positive ?? 0),
                fiscal_negative: Number(row.fiscal_negative ?? 0),
                fiscal_code: row.fiscal_code ?? null,
                fiscal_amount: computeFiscalAmount(row),
            });
        }

        // Hitung laba rugi dari updatedDraft (bukan a1Draft yang lama)
        const labaRugiAccount = masterAccounts?.find(
            (a) =>
                a.name.toLowerCase().includes("laba") &&
                a.name.toLowerCase().includes("sebelum pajak"),
        );

        if (labaRugiAccount) {
            const labaRugiAccountId = Number(labaRugiAccount.id);

            // Gunakan computedSummaryRowFromDraft
            const labaRugiRow = computedSummaryRowFromDraft(
                { name: "Laba (Rugi) Sebelum Pajak" } as MasterAccount,
                updatedDraft,
            );

            if (labaRugiRow) {
                const newRow: L1A1Item = {
                    ...labaRugiRow,
                    spt_badan_id: sptBadanId,
                    account_id: labaRugiAccountId,
                    code: CODE,
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
            route("spt.badan.l1g1.sync"),
            { spt_badan_id: sptBadanId, rows: allRows },
            {
                preserveScroll: true,
                onSuccess: () => setOpenEdit(false),
                onError: (errors) => toast.error(Object.values(errors).join(", ")),
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
                    spt_badan_id: sptBadanId,
                    account_id: accountId,
                    code: CODE,
                    amount: 0,
                }),
                amount,
            });
            return next;
        });
    };

    const handleSync = () => {
        if (!sptBadanId) return;
        setIsSaving(true);

        const a1Rows: L1A1Item[] = [];
        for (const [accountId, row] of a1Draft.entries()) {
            a1Rows.push({
                ...row,
                spt_badan_id: sptBadanId,
                account_id: accountId,
                code: CODE,
                amount: Number(row.amount ?? 0),
                non_taxable: Number(row.non_taxable ?? 0),
                subject_to_final: Number(row.subject_to_final ?? 0),
                non_final: Number(row.non_final ?? 0),
                fiscal_positive: Number(row.fiscal_positive ?? 0),
                fiscal_negative: Number(row.fiscal_negative ?? 0),
                fiscal_code: row.fiscal_code ?? null,
                fiscal_amount: computeFiscalAmount(row),
            });
        }

        // Gunakan computedSummaryRowFromDraft dengan a1Draft saat ini
        const labaRugiAccount = masterAccounts?.find(
            (a) =>
                a.name.toLowerCase().includes("laba") &&
                a.name.toLowerCase().includes("sebelum pajak"),
        );

        if (labaRugiAccount) {
            const labaRugiAccountId = Number(labaRugiAccount.id);
            const labaRugiRow = computedSummaryRowFromDraft(
                { name: "Laba (Rugi) Sebelum Pajak" } as MasterAccount,
                a1Draft,
            );

            if (labaRugiRow) {
                const newRow: L1A1Item = {
                    ...labaRugiRow,
                    spt_badan_id: sptBadanId,
                    account_id: labaRugiAccountId,
                    code: CODE,
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

        const a2Rows: L1A2Item[] = [];
        for (const [accountId, row] of a2Draft.entries()) {
            a2Rows.push({
                ...row,
                spt_badan_id: sptBadanId,
                account_id: accountId,
                code: CODE,
            });
        }

        router.post(
            route("spt.badan.l1g1.sync"),
            { spt_badan_id: sptBadanId, rows: a1Rows },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.post(
                        route("spt.badan.l1g2.sync"),
                        { spt_badan_id: sptBadanId, rows: a2Rows },
                        {
                            preserveScroll: true,
                            onError: (errors) => toast.error(Object.values(errors).join(", ")),
                            onFinish: () => setIsSaving(false),
                        },
                    );
                },
                onError: (errors) => {
                    toast.error(Object.values(errors).join(", "));
                    setIsSaving(false);
                },
            },
        );
    };

    const handleSyncA2 = () => {
        if (!sptBadanId) return;
        setIsSaving(true);

        const a2Rows: L1A2Item[] = [];
        for (const [accountId, row] of a2Draft.entries()) {
            a2Rows.push({
                ...row,
                spt_badan_id: sptBadanId,
                account_id: accountId,
                code: CODE,
            });
        }

        router.post(
            route("spt.badan.l1g2.sync"),
            { spt_badan_id: sptBadanId, rows: a2Rows },
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

    // Tambahkan ini SEBELUM return statement, setelah fungsi sumA1RowsByAccountNames

    // Helper: sum all rows in a specific category
    const sumA1RowsByCategory = (category: string): L1A1Item => {
        const sum: L1A1Item = {
            spt_badan_id: sptBadanId,
            account_id: 0,
            code: CODE,
            amount: 0,
            non_taxable: 0,
            subject_to_final: 0,
            non_final: 0,
            fiscal_positive: 0,
            fiscal_negative: 0,
            fiscal_code: null,
            fiscal_amount: 0,
        };
        const list = a1Accounts[category] ?? [];
        for (const acc of list) {
            if (isSummaryRow(acc)) continue; // skip summary rows themselves
            const accountId = Number(acc.id);
            const row = a1Draft.get(accountId) ?? a1ByAccountId.get(accountId);
            if (!row) continue;
            sum.amount += Number(row.amount ?? 0);
            sum.non_taxable += Number(row.non_taxable ?? 0);
            sum.subject_to_final += Number(row.subject_to_final ?? 0);
            sum.non_final += Number(row.non_final ?? 0);
            sum.fiscal_positive += Number(row.fiscal_positive ?? 0);
            sum.fiscal_negative += Number(row.fiscal_negative ?? 0);
        }
        return sum;
    };

    // Helper: subtract two L1A1Items (a - b)
    const subtractRows = (a: L1A1Item, b: L1A1Item): L1A1Item => ({
        ...a,
        amount: a.amount - b.amount,
        non_taxable: a.non_taxable - b.non_taxable,
        subject_to_final: a.subject_to_final - b.subject_to_final,
        non_final: a.non_final - b.non_final,
        fiscal_positive: a.fiscal_positive - b.fiscal_positive,
        fiscal_negative: a.fiscal_negative - b.fiscal_negative,
    });

    // Helper: add two L1A1Items (a + b)
    const addRows = (a: L1A1Item, b: L1A1Item): L1A1Item => ({
        ...a,
        amount: a.amount + b.amount,
        non_taxable: a.non_taxable + b.non_taxable,
        subject_to_final: a.subject_to_final + b.subject_to_final,
        non_final: a.non_final + b.non_final,
        fiscal_positive: a.fiscal_positive + b.fiscal_positive,
        fiscal_negative: a.fiscal_negative + b.fiscal_negative,
    });

    const emptyRow: L1A1Item = {
        spt_badan_id: sptBadanId,
        account_id: 0,
        code: CODE,
        amount: 0,
        non_taxable: 0,
        subject_to_final: 0,
        non_final: 0,
        fiscal_positive: 0,
        fiscal_negative: 0,
        fiscal_code: null,
        fiscal_amount: 0,
    };

    // Compute summary rows dynamically
    const computedSummaryRow = (acc: MasterAccount): L1A1Item | null => {
        const name = acc.name.toLowerCase();

        // Penjualan Bruto = Penjualan Domestik + Penjualan Ekspor
        if (name.includes("penjualan bruto")) {
            const { sum } = sumA1RowsByAccountNames([
                "penjualan domestik",
                "penjualan ekspor",
            ]);
            return sum;
        }

        // Penjualan Bersih = Penjualan Bruto - Potongan dan Retur Penjualan
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

        if (name.includes("jumlah hpp") || name.includes("jumlah harga pokok penjualan")) {
            const { sum: pembelian } = sumA1RowsByAccountNames(["pembelian"]);
            const { sum: persediaanAwal } = sumA1RowsByAccountNames(["persediaan - awal"]);
            const { sum: persediaanAkhir } = sumA1RowsByAccountNames(["persediaan akhir"]);

            return subtractRows(addRows(pembelian, persediaanAwal), persediaanAkhir);
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

    const sumA1RowsByAccountNames = (nameIncludes: string[]) => {
        const normalized = nameIncludes.map((name) => name.toLowerCase());
        const sum: L1A1Item = {
            spt_badan_id: sptBadanId,
            account_id: 0,
            code: CODE,
            amount: 0,
            non_taxable: 0,
            subject_to_final: 0,
            non_final: 0,
            fiscal_positive: 0,
            fiscal_negative: 0,
            fiscal_code: null,
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
            sum.amount += Number(row.amount ?? 0);
            sum.non_taxable += Number(row.non_taxable ?? 0);
            sum.subject_to_final += Number(row.subject_to_final ?? 0);
            sum.non_final += Number(row.non_final ?? 0);
            sum.fiscal_positive += Number(row.fiscal_positive ?? 0);
            sum.fiscal_negative += Number(row.fiscal_negative ?? 0);
        }

        return { sum, found };
    };

    // Helper yang menerima draft eksplisit agar bisa dipakai sebelum setState selesai
    const computedSummaryRowFromDraft = (
        acc: MasterAccount,
        draft: Map<number, L1A1Item>,
    ): L1A1Item | null => {
        const name = acc.name.toLowerCase();

        const sumByNameFromDraft = (nameIncludes: string[]) => {
            const normalized = nameIncludes.map((n) => n.toLowerCase());
            const sum: L1A1Item = { ...emptyRow };
            for (const a of masterAccounts ?? []) {
                const aName = a.name.toLowerCase();
                if (!normalized.some((needle) => aName.includes(needle))) continue;
                const accountId = Number(a.id);
                const row = draft.get(accountId) ?? a1ByAccountId.get(accountId);
                if (!row) continue;
                sum.amount          += Number(row.amount ?? 0);
                sum.non_taxable     += Number(row.non_taxable ?? 0);
                sum.subject_to_final+= Number(row.subject_to_final ?? 0);
                sum.non_final       += Number(row.non_final ?? 0);
                sum.fiscal_positive += Number(row.fiscal_positive ?? 0);
                sum.fiscal_negative += Number(row.fiscal_negative ?? 0);
            }
            return sum;
        };

        const sumByCategoryFromDraft = (category: string) => {
            const sum: L1A1Item = { ...emptyRow };
            const list = a1Accounts[category] ?? [];
            for (const a of list) {
                if (isSummaryRow(a)) continue;
                const accountId = Number(a.id);
                const row = draft.get(accountId) ?? a1ByAccountId.get(accountId);
                if (!row) continue;
                sum.amount          += Number(row.amount ?? 0);
                sum.non_taxable     += Number(row.non_taxable ?? 0);
                sum.subject_to_final+= Number(row.subject_to_final ?? 0);
                sum.non_final       += Number(row.non_final ?? 0);
                sum.fiscal_positive += Number(row.fiscal_positive ?? 0);
                sum.fiscal_negative += Number(row.fiscal_negative ?? 0);
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
        if (name.includes("jumlah hpp") || name.includes("jumlah harga pokok penjualan")) {
            return subtractRows(
                addRows(
                    sumByNameFromDraft(["pembelian"]),
                    sumByNameFromDraft(["persediaan - awal"]),
                ),
                sumByNameFromDraft(["persediaan akhir"]),
            );
        }
        if (name.includes("laba kotor")) {
            return subtractRows(recurse("Penjualan Bersih"), recurse("Jumlah HPP"));
        }
        if (name.includes("jumlah beban usaha")) {
            return sumByCategoryFromDraft("Beban Usaha");
        }
        if (name.includes("laba") && name.includes("sebelum pajak")) {
            return subtractRows(recurse("Laba Kotor"), recurse("Jumlah Beban Usaha"));
        }

        return null;
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800 space-y-6">
            <h2 className="text-xl font-semibold">
                REKONSILIASI LAPORAN KEUANGAN - ASURANSI
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
                            <Label className="text-sm">NPWP</Label>
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
                                                        TIDAK TERMASUK OBJEK
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
                                                {A1G.map(
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

                                                                        // Untuk summary rows, hitung otomatis dari baris-baris di atasnya
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
                                                                                        displayRow?.amount,
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
                                                                                        displayRow?.fiscal_positive,
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {formatMoney(
                                                                                        displayRow?.fiscal_negative,
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell className="text-center">
                                                                                    {displayRow?.fiscal_code ?? ""}
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
                                                                const isTotal =
                                                                    acc.category ===
                                                                    "Jumlah Aset";

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
                                                                                    value={
                                                                                        isTotal
                                                                                            ? formatMoney(sumA2Left())
                                                                                            : formatMoney(amount)
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        handleA2Change(
                                                                                            accountId,
                                                                                            e.target.value,
                                                                                        )
                                                                                    }
                                                                                    className="text-right"
                                                                                    disabled={isTotal}
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
                                                            
                                                                    acc.category ===
                                                                    "Jumlah Liabilitas & Ekuitas";

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
                                                                    value={
                                                                        isJumlahLiabEkuitas
                                                                            ? (() => {
                                                                                const val = sumA2LiabilitasEkuitas();
                                                                                
                                                                                return formatMoney(val);
                                                                            })()
                                                                            : isJumlahLiabilitas
                                                                            ? (() => {
                                                                                const val = sumA2ByCategory("Liabilitas");
                                                                                
                                                                                return formatMoney(val);
                                                                            })()
                                                                            : isJumlahEkuitas
                                                                            ? (() => {
                                                                                const val = sumA2ByCategory("Ekuitas");
                                                                                
                                                                                return formatMoney(val);
                                                                            })()
                                                                            : formatMoney(amount)
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleA2Change(accountId, e.target.value)
                                                                    }
                                                                    className="text-right"
                                                                    disabled={isJumlahLiabilitas || isJumlahEkuitas || isJumlahLiabEkuitas}
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
            <FormL1ADialog
                open={openEdit && !!editForm && !!editAccount}
                onOpenChange={setOpenEdit}
                account={editAccount}
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={handleSaveDraft}
            />
        </div>
    );
}
