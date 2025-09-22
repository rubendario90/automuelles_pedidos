<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntregaParcialTable extends Migration
{
    public function up()
    {
        Schema::create('entrega_parcial', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('factura_id');
            $table->unsignedBigInteger('transaccion');
            $table->unsignedBigInteger('user_id');
            $table->json('productos'); // Almacena los productos seleccionados y no seleccionados en formato JSON
            $table->timestamps();

            // Relaciones
            $table->foreign('factura_id')->references('id')->on('facturas')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('entrega_parcial');
    }
}