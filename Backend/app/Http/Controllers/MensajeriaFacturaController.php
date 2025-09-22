<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class MensajeriaFacturaController extends Controller
{
    public function facturasDespachosAsignadas(Request $request)
    {
        Log::info('user_id recibido:', ['user_id' => $request->user_id]);
        $facturas = DB::table('facturas_asignadas')
            ->where('estado', 'Mensajero_Asignado')
            ->where('user_id', intval($request->user_id))
            ->get();

        Log::info('Facturas encontradas:', ['count' => $facturas->count()]);
        return response()->json($facturas);
    }
}