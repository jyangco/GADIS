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
        Schema::create('sdd_reports', function (Blueprint $table) {
            $table->id('sdd_id');
            $table->integer('male');
            $table->integer('female');
            $table->integer('total');
            $table->string('region');
            $table->string('province');
            $table->string('type');
            $table->string('year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sdd_reports');
    }
};
