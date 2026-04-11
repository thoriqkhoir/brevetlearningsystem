export interface L13CItem {
    id?: string;
    spt_badan_id?: string;
    grant_facilities_number?: string | null;
    grant_facilities_date?: string | null;
    utilization_facilities_number?: string | null;
    utilization_facilities_date?: string | null;
    facilities_period?: string | null;
    utilization_year?: string | null;
    pph_reducer_percentage: number;
    taxable_income: number;
    pph_payable: number;
    facilities_amount: number;
}
