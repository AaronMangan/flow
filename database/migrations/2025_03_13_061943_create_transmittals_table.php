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
        // Create the transmittal table
        Schema::create('transmittals', function (Blueprint $table) {
            $table->id();
            $table->json('to');
            $table->longText('details')->nullable();

            // Related organisation (of the creating user)
            $table->foreignId('organisation_id')->constrained('organisations');

            // Status of the transmittal.
            $table->foreignId('status_id')->constrained('document_statuses');

            $table->dateTime('sent_at')->nullable();
            $table->dateTime('acknowledged_at')->nullable();
            $table->timestamps();
        });

        // Create the intermediate document/transmittals
        Schema::create('document_transmittal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->onDelete('cascade');
            $table->foreignId('revision_id')->constrained()->onDelete('cascade');
            $table->foreignId('status_id')->constrained('document_statuses')->onDelete('cascade');
            $table->foreignId('transmittal_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_transmittal');
        Schema::dropIfExists('transmittals');
    }
};
