import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { db } from '../prisma/db.js';
import type { Factura } from '../models/factura.model.js';
import type { DetalleFactura } from '../models/detalle-factura.model.js';
import { ProductoClienteService } from '../service/producto-cliente.js';
import { ClienteService } from '../service/cliente-service.js';
@Injectable()
export class FacturaService {
    constructor(
        private readonly productoCliente: ProductoClienteService,
        private readonly clienteService: ClienteService,
    ) {}

    async crear(data: Factura) {
        const factura = await db.orm.facturas.where({ codigo: data.codigo }).first();
        if (factura) {
            throw new ConflictException("Código ya existente");
        }
        await this.clienteService.consultar(data.cod_cliente);
        return db.orm.facturas.create({...data, fecha: new Date(data.fecha)});
    }

    async listar() {
        return db.orm.facturas.all();
    }

    async consultar(codigo: string) {
        const factura = await db.orm.facturas.where({ codigo }).first();
        if (!factura) {
            throw new NotFoundException("Factura no encontrada");
        }
        return factura;
    }
    //PATCH
    async actualizar(codigo: string, data: Partial<Factura>) {
        if (data.cod_cliente) {
            await this.clienteService.consultar(data.cod_cliente);
        }
        const cambios: Record<string, unknown> = { ...data };
        if (data.fecha) {
            cambios.fecha = new Date(data.fecha);
        }

        const factura = await db.orm.facturas.where({ codigo: codigo }).update(cambios);

        if (!factura) {
            throw new NotFoundException("Factura no encontrada");
        }

        return factura;
    }

    async eliminar(codigo: string) {
        const factura = await db.orm.facturas.where({ codigo }).first();
        if (!factura) {
            throw new NotFoundException("Factura no encontrada");
        }
        return db.orm.facturas.where({ id: factura.id }).delete();
    }
    //////////////////////////////////////////////////////////////////////
    //detalle factura
    async agregarDetalle(codigo: string, detalle: DetalleFactura) {
        const factura = await db.orm.facturas.where({ codigo }).first();
        if (!factura) {
            throw new NotFoundException("Factura no encontrada");
        }
        const nuevo = await this.calcularSubtotal(detalle);
        return db.orm.facturas.where({ id: factura.id }).update((f) => [f.detalles_facturas.push(nuevo)]);
    }

    //PATCH
    async actualizarDetalle(codigo: string, detalleId: number, data: Partial<DetalleFactura>) {
        const factura = await db.orm.facturas.where({ codigo }).first();
        if (!factura) {
            throw new NotFoundException("Factura no encontrada");
        }
        const detalle = factura.detalles_facturas.find((d) => d.codigo === detalleId);
        if (!detalle) {
            throw new NotFoundException("Detalle no encontrado");
        }
        const actualizado = await this.calcularSubtotal({ ...detalle, ...data });
        const detalles = factura.detalles_facturas.map((d) => (d === detalle ? actualizado : d));
        return db.orm.facturas.where({ id: factura.id }).update({ detalles_facturas: detalles });
    }

    async eliminarDetalle(codigo: string, detalleId: number) {
        const factura = await db.orm.facturas.where({ codigo }).first();
        if (!factura) {
            throw new NotFoundException("Factura no encontrada");
        }
        const detalles = factura.detalles_facturas.filter((d) => 
            d.codigo !== detalleId);
        if (detalles.length === factura.detalles_facturas.length) {
            throw new NotFoundException("Detalle no encontrado");
        }
        return db.orm.facturas.where({ id: factura.id })
        .update({ detalles_facturas: detalles });
    }

    async calcularSubtotal(detalle: DetalleFactura) {
        const producto = await this.productoCliente.consultar(detalle.cod_producto);
        return { ...detalle, precio: producto.precio, 
            subtotal: detalle.cantidad * producto.precio };
    }
    async listarDetalles(codigo: string) {
        const factura = await db.orm.facturas.where({ codigo }).first();
        if (!factura) {
            throw new NotFoundException("Factura no encontrada");
        }
        return factura.detalles_facturas;
    }
}
