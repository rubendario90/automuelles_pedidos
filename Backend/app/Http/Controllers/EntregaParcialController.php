<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EntregaParcialController extends Controller
{
    public function getEntregaParcial()
    {
        try {
            // Obtener los datos de la tabla entrega_parcial junto con el nombre del usuario
            $entregas = DB::table('entrega_parcial')
                ->join('users', 'entrega_parcial.user_id', '=', 'users.id') // Join con la tabla users
                ->join('facturas', 'entrega_parcial.factura_id', '=', 'facturas.id')
                ->select(
                    'entrega_parcial.id',
                    'entrega_parcial.factura_id',
                    'entrega_parcial.transaccion',
                    'users.name as user_name', // Obtener el nombre del usuario
                    'entrega_parcial.productos',
                    'entrega_parcial.created_at',
                    'entrega_parcial.updated_at',
                    'facturas.documento'
                )
                ->orderBy('entrega_parcial.created_at', 'desc') // Ordenar por la fecha de creación
                ->get();

            // Procesar el campo productos para formatear los valores numéricos
            $entregas = $entregas->map(function ($entrega) {
                $productos = json_decode($entrega->productos, true);
                if (is_array($productos)) {
                    foreach ($productos as &$producto) {
                        // Buscar StrParam1 por producto
                        $param1 = DB::connection('sqlsrv2')
                            ->table('dbo.TblProductos')
                            ->where('StrIdProducto', $producto['producto'])
                            ->value('StrParam1');
                        $producto['StrParam1'] = $param1 ?? '';
                        if (isset($producto['cantidad'])) {
                            $producto['cantidad'] = number_format((float) $producto['cantidad'], 2, '.', '');
                        }
                    }
                    $entrega->productos = json_encode($productos);
                }

                // Buscar detalles adicionales por transacción y documento
                $detalle = DB::connection('sqlsrv2')
                    ->table('dbo.TblDetalleDocumentos as d')
                    ->select(
                        'doc.StrReferencia1',
                        'doc.StrUsuarioGra',
                        'ter.StrNombre as ClienteNombre',
                        'doc.StrObservaciones',
                        'p.StrParam1'
                    )
                    ->leftJoin('dbo.TblProductos as p', 'd.StrProducto', '=', 'p.StrIdProducto')
                    ->leftJoin('dbo.TblDocumentos as doc', function ($join) {
                        $join->on('d.IntTransaccion', '=', 'doc.IntTransaccion')
                            ->on('d.IntDocumento', '=', 'doc.IntDocumento');
                    })
                    ->leftJoin('dbo.TblTerceros as ter', 'doc.StrTercero', '=', 'ter.StrIdTercero')
                    ->where('d.IntTransaccion', $entrega->transaccion)
                    ->where('d.IntDocumento', $entrega->documento)
                    ->orderBy('d.IntDocumento')
                    ->first();

                $entrega->StrReferencia1 = $detalle->StrReferencia1 ?? null;
                $entrega->StrUsuarioGra = $detalle->StrUsuarioGra ?? null;
                $entrega->ClienteNombre = $detalle->ClienteNombre ?? null;
                $entrega->StrObservaciones = $detalle->StrObservaciones ?? null;
                $entrega->StrParam1 = $detalle->StrParam1 ?? null;

                return $entrega;
            });


            return response()->json($entregas, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }
}
