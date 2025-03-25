<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        /**
         * Adds a weight column to the revision table. This is used to sort the revisions in their proper order.
         */
        Schema::table('revisions', function (Blueprint $table) {
            $table->integer('weight')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('revisions', function (Blueprint $table) {
            $table->dropColumn(['weight']);
        });
    }
};
