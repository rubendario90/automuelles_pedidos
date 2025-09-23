<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\FacturaPago;
use App\Models\Factura;

class FacturacionController extends Controller
{
    /**
     * Get all paid invoices
     */
    public function facturasPagadas(Request $request)
    {
        try {
            $query = FacturaPago::with(['factura', 'mensajero'])
                ->pagadas()
                ->orderBy('fecha_pago', 'desc');

            // Apply filters if provided
            if ($request->has('fecha_inicio') && $request->fecha_inicio) {
                $query->where('fecha_pago', '>=', $request->fecha_inicio);
            }

            if ($request->has('fecha_fin') && $request->fecha_fin) {
                $query->where('fecha_pago', '<=', $request->fecha_fin);
            }

            if ($request->has('mensajero_id') && $request->mensajero_id) {
                $query->where('mensajero_id', $request->mensajero_id);
            }

            $facturasPagadas = $query->get();

            return response()->json($facturasPagadas);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener facturas pagadas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all unpaid invoices
     */
    public function facturasPendientesPago(Request $request)
    {
        try {
            $query = FacturaPago::with(['factura', 'mensajero'])
                ->whereIn('estado_pago', ['no_pagado', 'pendiente'])
                ->orderBy('created_at', 'desc');

            // Apply filters if provided
            if ($request->has('estado') && $request->estado) {
                $query->where('estado_pago', $request->estado);
            }

            $facturasPendientes = $query->get();

            return response()->json($facturasPendientes);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener facturas pendientes de pago',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Report payment status when messenger delivers invoice
     */
    public function reportarPago(Request $request)
    {
        $request->validate([
            'documento' => 'required|integer',
            'transaccion' => 'required|integer',
            'mensajero_id' => 'required|integer',
            'estado_pago' => 'required|in:pagado,no_pagado',
            'monto_pagado' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string|max:1000'
        ]);

        try {
            // Find the factura
            $factura = DB::table('facturas')
                ->where('documento', $request->documento)
                ->where('transaccion', $request->transaccion)
                ->first();

            if (!$factura) {
                return response()->json([
                    'message' => 'Factura no encontrada'
                ], 404);
            }

            DB::beginTransaction();

            // Create or update payment record
            $facturaPago = FacturaPago::updateOrCreate(
                [
                    'factura_id' => $factura->id,
                    'documento' => $request->documento,
                    'transaccion' => $request->transaccion,
                ],
                [
                    'mensajero_id' => $request->mensajero_id,
                    'estado_pago' => $request->estado_pago,
                    'monto_pagado' => $request->monto_pagado,
                    'fecha_pago' => $request->estado_pago === 'pagado' ? now() : null,
                    'observaciones' => $request->observaciones,
                ]
            );

            // Log the payment status change
            DB::table('factura_status_logs')->insert([
                'factura_id' => $factura->id,
                'transaccion' => $request->transaccion,
                'user_id' => $request->mensajero_id,
                'new_status' => $request->estado_pago === 'pagado' ? 'Pagado' : 'No Pagado',
                'changed_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Estado de pago reportado correctamente',
                'factura_pago' => $facturaPago
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al reportar estado de pago',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment statistics
     */
    public function estadisticasPago(Request $request)
    {
        try {
            $fechaInicio = $request->get('fecha_inicio', now()->startOfMonth());
            $fechaFin = $request->get('fecha_fin', now()->endOfMonth());

            $estadisticas = [
                'total_facturas' => FacturaPago::whereBetween('created_at', [$fechaInicio, $fechaFin])->count(),
                'facturas_pagadas' => FacturaPago::pagadas()->whereBetween('fecha_pago', [$fechaInicio, $fechaFin])->count(),
                'facturas_no_pagadas' => FacturaPago::noPagadas()->whereBetween('created_at', [$fechaInicio, $fechaFin])->count(),
                'facturas_pendientes' => FacturaPago::pendientes()->whereBetween('created_at', [$fechaInicio, $fechaFin])->count(),
                'monto_total_pagado' => FacturaPago::pagadas()->whereBetween('fecha_pago', [$fechaInicio, $fechaFin])->sum('monto_pagado'),
            ];

            return response()->json($estadisticas);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent payment notifications
     */
    public function notificacionesPago(Request $request)
    {
        try {
            $limit = $request->get('limit', 10);
            
            $notificaciones = FacturaPago::with(['factura', 'mensajero'])
                ->where('estado_pago', 'pagado')
                ->where('fecha_pago', '>=', now()->subDays(7)) // Last 7 days
                ->orderBy('fecha_pago', 'desc')
                ->limit($limit)
                ->get();

            return response()->json($notificaciones);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener notificaciones',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}