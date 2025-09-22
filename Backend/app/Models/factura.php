<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class factura extends Model
{
    // Define los campos que pueden ser asignados masivamente
    protected $fillable = [
        'IntTransaccion',
        'IntDocumento',
        'fecha_de_creacion',
        'assigned_to'
    ];

    // Si necesitas personalizar el formato de las fechas
    protected $dates = ['fecha_de_creacion'];

    // Si la tabla tiene un nombre diferente al plural del modelo
    // protected $table = 'nombre_de_la_tabla';
}