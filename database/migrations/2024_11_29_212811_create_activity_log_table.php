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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('model_name', 255);
            $table->integer('model_id');
            $table->string('event', 255)->nullable();
            $table->json('data')->nullable();

            // The user that made the change.
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('organisation_id')->constrained('organisations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_log');
    }
};
