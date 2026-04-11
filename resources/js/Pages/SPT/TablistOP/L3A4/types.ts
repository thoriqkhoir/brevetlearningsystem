export type L3A4AItem = {
    id?: string;
    spt_op_id: string;
    business_place: string | null;
    business_type: string | null;
    gross_income: number;
    norma: number;
    net_income: number;
};

export type L3A4BItem = {
    id?: string;
    spt_op_id: string;
    code: string;
    income_type: string | null;
    net_income: number;
};

export type MasterTku = {
    id: string;
    code: string;
    name: string;
};

export type MasterObject = {
    id: string;
    code: string;
    name: string;
    kap: string;
};

export const L3A4B_INCOME_TYPE_OPTIONS = [
    {
        code: "207",
        label: "Penggantian atau imbalan yang diberikan dalam bentuk natura atau kenikmatan",
    },
    { code: "302", label: "Sewa harta selain tanah dan/atau bangunan" },
    { code: "304", label: "Bunga" },
    { code: "306", label: "Royalti" },
    { code: "307", label: "Keuntungan Penjualan Harta" },
    { code: "314", label: "Imbalan Bunga" },
    { code: "319", label: "Keuntungan Kurs Valuta Asing" },
    { code: "399", label: "Penghasilan Lain dari Modal atau Aset" },
    { code: "401", label: "Pembebasan Utang" },
    { code: "402", label: "Hibah" },
    { code: "403", label: "Bantuan/Sumbangan" },
    { code: "407", label: "Klaim Asuransi" },
    { code: "408", label: "Beasiswa" },
    { code: "409", label: "Hadiah/Undian" },
    { code: "412", label: "Penghasilan Domestik lainnya" },
] as const;

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

export function computeNetIncomeFromNorma(grossIncome: number, norma: number) {
    const gross = Number(grossIncome ?? 0);
    const pct = Number(norma ?? 0);
    if (!Number.isFinite(gross) || !Number.isFinite(pct)) return 0;
    return Math.round((gross * pct) / 100);
}
