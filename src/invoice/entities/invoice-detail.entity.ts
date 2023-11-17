import { Entity, Column, JoinColumn, ManyToOne, BeforeInsert } from 'typeorm';
import { InvoiceHead } from './invoice-head.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class InvoiceDetail extends BaseEntity {
  @Column()
  productCode: string;

  @Column()
  productDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  productPricePerUnit: number;

  @Column()
  productQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  lineTotal: number;

  @ManyToOne(() => InvoiceHead, (head) => head.details)
  @JoinColumn({ name: 'invoiceHeadId' })
  head: InvoiceHead;

  // BeforeInsert event handler
  @BeforeInsert()
  updateLineTotalBeforeInsert() {
    // calculate line total before inserting into the database
    this.lineTotal = this.calculateLineTotal();
  }

  // Method to calculate line total
  calculateLineTotal(): number {
    return this.productPricePerUnit * this.productQuantity;
  }
}
