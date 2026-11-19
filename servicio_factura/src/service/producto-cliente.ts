import {Injectable, NotFoundException, ServiceUnavailableException} from '@nestjs/common';

import type {Producto} from '../models/producto.model.js';
import { response } from 'express';

@Injectable()
export class ProductoClienteService {
    private readonly url = process.env['PRODUCTO_URL'];
    async consultar(codigo: number): Promise<Producto> {
        try {
            const respuesta = await fetch(`${this.url}/${codigo}`);

            if (respuesta.status === 404) {
                throw new NotFoundException("Producto no encontrado");
            }
            if (!respuesta.ok) {
                throw new ServiceUnavailableException("Servicio de productos no disponible");
            }
            if(!respuesta.ok) {
                throw new ServiceUnavailableException("Error al encontrar el producto");
            }
            const json = await respuesta.json();
            return json as Producto;
        }catch (error) {
            console.error('Error al consultar el producto:', error);
            throw error;
        }
    }
}