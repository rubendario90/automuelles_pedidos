<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PickingFacturasController extends Controller
{
    // Fetch facturas in the "picking" state
    public function fetchPickingFacturas(Request $request)
    {
        $facturas = DB::connection('sqlsrv')
            ->table('dbo.facturas_asignadas as fa')
            ->select(
                'fa.factura_id',
                'fa.transaccion',
                'fa.documento',
                'fa.user_id',
                'fa.user_name',
                'fa.estado',
                'fa.created_at',
                'fa.updated_at'
            )
            ->where('fa.estado', 'picking') // Filter by picking state
            ->orderBy('fa.updated_at', 'desc') // Order by the most recently updated
            ->get();

        return response()->json($facturas);
    }

    // Fetch document details for a specific factura
    public function fetchPickingFacturaDetails(Request $request)
    {
        $request->validate([
            'transaccion' => 'required|integer',
            'documento' => 'required|integer',
        ]);

        $details = DB::connection('sqlsrv2')
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
            ->where('d.IntTransaccion', $request->transaccion)
            ->where('d.IntDocumento', $request->documento)
            ->orderBy('d.IntDocumento')
            ->get();

        return response()->json($details);
    }
}