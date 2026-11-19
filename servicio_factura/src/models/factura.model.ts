import type { DetalleFactura } from './detalle-factura.model.js';

export interface Factura {
    id: string;
    codigo: string;
    fecha: Date;
    cod_cliente: number;
    total: number;
    descuento: number;
    iva: number;
    total_a_pagar: number;

    detalles_facturas: readonly DetalleFactura[];
}
