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
        Schema::create('factura_pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('factura_id')->constrained('facturas')->onDelete('cascade');
            $table->foreignId('mensajero_id')->constrained('users')->onDelete('cascade');
            $table->enum('estado_pago', ['pendiente', 'pagado', 'no_pagado'])->default('pendiente');
            $table->decimal('monto_pagado', 10, 2)->nullable();
            $table->timestamp('fecha_pago')->nullable();
            $table->text('observaciones')->nullable();
            $table->string('transaccion'); // For easier tracking with existing system
            $table->string('documento'); // For easier tracking with existing system
            $table->timestamps();

            // Indexes for better performance
            $table->index(['estado_pago', 'fecha_pago']);
            $table->index(['transaccion', 'documento']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('factura_pagos');
    }
};