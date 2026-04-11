export interface L3DAItem {
    id?: string;
    spt_op_id: string;
    entertainment_date?: string | null;
    entertainment_location?: string | null;
    address?: string | null;
    entertainment_type?: string | null;
    entertainment_amount?: number;
    related_party?: string | null;
    position?: string | null;
    company_name?: string | null;
    business_type?: string | null;
    notes?: string | null;
}

export interface L3DBItem {
    id?: string;
    spt_op_id: string;
    npwp?: string | null;
    name?: string | null;
    address?: string | null;
    date?: string | null;
    type_of_cost?: string | null;
    amount?: number;
    notes?: string | null;
    income_tax_with_holding?: number;
    with_holding_slip_number?: string | null;
}

export interface L3DCItem {
    id?: string;
    spt_op_id: string;
    npwp?: string | null;
    debtor_name?: string | null;
    debtor_address?: string | null;
    amount_of_debt?: number;
    bad_debt?: number;
    deduction_method?: string | null;
    type_of_proof?: string | null;
}

export const TYPE_OF_COST_OPTIONS = [
    "Biaya iklan",
    "Biaya pameran",
    "Biaya promosi (sampel/gratis)",
    "Biaya hadiah/doorprize",
    "Biaya promosi lainnya",
] as const;

export const DEDUCTION_METHOD_OPTIONS = [
    "Dibebankan langsung",
    "Pencadangan",
    "Penghapusan piutang",
    "Lainnya",
] as const;

export const TYPE_OF_PROOF_OPTIONS = [
    "Putusan pengadilan",
    "Perjanjian penghapusan piutang",
    "Surat pernyataan",
    "Lainnya",
] as const;
