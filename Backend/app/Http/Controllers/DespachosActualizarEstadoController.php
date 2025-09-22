<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DespachosActualizarEstadoController extends Controller
{
    public function actualizarEstado(Request $request)
    {
        $request->validate([
            'factura_id' => 'required|integer',
            'transaccion' => 'required|integer',
            'user_id' => 'required|integer',
        ]);

        $facturaId = $request->factura_id;
        $transaccion = $request->transaccion;
        $userId = $request->user_id;

        DB::transaction(function () use ($facturaId, $transaccion, $userId) {
            // Actualiza el estado a "Despachos"
            DB::table('facturas_asignadas')
                ->where('factura_id', $facturaId)
                ->update([
                    'estado' => 'Despachos',
                    'updated_at' => now(),
                ]);

            // Guarda el log de estado
            DB::table('factura_status_logs')->insert([
                'factura_id' => $facturaId,
                'transaccion' => $transaccion,
                'user_id' => $userId,
                'new_status' => 'Despachos',
                'changed_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Factura actualizada a Despachos correctamente.']);
    }
}