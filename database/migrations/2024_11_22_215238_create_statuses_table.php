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
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('description', 255);
            $table->string('type', 255);
            $table->unsignedBigInteger('organisation_id')->nullable();
            $table->foreign('organisation_id')->references('id')->on('organisations');
            $table->softDeletes();
            $table->timestamps();
        });

        // Apply a foreign key to the users table to provide a user status.
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('status_id')->default(1);
            $table->foreign('status_id')->references('id')->on('statuses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('statuses', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::dropIfExists('statuses');
    }
};
