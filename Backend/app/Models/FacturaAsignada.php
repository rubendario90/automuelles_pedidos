<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacturaAsignada extends Model
{
    use HasFactory;

    protected $table = 'facturas_asignadas'; // Nombre de la tabla en la base de datos

    protected $fillable = [
        'factura_id',
        'user_id',
        'estado',
        'user_name',
        'transaccion',
        'documento',
        'created_at',
        'updated_at',
    ];
}