<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 30)->nullable();
            $table->string('department', 100)->nullable()->index();
            $table->string('position', 100)->nullable();
            $table->date('join_date')->nullable()->index();
            $table->string('gender', 20)->nullable();
            $table->string('status', 20)->default('active')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['department']);
            $table->dropIndex(['join_date']);
            $table->dropIndex(['status']);
            $table->dropColumn([
                'phone',
                'department',
                'position',
                'join_date',
                'gender',
                'status',
            ]);
        });
    }
};
