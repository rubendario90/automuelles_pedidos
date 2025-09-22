<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use App\Jobs\AsignarFacturasJob;

class AsignarFacturaController extends Controller
{
    // Método para obtener las facturas asignadas
    public function obtenerFacturasAsignadas()
    {
        $facturas = Factura::whereNotNull('assigned_to')->get();
        return response()->json($facturas);
    }

    // Método para ejecutar el job manualmente
    public function asignarFacturas()
    {
        dispatch(new AsignarFacturasJob());
        return response()->json(['message' => 'Job AsignarFacturasJob ejecutado correctamente.']);
    }
}