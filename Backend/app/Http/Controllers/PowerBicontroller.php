<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PowerBicontroller extends Controller
{
    public function getEnviarProductosPowerBI(Request $request)
    {
        $productos = DB::connection('sqlsrv2')
            ->table('TblProductos')
            ->select('*')
            ->get();

        return response()->json($productos, 200);
    }

    public function getDetallesDocumentosPowerBI(Request $request)
    {
        $productos = DB::connection('sqlsrv2')
            ->table('TblDetalleDocumentos')
            ->select('*')
            ->get();

        return response()->json($productos, 200);
    }

    //TblGrupos
    // TmpProductos
}
