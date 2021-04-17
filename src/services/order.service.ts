import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Connection, EntityManager, QueryRunner } from 'typeorm';
import { ConnectionManager, AbstractService } from './abstract.service';
import { OrderDto } from '../dtos/order.dto';
import { Order } from '../entities/order.entity';
import { MessageResponse } from 'src/common/messageResponse';
import { CustomException } from 'src/common/customException.helper';

@Injectable()
export class OrderService extends AbstractService {

  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly connection: Connection,
  ) {
    super();
  }

  async findAll(): Promise<Order[]> {
    this.logger.debug("OrderService/findAll");
    let queryRunner: QueryRunner;

    try {
      queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      return await queryRunner.manager.find(Order);
    } catch (error) {
      this.logger.error(error, "Errore in OrderService/findAll");
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number, manager?: EntityManager): Promise<Order> {
    this.logger.debug("OrderService/findOne: " + id);

    let queryRunner: ConnectionManager;
    let result: Order;

    try {
      queryRunner = await this.getManager(this.connection, manager);
      await queryRunner.startTransaction();
      result = await queryRunner.manager.findOne(Order, {
        //relations: ['run'],
        where: {
          id: id
        }
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error, "Errore in OrderService/findOne");
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    if (!result || !result.id) {
      throw new NotFoundException("Ordine inesistente");
    }

    return result;

  }

  async create(orderDto: OrderDto): Promise<OrderDto> {
    this.logger.debug("OrderService/create " + JSON.stringify(orderDto));

    let queryRunner: QueryRunner;
    let item: OrderDto = null;
    let order: Order = null;
    let readItem = null;

    try {
      queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (orderDto.id) {
        readItem = await queryRunner.manager.createQueryBuilder()
          .select("o")
          .from(Order, "o")
          .where("o.id = :id", { id: orderDto.id })
          .getOne();
        this.logger.debug("readItem " + JSON.stringify(readItem));
      }

      if (!readItem) {
        //
        //Inserimento
        //
        const order: Order = this.createEntity(orderDto);
        this.logger.debug("OrderService/Inserimento ordine");
        item = await queryRunner.manager.save(order);
        if (!item) {
          throw new CustomException(20, `Ordine '${order.id}' non inserito`);
        }
      } else {
        const updateResult = await queryRunner.manager.save(order);
        if (!updateResult) {
          throw new CustomException(11, `Ordine '${readItem.id}' non inserito`);
        }
        item = await queryRunner.manager.findOne(Order, readItem.id);
      }
      await queryRunner.commitTransaction();

    } catch (error) {
      this.logger.error("OrderService/error: " + error);
      await queryRunner.rollbackTransaction();
      throw error; // Mandatory

    } finally {
      await queryRunner.release();
    }

    return item;
  }

  async update(id: number, order: OrderDto): Promise<OrderDto> {
    this.logger.debug("OrderService/update " + JSON.stringify(order));

    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const readItem = await queryRunner.manager.createQueryBuilder()
        .select("o")
        .from(Order, "o")
        .where("o.id = :id", { id: id })
        .withDeleted()
        .getOne();
      this.logger.debug("OrderService/foundIt " + JSON.stringify(readItem));

      if (!readItem) {
        throw new NotFoundException("Ordine inesistente");
      } else {
        if (readItem.dateDel) {
          //
          //Restore
          //
          const restoreResult = await await queryRunner.manager.restore(Order, id);
          if (!restoreResult || restoreResult.affected != 1) {
            throw new CustomException(10, `Ordine '${id}' ripristino in errore`);
          }
        }
      }

      const updateResult = await queryRunner.manager.update(Order, id, order);
      if (!updateResult || updateResult.affected != 1) {
        throw new CustomException(2, `OrderService/Ordine '${order}' non aggiornato`);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error, "Errore in update Notifica");
      await queryRunner.rollbackTransaction();
      throw error; // Mandatory

    } finally {
      await queryRunner.release();
    }

    return order;
  }

  async delete(id: number): Promise<MessageResponse> {
    this.logger.debug("OrderService/delete: " + id);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const result = await queryRunner.manager.createQueryBuilder()
        .select("o")
        .from(Order, "o")
        .where("o.id = :id", { id: id })
        .getOne();

      if (!result) {
        this.logger.debug("OrderService/delete: Ordine non presente");
        throw new NotFoundException("Ordine inesistente");
      } else {
        const item = await queryRunner.manager.getRepository(Order)
          .softDelete(id)
      }
      this.logger.debug("OrderService/delete: Ordine cancellato con successo");
    } catch (error) {
      this.logger.error(error, "Errore in OrderService/findOne");
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return new MessageResponse("Ordine cancellato con successo");
  }

  private createEntity(dto: OrderDto): Order {
    let ret = new Order();
    ret.id = dto.id;
    ret.type = dto.type;
    ret.number = dto.number;
    ret.date = dto.date;
    ret.status = dto.status;
    ret.totalPrice = dto.totalPrice;
    ret.expectedDeliveryDate = dto.expectedDeliveryDate;
    ret.tableCode = dto.tableCode;

    return ret;
  };

}
