<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VendedorFacturaController extends Controller
{
    public function facturasVendedorRevisionFinal()
    {
        // 1. Obtén las facturas que NO están en estado RevisionFinal
        $facturas = DB::table('facturas_asignadas')
            ->where('estado', 'RevisionFinal')
            ->get();

        // 2. Extrae los IDs de transacción y documento
        $transacciones = $facturas->pluck('transaccion')->unique()->toArray();
        $documentos = $facturas->pluck('documento')->unique()->toArray();

        // 3. Consulta los detalles en sqlsrv2 con los datos adicionales
        $detalles = DB::connection('sqlsrv2')
            ->table('dbo.TblDetalleDocumentos as d')
            ->select(
                'd.IntTransaccion',
                'd.IntDocumento',
                'd.StrProducto',
                'p.StrDescripcion',
                'p.StrParam1',
                'd.IntBodega',
                'd.IntCantidad',
                'd.StrUnidad',
                'd.DatFecha1',
                'd.StrVendedor',
                'doc.StrObservaciones',
                'doc.StrUsuarioGra',
                'doc.StrReferencia1',
                'doc.StrReferencia3',
                'doc.IntTotal',
                'doc.StrTercero',
                'ter.StrNombre as ClienteNombre'
            )
            ->leftJoin('dbo.TblProductos as p', 'd.StrProducto', '=', 'p.StrIdProducto')
            ->leftJoin('dbo.TblDocumentos as doc', function ($join) {
                $join->on('d.IntTransaccion', '=', 'doc.IntTransaccion')
                    ->on('d.IntDocumento', '=', 'doc.IntDocumento');
            })
            ->leftJoin('dbo.TblTerceros as ter', 'doc.StrTercero', '=', 'ter.StrIdTercero')
            ->whereIn('d.IntTransaccion', $transacciones)
            ->whereIn('d.IntDocumento', $documentos)
            ->where(function ($query) {
                $query->whereNull('doc.StrReferencia1')
                    ->orWhereRaw("LTRIM(RTRIM(doc.StrReferencia1)) = ''")
                    ->orWhereRaw("doc.StrReferencia1 = '0'")
                    ->orWhereRaw("doc.StrReferencia1 NOT LIKE '%[A-Za-z]%'");
            })
            ->orderBy('d.IntDocumento')
            ->get();

        // 4. Filtra las facturas asignadas para mostrar solo las que tienen detalles SIN StrReferencia1 válido
        $facturasFiltradas = $facturas->filter(function ($factura) use ($detalles) {
            return $detalles->contains(function ($detalle) use ($factura) {
                return $detalle->IntTransaccion == $factura->transaccion
                    && $detalle->IntDocumento == $factura->documento;
            });
        })->values();

        // 5. Devuelve los detalles completos de las facturas filtradas
        $facturasConDetalles = $facturasFiltradas->map(function ($factura) use ($detalles) {
            return $detalles->first(function ($detalle) use ($factura) {
                return $detalle->IntTransaccion == $factura->transaccion
                    && $detalle->IntDocumento == $factura->documento;
            });
        });

        return response()->json($facturasConDetalles);
    }
}