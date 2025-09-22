<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use App\Models\Role;
use App\Models\User;

class ChangeRoleController extends Controller
{
    public function changeRole(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado.'], 401);
        }

        // Rest of your code remains unchanged
        $request->validate([
            'newRole' => 'required|exists:roles,name',
        ]);

        $roleId = Role::where('name', $request->newRole)->value('id');

        if (!$roleId) {
            return response()->json(['message' => 'Rol no válido.'], 400);
        }

        if (!Schema::hasColumn('users', 'role_id')) {
            return response()->json(['message' => 'La columna role_id no existe en la tabla users.'], 500);
        }

        $user->role_id = $roleId;

        try {
            $user->save();
        } catch (\Exception $e) {
            Log::error('Error al guardar el rol del usuario.', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error al guardar el rol: ' . $e->getMessage()
            ], 500);
        }

        Log::info('Rol cambiado exitosamente.', [
            'user_id' => $user->id,
            'new_role_id' => $roleId
        ]);

        return response()->json(['message' => 'Rol cambiado exitosamente.'], 200);
    }
}