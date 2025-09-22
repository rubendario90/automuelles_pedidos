<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DespachosFacturaController extends Controller
{
    public function revisionFinal()
    {
        // 1. Obtén las facturas en estado RevisionFinal
        $facturas = DB::table('facturas_asignadas')
            ->where('estado', 'RevisionFinal')
            ->get();

        // 2. Extrae los IDs de transacción y documento
        $transacciones = $facturas->pluck('transaccion')->unique()->toArray();
        $documentos = $facturas->pluck('documento')->unique()->toArray();

        // 3. Consulta los detalles en sqlsrv2 solo si hay datos en StrReferencia1
        $detalles = DB::connection('sqlsrv2')
            ->table('dbo.TblDetalleDocumentos as d')
            ->leftJoin('dbo.TblDocumentos as doc', function ($join) {
                $join->on('d.IntTransaccion', '=', 'doc.IntTransaccion')
                    ->on('d.IntDocumento', '=', 'doc.IntDocumento');
            })
            ->whereIn('d.IntTransaccion', $transacciones)
            ->whereIn('d.IntDocumento', $documentos)
            ->whereNotNull('doc.StrReferencia1')
            ->whereRaw("LTRIM(RTRIM(doc.StrReferencia1)) <> ''")
            ->whereRaw("doc.StrReferencia1 <> '0'")
            ->whereRaw("doc.StrReferencia1 LIKE '%[A-Za-z]%'") // Solo si contiene letras
            ->select(
                'd.IntTransaccion as transaccion',
                'd.IntDocumento as documento',
                'doc.StrReferencia1'
            )
            ->get();

        // 4. Filtra las facturas asignadas para mostrar solo las que tienen detalles con StrReferencia1
        $facturasFiltradas = $facturas->filter(function ($factura) use ($detalles) {
            return $detalles->contains(function ($detalle) use ($factura) {
                return $detalle->transaccion == $factura->transaccion
                    && $detalle->documento == $factura->documento;
            });
        })->values();

        return response()->json($facturasFiltradas);
    }

    public function mensajeroAsignado()
    {
        $facturas = DB::table('facturas_asignadas')
            ->where('estado', 'Mensajero_Asignado')
            ->get();

        return response()->json($facturas);
    }

    public function misPedidosMensajero(Request $request)
    {
        $userId = $request->user_id; // Recíbelo por parámetro o por Auth

        $facturas = DB::table('facturas_asignadas')
            ->where('estado', 'Mensajero_Asignado')
            ->where('user_id', $userId)
            ->get();

        return response()->json($facturas);
    }

    public function PedidosDespachos()
    {
        // 1. Obtén las facturas en estado RevisionFinal
        $facturas = DB::table('facturas_asignadas')
            ->where('estado', 'Despachos')
            ->get();

        // 2. Extrae los IDs de transacción y documento
        $transacciones = $facturas->pluck('transaccion')->unique()->toArray();
        $documentos = $facturas->pluck('documento')->unique()->toArray();

        // 3. Consulta los detalles en sqlsrv2 solo si hay datos en StrReferencia1
        $detalles = DB::connection('sqlsrv2')
            ->table('dbo.TblDetalleDocumentos as d')
            ->leftJoin('dbo.TblDocumentos as doc', function ($join) {
                $join->on('d.IntTransaccion', '=', 'doc.IntTransaccion')
                    ->on('d.IntDocumento', '=', 'doc.IntDocumento');
            })
            ->whereIn('d.IntTransaccion', $transacciones)
            ->whereIn('d.IntDocumento', $documentos)
            ->whereNotNull('doc.StrReferencia1')
            ->whereRaw("LTRIM(RTRIM(doc.StrReferencia1)) <> ''")
            ->whereRaw("doc.StrReferencia1 <> '0'")
            ->whereRaw("doc.StrReferencia1 LIKE '%[A-Za-z]%'") // Solo si contiene letras
            ->select(
                'd.IntTransaccion as transaccion',
                'd.IntDocumento as documento',
                'doc.StrReferencia1'
            )
            ->get();

        // 4. Filtra las facturas asignadas para mostrar solo las que tienen detalles con StrReferencia1
        $facturasFiltradas = $facturas->filter(function ($factura) use ($detalles) {
            return $detalles->contains(function ($detalle) use ($factura) {
                return $detalle->transaccion == $factura->transaccion
                    && $detalle->documento == $factura->documento;
            });
        })->values();

        return response()->json($facturasFiltradas);
    }

    public function pedidosCurso()
    {
        // 1. Obtén las facturas en estado RevisionFinal
        $facturas = DB::table('facturas_asignadas')
            ->whereIn('estado', ['pendiente', 'asignado', 'picking', 'RevisionFinal', 'Despachos'])
            ->get();

        // 2. Extrae los IDs de transacción y documento
        $transacciones = $facturas->pluck('transaccion')->unique()->toArray();
        $documentos = $facturas->pluck('documento')->unique()->toArray();

        // 3. Consulta los detalles en sqlsrv2 solo si hay datos en StrReferencia1
        $detalles = DB::connection('sqlsrv2')
            ->table('dbo.TblDetalleDocumentos as d')
            ->leftJoin('dbo.TblDocumentos as doc', function ($join) {
                $join->on('d.IntTransaccion', '=', 'doc.IntTransaccion')
                    ->on('d.IntDocumento', '=', 'doc.IntDocumento');
            })
            ->whereIn('d.IntTransaccion', $transacciones)
            ->whereIn('d.IntDocumento', $documentos)
            ->whereNotNull('doc.StrReferencia1')
            ->whereRaw("LTRIM(RTRIM(doc.StrReferencia1)) <> ''")
            ->whereRaw("doc.StrReferencia1 <> '0'")
            ->whereRaw("doc.StrReferencia1 LIKE '%[A-Za-z]%'") // Solo si contiene letras
            ->select(
                'd.IntTransaccion as transaccion',
                'd.IntDocumento as documento',
                'doc.StrReferencia1'
            )
            ->get();

        // 4. Filtra las facturas asignadas para mostrar solo las que tienen detalles con StrReferencia1
        $facturasFiltradas = $facturas->filter(function ($factura) use ($detalles) {
            return $detalles->contains(function ($detalle) use ($factura) {
                return $detalle->transaccion == $factura->transaccion
                    && $detalle->documento == $factura->documento;
            });
        })->values();

        return response()->json($facturasFiltradas);
    }
}
