export type L5IncomeOption = {
    code: string;
    label: string;
};

export const L5B_TYPE_OF_INCOME_OPTIONS: L5IncomeOption[] = [
    { code: "501", label: "Zakat (Sesuai PP Nomor 60 Tahun 2010)" },
    {
        code: "502",
        label: "Sumbangan keagamaan (Sesuai PP Nomor 60 Tahun 2010)",
    },
    {
        code: "503",
        label: "Fasilitas pengurang penghasilan Neto (Tax allowance)",
    },
    { code: "504", label: "Fasilitas keringanan pajak lainnya (Tax reliefs)" },
    { code: "505", label: "Pengurang penghasilan neto lainnya" },
];

export const L5C_TYPE_OF_INCOME_OPTIONS: L5IncomeOption[] = [
    {
        code: "506",
        label: "Fasilitas pembebasan atau pengurangan PPh (Tax holiday)",
    },
    { code: "507", label: "Pengurang PPh Lainnya" },
];

export type L5ReducerType = "neto" | "pph";

export type L5ARecord = {
    id?: string;
    spt_op_id?: string;
    tax_year: string;
    fiscal_amount: number;
    compensation_year_a: number;
    compensation_year_b: number;
    compensation_year_c: number;
    compensation_year_d: number;
    compensation_year_e: number;
    compensation_year_f: number;
};

export type L5BCRecord = {
    id?: string;
    spt_op_id?: string;
    type_of_reducer: L5ReducerType;
    code: string;
    type_of_income: string;
    amount_of_reducer: number;
};

export const COMPENSATION_KEYS = [
    "compensation_year_a",
    "compensation_year_b",
    "compensation_year_c",
    "compensation_year_d",
    "compensation_year_e",
    "compensation_year_f",
] as const;

export type CompensationKey = (typeof COMPENSATION_KEYS)[number];

export const makeTaxYearRows = (currentYear: number) => {
    const end = currentYear - 1;
    const start = end - 9;
    return Array.from({ length: 10 }, (_, idx) => String(start + idx));
};

export const makeCompensationYears = (currentYear: number) => {
    const start = currentYear - 5;
    return Array.from({ length: 6 }, (_, idx) => start + idx);
};

export const parseDigits = (raw: string) => {
    const numeric = Number(String(raw ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
};

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export const formatRupiah = (value: number) => {
    const n = Number(value ?? 0);
    return rupiahFormatter.format(n).replace("Rp", "").trim();
};

export const emptyL5ARow = (taxYear: string): L5ARecord => ({
    tax_year: taxYear,
    fiscal_amount: 0,
    compensation_year_a: 0,
    compensation_year_b: 0,
    compensation_year_c: 0,
    compensation_year_d: 0,
    compensation_year_e: 0,
    compensation_year_f: 0,
});
