// Shared types for SPT Badan Lampiran L-5

export interface L5AItem {
    id?: string;
    spt_badan_id?: string;
    nitku: string;
    tku_name: string;
    address: string | null;
    village: string | null;
    district: string | null;
    regency: string | null;
    province: string | null;
}

export interface L5BItem {
    id?: string;
    spt_badan_id?: string;
    tku_name: string;
    january: string | null;
    february: string | null;
    march: string | null;
    april: string | null;
    may: string | null;
    june: string | null;
    july: string | null;
    august: string | null;
    september: string | null;
    october: string | null;
    november: string | null;
    december: string | null;
    total: string | null;
}
