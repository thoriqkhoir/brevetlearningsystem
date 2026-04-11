// Shared types for Lampiran L-11A

export interface L11A1Item {
    id?: string;
    spt_badan_id?: string;
    npwp: string;
    name: string;
    address: string | null;
    date: string | null;
    cost_type: string | null;
    amount: number;
    note: string | null;
    pph: number;
    witholding_tax_number: string | null;
}

export interface L11A2Item {
    id?: string;
    spt_badan_id?: string;
    date: string | null;
    place: string | null;
    address: string | null;
    type: string | null;
    amount: number;
    name: string;
    position: string | null;
    company_name: string | null;
    business_type: string | null;
    notes: string | null;
}

export interface L11A3Item {
    id?: string;
    spt_badan_id?: string;
    number_id: string;
    name: string;
    address: string | null;
    receivable_ceiling: number;
    bad_debts: number;
    loading_method: string | null;
    document_method: string | null;
}

export interface L11A4AItem {
    id?: string;
    spt_badan_id?: string;
    tangible_asset_type: string | null;
    acquisition_year: string | null;
    acquisition_value: number;
    depreciation_last_year: number;
    depreciation_this_year: number;
    depreciation_remaining: number;
}

export interface L11A4BData {
    id?: string;
    spt_badan_id?: string;
    address: string | null;
    decision_areas_number: number;
    decision_areas_date: string | null;
    decision_longer_areas_number: number;
    decision_longer_areas_date: string | null;
    value_4a: number;
    value_4b: number;
    value_4c: number;
    value_4d: number;
    value_4e: number;
    value_4f: number;
    total: number;
}

export interface L11A5Item {
    id?: string;
    spt_badan_id?: string;
    number_id: string;
    name: string;
    address: string | null;
    fiscal_start_year: string | null;
    fiscal_end_year: string | null;
    akrual: number;
    category: string | null;
}
