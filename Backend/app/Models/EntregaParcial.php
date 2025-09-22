<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntregaParcial extends Model
{
    use HasFactory;

    protected $table = 'entrega_parcial';

    protected $fillable = [
        'factura_id',
        'transaccion',
        'user_id',
        'productos',
    ];

    protected $casts = [
        'productos' => 'array', 
    ];
}