<!DOCTYPE html>
<html>
<head>
    <title>Factura Firmada</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header { display: flex; align-items: center; margin-bottom: 10px; }
        .company-info { margin-left: 20px; }
        .section-title { background: #eee; padding: 6px; font-weight: bold; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #333; padding: 4px; font-size: 12px; }
        .details-table td { border: none; }
        .firma { margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info">
            <div><strong>Automuelles Diesel SAS</strong></div>
            <div>NIT: 900.950.921-9</div>
            <div>Dirección: Cra 61 # 45-04 Medellín (Antioquia)</div>
            <div>Teléfono: 4483179</div>
            <div>Email: Facturas.compras@automuellesdiesel.com</div>
        </div>
    </div>

    <div class="section-title">Detalles del Cliente y Transacción</div>
    <table class="details-table">
        <tr>
            <td><strong>Factura #:</strong> {{ $factura[0]->IntDocumento }}</td>
            <td><strong>Transacción:</strong> {{ $factura[0]->IntTransaccion }}</td>
            <td><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($factura[0]->DatFecha)->format('d/m/Y') }}</td>
            <td><strong>Vencimiento:</strong> {{ \Carbon\Carbon::parse($factura[0]->DatVencimiento)->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td><strong>Cliente:</strong> {{ $factura[0]->StrNombre }}</td>
            <td><strong>Dirección:</strong> {{ $factura[0]->StrDireccion }}</td>
            <td><strong>Teléfono:</strong> {{ $factura[0]->StrTelefono }}</td>
            <td><strong>Placa:</strong> {{ $factura[0]->StrReferencia2 }}</td>
        </tr>
    </table>

    <div class="section-title">Productos</div>
    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Valor Unitario</th>
            </tr>
        </thead>
        <tbody>
            @foreach($factura as $item)
                @if(!empty($item->StrProducto))
                <tr>
                    <td>{{ $item->StrProducto }}</td>
                    <td>{{ $item->StrDescripcion }}</td>
                    <td>{{ number_format($item->IntCantidad, 2) }}</td>
                    <td>{{ number_format($item->IntValorUnitario, 2) }}</td>
                </tr>
                @endif
            @endforeach
        </tbody>
    </table>

    <div class="section-title">Totales</div>
    <table class="details-table">
        <tr>
            <td><strong>Subtotal:</strong> {{ number_format($factura[0]->IntSubtotal, 2) }}</td>
            <td><strong>IVA:</strong> {{ number_format($factura[0]->IntIva, 2) }}</td>
            <td><strong>Total:</strong> {{ number_format($factura[0]->IntTotal, 2) }}</td>
        </tr>
    </table>

    <div class="firma">
        <strong>Firma del Cliente:</strong><br>
        <img src="{{ public_path('storage/' . $signaturePath) }}" alt="Firma" width="200"/>
    </div>
</body>
</html>