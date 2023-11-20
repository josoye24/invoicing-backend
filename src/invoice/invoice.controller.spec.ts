import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceHead } from './entities/invoice-head.entity';
import { ResponseHelper } from '../common/response.helper';
import { User } from '../users/entities/user.entity';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let invoiceService: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        InvoiceService,
        ResponseHelper,
        {
          provide: getRepositoryToken(InvoiceHead),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    invoiceService = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getInvoiceById', () => {
    it('should return the invoice by ID', async () => {
      const mockInvoiceId = 'ff1f5109-1cc9-401d-a7d5-7e7725ceb36f';

      const mockInvoice: InvoiceHead = {
        id: mockInvoiceId,
        userId: mockInvoiceId,
        invoiceNumber: 10,
        customerName: 'Joseph',
        customerAddress: 'Lagos, Nigeria',
        productSubtotal: 0,
        invoiceTotal: 0,
        user: null,
        details: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(invoiceService, 'getInvoiceByInvoiceId')
        .mockResolvedValue(mockInvoice);

      const result = await controller.getInvoiceByInvoiceId(mockInvoiceId);
      expect(result).toEqual(mockInvoice);
    });

    it('should handle not found invoice', async () => {
      const mockInvoiceId = 'nonexistentInvoiceId';

      jest
        .spyOn(invoiceService, 'getInvoiceByInvoiceId')
        .mockRejectedValue(new NotFoundException('Invoice not found'));

      try {
        await controller.getInvoiceByInvoiceId(mockInvoiceId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Invoice not found');
        expect(error.status).toBe(404);
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
