<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\FacturaPago;

class ActualizarEstadoEntregadoController extends Controller
{
    public function actualizarEstado(Request $request)
    {
        $request->validate([
            'documento' => 'required|integer',
            'transaccion' => 'required|integer',
            'user_id' => 'required|integer',
            'signature' => 'nullable|string',
        ]);
        
        $documento = $request->documento;
        $transaccion = $request->transaccion;
        $userId = $request->user_id;
        
        // Busca el id de la factura usando documento y transaccion
        $factura = DB::table('facturas')
            ->where('documento', $documento)
            ->where('transaccion', $transaccion)
            ->first();
        
        if (!$factura) {
            return response()->json(['message' => 'Factura no encontrada.'], 404);
        }
        
        $facturaId = $factura->id;
    
        DB::transaction(function () use ($facturaId, $transaccion, $documento, $userId) {
            DB::table('facturas_asignadas')
                ->where('factura_id', $facturaId)
                ->update([
                    'estado' => 'Entregado',
                    'updated_at' => now(),
                ]);
    
            DB::table('factura_status_logs')->insert([
                'factura_id' => $facturaId,
                'transaccion' => $transaccion,
                'user_id' => $userId,
                'new_status' => 'Entregado',
                'changed_at' => now(),
            ]);

            // Create payment record as pending when invoice is delivered
            FacturaPago::updateOrCreate(
                [
                    'factura_id' => $facturaId,
                    'documento' => $documento,
                    'transaccion' => $transaccion,
                ],
                [
                    'mensajero_id' => $userId,
                    'estado_pago' => 'pendiente',
                ]
            );
        });
    
        return response()->json(['message' => 'Factura actualizada a Entregado correctamente.']);
    }
}
