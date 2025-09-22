<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Crear el usuario
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Corregido: $request->password en lugar de $request->string('password')
        ]);

        // Asignar el rol por defecto "users"
        $defaultRole = Role::firstOrCreate(['name' => 'users']); // Crea el rol si no existe
        $user->role_id = $defaultRole->id; // Asigna el role_id directamente
        $user->save();

        // Disparar el evento de registro
        event(new Registered($user));

        // Iniciar sesión automáticamente después del registro
        Auth::login($user);

        return response()->noContent();
    }
}