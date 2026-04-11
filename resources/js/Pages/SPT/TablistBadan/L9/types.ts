// Shared types for Lampiran L-9

export type L9GroupType =
    | "1a"
    | "1b"
    | "1c"
    | "1d"
    | "1e"
    | "2a"
    | "2b"
    | "3a"
    | "3b"
    | "3c"
    | "3d"
    | "3e";

export interface L9Item {
    id?: string;
    spt_badan_id?: string;
    group_type: L9GroupType;
    treasure_code: string;
    treasure_type: string;
    period_aquisition: string | null;
    cost_aquisition: number;
    residual_value: number;
    comercial_depreciation_method: string | null;
    fiscal_depreciation_method: string | null;
    depreciation_this_year: number;
    note: string | null;
}

export interface L9TreasureOption {
    code: string;
    label: string;
}

const TANGIBLE_TREASURE_OPTIONS: readonly L9TreasureOption[] = [
    { code: "0401", label: "Sepeda" },
    { code: "0402", label: "Motor" },
    { code: "0403", label: "Mobil Penumpang" },
    { code: "0404", label: "Bus" },
    { code: "0405", label: "Kendaraan Angkutan" },
    { code: "0406", label: "Kendaraan Khusus" },
    { code: "0407", label: "Kereta" },
    { code: "0408", label: "Pesawat Terbang" },
    { code: "0409", label: "Kapal Laut" },
    { code: "0410", label: "Mesin" },
    { code: "0411", label: "Gerobak/Troli" },
    { code: "0412", label: "Kapal Pesiar" },
    { code: "0413", label: "Peralatan" },
    { code: "0449", label: "Aset Bergerak Lainnya" },
    { code: "0707", label: "Peralatan Olahraga Khusus" },
    { code: "0708", label: "Peralatan Elektronik" },
    { code: "0709", label: "Rumah Tangga/Furnitur" },
    { code: "0710", label: "Peralatan Lainnya" },
    { code: "0711", label: "Jet Ski" },
    { code: "0799", label: "Aset Lainnya" },
];

const BUILDING_TREASURE_OPTIONS: readonly L9TreasureOption[] = [
    { code: "0502", label: "Bangunan untuk tempat tinggal" },
    {
        code: "0503",
        label: "Bangunan untuk usaha (toko, pabrik, kantor, gudang, dan sejenisnya)",
    },
    { code: "0504", label: "Bangunan yang disewakan" },
    { code: "0505", label: "Apartemen" },
    { code: "0599", label: "Aset tidak Bergerak Lainnya" },
];

const INTANGIBLE_TREASURE_OPTIONS: readonly L9TreasureOption[] = [
    { code: "0601", label: "Paten" },
    { code: "0602", label: "Royalti" },
    { code: "0603", label: "Merek dagang" },
    { code: "0604", label: "Merek Hak Bangunan" },
    { code: "0605", label: "Merek Hak Budidaya" },
    { code: "0606", label: "Hak Penggunaan" },
    { code: "0607", label: "Goodwill" },
    { code: "0608", label: "Hak Pengusahaan Hutan" },
    { code: "0609", label: "Hak di Lapangan Minyak dan Gas" },
    {
        code: "0610",
        label: "Hak Eksploitasi Sumber Daya Alam dan Hasil Alam Lainnya",
    },
    { code: "0699", label: "Harta Tidak Berwujud Lainnya" },
];

export const getL9TreasureOptions = (
    groupType: L9GroupType,
): readonly L9TreasureOption[] => {
    if (["1a", "1b", "1c", "1d", "1e"].includes(groupType)) {
        return TANGIBLE_TREASURE_OPTIONS;
    }

    if (["2a", "2b"].includes(groupType)) {
        return BUILDING_TREASURE_OPTIONS;
    }

    return INTANGIBLE_TREASURE_OPTIONS;
};
