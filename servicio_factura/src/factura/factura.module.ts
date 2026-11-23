import { Module } from '@nestjs/common';
import { FacturaController } from './factura.controller.js';
import { FacturaService } from './factura.service.js';
import { ProductoClienteService } from '../service/producto-cliente.js';
import { ClienteService } from '../service/cliente-service.js';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService, ProductoClienteService, ClienteService]
})
export class FacturaModule {}
