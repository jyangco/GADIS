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
        Schema::create('annex_b_agenda_contents', function (Blueprint $table) {
            $table->id('ac_id');
            $table->integer('ab_goal_id');
            $table->string('gender_issue');
            $table->string('result');
            $table->string('indicator');
            $table->string('baseline');
            $table->string('responsible_office');
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
        Schema::dropIfExists('annex_b_agenda_contents');
    }
};
