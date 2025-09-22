<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentSignController extends Controller
{
    public function saveSignature(Request $request)
    {
        $request->validate([
            'signature' => 'required|string',
            'documento' => 'required|integer',
            'transaccion' => 'required|integer',
            'user_id' => 'required|integer',
        ]);
    
        $signature = $request->input('signature');
        $documento = $request->input('documento');
        $transaccion = $request->input('transaccion');
        $userId = $request->input('user_id');
    
        // Buscar el id de la factura usando documento y transaccion
        $factura = DB::table('facturas')
            ->where('documento', $documento)
            ->where('transaccion', $transaccion)
            ->first();
    
        if (!$factura) {
            return response()->json(['message' => 'Factura no encontrada.'], 404);
        }
    
        $facturaId = $factura->documento;

        // Buscar datos de la factura
        $factura = DB::connection('sqlsrv2')->select(
            "SELECT 
                D.IntEmpresa, D.IntTransaccion, D.IntDocumento, D.DatFecha, D.DatVencimiento, 
                D.StrTercero, D.IntValor, D.IntSubtotal, D.IntIva, D.IntTotal, D.StrReferencia2,
                T.StrNombre, T.StrDireccion, T.StrTelefono, T.StrIdTercero,
                dp.StrProducto, p.StrDescripcion, dp.IntCantidad, dp.IntValorUnitario
            FROM TblDocumentos D
            JOIN TblTerceros T ON D.StrTercero = T.StrIdTercero
            LEFT JOIN TblDetalleDocumentos dp ON D.IntTransaccion = dp.IntTransaccion AND D.IntDocumento = dp.IntDocumento
            LEFT JOIN TblProductos p ON dp.StrProducto = p.StrIdProducto
            WHERE D.IntTransaccion = ? AND D.IntDocumento = ?",
            [$transaccion, $facturaId]
        );

        if (!$factura) {
            return response()->json(['message' => 'Factura no encontrada.'], 404);
        }

        // Guardar la firma como imagen
        if (strpos($signature, 'data:image/png;base64,') === 0) {
            $signature = substr($signature, strlen('data:image/png;base64,'));
        }
        $signaturePath = 'signatures/' . uniqid() . '.png';
        Storage::disk('public')->put($signaturePath, base64_decode($signature));

        // Construir el nombre del PDF
        $pdfFileName = $transaccion . '-' . $facturaId . '.pdf';
        $pdfPath = 'signed_pdfs/' . $pdfFileName;

        // Generar el PDF usando los datos obtenidos
        $pdf = Pdf::loadView('pdf.document', [
            'factura' => $factura,
            'signaturePath' => $signaturePath
        ]);
        Storage::disk('public')->put($pdfPath, $pdf->output());

        return response()->json(['message' => 'PDF generado correctamente.', 'pdf_path' => $pdfPath], 200);
    }
}