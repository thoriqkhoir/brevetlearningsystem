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
        Schema::create('spt_op', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_id')->constrained('spt')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('bank_id')->nullable()->constrained('banks')->onUpdate('cascade')->onDelete('set null');
            $table->enum('source_income', ['kegiatan usaha', 'pekerjaan', 'pekerjaan bebas', 'lainnya'])->default('lainnya');
            $table->enum('type_of_bookkeeping', ['pembukuan stelsel akrual', 'pembukuan stelsel kas', 'pencatatan'])->default('pencatatan');

            $table->boolean('b_1a')->nullable()->default(null);
            $table->integer('b_1a_value')->default(0);
            $table->boolean('b_1b_1')->nullable()->default(null);
            $table->enum('b_1b_2', ['tidak', 'ya1', 'ya2'])->nullable()->default(null);
            $table->enum('b_1b_3', ['tidak1', 'tidak2', 'ya'])->nullable()->default(null);
            $table->enum('b_1b_4', ['dagang', 'jasa', 'industri'])->nullable()->default(null);
            $table->integer('b_1b_5')->default(0);
            $table->boolean('b_1c')->nullable()->default(null);
            $table->integer('b_1c_value')->default(0);
            $table->boolean('b_1d')->nullable()->default(null);
            $table->integer('b_1d_value')->default(0);

            $table->integer('c_2')->default(0);
            $table->boolean('c_3')->nullable()->default(null);
            $table->integer('c_3_value')->default(0);
            $table->integer('c_4')->default(0);
            $table->string('c_5')->nullable();
            $table->integer('c_6')->default(0);
            $table->integer('c_7')->default(0);
            $table->boolean('c_8')->nullable()->default(null);
            $table->integer('c_8_value')->default(0);
            $table->integer('c_9')->default(0);

            $table->boolean('d_10_a')->nullable()->default(null);
            $table->integer('d_10_a_value')->default(0);
            $table->integer('d_10_b')->default(0);
            $table->integer('d_10_c')->default(0);
            $table->boolean('d_10_d')->nullable()->default(null);
            $table->integer('d_10_d_value')->default(0);

            $table->integer('e_11_a')->default(0);
            $table->boolean('e_11_b')->nullable()->default(null);
            $table->integer('e_11_b_value')->default(0);
            $table->integer('e_11_c')->default(0);

            $table->integer('f_12_a')->default(0);
            $table->integer('f_12_b')->default(0);

            $table->enum('g_pph', ['dikembalikan melalui pemeriksaan', 'dikembalikan melalui permohonan pendahuluan'])->nullable()->default(null);
            $table->string('account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('account_name')->nullable();

            $table->boolean('h_13_a')->nullable()->default(null);
            $table->integer('h_13_a_value')->default(0);
            $table->boolean('h_13_b')->nullable()->default(null);
            $table->integer('h_13_b_value')->default(0);
            $table->boolean('h_13_c')->nullable()->default(null);

            $table->integer('i_14_a')->default(0);
            $table->boolean('i_14_b')->nullable()->default(null);
            $table->integer('i_14_b_value')->default(0);
            $table->boolean('i_14_c')->nullable()->default(null);
            $table->integer('i_14_c_value')->default(0);
            $table->boolean('i_14_d')->nullable()->default(null);
            $table->integer('i_14_d_value')->default(0);
            $table->boolean('i_14_e')->nullable()->default(null);
            $table->integer('i_14_e_value')->default(0);
            $table->boolean('i_14_f')->nullable()->default(null);
            $table->integer('i_14_f_value')->default(0);
            $table->boolean('i_14_g')->nullable()->default(null);
            $table->integer('i_14_h')->default(0);

            $table->boolean('j_a')->nullable()->default(null);
            $table->string('j_a_file')->nullable();
            $table->boolean('j_b')->nullable()->default(null);
            $table->string('j_b_file')->nullable();
            $table->boolean('j_c')->nullable()->default(null);
            $table->string('j_c_file')->nullable();
            $table->boolean('j_d')->nullable()->default(null);
            $table->string('j_d_file')->nullable();
            $table->boolean('j_e')->nullable()->default(null);
            $table->string('j_e_file')->nullable();

            $table->enum('k_signer', ['taxpayer', 'representative'])->default('taxpayer');
            $table->string('k_signer_id')->nullable();
            $table->string('k_signer_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_op');
    }
};
