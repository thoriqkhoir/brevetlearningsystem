export interface MasterObjectOption {
    id: number;
    code: string;
    name: string;
    kap: string;
}

export interface L2AItem {
    id?: string;
    spt_op_id: string;
    object_id: number;
    tax_withholder_id: string;
    tax_withholder_name: string;
    dpp: number;
    pph_owed: number;
    created_at?: string;
    updated_at?: string;
}

export interface L2BItem {
    id?: string;
    spt_op_id: string;
    code: string;
    income_type?: string | null;
    npwp?: string | null;
    name?: string | null;
    gross_income: number;
    created_at?: string;
    updated_at?: string;
}

// L2C - Penghasilan Neto Luar Negeri
export interface L2CItem {
    id?: string;
    spt_op_id: string;
    provider_name: string;
    country?: string | null;
    transaction_date?: string | null;
    income_type?: string | null;
    income_code?: string | null;
    net_income: number;
    tax_foreign_currency: number;
    amount: number;
    currency?: string | null;
    tax_credit: number;
    created_at?: string;
    updated_at?: string;
}

export type L2CIncomeTypeOption = {
    code: string;
    name: string;
    category?: string;
};

export const L2C_INCOME_TYPE_OPTIONS: readonly L2CIncomeTypeOption[] = [
    { name: "Penghasilan dari Pekerjaan Bebas", code: "104" },
    { name: "Penghasilan dari kegiatan usaha", code: "109" },
    {
        name: "Pendapatan lain dari kegiatan usaha atau pekerjaan bebas",
        code: "199",
    },
    {
        name: "Gaji, tunjangan, honorarium, bonus, jasa produksi",
        code: "201",
    },
    {
        name: "Upah honorarium yg diterima oleh pegawai tidak tetap",
        code: "202",
    },
    { name: "Uang pesangon diterima sekaligus", code: "204" },
    {
        name: "Manfaat Pensiun, Tunjangan Hari Tua, atau Jaminan Hari Tua dibayarkan sekaligus",
        code: "205",
    },
    {
        name: "Uang pensiun yang diterima secara berkala/bulanan oleh penerima pensiun",
        code: "206",
    },
    { name: "Penghasilan lain yang berhubungan dengan pekerjaan", code: "299" },
    { name: "Sewa tanah dan atau bangunan", code: "301" },
    { name: "Sewa harta selain tanah dan atau bangunan", code: "302" },
    { name: "Dividen", code: "303", category: "l2b" },
    { name: "Bunga", code: "304" },
    { name: "Obligasi", code: "305" },
    { name: "Royalti", code: "306" },
    { name: "Keuntungan Penjualan Harta", code: "307" },
    { name: "Bunga Deposito", code: "308" },
    { name: "Bunga Tabungan", code: "309" },
    { name: "Surat Berharga/Sekuritas", code: "311" },
    { name: "Penjualan Saham di Bursa", code: "312" },
    { name: "Pengalihan atau Penjualan Tanah Bangunan", code: "315" },
    { name: "Keuntungan Selisih Mata Uang Asing", code: "319" },
    {
        name: "Penghasilan lain-lain dari Modal atau Aset/Harta",
        code: "399",
    },
    { name: "Pembebasan Utang", code: "401", category: "l2b" },
    { name: "Hibah", code: "402", category: "l2b" },
    { name: "Bantuan/Sumbangan", code: "403", category: "l2b" },
    { name: "Warisan", code: "404", category: "l2b" },
    { name: "Hadiah/Undian", code: "409", category: "l2b" },
    { name: "Penghasilan lain", code: "499", category: "l2b" },
    {
        name: "Penerimaan Zakat dan Sumbangan Keagamaan yang sifatnya wajib",
        code: "405",
        category: "l2b",
    },
    {
        name: "Bagian Laba Anggota Perseroan Komanditer Tidak Atas Saham, Persekutuan, Perkumpulan, Firma, Kongsi",
        code: "406",
        category: "l2b",
    },
    {
        name: "Klaim asuransi kesehatan, kecelakaan, jiwa, dwiguna, beasiswa",
        code: "407",
        category: "l2b",
    },
    { name: "Beasiswa", code: "408", category: "l2b" },
    {
        name: "Hadiah langsung yang diberikan kepada semua pembeli/konsumen akhir tanpa diundi",
        code: "409",
        category: "l2b",
    },
    {
        name: "Objek PPh tertentu bagi TKA yang memiliki keahlian tertentu (expatriate regime)",
        code: "423",
        category: "l2b",
    },
    {
        name: "Natura dan kenikmatan yang dikecualikan dari objek pajak",
        code: "424",
        category: "l2b",
    },
    { name: "SHU dari koperasi", code: "425", category: "l2b" },
    {
        name: "Penghasilan lain yang tidak termasuk objek pajak",
        code: "426",
        category: "l2b",
    },
] as const;
