// Shared types for SPT Badan Lampiran L-3

export interface L3AItem {
    id?: string;
    spt_badan_id?: string;
    name: string;
    country: string | null;
    pph_date: string | null;
    type_income: string | null;
    net_income: number;
    pph_amount: number;
    pph_currency: string | null;
    pph_foreign_amount: number;
    tax_credit: number;
}

export interface L3BItem {
    id?: string;
    spt_badan_id?: string;
    name: string;
    npwp: string | null;
    tax_type: string | null;
    dpp: number;
    income_tax: number;
    number_of_provement: string | null;
    date_of_provement: string | null;
}

export const TYPE_INCOME_OPTIONS = [
    { value: "dividen", label: "Dividen" },
    { value: "bunga", label: "Bunga" },
    { value: "royalti", label: "Royalti" },
    { value: "sewa", label: "Sewa" },
    { value: "jasa", label: "Jasa" },
    { value: "lainnya", label: "Lainnya" },
];

export const TAX_TYPE_OPTIONS = [
    { value: "pph_21", label: "PPh Pasal 21" },
    { value: "pph_22", label: "PPh Pasal 22" },
    { value: "pph_23", label: "PPh Pasal 23" },
    { value: "pph_24", label: "PPh Pasal 24" },
    { value: "pph_25", label: "PPh Pasal 25" },
    { value: "pph_26", label: "PPh Pasal 26" },
    { value: "pph_final", label: "PPh Final" },
    { value: "lainnya", label: "Lainnya" },
];
