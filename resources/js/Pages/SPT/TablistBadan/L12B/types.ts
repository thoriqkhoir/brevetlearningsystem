// spt_badan_l_12b_1_2  (type = 'taxpayer' | 'company')
export interface L12B12Item {
    id?: string;
    spt_badan_id?: string;
    type: "taxpayer" | "company";
    npwp: string;
    name: string;
    address?: string | null;
    business_type?: string | null;
}

// spt_badan_l_12b_3
export interface L12B3Item {
    id?: string;
    spt_badan_id?: string;
    tax_year: string;
    taxable_income: number;
    tax_income: number;
    income_after_reduce: number;
}

// spt_badan_l_12b_4  (investment form parent)
export interface L12B4Item {
    id?: string;
    spt_badan_id?: string;
    investment_form?: string | null;
    items?: L12B4BItem[];
}

// spt_badan_l_12b_4b  (child of L12B4)
export interface L12B4BItem {
    id?: string;
    spt_badan_l_12b_4_id?: string;
    investment_name?: string | null;
    realization_value: number;
    realization_year?: string | null;
}

// spt_badan_l_12b_5
export interface L12B5Item {
    id?: string;
    spt_badan_id?: string;
    name: string;
    npwp: string;
    address?: string | null;
    business_type?: string | null;
    deed_incorporation_number?: string | null;
    deed_incorporation_date?: string | null;
    deed_incorporation_notary?: string | null;
    investment_value: number;
    active_period?: string | null;
}

// spt_badan_l_12b_6
export interface L12B6Item {
    id?: string;
    spt_badan_id?: string;
    name: string;
    npwp: string;
    address?: string | null;
    business_type?: string | null;
    deed_participation_number?: string | null;
    deed_participation_date?: string | null;
    deed_participation_notary?: string | null;
    investment_value: number;
    active_period?: string | null;
    is_company_listed: boolean;
    stock_exchange_name?: string | null;
}

// spt_badan_l_12b_7
export interface L12B7Item {
    id?: string;
    spt_badan_id?: string;
    fixed_asset_type: string;
    fixed_asset_location: string;
    quantity: number;
    fixed_asset_value: number;
    fixed_asset_number?: string | null;
    fixed_asset_date?: string | null;
    document_number?: string | null;
    document_date?: string | null;
}

// spt_badan_l_12b_8
export interface L12B8Item {
    id?: string;
    spt_badan_id?: string;
    asset_type: string;
    asset_value: number;
    description?: string | null;
}
