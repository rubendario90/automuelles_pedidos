<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RevisionMensajeria;

class RevisionMensajeriaController extends Controller
{
    public function guardar(Request $request)
    {
        $revision = RevisionMensajeria::create([
            'user_id' => $request->user_id,
            'data' => json_encode($request->data), // Guarda como JSON string
        ]);
        return response()->json(['success' => true, 'revision' => $revision]);
    }
    public function existe(Request $request)
    {
        $existe = RevisionMensajeria::where('user_id', $request->user_id)
            ->whereDate('created_at', $request->fecha)
            ->exists();
        return response()->json(['exists' => $existe]);
    }
}
