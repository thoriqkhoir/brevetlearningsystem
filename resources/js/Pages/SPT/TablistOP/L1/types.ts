// Shared types for Lampiran L-1

export interface L1A1Item {
    id?: string;
    spt_op_id?: string;
    code: string;
    description: string;
    account_number: string;
    on_behalf: string;
    bank: string;
    country: string;
    acquisition_year: string;
    integer: number; // Saldo
    notes: string;
}

export interface L1A2Item {
    id?: string;
    spt_op_id?: string;
    code: string;
    description: string;
    country: string;
    recipient_id: string;
    recipient_name: string;
    amount: number;
    year_begin: string;
    amount_now: number;
    notes: string;
}

export interface L1A3Item {
    id?: string;
    spt_op_id?: string;
    code: string;
    description: string;
    country: string;
    recipient_id: string;
    recipient_name: string;
    account_number: string;
    acquisition_cost: number;
    acquisition_year: string;
    amount_now: number;
    notes: string;
}

export interface L1A4Item {
    id?: string;
    spt_op_id?: string;
    code: string;
    type: string;
    brand: string;
    police_number: string;
    ownership: string;
    owner_id: string;
    owner_name: string;
    acquisition_year: string;
    acquisition_cost: number;
    amount_now: number;
    notes: string;
}

export interface L1A5Item {
    id?: string;
    spt_op_id?: string;
    code: string;
    description: string;
    country: string;
    land_size: string;
    building_size: string;
    ownership_source: string;
    certificate_number: string;
    acquisition_year: string;
    acquisition_cost: number;
    amount_now: number;
    notes: string;
}

export interface L1A6Item {
    id?: string;
    spt_op_id?: string;
    code: string;
    description: string;
    acquisition_year: string;
    acquisition_cost: number;
    amount_now: number;
    account_number: string;
    additional_information: string;
    notes: string;
}

export interface L1A7Item {
    id?: string;
    spt_op_id?: string;
    description: string;
    acquisition_cost: number;
    amount_now: number;
}

export interface L1BItem {
    id?: string;
    spt_op_id?: string;
    code: string;
    description: string;
    creditor_id: string;
    creditor_name: string;
    creditor_country: string;
    ownership: string;
    loan_year: string;
    balance: number;
    notes: string;
}

export interface L1CItem {
    id?: string;
    spt_op_id?: string;
    name: string;
    // Backend column is `npwp`, UI label is `NIK`
    nik?: string;
    npwp?: string;
    date_of_birth: string;
    relationship: string;
    job: string;
}

export interface L1DItem {
    id?: string;
    spt_op_id?: string;
    employer_name: string;
    employer_id: string;
    gross_income: number;
    deduction_gross_income: number;
    net_income: number;
}

export interface L1EItem {
    id?: string;
    spt_op_id?: string;
    tax_withholder_name: string;
    tax_withholder_id: string;
    tax_withholder_slip_number: string;
    tax_withholder_slip_date: string;
    tax_type: string;
    gross_income: number;
    amount: number;
}

export type LampiranL1Data = {
    l1a1?: L1A1Item[];
    l1a2?: L1A2Item[];
    l1a3?: L1A3Item[];
    l1a4?: L1A4Item[];
    l1a5?: L1A5Item[];
    l1a6?: L1A6Item[];
    l1a7?: L1A7Item[];
    l1b?: L1BItem[];
    l1c?: L1CItem[];
    l1d?: L1DItem[];
    l1e?: L1EItem[];
} | null;

export const L1E_TAX_TYPE_OPTIONS = [
    { value: "PPh Pasal 15", label: "PPh Pasal 15" },
    { value: "PPh Pasal 21", label: "PPh Pasal 21" },
    { value: "PPh Pasal 22", label: "PPh Pasal 22" },
    { value: "PPh Pasal 23", label: "PPh Pasal 23" },
    { value: "PPh Pasal 26", label: "PPh Pasal 26" },
    {
        value: "PPh Ditanggung Pemerintah",
        label: "PPh Ditanggung Pemerintah",
    },
    {
        value: "PPh Ditanggung Pemerintah(Proyek Bantuan Luar Negeri)",
        label: "PPh Ditanggung Pemerintah(Proyek Bantuan Luar Negeri)",
    },
    {
        value: "Sisa LB yang tidak dikembalikan pada SKPPKP",
        label: "Sisa LB yang tidak dikembalikan pada SKPPKP",
    },
];

export const NOTES_OPTIONS = [
    { value: "harta pps", label: "Harta PPS" },
    { value: "harta investasi pps", label: "Harta Investasi PPS" },
];

// Kode Harta untuk Kas dan Setara Kas (A1)
export const L1A1_CODE_OPTIONS = [
    { value: "0101", label: "Uang Tunai/Bank Note/Koin" },
    { value: "0102", label: "Tabungan (Bank/Lembaga Keuangan)" },
    { value: "0103", label: "Giro" },
    { value: "0104", label: "Deposito" },
    { value: "0105", label: "Uang Elektronik" },
    { value: "0106", label: "Cek" },
    { value: "0107", label: "Wessel" },
    { value: "0108", label: "Commercial Paper" },
    { value: "0109", label: "Setara Kas Lainnya" },
];

