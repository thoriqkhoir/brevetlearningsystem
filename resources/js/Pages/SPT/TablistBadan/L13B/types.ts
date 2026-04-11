export interface L13BAItem {
    id?: string;
    spt_badan_id?: string;
    coorperation_agreement_number?: string | null;
    coorperation_agreement_date?: string | null;
    actiity_partner?: string | null;
    note?: string | null;
}

export interface L13BBItem {
    id?: string;
    spt_badan_id?: string;
    amount_1a: number;
    amount_1b: number;
    amount_1c: number;
    amount_1d: number;
    amount_1e: number;
    amount_2: number;
}

export interface L13BCItem {
    id?: string;
    spt_badan_id?: string;
    proposal_number?: string | null;
    expenses_start_period?: string | null;
    expenses_end_period?: string | null;
    total_cost?: number | null;
    year_acquisition?: string | null;
    facilities_percentage?: number | null;
    additional_gross_income?: string | number | null;
}

export interface L13BDItem {
    id?: string;
    spt_badan_id?: string;
    amount_1: number;
    amount_2: number;
    amount_3: number;
    amount_4: number;
    amount_5: number;
    amount_6: number;
}
