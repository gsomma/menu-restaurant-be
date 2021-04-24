import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANTS } from 'src/common/constants';
import { CustomException } from 'src/common/customException.helper';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';
import { Connection } from 'typeorm';

const base64 = require('nodejs-base64-converter');

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly connection: Connection,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.profile };
    //const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string): Promise<any> {
    const decoded: any = this.jwtService.verify(token, { secret: JWT_CONSTANTS.SECRET });
    return decoded;
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    // return null;
  }

  async updatePassword(userName: string, params: any): Promise<any> {
    this.logger.debug("AuthService/updatePassword: " + JSON.stringify(params));

    if (params.oldPassword === params.newPassword) {
      throw new CustomException(12, 'Le password non possono coincidere', HttpStatus.BAD_REQUEST);
    }
    const queryRunner = this.connection.createQueryRunner();
    let updatedItem;

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const readItem = await queryRunner.manager.createQueryBuilder()
        .select("u")
        .from(User, "u")
        .where("u.username = :username", { username: userName })
        .andWhere("u.password = :oldPassword", { oldPassword: base64.encode(params.oldPassword) })
        .getOne();
      this.logger.debug("foundIt " + JSON.stringify(readItem));

      if (!readItem) {
        throw new CustomException(10, "Utente inesistente o password precedente diversa", HttpStatus.BAD_REQUEST);
      } else {

        if (readItem.dateDel) {
          //
          //Restore
          //
          const restoreResult = await await queryRunner.manager.restore(User, { username: userName });
          if (!restoreResult || restoreResult.affected != 1) {
            throw new CustomException(10, ` utente '${userName}' ripristino in errore`);
          }
        }
      }

      readItem.password = base64.encode(params.newPassword);
      updatedItem = readItem;
      const updateResult = await queryRunner.manager.update(User, { id: updatedItem.id }, updatedItem);
      if (!updateResult || updateResult.affected != 1) {
        throw new CustomException(2, `Password '${updatedItem}' non aggiornata`);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error, "Errore in modifica password");
      await queryRunner.rollbackTransaction();
      throw error; // Mandatory

    } finally {
      await queryRunner.release();
    }

    return updatedItem;
  }

}