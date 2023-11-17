import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceHead } from './entities/invoice-head.entity';
import { InvoiceDetail } from './entities/invoice-detail.entity';
import { User } from '../users/entities/user.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { ResponseHelper } from '../common/response.helper';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceHead, InvoiceDetail, User])],
  controllers: [InvoiceController],
  providers: [InvoiceService, ResponseHelper],
})
export class InvoiceModule {}
