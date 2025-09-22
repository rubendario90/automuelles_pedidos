<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\AsignarFacturaController;
use App\Http\Controllers\FacturaAsignadaController;
use App\Http\Controllers\ChangeRoleController;
use App\Http\Controllers\DocumentDetailsController;
use App\Http\Controllers\ActualizarEstadoController;
use App\Http\Controllers\PickingFacturasController;
use App\Http\Controllers\ActualizarEstadoToRevisionFinalController;
use App\Http\Controllers\EntregaParcialController;
use App\Http\Controllers\ActualizarEstadoToEntregaParcialController;
use App\Http\Controllers\ReasignarFacturaController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\EliminarUsuarioController;
use App\Http\Controllers\CambioRolController;
use App\Http\Controllers\DespachosFacturaController;
use App\Http\Controllers\DespachosActualizarEstadoController;
use App\Http\Controllers\AsignarMensajeroController;
use App\Http\Controllers\ActualizarEstadoEntregadoController;
use App\Http\Controllers\VendedorFacturaController;
use App\Http\Controllers\MensajeriaFacturaController;
use App\Http\Controllers\RevisionMensajeriaController;
use App\Http\Controllers\DocumentDomicilioController;
use App\Http\Controllers\DocumentSignController;
use App\Http\Controllers\PowerBicontroller;
use App\Http\Controllers\NotasController;
use App\Models\User;

Route::middleware('throttle:10000,1')->group(function () {
    // Todas tus rutas aquí
    Route::get('/usuarios', function () {
        return User::select('id', 'name', 'email', 'role_id')->get();
    });

    Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::middleware('auth:sanctum')->delete('/usuarios/{id}', [EliminarUsuarioController::class, 'destroy']);
    Route::middleware('auth:sanctum')->put('/user/force-password', [ChangePasswordController::class, 'forceUpdate']);
    Route::middleware(['auth:sanctum'])->put('/change-role', [ChangeRoleController::class, 'changeRole']);
    Route::middleware('auth:sanctum')->get('/roles', [CambioRolController::class, 'roles']);
    Route::middleware('auth:sanctum')->put('/cambio-rol', [CambioRolController::class, 'cambioRol']);
    Route::post('/document-details', [DocumentDetailsController::class, 'fetchDocumentDetails']);
    Route::get('/facturas-borrar', [FacturaController::class, 'getborrarFacturas']);
    Route::delete('/facturas/{id}', [FacturaController::class, 'deleteFactura']);
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/facturas', [FacturaController::class, 'index']);
    });
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/facturas-asignadas', [AsignarFacturaController::class, 'obtenerFacturasAsignadas']);
        Route::post('/asignar-facturas', [AsignarFacturaController::class, 'asignarFacturas']);
    });
    Route::middleware('auth:sanctum')->get('/facturas-pendientes', [FacturaAsignadaController::class, 'obtenerFacturasPendientes']);
    Route::get('/facturas-pendientes/count', [FacturaAsignadaController::class, 'obtenerCantidadFacturasPendientes']);
    Route::get('/facturas/picking', [PickingFacturasController::class, 'fetchPickingFacturas']);
    Route::post('/facturas/picking/details', [PickingFacturasController::class, 'fetchPickingFacturaDetails']);
    Route::post('/actualizar-estado-revision-final', [ActualizarEstadoToRevisionFinalController::class, 'ActualizarEstadoToRevisionFinal']);
    Route::post('/actualizar-estado', [ActualizarEstadoController::class, 'ActualizarEstado']);
    Route::post('/actualizar-estado-entrega-parcial', [ActualizarEstadoToEntregaParcialController::class, 'ActualizarEstadoToEntregaParcial']);
    Route::post('/actualizar-estado-Despachos', [DespachosActualizarEstadoController::class, 'actualizarEstado']);
    Route::get('/facturas/{id}/details', [FacturaController::class, 'getFacturaDetails']);
    Route::post('/registrar-entrega-parcial', [ActualizarEstadoController::class, 'registrarEntregaParcial']);
    Route::get('/entrega-parcial', [EntregaParcialController::class, 'getEntregaParcial']);
    Route::get('/facturas/pendientes', [ReasignarFacturaController::class, 'facturasPendientes']);
    Route::get('/usuarios/activos', [ReasignarFacturaController::class, 'usuariosActivos']);
    Route::post('/facturas/reasignar', [ReasignarFacturaController::class, 'reasignar']);


    // Rutas para Despachos
    Route::middleware('auth:sanctum')->get('/facturas-despachos-revision-final', [DespachosFacturaController::class, 'revisionFinal']);
    Route::middleware('auth:sanctum')->get('/facturas-pedidos-despachos', [DespachosFacturaController::class, 'PedidosDespachos']);
    Route::middleware('auth:sanctum')->get('/facturas-Pedidos-en-curso', [DespachosFacturaController::class, 'pedidosCurso']);
    Route::get('/usuarios-mensajeria', [AsignarMensajeroController::class, 'usuariosMensajeria']);
    Route::post('/asignar-mensajero', [AsignarMensajeroController::class, 'asignarMensajero']);
    Route::get('/facturas/mensajero-asignado', [DespachosFacturaController::class, 'mensajeroAsignado']);
    Route::get('/mis-pedidos-mensajero/{user_id}', [DespachosFacturaController::class, 'misPedidosMensajero']);
    Route::get('/factura-documento/{facturaId}', [FacturaController::class, 'getDocumento']);
    Route::post('/actualizar-estado-entregado', [ActualizarEstadoEntregadoController::class, 'actualizarEstado']);
    Route::get('/facturas-vendedor-revision-final', [VendedorFacturaController::class, 'facturasVendedorRevisionFinal']);
    Route::post('/facturas-despachos-asignadas', [MensajeriaFacturaController::class, 'facturasDespachosAsignadas']);
    Route::post('/guardar-revision-mensajeria', [RevisionMensajeriaController::class, 'guardar']);
    Route::get('/revision-mensajeria-existe', [RevisionMensajeriaController::class, 'existe']);
    Route::post('/documentos/update-referencia1', [DocumentDomicilioController::class, 'updateReferencia1']);
    Route::post('/document/sign', [DocumentSignController::class, 'saveSignature']);
    Route::get('/descargar-factura/{fileName}', [FacturaController::class, 'descargarFactura']);

    // Ruta de proyecto powerbi
    Route::get('/powerbi/enviar-productos', [PowerBicontroller::class, 'getEnviarProductosPowerBI']);
    Route::get('/powerbi/detalles-documentos', [PowerBicontroller::class, 'getDetallesDocumentosPowerBI']);

    // Rutas para Notas
    Route::get('/terceros/buscar', [NotasController::class, 'buscar']);
    Route::post('/notas', [NotasController::class, 'guardar']);
    Route::get('/productos-por-documento', [NotasController::class, 'productosPorDocumento']);
    Route::get('/notas-pendientes', [NotasController::class, 'notasPendientes']);
    Route::put('/notas/{id}/aprobar', [NotasController::class, 'aprobar']);
    Route::delete('/notas/{id}', [NotasController::class, 'eliminar']);
    Route::get('/notas-autorizadas', [NotasController::class, 'notasAutorizadas']);
    Route::put('/notas/{id}/crear', [NotasController::class, 'crear']);
    Route::get('/contar-pendientes', [NotasController::class, 'contarPendientes']);
    Route::get('/notas-historial', [NotasController::class, 'historial']);
});
