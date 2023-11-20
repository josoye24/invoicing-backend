import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvoiceHead } from './entities/invoice-head.entity';
import { ResponseHelper } from '../common/response.helper';
import { InvoiceController } from './invoice.controller';
import { User } from '../users/entities/user.entity';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let invoiceRepository: Repository<InvoiceHead>;

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

    service = module.get<InvoiceService>(InvoiceService);
    invoiceRepository = module.get<Repository<InvoiceHead>>(
      getRepositoryToken(InvoiceHead),
    );
  });

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

    jest.spyOn(invoiceRepository, 'findOne').mockResolvedValue(mockInvoice);

    const result = await service.getInvoiceByInvoiceId(mockInvoiceId);
    expect(result).toEqual(mockInvoice);
  });

  it('should handle not found invoice', async () => {
    const mockInvoiceId = 'nonexistentInvoiceId';

    jest.spyOn(invoiceRepository, 'findOne').mockResolvedValue(null);

    try {
      await service.getInvoiceByInvoiceId(mockInvoiceId);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.message).toBe('Invoice not found');
      expect(error.response.statusCode).toBe(404);
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
