// Shared types for L3A tabs

export type SectorType = "dagang" | "jasa" | "industri";

export type MasterAccount = {
    id: string | number;
    code: string;
    category: string;
    name: string;
};

export type L3A13A1Item = {
    id?: string;
    spt_op_id: string;
    account_id: number;
    type: SectorType;
    commercial_value: number;
    non_taxable: number;
    subject_to_final: number;
    non_final: number;
    positive_fiscal: number;
    negative_fiscal: number;
    correction_code?: string | null;
    fiscal_amount: number;
};

export type L3A13A2Item = {
    id?: string;
    spt_op_id: string;
    account_id: number;
    type: SectorType;
    amount: number;
};

export type L3AProps = {
    user: { npwp: string };
    spt: { year: number };
    sptOpId: string;
    masterAccounts: MasterAccount[];
    l3a13a1: L3A13A1Item[];
    l3a13a2: L3A13A2Item[];
};

type AccountSorter = (accounts: MasterAccount[], category: string) => MasterAccount[];

// A.2 Neraca categories (same for all types)
export const A2_LEFT_CATEGORIES = [
    "Aset Lancar",
    "Aset Tidak Lancar",
    "Jumlah Aset",
];

export const A2_RIGHT_CATEGORIES = [
    "Liabilitas Jangka Pendek",
    "Liabilitas Jangka Panjang",
    "Ekuitas",
    "Jumlah Liabilitas & Ekuitas",
];

// A.1 Laporan Laba Rugi categories by sector type
export const A1_CATEGORIES_DAGANG = [
    "Penjualan",
    "Dikurangi :",
    "Penjualan Bersih",
    "Harga Pokok Penjualan (HPP)",
    "Laba Kotor",
    "Beban Usaha",
    "Jumlah Beban Usaha",
    "Laba (Rugi) Sebelum Pajak",
] as const;

export const A1_CATEGORIES_JASA = [
    "Pendapatan",
    "Laba Kotor",
    "Beban Usaha",
    "Jumlah Beban Usaha",
    "Laba (Rugi) Sebelum Pajak",
] as const;

export const A1_CATEGORIES_INDUSTRI = [
    "Penjualan",
    "Dikurangi :",
    "Biaya Overhead Pabrik",
    "Penjualan Bersih",
    "Biaya Pabrikasi",
    "Jumlah Biaya Pabrikasi",
    "Jumlah Biaya Produksi",
    "Jumlah Harga Pokok Produksi",
    "Jumlah Harga Pokok Penjualan",
    "Laba Kotor",
    "Beban Usaha",
    "Jumlah Beban Usaha",
    "Laba (Rugi) Sebelum Pajak",
] as const;

// Kode Penyesuaian Fiskal options
export const KODE_PENYESUAIAN_FISKAL_OPTIONS = [
    { value: "", label: "Silakan Pilih" },
    { value: "FPO-01", label: "FPO-01 Biaya yang dibebankan/dikeluarkan untuk kepentingan pribadi Wajib Pajak atau orang yang menjadi tanggungannya" },
    { value: "FPO-02", label: "FPO-02 Premi Asuransi kesehatan, asuransi kecelakaan, asuransi jiwa, asuransi dwiguna, dan asuransi beasiswa yang dibayar oleh Wajib Pajak" },
    { value: "FPO-04", label: "FPO-04 Jumlah yang melebihi kewajaran yang dibayarkan kepada pihak yang mempunyai hubungan istimewa sehubungan dengan pekerjaan yang dilakukan" },
    { value: "FPO-05", label: "FPO-05 Harta yang dihibahkan, bantuan atau sumbangan" },
    { value: "FPO-06", label: "FPO-06 Pajak penghasilan" },
    { value: "FPO-07", label: "FPO-07 Gaji yang dibayarkan kepada pemilik/orang yang menjadi tanggungannya" },
    { value: "FPO-08", label: "FPO-08 Sanksi administrasi" },
    { value: "FPO-09", label: "FPO-09 Selisih penyusutan komersial di atas penyusutan fiskal" },
    { value: "FPO-10", label: "FPO-10 Selisih amortisasi komersial di atas amortisasi fiskal" },
    { value: "FPO-11", label: "FPO-11 Biaya untuk mendapatkan, menagih dan memelihara penghasilan yang dikenakan PPh Final dan penghasilan yang tidak termasuk objek pajak" },
    { value: "FPO-12", label: "FPO-12 Penyesuaian fiskal positif lainnya" },
    { value: "FNE-01", label: "FNE-01 Penghasilan yang dikenakan PPh final dan penghasilan yang tidak termasuk objek pajak tetapi termasuk dalam peredaran usaha" },
    { value: "FNE-02", label: "FNE-02 Selisih penyusutan komersial di bawah penyusutan fiskal" },
    { value: "FNE-03", label: "FNE-03 Selisih amortisasi komersial di bawah amortisasi fiskal" },
    { value: "FNE-04", label: "FNE-04 Penyesuaian fiskal negatif lainnya" },
] as const;

// Utility functions
const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

export const formatMoney = (value: unknown) => {
    const numeric = Number(value ?? 0);
    const safe = Number.isFinite(numeric) ? numeric : 0;
    return rupiahFormatter.format(safe).replace("Rp", "").trim();
};

export const parseDigits = (value: string) => {
    const raw = value.replace(/[^0-9]/g, "");
    return raw ? Number(raw) : 0;
};

export function computeFiscalAmount(
    item: Pick<
        L3A13A1Item,
        "non_final" | "positive_fiscal" | "negative_fiscal"
    >,
) {
    const nonFinal = Number(item.non_final ?? 0);
    const pos = Number(item.positive_fiscal ?? 0);
    const neg = Number(item.negative_fiscal ?? 0);
    return nonFinal + pos - neg;
}

export function buildA1AccountsByCategory(
    masterAccounts: MasterAccount[] = [],
    categories: readonly string[],
    sorter?: AccountSorter,
) {
    const byCategory: Record<string, MasterAccount[]> = {};

    for (const acc of masterAccounts) {
        if (!categories.includes(acc.category)) continue;
        byCategory[acc.category] = byCategory[acc.category] ?? [];
        byCategory[acc.category].push(acc);
    }

    for (const category of Object.keys(byCategory)) {
        const list = byCategory[category] ?? [];
        byCategory[category] = sorter
            ? sorter(list, category)
            : [...list].sort((a, b) => Number(a.code) - Number(b.code));
    }

    return byCategory;
}

export function buildAccountsByCategories(
    masterAccounts: MasterAccount[] = [],
    categories: readonly string[],
) {
    return masterAccounts
        .filter((account) => categories.includes(account.category))
        .sort((a, b) => Number(a.code) - Number(b.code));
}

export function buildA1SyncRows(
    draft: Map<number, L3A13A1Item>,
    sptOpId: string,
    type: SectorType,
) {
    const rows: L3A13A1Item[] = [];

    for (const [accountId, row] of draft.entries()) {
        rows.push({
            ...row,
            spt_op_id: sptOpId,
            account_id: accountId,
            type,
            fiscal_amount: computeFiscalAmount(row),
        });
    }

    return rows;
}

export function buildA2SyncRows(
    draft: Map<number, L3A13A2Item>,
    sptOpId: string,
    type: SectorType,
) {
    const rows: L3A13A2Item[] = [];

    for (const [accountId, row] of draft.entries()) {
        rows.push({
            ...row,
            spt_op_id: sptOpId,
            account_id: accountId,
            type,
        });
    }

    return rows;
}
