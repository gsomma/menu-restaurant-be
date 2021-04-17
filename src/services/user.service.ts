import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CustomException } from 'src/common/customException.helper';
import { MessageResponse } from 'src/common/messageResponse';
import { UserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { Connection, EntityManager, QueryRunner } from 'typeorm';
import { ConnectionManager, AbstractService } from './abstract.service';

@Injectable()
export class UserService extends AbstractService {

  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly connection: Connection,
  ) {
    super();
  }

  async findAll(): Promise<User[]> {
    this.logger.debug("UserService/findAll");
    let queryRunner: QueryRunner;

    try {
      queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      return await queryRunner.manager.find(User);
    } catch (error) {
      this.logger.error(error, "Errore in UserService/findAll");
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number, manager?: EntityManager): Promise<User> {
    this.logger.debug("UserService/findOne: " + id);

    let queryRunner: ConnectionManager;
    let result: User;

    try {
      queryRunner = await this.getManager(this.connection, manager);
      await queryRunner.startTransaction();
      result = await queryRunner.manager.findOne(User, {
        //relations: ['run'],
        where: {
          id: id
        }
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error, "Errore in UserService/findOne");
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    if (!result || !result.id) {
      throw new NotFoundException("Utente inesistente");
    }

    return result;

  }

  async findByUsername(username: string, manager?: EntityManager): Promise<User> {
    this.logger.debug("UserService/findByUsername: " + username);

    let queryRunner: ConnectionManager;
    let result: User;

    try {
      queryRunner = await this.getManager(this.connection, manager);
      await queryRunner.startTransaction();
      result = await queryRunner.manager.findOne(User, {
        //relations: ['run'],
        where: {
          username: username
        }
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error, "Errore in UserService/findByUsername");
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    if (!result || !result.id) {
      throw new NotFoundException("Utente inesistente");
    }

    return result;

  }

  async create(userDto: UserDto): Promise<UserDto> {
    this.logger.debug("UserService/create " + JSON.stringify(userDto));

    let queryRunner: QueryRunner;
    let item: UserDto = null;
    let user: User = null;
    let readItem = null;

    try {
      queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (userDto.id) {
        readItem = await queryRunner.manager.createQueryBuilder()
          .select("o")
          .from(User, "o")
          .where("o.id = :id", { id: userDto.id })
          .getOne();
        this.logger.debug("readItem " + JSON.stringify(readItem));
      }

      if (!readItem) {
        //
        //Inserimento
        //
        const user: User = this.createEntity(userDto);
        user.password = "aaa";
        this.logger.debug("UserService/Inserimento ordine");
        item = await queryRunner.manager.save(user);
        if (!item) {
          throw new CustomException(20, `Utente '${user.id}' non inserito`);
        }
      } else {
        const updateResult = await queryRunner.manager.save(user);
        if (!updateResult) {
          throw new CustomException(11, `Utente '${readItem.id}' non inserito`);
        }
        item = await queryRunner.manager.findOne(User, readItem.id);
      }
      await queryRunner.commitTransaction();

    } catch (error) {
      this.logger.error("UserService/error: " + error);
      await queryRunner.rollbackTransaction();
      throw error; // Mandatory

    } finally {
      await queryRunner.release();
    }

    return item;
  }

  async update(id: number, user: UserDto): Promise<UserDto> {
    this.logger.debug("UserService/update " + JSON.stringify(user));
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const readItem = await queryRunner.manager.createQueryBuilder()
        .select("o")
        .from(User, "o")
        .where("o.id = :id", { id: id })
        .withDeleted()
        .getOne();
      this.logger.debug("UserService/foundIt " + JSON.stringify(readItem));

      if (!readItem) {
        throw new NotFoundException("Utente inesistente");
      } else {
        if (readItem.dateDel) {
          //
          //Restore
          //
          const restoreResult = await await queryRunner.manager.restore(User, id);
          if (!restoreResult || restoreResult.affected != 1) {
            throw new CustomException(10, `Utente '${id}' ripristino in errore`);
          }
        }
      }

      const updateResult = await queryRunner.manager.update(User, id, user);
      if (!updateResult || updateResult.affected != 1) {
        throw new CustomException(2, `UserService/Utente '${user}' non aggiornato`);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error, "Errore in update Notifica");
      await queryRunner.rollbackTransaction();
      throw error; // Mandatory

    } finally {
      await queryRunner.release();
    }

    return user;
  }

  async delete(id: number): Promise<MessageResponse> {
    this.logger.debug("UserService/delete: " + id);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();

    try {

      const result = await queryRunner.manager.createQueryBuilder()
        .select("o")
        .from(User, "o")
        .where("o.id = :id", { id: id })
        .getOne();

      if (!result) {
        this.logger.debug("UserService/delete: Utente non presente");
        throw new NotFoundException("Utente inesistente");
      } else {
        const item = await queryRunner.manager.getRepository(User)
          .softDelete(id)
      }
      this.logger.debug("UserService/delete: Utente cancellato con successo");
    } catch (error) {
      this.logger.error(error, "Errore in UserService/findOne");
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return new MessageResponse("Utente cancellato con successo");
  }

  private createEntity(dto: UserDto): User {
    let ret = new User();
    ret.id = dto.id;
    ret.username = dto.username;
    ret.fullName = dto.fullName;
    ret.profile = dto.profile;
    ret.isActive = dto.isActive;
    ret.password = dto.password;

    return ret;
  };


}
