export type L3CType = "tangible" | "building" | "intangible";

export type L3CSubType =
    | "kelompok_1"
    | "kelompok_2"
    | "kelompok_3"
    | "kelompok_4"
    | "lainnya"
    | "permanen"
    | "tidak_permanen";

export interface L3CItem {
    id?: string;
    spt_op_id: string;
    type: L3CType;
    sub_type: L3CSubType;

    code: string;
    asset_type: string;
    period_acquisition: string;

    cost_acquisition: number;
    begining_fiscal_book: number;

    method_commercial: string | null;
    method_fiscal: string | null;

    fiscal_depreciation: number;
    notes: string | null;

    created_at?: string;
    updated_at?: string;
}

export const L3C_TYPE_LABEL: Record<L3CType, string> = {
    tangible: "HARTA BERWUJUD",
    building: "BANGUNAN",
    intangible: "HARTA TIDAK BERWUJUD",
};

export const L3C_SUBTYPE_LABEL: Record<L3CSubType, string> = {
    kelompok_1: "KELOMPOK 1",
    kelompok_2: "KELOMPOK 2",
    kelompok_3: "KELOMPOK 3",
    kelompok_4: "KELOMPOK 4",
    lainnya: "LAINNYA",
    permanen: "PERMANEN",
    tidak_permanen: "TIDAK PERMANEN",
};

export type AssetOption = {
    value: string;
    code?: string;
    type?: "Fiskal" | "Komersial";
};

export const TANGIBLE_ASSET_OPTIONS: AssetOption[] = [
    { value: "Sepeda", code: "0401" },
    { value: "Motor", code: "0402" },
    { value: "Mobil Penumpang", code: "0403" },
    { value: "Bus", code: "0404" },
    { value: "Kendaraan Angkutan", code: "0405" },
    { value: "Kendaraan Khusus", code: "0406" },
    { value: "Kereta", code: "0407" },
    { value: "Pesawat Terbang", code: "0408" },
    { value: "Kapal Laut", code: "0409" },
    { value: "Mesin", code: "0410" },
    { value: "Gerobak/Troli", code: "0411" },
    { value: "Kapal Pesiar", code: "0412" },
    { value: "Peralatan", code: "0413" },
    { value: "Aset Bergerak Lainnya", code: "0449" },
    { value: "Peralatan Olahraga Khusus", code: "0707" },
    { value: "Peralatan Elektronik", code: "0708" },
    { value: "Rumah Tangga/Furnitur", code: "0709" },
    { value: "Peralatan Lainnya", code: "0710" },
    { value: "Jet Ski", code: "0711" },
    { value: "Aset Lainnya", code: "0799" },
];

export const BUILDING_ASSET_OPTIONS: AssetOption[] = [
    { value: "Bangunan untuk tempat tinggal", code: "0502" },
    {
        value: "Bangunan untuk usaha (toko, pabrik, kantor, gudang, dan sejenisnya)", code: "0503"
    },
    { value: "Bangunan yang disewakan" , code: "0504" },
    { value: "Apartemen" , code: "0505" },
    { value: "Aset tidak Bergerak Lainnya" , code: "0599" },
];

export const INTANGIBLE_ASSET_OPTIONS: AssetOption[] = [
    { value: "Paten", code: "0601" },
    { value: "Royalti", code: "0602" },
    { value: "Merek dagang" , code: "0603" },
    { value: "Merek Hak Bangunan"  , code: "0604" },
    { value: "Merek Hak Budidaya" , code: "0605" },
    { value: "Hak Penggunaan" , code: "0606" },
    { value: "Goodwill" , code: "0607" },
    { value: "Hak Pengusahaan Hutan" , code: "0608" },
    { value: "Hak di Lapangan Minyak dan Gas" , code: "0609" },
    { value: "Hak Eksploitasi Sumber Daya Alam dan Hasil Alam Lainnya" , code: "0610" },
    { value: "Harta Tidak Berwujud Lainnya" , code: "0699" },
];

export const METHOD_OPTIONS: AssetOption[] = [
    { value: "Garis Lurus", type: "Fiskal" },
    { value: "Jumlah Angka Tahun" , type: "Komersial" },
    { value: "Jumlah Jam Jasa", type: "Komersial" },
    { value: "Jumlah Satuan Produksi", type: "Fiskal" },
    { value: "Saldo Menurun", type: "Fiskal" },
    { value: "Saldo Menurun Ganda" },
    { value: "Unit Produksi", type: "Komersial" },
    { value: "Lainnya", type: "Komersial" },
];
