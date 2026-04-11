export interface L11CItem {
    id?: string;
    spt_badan_id?: string;
    name: string;
    address?: string | null;
    region?: string | null;
    currency_code?: string | null;
    currency_end_year?: number | null;
    principal_debt_start_year?: number | null;
    principal_debt_addition?: number | null;
    principal_debt_reducer?: number | null;
    principal_debt_end_year?: number | null;
    start_loan_term?: string | null;
    end_loan_term?: string | null;
    interest_rate?: number | null;
    interest_amount?: number | null;
    cost_other?: number | null;
    loan_allocation?: string | null;
}
