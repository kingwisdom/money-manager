<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->decimal('amount', 12, 2);
            $table->unsignedTinyInteger('due_day');
            $table->unsignedTinyInteger('due_month')->nullable();
            $table->enum('frequency', ['monthly', 'yearly'])->default('monthly');
            $table->boolean('auto_pay')->default(false);
            $table->boolean('active')->default(true);
            $table->unsignedSmallInteger('reminder_days')->default(3);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
