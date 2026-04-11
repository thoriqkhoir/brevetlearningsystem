// Shared types for Lampiran L-11B

export interface L11B1Data {
    id?: string;
    spt_badan_id?: string;
    net_income: number;
    depreciation_expense: number;
    income_tax_expense: number;
    loan_tax_expense: number;
    ebtida: number;
    ebtida_after_tax: number;
}

export interface L11B2AItem {
    id?: string;
    spt_badan_id?: string;
    number_id: string;
    name: string;
    relationship: string | null;
    month_balance_1: number;
    month_balance_2: number;
    month_balance_3: number;
    month_balance_4: number;
    month_balance_5: number;
    month_balance_6: number;
    month_balance_7: number;
    month_balance_8: number;
    month_balance_9: number;
    month_balance_10: number;
    month_balance_11: number;
    month_balance_12: number;
    average_balance: number;
}

export interface L11B2BItem {
    id?: string;
    spt_badan_id?: string;
    cost_breakdown: string;
    month_balance_1: number;
    month_balance_2: number;
    month_balance_3: number;
    month_balance_4: number;
    month_balance_5: number;
    month_balance_6: number;
    month_balance_7: number;
    month_balance_8: number;
    month_balance_9: number;
    month_balance_10: number;
    month_balance_11: number;
    month_balance_12: number;
    average_balance: number;
}

export interface L11B3Item {
    id?: string;
    spt_badan_id?: string;
    cost_provider: string;
    average_debt_balance: number;
    loan_cost: number;
    loan_cost_tax: number;
    loan_cost_cannot_reduced: number;
}
