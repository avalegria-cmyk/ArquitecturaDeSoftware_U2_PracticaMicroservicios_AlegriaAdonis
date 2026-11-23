import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import type { Cliente } from '../models/cliente.model.js';

@Injectable()
export class ClienteService {
    private readonly url = process.env['CLIENTE_URL'];

    async consultar(codigo: number): Promise<Cliente> {
        let respuesta: Response;
        try {
            respuesta = await fetch(`${this.url}/${codigo}`);
        } catch {
            throw new ServiceUnavailableException("Servicio de clientes no disponible");
        }

        if (respuesta.status >= 500) {
            throw new ServiceUnavailableException("Servicio de clientes no disponible");
        }
        if (!respuesta.ok) {
            throw new NotFoundException("Cliente no encontrado");
        }
        return respuesta.json();
    }
}
