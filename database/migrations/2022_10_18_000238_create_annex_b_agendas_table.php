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
        Schema::create('annex_b_agendas', function (Blueprint $table) {
            $table->id('agenda_id');
            $table->integer('an_id');
            $table->string('agenda_year');
            $table->mediumText('agenda_target');
            $table->string('agenda_budget');
            $table->string('agenda_budget_for')->default("");
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
        Schema::dropIfExists('annex_b_agendas');
    }
};
