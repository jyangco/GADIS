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
        Schema::create('activity_details', function (Blueprint $table) {
            $table->id('act_id');
            $table->string('act_year');
            $table->string('act_category');
            $table->string('act_type');
            $table->mediumText('act_gad_mandate');
            $table->mediumText('act_cause_of_issue');
            $table->mediumText('act_gad_objective');
            $table->string('act_relevant_org');
            $table->string('act_responsible_unit');
            $table->string('act_expense_class');
            $table->string('act_source');
            $table->string('act_source_code');
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
        Schema::dropIfExists('activity_details');
    }
};
