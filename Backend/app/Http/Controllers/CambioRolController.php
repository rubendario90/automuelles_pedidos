<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;

class CambioRolController extends Controller
{
    // Listar usuarios con su rol
    public function usuarios()
    {
        return User::select('id', 'name', 'email', 'role_id')->get();
    }

    // Listar roles
    public function roles()
    {
        return Role::select('id', 'name')->get();
    }

    // Cambiar rol de usuario
    public function  CambioRol(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'role_id' => ['required', 'exists:roles,id'],
        ]);

        $user = User::find($request->user_id);
        $user->role_id = $request->role_id;
        $user->save();

        return response()->json(['message' => 'Rol actualizado correctamente.']);
    }
}