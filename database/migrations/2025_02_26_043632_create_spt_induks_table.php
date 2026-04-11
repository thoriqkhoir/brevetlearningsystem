<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('spt_induk', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_id')->constrained('spt')->onUpdate('cascade')->onDelete('cascade');
            $table->bigInteger('dpp_a1')->default(0);
            $table->bigInteger('dpp_a2')->default(0);
            $table->bigInteger('dpp_a3')->default(0);
            $table->bigInteger('dpp_a4')->default(0);
            $table->bigInteger('dpp_a5')->default(0);
            $table->bigInteger('dpp_a6')->default(0);
            $table->bigInteger('dpp_a7')->default(0);
            $table->bigInteger('dpp_a8')->default(0);
            $table->bigInteger('dpp_a9')->default(0);
            $table->bigInteger('dpp_a10')->default(0);
            $table->bigInteger('dpp_ab')->default(0);
            $table->bigInteger('dpp_suma')->default(0);
            $table->bigInteger('dpp_lain_a1')->default(0);
            $table->bigInteger('dpp_lain_a2')->default(0);
            $table->bigInteger('dpp_lain_a3')->default(0);
            $table->bigInteger('dpp_lain_a4')->default(0);
            $table->bigInteger('dpp_lain_a5')->default(0);
            $table->bigInteger('dpp_lain_a6')->default(0);
            $table->bigInteger('dpp_lain_a7')->default(0);
            $table->bigInteger('dpp_lain_a8')->default(0);
            $table->bigInteger('dpp_lain_a9')->default(0);
            $table->bigInteger('dpp_lain_a10')->default(0);
            $table->bigInteger('dpp_lain_ab')->default(0);
            $table->bigInteger('dpp_lain_suma')->default(0);
            $table->bigInteger('ppn_a1')->default(0);
            $table->bigInteger('ppn_a2')->default(0);
            $table->bigInteger('ppn_a3')->default(0);
            $table->bigInteger('ppn_a4')->default(0);
            $table->bigInteger('ppn_a5')->default(0);
            $table->bigInteger('ppn_a6')->default(0);
            $table->bigInteger('ppn_a7')->default(0);
            $table->bigInteger('ppn_a8')->default(0);
            $table->bigInteger('ppn_a9')->default(0);
            $table->bigInteger('ppn_a10')->default(0);
            $table->bigInteger('ppn_ab')->default(0);
            $table->bigInteger('ppn_suma')->default(0);
            $table->bigInteger('ppnbm_a1')->default(0);
            $table->bigInteger('ppnbm_a2')->default(0);
            $table->bigInteger('ppnbm_a3')->default(0);
            $table->bigInteger('ppnbm_a4')->default(0);
            $table->bigInteger('ppnbm_a5')->default(0);
            $table->bigInteger('ppnbm_a6')->default(0);
            $table->bigInteger('ppnbm_a7')->default(0);
            $table->bigInteger('ppnbm_a8')->default(0);
            $table->bigInteger('ppnbm_a9')->default(0);
            $table->bigInteger('ppnbm_a10')->default(0);
            $table->bigInteger('ppnbm_ab')->default(0);
            $table->bigInteger('ppnbm_suma')->default(0);

            $table->bigInteger('dpp_ba')->default(0);
            $table->bigInteger('dpp_bb')->default(0);
            $table->bigInteger('dpp_bc')->default(0);
            $table->bigInteger('dpp_bd')->default(0);
            $table->bigInteger('dpp_be')->default(0);
            $table->bigInteger('dpp_bf')->default(0);
            $table->bigInteger('dpp_bg')->default(0);
            $table->bigInteger('dpp_bh')->default(0);
            $table->bigInteger('dpp_bi')->default(0);
            $table->bigInteger('dpp_bj')->default(0);
            $table->bigInteger('dpp_lain_ba')->default(0);
            $table->bigInteger('dpp_lain_bb')->default(0);
            $table->bigInteger('dpp_lain_bc')->default(0);
            $table->bigInteger('dpp_lain_bd')->default(0);
            $table->bigInteger('dpp_lain_be')->default(0);
            $table->bigInteger('dpp_lain_bf')->default(0);
            $table->bigInteger('dpp_lain_bg')->default(0);
            $table->bigInteger('dpp_lain_bh')->default(0);
            $table->bigInteger('dpp_lain_bi')->default(0);
            $table->bigInteger('dpp_lain_bj')->default(0);
            $table->bigInteger('ppn_ba')->default(0);
            $table->bigInteger('ppn_bb')->default(0);
            $table->bigInteger('ppn_bc')->default(0);
            $table->bigInteger('ppn_bd')->default(0);
            $table->bigInteger('ppn_be')->default(0);
            $table->bigInteger('ppn_bf')->default(0);
            $table->bigInteger('ppn_bg')->default(0);
            $table->bigInteger('ppn_bh')->default(0);
            $table->bigInteger('ppn_bi')->default(0);
            $table->bigInteger('ppn_bj')->default(0);
            $table->bigInteger('ppnbm_ba')->default(0);
            $table->bigInteger('ppnbm_bb')->default(0);
            $table->bigInteger('ppnbm_bc')->default(0);
            $table->bigInteger('ppnbm_bd')->default(0);
            $table->bigInteger('ppnbm_be')->default(0);
            $table->bigInteger('ppnbm_bf')->default(0);
            $table->bigInteger('ppnbm_bg')->default(0);
            $table->bigInteger('ppnbm_bh')->default(0);
            $table->bigInteger('ppnbm_bi')->default(0);
            $table->bigInteger('ppnbm_bj')->default(0);

            $table->bigInteger('ppn_ca')->default(0);
            $table->bigInteger('ppn_cb')->default(0);
            $table->bigInteger('ppn_cc')->default(0);
            $table->bigInteger('ppn_cd')->default(0);
            $table->bigInteger('ppn_ce')->default(0);
            $table->bigInteger('ppn_cf')->default(0);
            $table->bigInteger('ppn_cg')->default(0);
            $table->enum('ppn_ch', ['Dikompensasikan', 'dikembalikan melalui pengembalian pendahuluan', 'dikembalikan melalui pemeriksaan'])->nullable();

            $table->bigInteger('dpp_kms')->default(0);
            $table->bigInteger('ppn_kms')->default(0);

            $table->bigInteger('ppn_pkpm')->default(0);

            $table->bigInteger('ppnbm_da')->default(0);
            $table->bigInteger('ppnbm_db')->default(0);
            $table->bigInteger('ppnbm_dc')->default(0);
            $table->bigInteger('ppnbm_dd')->default(0);
            $table->bigInteger('ppnbm_de')->default(0);
            $table->boolean('ppnbm_df')->default(false);

            $table->bigInteger('dpp_ea')->default(0);
            $table->bigInteger('dpp_eb')->default(0);
            $table->bigInteger('dpp_ec')->default(0);
            $table->bigInteger('dpp_lain_ea')->default(0);
            $table->bigInteger('dpp_lain_eb')->default(0);
            $table->bigInteger('dpp_lain_ec')->default(0);
            $table->bigInteger('ppn_ea')->default(0);
            $table->bigInteger('ppn_eb')->default(0);
            $table->bigInteger('ppn_ec')->default(0);
            $table->bigInteger('ppnbm_ea')->default(0);
            $table->bigInteger('ppnbm_eb')->default(0);
            $table->bigInteger('ppnbm_ec')->default(0);

            $table->bigInteger('dpp_fa')->default(0);
            $table->bigInteger('dpp_fb')->default(0);
            $table->bigInteger('dpp_fc')->default(0);
            $table->bigInteger('dpp_lain_fa')->default(0);
            $table->bigInteger('dpp_lain_fb')->default(0);
            $table->bigInteger('dpp_lain_fc')->default(0);
            $table->bigInteger('ppn_fa')->default(0);
            $table->bigInteger('ppn_fb')->default(0);
            $table->bigInteger('ppn_fc')->default(0);
            $table->bigInteger('ppnbm_fa')->default(0);
            $table->bigInteger('ppnbm_fb')->default(0);
            $table->bigInteger('ppnbm_fc')->default(0);
            $table->boolean('ppnbm_fd')->default(false);

            $table->enum('spt_document', ['ya', 'tidak'])->default('tidak');
            $table->enum('spt_result', ['ya', 'tidak'])->default('tidak');

            $table->string('ttd_name');
            $table->string('ttd_position');
            $table->date('ttd_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_induk');
    }
};
