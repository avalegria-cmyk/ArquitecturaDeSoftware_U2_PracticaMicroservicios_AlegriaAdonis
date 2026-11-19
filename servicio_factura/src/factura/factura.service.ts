import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { db } from '../prisma/db.js';
import type { Factura } from '../models/factura.model.js';
import type { DetalleFactura } from '../models/detalle-factura.model.js';
@Injectable()
export class FacturaService {

    async crear(data: Factura) {
        const factura = await db.orm.facturas.where({ codigo: data.codigo }).first();
        if (factura) {
            throw new ConflictException("Código ya existente");
        }
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

    //detalle factura
    async agregarDetalle(codigo: string, detalle: DetalleFactura) {
        const factura = await db.orm.facturas.where({ codigo }).first();
        if (!factura) {
            throw new NotFoundException("Factura no encontrada");
        }
        return db.orm.facturas
            .where({ id: factura.id })
            .update((f) => [f.detalles_facturas.push(detalle)]);
    }

    //PATCH
    async actualizarDetalle(codigo: string, detalleId: number, data: Partial<DetalleFactura>) {
        const factura = await db.orm.facturas.where({ codigo }).first();
        if (!factura) {
            throw new NotFoundException("Factura no encontrada");
        }

        const existe = factura.detalles_facturas.some((detalle) => detalle.codigo === detalleId);
        if (!existe) {
            throw new NotFoundException("Detalle no encontrado");
        }

        const detalles = factura.detalles_facturas.map((detalle) => {
            if (detalle.codigo === detalleId) {
                return { ...detalle, ...data, codigo: detalleId };
            }
            return detalle;
        });

        await db.orm.facturas.where({ id: factura.id }).update({ detalles_facturas: detalles });
        return detalles.find((detalle) => detalle.codigo === detalleId);
    }
    
    async eliminarDetalle(codigo: string, detalleId: number) {
        const factura = await db.orm.facturas.where({ codigo }).first();
        if (!factura) {
            throw new NotFoundException("Factura no encontrada");
        }
        
        const detalles = factura.detalles_facturas.filter((detalle) => detalle.codigo !== detalleId);
        if (detalles.length === factura.detalles_facturas.length) {
            throw new NotFoundException("Detalle no encontrado");
        }

        await db.orm.facturas.where({ id: factura.id }).update({ detalles_facturas: detalles });
        return detalles;
    }
}
