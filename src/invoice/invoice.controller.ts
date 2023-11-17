import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceHead } from './entities/invoice-head.entity';
import { InvoiceHeadDto } from './dto/invoice-head.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoice(
    @Body() invoiceData: InvoiceHeadDto,
  ): Promise<InvoiceHead> {
    return this.invoiceService.createInvoice(invoiceData);
  }

  @Get('all')
  async getAllInvoices(): Promise<InvoiceHead[]> {
    return this.invoiceService.getAllInvoices();
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string): Promise<InvoiceHead> {
    return this.invoiceService.getInvoiceById(id);
  }

  @Put(':id')
  async updateInvoice(
    @Param('id') id: string,
    @Body() invoiceData: Partial<InvoiceHead>,
  ): Promise<InvoiceHead> {
    return this.invoiceService.updateInvoice(id, invoiceData);
  }

  @Delete(':id')
  async deleteInvoice(@Param('id') id: string): Promise<void> {
    try {
      await this.invoiceService.deleteInvoice(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Handle 404 response or rethrow the error if needed
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
      // Handle other errors
      throw error;
    }
  }
}
