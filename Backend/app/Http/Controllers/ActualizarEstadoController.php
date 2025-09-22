<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActualizarEstadoController extends Controller
{
    public function ActualizarEstado(Request $request)
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

            // Step 2: Update the status of the factura in facturas_asignadas to 'picking'
            DB::table('facturas_asignadas')
                ->where('factura_id', $facturaId)
                ->update([
                    'estado' => 'picking',
                    'updated_at' => now(),
                ]);

            // Step 3: Save a copy of the factura in factura_status_logs with status 'picking'
            DB::table('factura_status_logs')->insert([
                'factura_id' => $facturaId,
                'transaccion' => $transaccion,
                'user_id' => $userId,
                'new_status' => 'picking',
                'changed_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Factura actualizada correctamente.']);
    }

    public function registrarEntregaParcial(Request $request)
    {
        $request->validate([
            'factura_id' => 'required|integer',
            'transaccion' => 'required|integer',
            'user_id' => 'required|integer',
            'productos_seleccionados' => 'nullable|array',
            'productos_no_seleccionados' => 'nullable|array',
        ]);

        $facturaId = $request->factura_id;
        $transaccion = $request->transaccion;
        $userId = $request->user_id;
        $productosSeleccionados = $request->productos_seleccionados;
        $productosNoSeleccionados = $request->productos_no_seleccionados;

        DB::transaction(function () use ($facturaId, $transaccion, $userId, $productosSeleccionados, $productosNoSeleccionados) {
            // Crear un diccionario con los productos seleccionados y no seleccionados
            $productos = [];

            if ($productosSeleccionados) {
                foreach ($productosSeleccionados as $producto) {
                    $productos[] = [
                        'descripcion' => $producto['StrDescripcion'],
                        'producto' => $producto['StrProducto'],
                        'bodega' => $producto['IntBodega'],
                        'cantidad' => number_format((float)$producto['IntCantidad'], 2, '.', ''),
                        'estado' => 'entregado',
                    ];
                }
            }

            if ($productosNoSeleccionados) {
                foreach ($productosNoSeleccionados as $producto) {
                    $productos[] = [
                        'descripcion' => $producto['StrDescripcion'],
                        'producto' => $producto['StrProducto'],
                        'bodega' => $producto['IntBodega'],
                        'cantidad' => number_format((float)$producto['IntCantidad'], 2, '.', ''),
                        'estado' => 'no entregado',
                    ];
                }
            }

            // Guardar los datos en la tabla entrega_parcial
            DB::table('entrega_parcial')->insert([
                'factura_id' => $facturaId,
                'transaccion' => $transaccion,
                'user_id' => $userId,
                'productos' => json_encode($productos), // Guardar como JSON
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Actualizar el estado en facturas_asignadas a "entrega parcial"
            DB::table('facturas_asignadas')
                ->where('factura_id', $facturaId)
                ->update([
                    'estado' => 'entrega parcial',
                    'updated_at' => now(),
                ]);

            // Registrar el estado "entrega parcial" en factura_status_logs
            DB::table('factura_status_logs')->insert([
                'factura_id' => $facturaId,
                'transaccion' => $transaccion,
                'user_id' => $userId,
                'new_status' => 'entrega parcial',
                'changed_at' => now(),
            ]);

            // Registrar el estado "picking" en factura_status_logs
            DB::table('factura_status_logs')->insert([
                'factura_id' => $facturaId,
                'transaccion' => $transaccion,
                'user_id' => $userId,
                'new_status' => 'picking',
                'changed_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Estado "entrega parcial" registrado correctamente.']);
    }
}
