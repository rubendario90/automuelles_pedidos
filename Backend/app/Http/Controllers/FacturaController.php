<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use App\Models\FacturaAsignada;
use App\Models\FacturaStatusLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FacturaController extends Controller
{
    /**
     * Devuelve las facturas del día actual.
     */
    public function index(Request $request)
    {
        try {
            // Obtener la fecha del parámetro o usar la fecha actual por defecto
            $date = $request->query('date', Carbon::now('America/Bogota')->toDateString());

            // Filtrar las facturas por la fecha proporcionada
            $facturas = Factura::whereDate('created_at', $date)->get();

            return response()->json($facturas);
        } catch (\Exception $e) {
            // Devuelve un error con detalles
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getborrarFacturas()
    {
        try {
            // Obtener las facturas que no tengan los valores específicos en transaccion
            $facturasConBoton = Factura::whereNotIn('transaccion', [40, 42, 88, 90])->get();

            return response()->json($facturasConBoton);
        } catch (\Exception $e) {
            // Devuelve un error con detalles
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteFactura($id)
    {
        try {
            $factura = Factura::findOrFail($id);
            $factura->delete();

            return response()->json(['message' => 'Factura eliminada correctamente']);
        } catch (\Exception $e) {
            // Devuelve un error con detalles
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getFacturaDetails($id)
    {
        try {
            $factura = Factura::select('id', 'transaccion', 'documento', 'created_at', 'updated_at', 'assigned_to')
                ->findOrFail($id);

            $factura->created_at = Carbon::parse($factura->created_at);
            $factura->updated_at = Carbon::parse($factura->updated_at);

            $asignacion = FacturaAsignada::select('id', 'factura_id', 'user_id', 'created_at')
                ->where('factura_id', $id)
                ->first();

            if ($asignacion) {
                $asignacion->created_at = Carbon::parse($asignacion->created_at);
            }

            // Obtener el historial de cambios de estado de la factura con el nombre del usuario
            $statusLogs = FacturaStatusLog::select('id', 'factura_id', 'transaccion', 'user_id', 'new_status', 'changed_at')
                ->where('factura_id', $id)
                ->orderBy('changed_at', 'asc')
                ->get()
                ->map(function ($log) {
                    $user = User::select('name')->find($log->user_id);
                    $log->user_name = $user ? $user->name : 'Usuario desconocido';
                    $log->changed_at = Carbon::parse($log->changed_at);
                    return $log;
                });

            // Si no hay logs, puedes agregar un estado inicial "pendiente"
            if ($statusLogs->isEmpty() && $asignacion) {
                $user = User::select('name')->find($asignacion->user_id);
                $statusLogs->prepend((object) [
                    'id' => null,
                    'factura_id' => $id,
                    'transaccion' => $factura->transaccion,
                    'user_id' => $asignacion->user_id,
                    'new_status' => 'pendiente',
                    'changed_at' => $asignacion->created_at,
                    'user_name' => $user ? $user->name : 'Usuario desconocido',
                ]);
            }

            $assignedUser = $asignacion ? User::select('id', 'name', 'email')->find($asignacion->user_id) : null;

            $details = [
                'factura' => [
                    'transaccion' => $factura->transaccion,
                    'documento' => $factura->documento,
                    'created_at' => $factura->created_at,
                    'updated_at' => $factura->updated_at,
                    'assigned_to' => $factura->assigned_to,
                ],
                'asignacion' => $asignacion ? [
                    'user_id' => $asignacion->user_id,
                    'assigned_at' => $asignacion->created_at,
                ] : null,
                'status_logs' => $statusLogs,
                'assigned_user' => $assignedUser,
            ];

            return response()->json($details);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function getDocumento($facturaId)
    {
        $factura = DB::table('facturas')->where('id', $facturaId)->first();
        return response()->json(['documento' => $factura ? $factura->documento : null]);
    }

    public function descargarFactura($fileName)
    {
        $path = storage_path('app/public/signed_pdfs/' . $fileName);

        if (!file_exists($path)) {
            abort(404, 'Archivo no encontrado');
        }

        return response()->make(file_get_contents($path), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $fileName . '"'
        ]);
    }
}
