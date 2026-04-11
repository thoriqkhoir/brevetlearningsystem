export interface L13AItem {
    id?: string;
    spt_badan_id?: string;
    // (1) NO — auto
    // (2) Keputusan Pemberian Fasilitas
    decision_grant_facilities_number?: string | null;
    decision_grant_facilities_date?: string | null;
    // (3) Keputusan Pemanfaatan Fasilitas
    decision_utilization_facilities_number?: string | null;
    decision_utilization_facilities_date?: string | null;
    // (4-9) Jumlah Penanaman Modal yang Disetujui
    amount_capital_naming_in_foreign: number;
    amount_capital_naming_equivalen: number;
    amount_capital_naming_in_rupiah: number;
    amount_capital_naming_total: number;
    // (10) Bentuk Penanaman Modal
    capital_naming?: string | null;
    // (11) Di Bidang Dan/Atau Daerah
    field?: string | null;
    // (12) Fasilitas yang Diberikan
    facilities?: string | null;
    // (13) Persentase Pengurangan Penghasilan Neto
    reduce_net_income_persentage: number;
    // (14) Penambahan Jangka Waktu Kompensasi Kerugian
    additional_period?: string | null;
    // (15) Realisasi Penanaman Modal — Akumulasi s.d. Tahun Ini
    realization_capital_naming_acumulation: number;
    // (16) Realisasi Penanaman Modal — Pada Saat Mulai Berproduksi Komersial
    realization_capital_naming_start_production?: string | null;
    // (17) Saat Mulai Berproduksi Komersial
    start_comercial_production?: string | null;
    // (18) Fasilitas Pengurangan Penghasilan Neto — Tahun ke-
    reducer_net_income_year?: string | null;
    // (19) Fasilitas Pengurangan Penghasilan Neto — Jumlah (Rp)
    reducer_net_income_amount: number;
}
