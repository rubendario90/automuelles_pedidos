<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActualizarEstadoToEntregaParcialController extends Controller
{
    public function ActualizarEstadoToEntregaParcial(Request $request)
    {
        $request->validate([
            'transaccion' => 'required|integer',
            'factura_id' => 'required|integer',
            'user_id' => 'required|integer',
        ]);

        $transaccion = $request->transaccion;
        $facturaId = $request->factura_id;
        $userId = $request->user_id;

        DB::transaction(function () use ($transaccion, $facturaId, $userId) {
            // Actualiza el estado en facturas_asignadas
            DB::table('facturas_asignadas')
                ->where('transaccion', $transaccion)
                ->where('factura_id', $facturaId)
                ->update([
                    'estado' => 'RevisionFinal',
                    'updated_at' => now(),
                ]);

            // Guarda el log
            DB::table('factura_status_logs')->insert([
                'transaccion' => $transaccion,
                'factura_id' => $facturaId,
                'user_id' => $userId,
                'new_status' => 'RevisionFinal',
                'changed_at' => now(),
            ]);

            // Borra de entrega_parcial
            DB::table('entrega_parcial')
                ->where('transaccion', $transaccion)
                ->where('factura_id', $facturaId)
                ->delete();
        });

        return response()->json(['message' => 'Factura actualizada y eliminada de entrega_parcial correctamente.']);
    }
}