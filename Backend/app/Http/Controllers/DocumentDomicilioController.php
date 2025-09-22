<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DocumentDomicilioController extends Controller
{
    public function updateReferencia1(Request $request)
    {
        $request->validate([
            'transaccion' => 'required|integer',
            'documento' => 'required|integer',
            'referencia1' => 'required|string',
        ]);

        try {
            // Deshabilitar los triggers
            DB::connection('sqlsrv2')->statement("DISABLE TRIGGER trg_InsertToFacturas ON TblDocumentos");
            DB::connection('sqlsrv2')->statement("DISABLE TRIGGER TgAuditHgi_TblDocumentos ON TblDocumentos");
            DB::connection('sqlsrv2')->statement("DISABLE TRIGGER TgHgiNet_tbldocumentos ON TblDocumentos");

            // Actualizar el campo
            $updated = DB::connection('sqlsrv2')
                ->table('dbo.TblDocumentos')
                ->where('IntTransaccion', $request->transaccion)
                ->where('IntDocumento', $request->documento)
                ->update(['StrReferencia1' => $request->referencia1]);

            // Rehabilitar los triggers
            DB::connection('sqlsrv2')->statement("ENABLE TRIGGER trg_InsertToFacturas ON TblDocumentos");
            DB::connection('sqlsrv2')->statement("ENABLE TRIGGER TgAuditHgi_TblDocumentos ON TblDocumentos");
            DB::connection('sqlsrv2')->statement("ENABLE TRIGGER TgHgiNet_tbldocumentos ON TblDocumentos");

            if ($updated) {
                return response()->json(['message' => 'Referencia1 actualizada correctamente.']);
            } else {
                return response()->json(['message' => 'No se encontró el documento o no se actualizó.'], 404);
            }
        } catch (\Exception $e) {
            // Rehabilitar los triggers si ocurre un error
            DB::connection('sqlsrv2')->statement("ENABLE TRIGGER trg_InsertToFacturas ON TblDocumentos");
            DB::connection('sqlsrv2')->statement("ENABLE TRIGGER TgAuditHgi_TblDocumentos ON TblDocumentos");
            DB::connection('sqlsrv2')->statement("ENABLE TRIGGER TgHgiNet_tbldocumentos ON TblDocumentos");
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}