// Kode Harta untuk Piutang (A2)
export const L1A2_CODE_OPTIONS = [
    { value: "0201", label: "Piutang Usaha" },
    { value: "0202", label: "Piutang Afiliasi" },
    { value: "0209", label: "Piutang Lainnya" },
];

// Kode Harta untuk Investasi (A3)
export const L1A3_CODE_OPTIONS = [
    { value: "0301", label: "Saham yang dibeli untuk dijual kembali" },
    { value: "0302", label: "Saham Non Bursa" },
    { value: "0303", label: "Saham Bursa" },
    { value: "0304", label: "Obligasi Perusahaan" },
    { value: "0305", label: "Obligasi Pemerintah Indonesia (ORI, SBSN, dll)" },
    { value: "0306", label: "Surat Utang Lainnya" },
    {
        value: "0307",
        label: "Kontrak Investasi Kolektif (KIK) termasuk Reksadana, dan investasi yang dikonversikan ke unit penyertaan",
    },
    {
        value: "0308",
        label: "Instrumen Derivatif (right, warran, kontrak berjangka, opsi, dll)",
    },
    {
        value: "0309",
        label: "Penyertaan Modal dalam Perusahaan Lain (bukan atas saham, meliputi CV, Firma, dan sejenisnya)",
    },
    { value: "0310", label: "Asuransi" },
    { value: "0311", label: "Unit Link di Asuransi" },
    {
        value: "0399",
        label: "Investasi Lainnya (termasuk Cryptocurrency, Trust Fund, dll)",
    },
];

// Kode Harta untuk Harta Bergerak (A4)
export const L1A4_CODE_OPTIONS = [
    { value: "0401", label: "Sepeda" },
    { value: "0402", label: "Sepeda Motor" },
    { value: "0403", label: "Mobil Penumpang" },
    { value: "0404", label: "Bis" },
    { value: "0405", label: "Kendaraan Angkutan Jalan" },
    { value: "0406", label: "Kendaraan Tujuan Khusus" },
    { value: "0407", label: "Kereta" },
    { value: "0408", label: "Pesawat Terbang" },
    { value: "0409", label: "Kapal" },
    { value: "0410", label: "Mesin" },
    { value: "0411", label: "Gerobak" },
    { value: "0412", label: "Kapal Pesiar" },
    { value: "0499", label: "Harta bergerak lainnya" },
];

// Kode Harta untuk Harta Tidak Bergerak (A5)
export const L1A5_CODE_OPTIONS = [
    {
        value: "0501",
        label: "Tanah Kosong",
    },
    {
        value: "0502",
        label: "Tanah dan/atau Bangunan untuk Tempat Tinggal",
    },
    {
        value: "0503",
        label: "Apartemen",
    },
    {
        value: "0504",
        label: "Kapal",
    },
    {
        value: "0505",
        label: "Tanah atau Lahan untuk Usaha (seperti lahan pertanian, perkebunan, perikanan darat, dan sejenisnya)",
    },
    {
        value: "0506",
        label: "Tanah dan/atau Bangunan untuk Usaha (toko, pabrik, gudang, dan sejenisnya)",
    },
    {
        value: "0507",
        label: "Tanah dan/atau Bangunan yang Disewakan",
    },
    {
        value: "0509",
        label: "Harta Tidak Bergerak Lainnya",
    },
];

// Kode Harta untuk Harta Lainnya (A6)
export const L1A6_CODE_OPTIONS = [
    { value: "0601", label: "Paten" },
    { value: "0602", label: "Royalti" },
    { value: "0603", label: "Merek dagang" },
    { value: "0699", label: "Harta Tidak Berwujud Lainnya" },
    { value: "0701", label: "Emas Batangan" },
    { value: "0702", label: "Emas Perhiasan" },
    { value: "0703", label: "Batangan Non-Emas" },
    { value: "0704", label: "Perhiasan Non-Emas" },
    { value: "0705", label: "Permata (intan, berlian, batu mulia lainnya)" },
    {
        value: "0706",
        label: "Barang-barang seni dan antik (barang-barang seni, barang-barang antik)",
    },
    { value: "0707", label: "Peralatan olahraga khusus" },
    { value: "0708", label: "Peralatan elektronik" },
    { value: "0709", label: "Perabot Rumah Tangga" },
    { value: "0710", label: "Peralatan Kantor" },
    { value: "0711", label: "Jet Ski" },
    { value: "0712", label: "Persediaan usaha" },
    { value: "0799", label: "Harta lainnya" },
];

// Kepemilikan Harta Bergerak dan Harta Tidak Bergerak
export const OWNERSHIP_OPTIONS = [
    {
        value: "atas nama pihak lain",
        type: "harta bergerak",
        label: "Atas nama pihak lain",
    },
    {
        value: "atas nama sendiri",
        type: "harta bergerak",
        label: "Atas nama sendiri",
    },
    { value: "utang", type: "harta tidak bergerak", label: "Utang" },
    { value: "hadiah", type: "harta tidak bergerak", label: "Hadiah" },
    { value: "hibah", type: "harta tidak bergerak", label: "Hibah" },
    { value: "warisan", type: "harta tidak bergerak", label: "Warisan" },
    {
        value: "sumber lainnya",
        type: "harta tidak bergerak",
        label: "Sumber lainnya",
    },
    {
        value: "hasil sendiri",
        type: "harta tidak bergerak",
        label: "Hasil Sendiri",
    },
];
