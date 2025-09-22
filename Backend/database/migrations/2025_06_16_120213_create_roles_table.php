<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id'); // ID autoincremental
            $table->string('name')->unique(); // Nombre del rol
            $table->timestamps();
        });

        // Agregar la relación de roles a la tabla users
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('role_id')->nullable(); // Cambiar a unsignedInteger para coincidir con increments
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });

        Schema::dropIfExists('roles');
    }
}