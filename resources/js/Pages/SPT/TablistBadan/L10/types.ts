// Shared types for Lampiran L-10A, L-10B, L-10C, L-10D

export interface L10AItem {
    id?: string;
    spt_badan_id?: string;
    name: string;
    npwp: string;
    country: string | null;
    relationship: string | null;
    business_activities: string | null;
    transaction_type: string | null;
    transaction_value: number;
    transfer_pricing_method: string | null;
    reason_using_method: string | null;
}

export interface L10BData {
    id?: string;
    spt_badan_id?: string;
    is_1a: boolean | null;
    is_1b: boolean | null;
    is_1c: boolean | null;
    is_1d: boolean | null;
    is_2a: boolean | null;
    is_2b: boolean | null;
    is_2c: boolean | null;
    is_3a: boolean | null;
    is_3b: boolean | null;
    is_3c: boolean | null;
    is_3d: boolean | null;
    is_3e: boolean | null;
    is_4a: boolean | null;
    is_4b: boolean | null;
    is_4c: boolean | null;
}

export interface L10CItem {
    id?: string;
    spt_badan_id?: string;
    partner_name: string;
    transaction_type: string;
    country: string | null;
    transaction_amount: number;
}

export interface L10DData {
    id?: string;
    spt_badan_id?: string;
    is_i_a: boolean | null;
    is_i_b: boolean | null;
    is_i_c: boolean | null;
    is_i_d: boolean | null;
    is_i_e: boolean | null;
    is_ii_a: boolean | null;
    is_ii_b: boolean | null;
    is_ii_c: boolean | null;
    is_ii_d: boolean | null;
    is_ii_e: boolean | null;
    iii_a: string | null;
    iii_b: string | null;
}
