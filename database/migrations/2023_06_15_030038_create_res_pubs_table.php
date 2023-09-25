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
        Schema::create('res_pubs', function (Blueprint $table) {
            $table->id('respub_id');
            $table->string('file_type');
            $table->string('file_title');
            $table->string('file_category');
            $table->string('file_subcategory');
            $table->string('file_name');
            $table->string('file_thumbnail')->default('');
            $table->string('issuance_year')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('res_pubs');
    }
};
