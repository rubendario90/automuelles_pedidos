<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotasController extends Controller
{
    public function buscar(Request $request)
    {
        $query = $request->input('query');
        $terceros = DB::connection('sqlsrv2')
            ->table('AutomuellesDiesel1.dbo.TblTerceros')
            ->select(
                'StrIdTercero',
                'StrNombre',
                'StrTipoId',
                'StrApellido1',
                'StrApellido2',
                'StrNombre1',
                'StrNombre2'
            )
            ->where('StrIdTercero', 'like', "%$query%")
            ->orWhere('StrNombre', 'like', "%$query%")
            ->limit(20)
            ->get();

        return response()->json($terceros);
    }

    public function guardar(Request $request)
    {
        // Guarda todo el request como JSON
        DB::table('notas')->insert([
            'data' => json_encode($request->all()),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return response()->json(['message' => 'Nota guardada correctamente'], 201);
    }

    public function productosPorDocumento(Request $request)
    {
        $transaccion = $request->input('transaccion');
        $documento = $request->input('documento');

        $productos = DB::connection('sqlsrv2')
            ->table('dbo.TblDetalleDocumentos as d')
            ->select('d.StrProducto', 'd.IntCantidad') // <-- Agrega IntCantidad
            ->where('d.IntTransaccion', $transaccion)
            ->where('d.IntDocumento', $documento)
            ->groupBy('d.StrProducto', 'd.IntCantidad') // <-- Agrupa también por IntCantidad
            ->get();

        return response()->json($productos);
    }

    public function notasPendientes()
    {
        $notas = DB::table('notas')
            ->whereRaw("JSON_VALUE(data, '$.autorizado') IS NULL")
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();

        return response()->json($notas);
    }

    public function aprobar(Request $request, $id)
    {
        $usuario = $request->input('usuario'); // El usuario que aprueba

        $nota = DB::table('notas')->where('id', $id)->first();
        if ($nota) {
            $data = json_decode($nota->data, true);
            $data['autorizado'] = $usuario;
            DB::table('notas')->where('id', $id)->update([
                'data' => json_encode($data),
                'updated_at' => now(),
            ]);
            return response()->json(['message' => 'Nota aprobada']);
        }
        return response()->json(['message' => 'Nota no encontrada'], 404);
    }

    public function eliminar($id)
    {
        DB::table('notas')->where('id', $id)->delete();
        return response()->json(['message' => 'Nota eliminada']);
    }

    public function notasAutorizadas(Request $request)
    {
        $notas = DB::table('notas')
            ->whereRaw("JSON_VALUE(data, '$.autorizado') IS NOT NULL AND JSON_VALUE(data, '$.creado') IS NULL")
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();

        return response()->json($notas);
    }

    public function crear(Request $request, $id)
    {
        $usuario = $request->input('usuario'); // El usuario que crea

        $nota = DB::table('notas')->where('id', $id)->first();
        if ($nota) {
            $data = json_decode($nota->data, true);
            $data['creado'] = $usuario;
            DB::table('notas')->where('id', $id)->update([
                'data' => json_encode($data),
                'updated_at' => now(),
            ]);
            return response()->json(['message' => 'Nota creada']);
        }
        return response()->json(['message' => 'Nota no encontrada'], 404);
    }

    public function contarPendientes()
    {
        $count = DB::table('notas')
            ->whereRaw("JSON_VALUE(data, '$.autorizado') IS NOT NULL AND JSON_VALUE(data, '$.creado') IS NULL")
            ->count();

        return response()->json(['pendientes' => $count]);
    }

    public function historial(Request $request)
    {
        $transaccion = $request->input('transaccion');
        $documento = $request->input('documento');
        $fecha_inicio = $request->input('fecha_inicio');
        $fecha_fin = $request->input('fecha_fin');

        $query = DB::table('notas');

        if ($transaccion) {
            $query->whereRaw("JSON_VALUE(data, '$.transaccion') = ?", [$transaccion]);
        }
        if ($documento) {
            $query->whereRaw("JSON_VALUE(data, '$.documento') = ?", [$documento]);
        }
        if ($fecha_inicio) {
            $query->whereDate('created_at', '>=', $fecha_inicio);
        }
        if ($fecha_fin) {
            $query->whereDate('created_at', '<=', $fecha_fin);
        }

        $notas = $query->orderBy('created_at', 'desc')->limit(1000)->get();

        return response()->json($notas);
    }
}
