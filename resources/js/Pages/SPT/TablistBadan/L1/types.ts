// Shared types for SPT Badan L1A tabs

export type SectorCode = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l";

export type MasterAccount = {
    id: string | number;
    code: string;
    category: string;
    name: string;
};

export type L1A1Item = {
    id?: string;
    spt_badan_id: string;
    account_id: number;
    account_code?: string;
    code: string;
    amount: number;
    non_taxable: number;
    subject_to_final: number;
    non_final: number;
    fiscal_positive: number;
    fiscal_negative: number;
    fiscal_code?: string | null;
    fiscal_amount: number;
};

export type L1A2Item = {
    id?: string;
    spt_badan_id: string;
    account_id: number;
    account_code?: string;
    code: string;
    amount: number;
};

export type L1ALayoutAccount = {
    id: number | null;
    code: string;
    name: string;
    category: string;
};

export type L1ALayout = {
    a1: Record<string, L1ALayoutAccount[]>;
    a2: {
        left: L1ALayoutAccount[];
        right: L1ALayoutAccount[];
    };
};

export type L1AProps = {
    user: { npwp: string };
    spt: { year: number };
    sptBadanId: string;
    masterAccounts: MasterAccount[];
    l1aLayout?: L1ALayout;
    l1a1: L1A1Item[];
    l1a2: L1A2Item[];
    sectorCode?: SectorCode;
    a1Categories?: readonly string[];
    heading?: string;
    showEmptyCategoryTitle?: boolean;
};

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
export const A1A = [
    "Penjualan",
    "Dikurangi :",
    "Penjualan Bersih",
    "Harga Pokok Penjualan (HPP)",
    "Laba Kotor",
    "Beban Usaha",
    "Jumlah Beban Usaha",
    "Laba (Rugi) Sebelum Pajak",
    "Pendapatan Non Usaha",
    "Beban Non Usaha",
] as const;

export const A1B = [
    "Penjualan",
    "Dikurangi :",
    "Harga Pokok Produksi",
    "Biaya Bahan Baku",
    "Biaya Pabrikasi",
    "Beban Usaha",
    "Pendapatan Non Usaha",
    "Beban Non Usaha",
] as const;

export const A1C = [
    "Penjualan",
    "Dikurangi :",
    "Penjualan Bersih",
    "Harga Pokok Penjualan (HPP)",
    "Laba Kotor",
    "Beban Usaha",
    "Jumlah Beban Usaha",
    "Laba (Rugi) Sebelum Pajak",
    "Pendapatan Non Usaha",
    "Beban Non Usaha",
] as const;

export const A1D = [
    "Pendapatan :",
    "Penjualan",
    "Dikurangi :",
    "Penjualan Bersih",
    "Harga Pokok Penjualan (HPP)",
    "Laba Kotor",
    "Beban Usaha",
    "Jumlah Beban Usaha",
    "Laba (Rugi) Sebelum Pajak",
    "Pendapatan Non Usaha",
    "Beban Non Usaha",
] as const;

export const A1E = [
    "Pendapatan Bunga",
    "Beban Bunga :",
    "Pendapatan Operasional Lain",
    "Beban Operasional Lain",
    "Laba Kotor",
    "Beban Usaha",
    "Jumlah Beban Usaha",
    "Laba (Rugi) Sebelum Pajak",
] as const;

export const A1F = [
    "Pendapatan Investasi",
    "Beban Investasi",
    "Beban Operasional",
    "Laba (Rugi) Non Operasional",
    "Laba Kotor",
    "Beban Usaha",
    "Jumlah Beban Usaha",
    "Laba (Rugi) Sebelum Pajak",
] as const;


export const A1G = [
    "Pendapatan",
    "Beban Underwriting",
    "Beban Operasional",
    "Harga Pokok Penjualan (HPP)",
    "Laba Kotor",
    "Beban Usaha",
    "Jumlah Beban Usaha",
    "Laba (Rugi) Sebelum Pajak",
] as const;


export const A1H = [
    "Penjualan",
    "Dikurangi :",
    "Beban Usaha",
    "Pendapatan Non Usaha",
    "Beban Non Usaha",
    "Penjualan Bersih",
    "Harga Pokok Penjualan (HPP)",
    "Laba Kotor",
    "Jumlah Beban Usaha",
    "Laba (Rugi) Sebelum Pajak",
] as const;

export const A1I = [
    "Pendapatan dan Beban Operasional",
    "Pendapatan dari Penyaluran Dana",
    "Pendapatan dari Piutang",
    "Pendapatan Bagi Hasil",
    "Bagi Hasil untuk Pemilik Dana Investasi",
    "Pendapatan dan Beban Operasional selain dari Penyaluran Dana",
    "Pendapatan Operasional Lain",
    "Beban Operasional Lainnya",
    "PENDAPATAN NON-OPERASIONAL",
    "BEBAN NON-OPERASIONAL"
] as const;

export const A1J = [
    "Penjualan",
    "Beban Usaha",
    "Pendapatan Non Usaha",
    "Beban Non Usaha",
] as const;

export const A1K = [
    "Pendapatan Usaha",
    "Beban Usaha",
    "Pendapatan di luar usaha",
    "Beban di luar usaha",
    
] as const;

export const A1L = [
    "Pendapatan Usaha",
    "Beban Usaha",
    "Pendapatan di Luar Usaha",
    "Beban  di Luar Usaha",
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
        L1A1Item,
        "non_final" | "fiscal_positive" | "fiscal_negative"
    >,
) {
    const nonFinal = Number(item.non_final ?? 0);
    const pos = Number(item.fiscal_positive ?? 0);
    const neg = Number(item.fiscal_negative ?? 0);
    return nonFinal + pos - neg;
}
