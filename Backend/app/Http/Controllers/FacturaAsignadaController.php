<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FacturaAsignada;

class FacturaAsignadaController extends Controller
{
    public function obtenerFacturasPendientes(Request $request)
    {
        $userId = $request->user()->id; 

        $facturasPendientes = FacturaAsignada::where('user_id', $userId)
            ->where('estado', 'pendiente')
            ->get();

        return response()->json($facturasPendientes);
    }
    public function obtenerCantidadFacturasPendientes(Request $request)
    {
        $userId = $request->user()->id; 

        $count = FacturaAsignada::where('user_id', $userId)
            ->where('estado', 'pendiente')
            ->count();

        return response()->json(['count' => $count]);
    }
}