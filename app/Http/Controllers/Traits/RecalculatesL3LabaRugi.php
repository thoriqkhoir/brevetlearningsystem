<?php

namespace App\Http\Controllers\Traits;

use App\Models\SptOp;
use App\Models\SptOpL3A13A1;

trait RecalculatesL3LabaRugi
{
    /**
     * Recalculate "Laba (Rugi) Sebelum Pajak" fiscal_amount for a given type,
     * then update spt_ops.b_1b_5 with the result.
     *
     * Arithmetic per type (mirrors frontend computedSummaryRow):
     *
     * DAGANG
     *   Penjualan Bruto   = Σ fiscal where name ~ "penjualan domestik|penjualan ekspor"
     *   Retur & Potongan  = Σ fiscal where name ~ "retur|potongan penjualan"
     *   Penjualan Bersih  = Penjualan Bruto - Retur & Potongan
     *   Pembelian         = Σ fiscal where name ~ "pembelian"
     *   Persediaan Awal   = Σ fiscal where name ~ "persediaan - awal"
     *   Persediaan Akhir  = Σ fiscal where name ~ "persediaan akhir"
     *   Jumlah HPP        = Pembelian + Persediaan Awal - Persediaan Akhir
     *   Beban Usaha       = Σ fiscal where category starts_with "Beban Usaha"
     *   Laba Rugi         = Penjualan Bersih - Jumlah HPP - Beban Usaha
     *
     * JASA
     *   Pendapatan        = Σ fiscal where category starts_with "Pendapatan"
     *   Beban Langsung    = Σ fiscal where category starts_with "Beban Langsung"
     *   Laba Kotor        = Pendapatan - Beban Langsung
     *   Beban Usaha       = Σ fiscal where category starts_with "Beban Usaha"
     *   Laba Rugi         = Laba Kotor - Beban Usaha
     *
     * INDUSTRI
     *   Penjualan Bruto   = Σ fiscal where name ~ "penjualan domestik|penjualan ekspor"
     *   Retur & Potongan  = Σ fiscal where name ~ "retur|potongan penjualan"
     *   Penjualan Bersih  = Penjualan Bruto - Retur & Potongan
     *   Jumlah HPP        = Σ fiscal where category starts_with "Biaya Pabrikasi|Biaya Overhead Pabrik"
     *   Beban Usaha       = Σ fiscal where category starts_with "Beban Usaha"
     *   Laba Rugi         = Penjualan Bersih - Jumlah HPP - Beban Usaha
     */
    protected function recalculateL3LabaRugi(string $sptOpId, string $type): void
    {
        $sptOp = SptOp::find($sptOpId);
        if (!$sptOp) {
            return;
        }

        // Load all A.1 rows for this spt_op + type, eager-load master_account
        $rows = SptOpL3A13A1::where('spt_op_id', $sptOpId)
            ->where('type', $type)
            ->with('masterAccount')
            ->get();

        // ── helpers ────────────────────────────────────────────────────────────

        /** Sum fiscal_amount for rows whose account name contains ANY of the needles. */
        $sumByName = function (array $needles) use ($rows): int {
            $total = 0;
            foreach ($rows as $row) {
                $name = strtolower($row->masterAccount?->name ?? '');
                foreach ($needles as $needle) {
                    if (str_contains($name, strtolower($needle))) {
                        $total += (int) $row->fiscal_amount;
                        break;
                    }
                }
            }
            return $total;
        };

        /** Sum fiscal_amount for rows whose account category STARTS WITH the prefix. */
        $sumByCategory = function (string $prefix) use ($rows): int {
            $total = 0;
            foreach ($rows as $row) {
                $category = strtolower($row->masterAccount?->category ?? '');
                if (!str_starts_with($category, strtolower($prefix))) {
                    continue;
                }
                $total += (int) $row->fiscal_amount;
            }
            return $total;
        };

        // ── per-type calculation ───────────────────────────────────────────────

        $labaRugiFiscal = match ($type) {

            'dagang' => (function () use ($sumByName, $sumByCategory): int {
                $penjualanBruto  = $sumByName(['penjualan domestik', 'penjualan ekspor']);
                $returPotongan   = $sumByName(['retur', 'potongan penjualan']);
                $penjualanBersih = $penjualanBruto - $returPotongan;

                $pembelian       = $sumByName(['pembelian']);
                $persediaanAwal  = $sumByName(['persediaan - awal']);
                $persediaanAkhir = $sumByName(['persediaan akhir']);
                $jumlahHpp       = $pembelian + $persediaanAwal - $persediaanAkhir;

                $bebanUsaha      = $sumByCategory('Beban Usaha');

                return $penjualanBersih - $jumlahHpp - $bebanUsaha;
            })(),

            'jasa' => (function () use ($sumByCategory): int {
                $pendapatan    = $sumByCategory('Pendapatan');
                $bebanLangsung = $sumByCategory('Beban Langsung');
                $labaKotor     = $pendapatan - $bebanLangsung;
                $bebanUsaha    = $sumByCategory('Beban Usaha');

                return $labaKotor - $bebanUsaha;
            })(),

            'industri' => (function () use ($sumByName, $sumByCategory): int {
                $penjualanBruto  = $sumByName(['penjualan domestik', 'penjualan ekspor']);
                $returPotongan   = $sumByName(['retur', 'potongan penjualan']);
                $penjualanBersih = $penjualanBruto - $returPotongan;

                $biayaPabrikasi  = $sumByCategory('Biaya Pabrikasi');
                $overheadPabrik  = $sumByCategory('Biaya Overhead Pabrik');
                $jumlahHpp       = $biayaPabrikasi + $overheadPabrik;

                $bebanUsaha      = $sumByCategory('Beban Usaha');

                return $penjualanBersih - $jumlahHpp - $bebanUsaha;
            })(),

            default => 0,
        };

        // ── update b_1b_5 di spt_ops ──────────────────────────────────────────
        $sptOp->update(['b_1b_5' => $labaRugiFiscal]);
    }
}