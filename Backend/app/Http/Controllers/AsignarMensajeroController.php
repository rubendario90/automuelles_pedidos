<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AsignarMensajeroController extends Controller
{
    public function usuariosMensajeria()
    {
        // Devuelve usuarios con rol "Mensajeria"
        $usuarios = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->whereIn('roles.name', ['Mensajeria', 'Despachos'])
            ->select('users.id', 'users.name')
            ->get();

        return response()->json($usuarios);
    }

    public function asignarMensajero(Request $request)
    {
        $request->validate([
            'factura_id' => 'required|integer',
            'transaccion' => 'required|integer',
            'user_id' => 'required|integer',
        ]);

        $facturaId = $request->factura_id;
        $transaccion = $request->transaccion;
        $mensajeroId = $request->user_id;

        // Obtener el nombre del usuario
        $mensajero = DB::table('users')->where('id', $mensajeroId)->first();
        $mensajeroName = $mensajero ? $mensajero->name : '';

        DB::transaction(function () use ($facturaId, $transaccion, $mensajeroId, $mensajeroName) {
            DB::table('facturas_asignadas')
                ->where('factura_id', $facturaId)
                ->update([
                    'estado' => 'Mensajero_Asignado',
                    'user_id' => $mensajeroId,
                    'user_name' => $mensajeroName,
                    'updated_at' => now(),
                ]);

            DB::table('factura_status_logs')->insert([
                'factura_id' => $facturaId,
                'transaccion' => $transaccion,
                'user_id' => $mensajeroId,
                'new_status' => 'Mensajero_Asignado',
                'changed_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Mensajero asignado correctamente.']);
    }
}
