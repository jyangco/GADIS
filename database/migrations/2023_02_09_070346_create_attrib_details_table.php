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
        Schema::create('attrib_details', function (Blueprint $table) {
            $table->id('attrib_id');
            $table->integer('attrib_number');
            $table->double('attrib_planned_budget');
            $table->double('attrib_actual_budget');
            $table->string('attrib_year');
            $table->string('attrib_responsible_unit');
            $table->string('attrib_class');
            $table->string('attrib_source');
            $table->string('attrib_source_code');
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
        Schema::dropIfExists('attrib_details');
    }
};
