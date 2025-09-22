<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacturaStatusLog extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'factura_status_logs';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'factura_id',
        'transaccion',
        'user_id',
        'new_status',
        'changed_at',
    ];

    // Relación con la tabla `facturas`
    public function factura()
    {
        return $this->belongsTo(Factura::class, 'factura_id');
    }

    // Relación con la tabla `users`
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}