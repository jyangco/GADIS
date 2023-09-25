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
        Schema::create('gad_reports', function (Blueprint $table) {
            $table->id('report_id');
            $table->string('report_year');
            $table->string('report_type');
            $table->string('status');
            $table->double('total_budget');
            $table->json('activity_list');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gad_reports');
    }
};
