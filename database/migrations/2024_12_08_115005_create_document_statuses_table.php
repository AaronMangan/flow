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
        Schema::create('document_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('name', 255)->nullable();
            $table->text('description')->nullable();
            $table->boolean('draft')->default(false);
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('organisation_id')->constrained('organisations');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_statuses');
    }
};
