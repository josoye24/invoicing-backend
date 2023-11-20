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
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceHead } from './entities/invoice-head.entity';
import { InvoiceHeadDto } from './dto/invoice-head.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoice(
    @Body() invoiceData: InvoiceHeadDto,
  ): Promise<InvoiceHead> {
    return this.invoiceService.createInvoice(invoiceData);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  async getAllInvoices(): Promise<InvoiceHead[]> {
    return this.invoiceService.getAllInvoices();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getInvoiceById(@Param('id') id: string): Promise<InvoiceHead> {
    return this.invoiceService.getInvoiceById(id);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard('jwt'))
  async getInvoicesByUserId(@Param('id') id: string): Promise<InvoiceHead[]> {
    return this.invoiceService.getInvoicesByUserId(id);
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
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }
      throw error;
    }
  }

  // method only used by Jest test
  @Get('test/:id')
  @UseGuards(AuthGuard('jwt'))
  async getInvoiceByInvoiceId(@Param('id') id: string): Promise<InvoiceHead> {
    return this.invoiceService.getInvoiceByInvoiceId(id);
  }
}
