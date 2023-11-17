import { IsNotEmpty, IsString } from 'class-validator';
import { InvoiceDetailDto } from './invoice-detail.dto';

export class InvoiceHeadDto {
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsString()
  customerAddress: string;

  @IsNotEmpty()
  details: InvoiceDetailDto[];

  @IsNotEmpty()
  @IsString()
  userId: string;
}
