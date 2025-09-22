<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\FacturaAsignada;

class ReasignarFacturaController extends Controller
{
    // Obtener facturas en estado pendiente
    public function facturasPendientes()
    {
        $facturas = DB::table('facturas_asignadas as f')
            ->leftJoin('users as u', 'f.user_id', '=', 'u.id')
            ->where('f.estado', 'pendiente')
            ->select(
                'f.*',
                'u.name as usuario_actual'
            )
            ->get();

        return response()->json($facturas);
    }
    // Obtener usuarios activos (con sesión activa)
    public function usuariosActivos()
    {
        $activeUserIds = DB::table('sessions')->pluck('user_id')->unique();
        $usuarios = User::whereIn('id', $activeUserIds)->get(['id', 'name']);
        return response()->json($usuarios);
    }

    // Reasignar factura a un usuario
    public function reasignar(Request $request)
    {
        $request->validate([
            'factura_id' => 'required|integer|exists:facturas_asignadas,id',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $usuario = User::find($request->user_id);
        $factura = FacturaAsignada::find($request->factura_id);

        if (!$usuario || !$factura) {
            return response()->json(['message' => 'Usuario o factura no encontrada'], 404);
        }

        $factura->user_id = $usuario->id;
        $factura->user_name = $usuario->name;
        $factura->save();

        return response()->json(['message' => 'Factura reasignada correctamente']);
    }
}
