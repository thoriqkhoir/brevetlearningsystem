export interface L14Item {
    id?: string;
    spt_badan_id?: string;
    tax_year?: string | null;                           // (1) Tahun Pajak/Bagian Tahun Pajak
    provision_remaining?: number | null;                // (2) Penyediaan Sisa Lebih Untuk Ditanamkan Kembali Selama 4 Tahun (Rp)
    replanting_form_surfer?: string | null;             // (3) Bentuk Penanaman Kembali Sisa Lebih
    year_1?: number | null;                             // (4) Tahun Ke-1 (Rp)
    year_2?: number | null;                             // (5) Tahun Ke-2 (Rp)
    year_3?: number | null;                             // (6) Tahun Ke-3 (Rp)
    year_4?: number | null;                             // (7) Tahun Ke-4 (Rp)
    remaining_amount?: number | null;                   // (8) Jumlah Penggunaan Sisa Lebih (Rp)
    unreplaced_excess?: number | null;                  // (9) Sisa Lebih Yang Belum Ditanamkan Kembali (Rp)
    surplus_year_replanting_period?: number | null;     // (10) Sisa Lebih Yang Melewati Jangka Waktu Penanaman Kembali Dalam Jangka Waktu 4 Tahun (Rp)
}
