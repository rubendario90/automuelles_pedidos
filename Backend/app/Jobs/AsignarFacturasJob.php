<?php

namespace App\Jobs;

use App\Models\Factura;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AsignarFacturasJob
{
    public function handle()
    {
        try {
            Log::info("Iniciando el proceso de asignación de facturas.");

            DB::table('facturas')
            ->whereNotIn('transaccion', [40, 42, 88, 90])
            ->delete();
            
            // Paso 0: Reasignar facturas de usuarios no logueados y limpiar asignacion_indices
            $usuariosConFacturas = DB::table('facturas_asignadas')
                ->where('estado', 'pendiente')
                ->pluck('user_id')
                ->unique();

            $usuariosNoLogueados = $usuariosConFacturas->filter(function ($userId) {
                return !DB::table('sessions')
                    ->where('user_id', $userId)
                    ->where('last_activity', '>=', now()->subMinutes(config('session.lifetime'))->timestamp)
                    ->exists();
            });

            foreach ($usuariosNoLogueados as $userId) {
                // Reasignar facturas: poner assigned_to = null
                $facturas = DB::table('facturas_asignadas')
                    ->where('user_id', $userId)
                    ->where('estado', 'pendiente')
                    ->pluck('factura_id');

                DB::table('facturas')
                    ->whereIn('id', $facturas)
                    ->update(['assigned_to' => null]);

                // Eliminar de facturas_asignadas
                DB::table('facturas_asignadas')
                    ->where('user_id', $userId)
                    ->where('estado', 'pendiente')
                    ->delete();

                // Eliminar de asignacion_indices
                DB::table('asignacion_indices')
                    ->where('user_id', $userId)
                    ->delete();

                Log::info("Facturas liberadas y usuario {$userId} eliminado de asignacion_indices por no estar logueado.");
            }

            // Paso 1: Buscar usuarios activos con roles específicos
            $usuariosActivos = User::whereIn('role_id', function ($query) {
                $query->select('id')->from('roles')
                    ->whereIn('name', ['Bodega', 'BodegaJefe', 'JefeCedi']);
            })
                ->whereIn('id', function ($query) {
                    $query->select('user_id')->from('sessions')
                        ->whereNotNull('user_id')
                        ->where('last_activity', '>=', now()->subMinutes(config('session.lifetime'))->timestamp);
                })
                ->orderBy('id')
                ->get();

            Log::info('Usuarios activos encontrados:', $usuariosActivos->pluck('id')->toArray());

            if ($usuariosActivos->isEmpty()) {
                Log::info("No hay usuarios activos con roles válidos.");
                return;
            }

            // Paso 2: Registrar usuarios activos en la tabla asignacion_indices
            foreach ($usuariosActivos as $usuario) {
                DB::table('asignacion_indices')->updateOrInsert(
                    ['key' => 'usuario_' . $usuario->id],
                    [
                        'user_id' => $usuario->id,
                        'status' => 'activo',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
                Log::info("Usuario registrado en asignacion_indices: {$usuario->id}");
            }

            // Paso 3: Buscar facturas sin asignar
            $facturasSinAsignar = Factura::whereIn('transaccion', [40, 42, 88, 90])
                ->where(function ($query) {
                    $query->whereNull('assigned_to')
                        ->orWhere('assigned_to', '')
                        ->orWhereRaw("LTRIM(RTRIM(assigned_to)) = ''");
                })
                ->get();

            Log::info('Facturas sin asignar encontradas:', $facturasSinAsignar->pluck('id')->toArray());

            if ($facturasSinAsignar->isEmpty()) {
                Log::info("No hay facturas sin asignar.");
                return;
            }

            $usuarios = $usuariosActivos->values(); // Para usar índices
            $contadorUsuarios = $usuarios->count();
            $indiceUsuario = 0;

            // Paso 4: Asignar facturas a los usuarios (máximo 2 pendientes por usuario)
            foreach ($facturasSinAsignar as $factura) {
                $intentado = 0;

                while ($intentado < $contadorUsuarios) {
                    $usuario = $usuarios[$indiceUsuario];

                    // Verificar cuántas facturas pendientes tiene el usuario
                    $pendientes = DB::table('facturas_asignadas')
                        ->where('user_id', $usuario->id)
                        ->where('estado', 'pendiente')
                        ->count();

                    Log::info("Usuario {$usuario->id} tiene {$pendientes} facturas pendientes.");

                    if ($pendientes < 2) {
                        // Asignar la factura
                        $factura->assigned_to = $usuario->id;
                        $factura->save();

                        Log::info("Asignando factura {$factura->id} al usuario {$usuario->id}");

                        DB::table('facturas_asignadas')->insert([
                            'factura_id'  => $factura->id,
                            'user_id'     => $usuario->id,
                            'estado'      => 'pendiente',
                            'user_name'   => $usuario->name,
                            'transaccion' => $factura->transaccion,
                            'documento'   => $factura->documento,
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                        Log::info("Insertada en facturas_asignadas: factura {$factura->id}, usuario {$usuario->id}");

                        DB::table('factura_status_logs')->insert([
                            [
                                'factura_id'  => $factura->id,
                                'transaccion' => $factura->transaccion,
                                'user_id'     => $usuario->id,
                                'new_status'  => 'pendiente',
                                'changed_at'  => now(),
                            ],
                            [
                                'factura_id'  => $factura->id,
                                'transaccion' => $factura->transaccion,
                                'user_id'     => $usuario->id,
                                'new_status'  => 'asignado',
                                'changed_at'  => now(),
                            ],
                        ]);
                        Log::info("Insertados logs de estado para factura {$factura->id}");

                        // Avanzar al siguiente usuario para la siguiente factura
                        $indiceUsuario = ($indiceUsuario + 1) % $contadorUsuarios;
                        break; // salir del while e ir a la siguiente factura
                    }

                    // El usuario tiene 2 o más facturas pendientes, probar el siguiente
                    $indiceUsuario = ($indiceUsuario + 1) % $contadorUsuarios;
                    $intentado++;
                }

                if ($intentado >= $contadorUsuarios) {
                    Log::info("Todos los usuarios tienen 2 facturas pendientes. No se puede asignar la factura ID: " . $factura->id);
                }
            }

            Log::info("Proceso de asignación de facturas finalizado exitosamente.");
        } catch (\Exception $e) {
            Log::error("Error en AsignarFacturasJob: " . $e->getMessage());
        }
    }
}
