import { Test, TestingModule } from '@nestjs/testing';
import { FacturaController } from './factura.controller.js';
import { FacturaService } from './factura.service.js';
import { ProductoClienteService } from '../service/producto-cliente.js';
import { ClienteService } from '../service/cliente-service.js';

describe('FacturaController', () => {
  let controller: FacturaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturaController],
      providers: [FacturaService, ProductoClienteService, ClienteService],
    }).compile();

    controller = module.get<FacturaController>(FacturaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
