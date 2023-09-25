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
        Schema::create('activity_beneficiaries', function (Blueprint $table) {
            $table->id('ben_id');
            $table->integer('act_id');
            $table->string('act_target');
            $table->integer('p_beneficiary_value');
            $table->string('p_beneficiary_target');
            $table->integer('a_beneficiary_value');
            $table->string('a_beneficiary_target');
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
        Schema::dropIfExists('activity_beneficiaries');
    }
};
