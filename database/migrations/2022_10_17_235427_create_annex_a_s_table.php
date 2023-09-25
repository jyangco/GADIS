<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('annex_a_s', function (Blueprint $table) {
            $table->id('aa_id');
            $table->string('start_year');
            $table->string('end_year');
            $table->string('GAD_vision');
            $table->mediumText('GAD_mission');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('annex_a_s');
    }
};
