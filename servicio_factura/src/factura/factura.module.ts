import { Module } from '@nestjs/common';
import { FacturaController } from './factura.controller.js';
import { FacturaService } from './factura.service.js';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService]
})
export class FacturaModule {}
