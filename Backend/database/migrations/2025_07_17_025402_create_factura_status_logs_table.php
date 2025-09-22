<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateFacturaStatusLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('factura_status_logs', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('factura_id'); // Foreign key to facturas table
            $table->unsignedBigInteger('transaccion'); // Transaccion ID
            $table->unsignedBigInteger('user_id'); // Foreign key to users table
            $table->string('new_status', 50); // New status
            $table->timestamp('changed_at')->default(DB::raw('CURRENT_TIMESTAMP')); // Timestamp of the change

            // Foreign key constraints
            $table->foreign('factura_id')->references('id')->on('facturas')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('factura_status_logs');
    }
}