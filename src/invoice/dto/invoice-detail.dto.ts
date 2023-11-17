import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InvoiceDetailDto {
  @IsNotEmpty()
  @IsString()
  productCode: string;

  @IsNotEmpty()
  @IsString()
  productDescription: string;

  @IsNotEmpty()
  @IsNumber()
  productPricePerUnit: number;

  @IsNotEmpty()
  @IsNumber()
  productQuantity: number;
}
