export type MasterTku = {
    id: string | number;
    name: string;
    code?: string | number;
    alamat?: string | null;
    address?: string | null;
    kelurahan?: string | null;
    desa?: string | null;
    kecamatan?: string | null;
    kota?: string | null;
    kabupaten?: string | null;
    provinsi?: string | null;
};

export type MasterObject = {
    id: string | number;
    code: string;
    name: string;
    kap?: string;
};

export type BrutoType = "a" | "b" | "c";

// Jenis Usaha/Pekerjaan Bebas (sesuai daftar DJP)
export const PROFESSION_TYPES = [
    "Dagang",
    "Penilai",
    "Arsitek",
    "Artis dan profesi sejenisnya",
    "Pembuat konten",
    "Penulis",
    "Olahragawan",
    "Pelatih/Pengajar",
    "Distributor perusahaan pemasaran berjenjang",
    "Peneliti",
    "Penjual penjaja barang dagangan",
    "Industri",
    "Agen Iklan",
    "Agen asuransi",
    "Perantara",
    "Usaha/profesi lainnya",
    "Jasa",
    "Pengacara",
    "Akuntan",
    "Konsultan",
    "Aktuaris",
    "Notaris/PPAT",
    "Dokter",
] as const;

export type ProfessionType = (typeof PROFESSION_TYPES)[number];

export type L3BItem = {
    id?: string;
    spt_op_id: string;
    tku_id: number;
    bruto_type: BrutoType;
    type_of_bookkeeping: string | null;
    business_type: ProfessionType | null;
    januari: number;
    februari: number;
    maret: number;
    april: number;
    mei: number;
    juni: number;
    juli: number;
    agustus: number;
    september: number;
    oktober: number;
    november: number;
    desember: number;
    accumulated: number;
    total: number;
};

export const MONTH_KEYS = [
    "januari",
    "februari",
    "maret",
    "april",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "oktober",
    "november",
    "desember",
] as const;

export type MonthKey = (typeof MONTH_KEYS)[number];

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

export const computeRowTotal = (row: Pick<L3BItem, MonthKey>) => {
    return MONTH_KEYS.reduce((sum, key) => sum + Number(row[key] ?? 0), 0);
};

export const emptyL3BRow = (sptOpId: string, brutoType: BrutoType): L3BItem => {
    return {
        spt_op_id: sptOpId,
        tku_id: 0,
        bruto_type: brutoType,
        type_of_bookkeeping: null,
        business_type: null,
        januari: 0,
        februari: 0,
        maret: 0,
        april: 0,
        mei: 0,
        juni: 0,
        juli: 0,
        agustus: 0,
        september: 0,
        oktober: 0,
        november: 0,
        desember: 0,
        accumulated: 0,
        total: 0,
    };
};
