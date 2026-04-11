// Shared types for SPT Badan Lampiran L-7

export interface L7Item {
    id?: string;
    spt_badan_id?: string;
    tax_year_part: string | null;  // Tahun Bagian Pajak
    amount: number;                // Nilai
    fourth_year: number;           // Tahun Keempat
    third_year: number;            // Tahun Ketiga
    second_year: number;           // Tahun Kedua
    first_year: number;            // Tahun Pertama
    year_now: number;              // Tahun Pajak Berjalan
    current_tax_year: number;      // Tahun Pajak Sekarang
}
