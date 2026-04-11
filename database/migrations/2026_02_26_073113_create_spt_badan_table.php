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
        Schema::create('spt_badan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('spt_id')->constrained('spt')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('business_entity_id')->constrained('business_entities')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignUuid('bank_id')->nullable()->constrained('banks')->onUpdate('cascade')->onDelete('set null');
            $table->enum('type_of_bookkeeping', ['pembukuan stelsel akrual', 'pembukuan stelsel kas', 'pencatatan'])->default('pencatatan');

            $table->string('b_1a')->nullable();
            $table->boolean('b_2')->nullable()->default(null);
            $table->string('b_2a')->nullable();
            $table->string('b_2b')->nullable();
            $table->string('b_2c')->nullable();

            $table->boolean('c_1a')->nullable()->default(null);
            $table->boolean('c_1b')->nullable()->default(null);
            $table->boolean('c_2')->nullable()->default(null);
            $table->bigInteger('c_2_value')->default(0);
            $table->boolean('c_3')->nullable()->default(null);
            $table->bigInteger('c_3_value')->default(0);

            $table->bigInteger('d_4')->default(0);
            $table->boolean('d_5')->nullable()->default(null);
            $table->bigInteger('d_5_value')->default(0);
            $table->boolean('d_6')->nullable()->default(null);
            $table->bigInteger('d_6_value')->default(0);
            $table->bigInteger('d_7')->default(0);
            $table->boolean('d_8')->nullable()->default(null);
            $table->bigInteger('d_8_value')->default(0);
            $table->bigInteger('d_9')->default(0);
            $table->boolean('d_10')->nullable()->default(null);
            $table->bigInteger('d_10_value')->default(0);
            $table->string('d_11')->nullable();
            $table->decimal('d_11_percentage', 15, 2)->default(0);
            $table->bigInteger('d_12')->default(0);

            $table->boolean('e_13')->nullable()->default(null);
            $table->bigInteger('e_13_value')->default(0);
            $table->bigInteger('e_14')->default(0);
            $table->bigInteger('e_15')->default(0);
            $table->boolean('e_16')->nullable()->default(null);
            $table->bigInteger('e_16_value')->default(0);

            $table->bigInteger('f_17a')->default(0);
            $table->boolean('f_17b')->nullable()->default(null);
            $table->bigInteger('f_17b_value')->default(0);
            $table->bigInteger('f_17c')->default(0);
            $table->boolean('f_18a')->nullable()->default(null);
            $table->bigInteger('f_18a_value')->default(0);
            $table->bigInteger('f_18b')->default(0);
            $table->string('f_19a')->nullable();

            $table->string('account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('account_name')->nullable();

            $table->boolean('g_20')->nullable()->default(null);
            $table->bigInteger('g_20_value')->default(0);

            $table->boolean('f_21a')->nullable()->default(null);
            $table->boolean('f_21b')->nullable()->default(null);
            $table->boolean('f_21c')->nullable()->default(null);
            $table->boolean('f_21d')->nullable()->default(null);
            $table->boolean('f_21e')->nullable()->default(null);
            $table->boolean('f_21f')->nullable()->default(null);
            $table->boolean('f_21g')->nullable()->default(null);
            $table->boolean('f_21h')->nullable()->default(null);
            $table->boolean('f_21i')->nullable()->default(null);
            $table->bigInteger('f_21j')->default(0);

            $table->string('i_a_1')->nullable();
            $table->string('i_a_2')->nullable();
            $table->string('i_b')->nullable();
            $table->string('i_c')->nullable();
            $table->string('i_d')->nullable();
            $table->string('i_e')->nullable();
            $table->string('i_f')->nullable();
            $table->string('i_f_1')->nullable();
            $table->string('i_f_2')->nullable();
            $table->string('i_f_3')->nullable();
            $table->string('i_f_4')->nullable();
            $table->string('i_g')->nullable();
            $table->string('i_h_1')->nullable();
            $table->string('i_h_2')->nullable();
            $table->string('i_i')->nullable();
            $table->string('i_j')->nullable();

            $table->enum('j_signer', ['taxpayer', 'representative'])->default('taxpayer');
            $table->string('j_signer_id')->nullable();
            $table->string('j_signer_name')->nullable();
            $table->string('j_signer_position')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spt_badans');
    }
};
