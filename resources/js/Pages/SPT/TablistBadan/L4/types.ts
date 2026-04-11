// Shared types for SPT Badan Lampiran L-4

export interface L4TaxObjectOption {
    code: string;
    name: string;
}

export const L4_TAX_OBJECT_OPTIONS: readonly L4TaxObjectOption[] = [
    { code: "303", name: "Dividen" },
    { code: "401", name: "Pembebasan Utang" },
    { code: "402", name: "Hibah" },
    { code: "403", name: "Bantuan/Sumbangan" },
    { code: "404", name: "Warisan" },
    {
        code: "405",
        name: "Penerimaan Zakat dan Sumbangan Keagamaan yang sifatnya wajib",
    },
    {
        code: "406",
        name: "Bagian Laba Anggota Perseroan Komanditer Tidak Atas Saham, Persekutuan, Perkumpulan, Firma, Kongsi",
    },
    {
        code: "407",
        name: "Klaim asuransi kesehatan, kecelakaan, jiwa, dwiguna, beasiswa",
    },
    { code: "408", name: "Beasiswa" },
    { code: "409", name: "Hadiah/Undian" },
    {
        code: "423",
        name: "Objek PPh tertentu bagi TKA yang memiliki keahlian tertentu (expatriate regime)",
    },
    {
        code: "424",
        name: "Natura dan kenikmatan yang dikecualikan dari objek pajak",
    },
    { code: "425", name: "SHU dari koperasi" },
    { code: "426", name: "Penghasilan lain yang tidak termasuk objek pajak" },
] as const;

export const L4B_INCOME_TYPE_OPTIONS = L4_TAX_OBJECT_OPTIONS.map((option) => ({
    value: option.name,
    label: option.name,
    code: option.code,
}));

export interface L4AItem {
    id?: string;
    spt_badan_id?: string;
    npwp: string;
    name: string;
    tax_object_code: string | null;
    tax_object_name: string | null;
    dpp: number;
    rate: number;
    pph_payable: number;
}

export interface L4BItem {
    id?: string;
    spt_badan_id?: string;
    code: string;
    income_type: string;
    source_income: string | null;
    gross_income: number;
}
