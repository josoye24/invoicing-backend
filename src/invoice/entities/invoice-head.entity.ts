import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { InvoiceDetail } from './invoice-detail.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class InvoiceHead extends BaseEntity {
  @Column()
  customerName: string;

  @Column()
  customerAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  productSubtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  invoiceTotal: number;

  @OneToMany(() => InvoiceDetail, (detail) => detail.head, { cascade: true })
  details: InvoiceDetail[];

  @ManyToOne(() => User, (user) => user.invoices)
  @JoinColumn({ name: 'userId' })
  user: User;
}
