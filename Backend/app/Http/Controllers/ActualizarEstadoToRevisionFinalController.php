<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActualizarEstadoToRevisionFinalController extends Controller
{
    public function ActualizarEstadoToRevisionFinal(Request $request)
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
            // Step 1: Update the status of the factura in facturas_asignadas to 'RevisionFinal'
            DB::table('facturas_asignadas')
                ->where('factura_id', $facturaId)
                ->update([
                    'estado' => 'RevisionFinal',
                    'updated_at' => now(),
                ]);

            // Step 2: Save a copy of the factura in factura_status_logs with status 'RevisionFinal'
            DB::table('factura_status_logs')->insert([
                'factura_id' => $facturaId,
                'transaccion' => $transaccion,
                'user_id' => $userId,
                'new_status' => 'RevisionFinal',
                'changed_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Factura actualizada a RevisionFinal correctamente.']);
    }
}