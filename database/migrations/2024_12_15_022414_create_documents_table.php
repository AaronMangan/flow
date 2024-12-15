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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);                                                // Name is required.
            $table->longText('description')->nullable();                                // Description can keep more information about the document.

            /* RELATIONSHIPS */
            // The user that created the document.
            $table->foreignId('user_id')->constrained('users');

            // The organisation the document belongs to.
            $table->foreignId('organisation_id')->constrained('organisations');

            // The related status of the document.
            $table->foreignId('document_status_id')->constrained('document_statuses');

            // Discipline (nullable because it can be configured to not be used)
            $table->foreignId('discipline_id')->constrained('disciplines')->nullable();

            // Type (nullable because it can be configured to not be used)
            $table->foreignId('type_id')->constrained('types')->nullable();

            // Area (nullable because they can be configured to not be used)
            $table->foreignId('area_id')->constrained('areas')->nullable();

            // Revision.
            $table->foreignId('revision_id')->constrained('revisions')->nullable();

            // Timestamps, including soft delete.
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::dropIfExists('documents');
    }
};
