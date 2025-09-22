<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class EliminarUsuarioController extends Controller
{
    // Listar usuarios (opcional, ya lo tienes como closure)
    public function index()
    {
        return User::select('id', 'name', 'email')->get();
    }

    // Eliminar usuario por ID
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente.']);
    }
}