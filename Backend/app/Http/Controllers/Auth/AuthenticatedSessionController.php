<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
    
        if (Auth::attempt($credentials)) {
            DB::table('sessions')->where('user_id', Auth::id())->delete();

            // Regenerar la sesión actual
            $request->session()->regenerate();
    
            $user = Auth::user();
    
            // Verifica si el usuario tiene un rol asociado
            $roleName = $user->role ? $user->role->name : 'Sin rol';
    
            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $roleName,
            ]);
        }
    
        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }
    
    public function destroy(Request $request): Response
    {
        // Obtén el ID del usuario autenticado
        $userId = Auth::id();
    
        // Elimina todas las sesiones asociadas al usuario autenticado
        DB::table('sessions')->where('user_id', $userId)->delete();
    
        // Cierra la sesión actual
        Auth::guard('web')->logout();
    
        // Invalida la sesión actual
        $request->session()->invalidate();
    
        // Regenera el token CSRF
        $request->session()->regenerateToken();
    
        return response()->noContent(); // Devuelve una respuesta vacía
    }
}
