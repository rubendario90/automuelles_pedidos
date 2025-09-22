<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asignacion_indices', function (Blueprint $table) {
            $table->id(); // Clave primaria
            $table->string('key')->unique(); // Clave única para identificar el índice
            $table->integer('value'); // Valor del índice
            $table->timestamps(); // Timestamps para created_at y updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asignacion_indices'); // Eliminar la tabla en caso de rollback
    }
};