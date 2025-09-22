<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DocumentDetailsController extends Controller
{
    public function fetchDocumentDetails(Request $request)
    {
        $request->validate([
            'transaccion' => 'required|integer',
            'documento' => 'required|integer',
        ]);

        $results = DB::connection('sqlsrv2')
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

        return response()->json($results);
    }
}

