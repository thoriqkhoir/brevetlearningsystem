// Shared types for Lampiran L-2

export interface L2AItem {
    id?: string;
    spt_badan_id?: string;
    name: string;
    address: string;
    country: string;
    npwp: string;
    position: string;
    paid_up_capital_amount: number;
    paid_up_capital_percentage: number | null;
    dividen: number;
}

export interface L2BItem {
    id?: string;
    spt_badan_id?: string;
    name: string;
    country: string;
    npwp: string;
    position: string;
    equity_capital_amount: number;
    equity_capital_percentage: number | null;
    debt_amount: number;
    debt_year: string;
    debt_interest: number;
    receivables_amount: number;
    receivables_year: string;
    receivables_interest: number;
}
