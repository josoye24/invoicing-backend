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
      return this.httpRes.SendHttpError(
        'Invalid user id',
        HttpStatus.BAD_REQUEST,
      );
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
    await this.invoiceHeadRepository.save(newInvoiceHead);

    return this.httpRes.SendHttpResponse(
      'Invoice created successfully',
      HttpStatus.CREATED,
      newInvoiceHead,
    );
  }

  async getAllInvoices(): Promise<InvoiceHead[]> {
    const invoices = await this.invoiceHeadRepository.find({
      relations: ['details', 'user'],
    });

    // map User properties to reduce the amount of data exposed
    invoices.forEach((invoice) => {
      if (invoice.user) {
        invoice.user = {
          id: invoice.user.id,
          name: invoice.user.name,
          email: invoice.user.email,
        } as User;
      }
    });
    return this.httpRes.SendHttpResponse(
      'All invoices fetched successfully',
      HttpStatus.OK,
      invoices,
    );
  }

  async getInvoiceById(id: string): Promise<InvoiceHead> {
    const invoice = await this.invoiceHeadRepository.findOne({
      where: { id: id },
      relations: ['details', 'user'],
    });
    // User properties to reduce the amount of data exposed
    if (invoice.user) {
      invoice.user = {
        id: invoice.user.id,
        name: invoice.user.name,
        email: invoice.user.email,
      } as User;
    }

    if (!invoice) {
      return this.httpRes.SendHttpError(
        'Invoice not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.httpRes.SendHttpResponse(
      'Invoice fetched successfully',
      HttpStatus.OK,
      invoice,
    );
  }

  async getInvoiceByInvoiceId(id: string): Promise<InvoiceHead> {
    const invoice = await this.invoiceHeadRepository.findOne({
      where: { id: id },
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  async getInvoicesByUserId(id: string): Promise<InvoiceHead[]> {
    const invoice = await this.invoiceHeadRepository.find({
      where: { user: { id: id } },
      relations: ['details', 'user'],
      order: {
        createdAt: 'DESC',
      },
    });
    // map User properties to reduce the amount of data exposed
    invoice.forEach((invo) => {
      if (invo.user) {
        invo.user = {
          id: invo.user.id,
          name: invo.user.name,
          email: invo.user.email,
        } as User;
      }
    });
    return this.httpRes.SendHttpResponse(
      'All invoices fetched successfully',
      HttpStatus.OK,
      invoice,
    );
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
