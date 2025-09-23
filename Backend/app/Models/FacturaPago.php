<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacturaPago extends Model
{
    use HasFactory;

    protected $table = 'factura_pagos';

    protected $fillable = [
        'factura_id',
        'mensajero_id',
        'estado_pago',
        'monto_pagado',
        'fecha_pago',
        'observaciones',
        'transaccion',
        'documento'
    ];

    protected $casts = [
        'fecha_pago' => 'datetime',
        'monto_pagado' => 'decimal:2'
    ];

    /**
     * Relationship with Factura
     */
    public function factura()
    {
        return $this->belongsTo(Factura::class);
    }

    /**
     * Relationship with User (Mensajero)
     */
    public function mensajero()
    {
        return $this->belongsTo(User::class, 'mensajero_id');
    }

    /**
     * Scope for paid invoices
     */
    public function scopePagadas($query)
    {
        return $query->where('estado_pago', 'pagado');
    }

    /**
     * Scope for unpaid invoices
     */
    public function scopeNoPagadas($query)
    {
        return $query->where('estado_pago', 'no_pagado');
    }

    /**
     * Scope for pending invoices
     */
    public function scopePendientes($query)
    {
        return $query->where('estado_pago', 'pendiente');
    }
}