import { OrderStatus } from 'src/enums/order-status.enum';
import { OrderType } from 'src/enums/order-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class Order extends AbstractEntity {
    @PrimaryGeneratedColumn({ comment: "Identificativo PK" })
    id: number;

    @Column({ name: 'type', type: 'enum', enum: OrderType, nullable: false, default: 'Tavolo', comment: "tipo ordine" })
    type: OrderType;

    @Column({ name: 'number', type: 'varchar', length: 20, nullable: false, comment: "numero ordine" })
    number: string;

    @Column({ name: "date", nullable: false, comment: 'Data ordine' })
    date: Date;

    @Column({ name: 'status', type: "enum", enum: OrderStatus, default: 'in attesa', comment: 'stato ordine' })
    status: OrderStatus;

    @Column({ name: 'tableCode', type: 'varchar', length: 20, nullable: true, comment: "numero tavolo" })
    tableCode: string;

    @Column({ name: 'totalPrice', type: 'real', default: 0, nullable: true, comment: 'totale ordine' })
    totalPrice: number;

    @Column({ name: 'expectedDeliveryDate', nullable: true, comment: 'Data prevista consegna' })
    expectedDeliveryDate: Date;
}