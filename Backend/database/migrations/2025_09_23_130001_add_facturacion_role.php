<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add Facturacion role if it doesn't exist
        $existingRole = DB::table('roles')->where('name', 'Facturacion')->first();
        
        if (!$existingRole) {
            DB::table('roles')->insert([
                'name' => 'Facturacion',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('roles')->where('name', 'Facturacion')->delete();
    }
};