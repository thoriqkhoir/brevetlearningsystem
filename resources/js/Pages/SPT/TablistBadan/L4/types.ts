// Shared types for SPT Badan Lampiran L-4

export interface L4TaxObjectOption {
    code: string;
    name: string;
}

export const L4_TAX_OBJECT_OPTIONS: readonly L4TaxObjectOption[] = [
    {
        code: "28-401-01",
        name: "BUNGA DEPOSITO / TABUNGAN DAN DISKONTO SBI / SBN",
    },
    {
        code: "28-401-02",
        name: "BUNGA / DISKONTO OBLIGASI",
    },
    {
        code: "28-407-01",
        name: "PENGHASILAN PENJUALAN SAHAM YANG DIPERDAGANGKAN DI BURSA EFEK",
    },
    {
        code: "28-408-01",
        name: "PENGHASILAN PENJUALAN SAHAM MILIK PERUSAHAAN MODAL VENTURA",
    },
    {
        code: "28-423-01",
        name: "PENGHASILAN USAHA PENYALUR / DEALER / AGEN PRODUK BBM",
    },
    {
        code: "28-404-01",
        name: "PENGHASILAN PENGALIHAN HAK ATAS TANAH / BANGUNAN",
    },
    {
        code: "28-405-01",
        name: "PENGHASILAN PERSEWAAN ATAS TANAH / BANGUNAN",
    },
    {
        code: "28-406-01",
        name: "IMBALAN JASA KONSTRUKSI : PELAKSANA KONSTRUKSI",
    },
    {
        code: "28-407-01",
        name: "IMBALAN JASA KONSTRUKSI : PERENCANA KONSTRUKSI",
    },
    {
        code: "28-408-01",
        name: "IMBALAN JASA KONSTRUKSI : PENGAWAS KONSTRUKSI",
    },
    {
        code: "28-413-01",
        name: "PERWAKILAN DAGANG ASING",
    },
    {
        code: "28-415-01",
        name: "PELAYARAN / PENERBANGAN ASING",
    },
    {
        code: "28-416-01",
        name: "PELAYARAN DALAM NEGERI",
    },
    {
        code: "28-423-01",
        name: "PENILAIAN KEMBALI AKTIVA TETAP",
    },
    {
        code: "28-409-01",
        name: "TRANSAKSI DERIVATIF YANG DIPERDAGANGKAN DI BURSA",
    },
    {
        code: "28-412-01",
        name: "PENGHASILAN LAIN",
    },
    {
        code: "28-408-01",
        name: "UMKM (peredaran bruto ≤ Rp4,8 miliar, PP 55/2022)",
    },
] as const;

export const L4_NON_TAXABLE_INCOME_OPTIONS: readonly L4TaxObjectOption[] = [
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

export const L4B_INCOME_TYPE_OPTIONS = L4_NON_TAXABLE_INCOME_OPTIONS.map(
    (option) => ({
        value: option.name,
        label: option.name,
        code: option.code,
    }),
);

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
