import { Injectable, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceHead } from './entities/invoice-head.entity';
import { InvoiceHeadDto } from './dto/invoice-head.dto';
import { ResponseHelper } from '../common/response.helper';

import { User } from '../users/entities/user.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceHead)
    private readonly invoiceHeadRepository: Repository<InvoiceHead>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private httpRes: ResponseHelper,
  ) {}

  async createInvoice(invoiceData: InvoiceHeadDto): Promise<InvoiceHead> {
    // check user exists

    const isValidUserId = await this.usersRepository.findOne({
      where: { id: invoiceData.userId },
    });

    if (!isValidUserId) {
      this.httpRes.SendHttpError('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    const newInvoiceHead = this.invoiceHeadRepository.create(invoiceData);

    // calculate line total for each detail
    newInvoiceHead.details.forEach((detail) => {
      detail.lineTotal = detail.calculateLineTotal();
    });

    // calculate product subtotal and invoice total
    newInvoiceHead.productSubtotal =
      this.calculateProductSubtotal(newInvoiceHead);
    newInvoiceHead.invoiceTotal = this.calculateInvoiceTotal(newInvoiceHead);

    // create the invoice
    return this.invoiceHeadRepository.save(newInvoiceHead);
  }

  async getAllInvoices(): Promise<InvoiceHead[]> {
    return this.invoiceHeadRepository.find({ relations: ['details'] });
  }

  async getInvoiceById(id: string): Promise<InvoiceHead> {
    // const invoice = await this.invoiceHeadRepository.findOne(id, { relations: ['details'] });
    const invoice = await this.invoiceHeadRepository.findOne({
      where: { id: id },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async updateInvoice(
    id: string,
    invoiceData: Partial<InvoiceHead>,
  ): Promise<InvoiceHead> {
    await this.getInvoiceById(id);
    await this.invoiceHeadRepository.update(id, invoiceData);
    return this.getInvoiceById(id);
  }

  async deleteInvoice(id: string): Promise<void> {
    await this.getInvoiceById(id);
    await this.invoiceHeadRepository.delete(id);
  }

  // method for calculating productSubtotal
  private calculateProductSubtotal(invoice: InvoiceHead): number {
    if (!invoice.details || invoice.details.length === 0) {
      return 0;
    }

    const subtotal = invoice.details.reduce(
      (subtotal, detail) => subtotal + detail.lineTotal,
      0,
    );

    return isNaN(subtotal) ? 0 : subtotal;
  }

  // method for calculating invoiceTotal
  private calculateInvoiceTotal(invoice: InvoiceHead): number {
    return invoice.productSubtotal;
  }
}
