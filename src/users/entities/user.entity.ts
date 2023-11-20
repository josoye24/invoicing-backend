import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { InvoiceHead } from '../../invoice/entities/invoice-head.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => InvoiceHead, (invoice) => invoice.user)
  invoices: InvoiceHead[];
}
