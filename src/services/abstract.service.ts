import { Logger } from "@nestjs/common";
import { QueryRunner, EntityManager, Connection, TransactionManager, Transaction } from "typeorm";

export class ConnectionManager {
  manager: EntityManager;
  queryRunner: QueryRunner;

  constructor(manager?: EntityManager, queryRunner?: QueryRunner) {
    if (manager) {
      console.log("ConnectionManager -- manager");
      this.manager = manager;
    }
    if (queryRunner) {
      console.log("ConnectionManager -- queryRunner");
      this.queryRunner = queryRunner;
      this.manager = queryRunner.manager;
    }
  }

  async release(): Promise<void> {
    if (this.queryRunner) {
      console.log("release connection");
      await this.queryRunner.release();
    }
  }
  // async connect(): Promise<void> {
  //   if (this.queryRunner){
  //     await this.queryRunner.connect();
  //   }
  // }
  async startTransaction(): Promise<void> {
    if (this.queryRunner) {
      console.log("startTransaction");
      await this.queryRunner.startTransaction();
    }
  }
  async commitTransaction(): Promise<void> {
    if (this.queryRunner) {
      console.log("commitTransaction");
      await this.queryRunner.commitTransaction();
    }
  }
  async rollbackTransaction(): Promise<void> {
    if (this.queryRunner) {
      console.log("rollbackTransaction =");
      await this.queryRunner.rollbackTransaction();
    }
  }

}

export abstract class AbstractService {

  private readonly log = new Logger(AbstractService.name);
  
  // /**
  //  * 
  //  * @param params 
  //  */
  // async createCronologia(queryRunner: QueryRunner | ConnectionManager, params: any): Promise<Cronologia> {
  //   const cronologia = new Cronologia(params);
  //   return await queryRunner.manager.save(cronologia);
  // }

  async getManager(connection: Connection, transactionManager?: EntityManager | ConnectionManager): Promise<ConnectionManager> {
    // console.log("getManager, connection=", connection);
    // console.log("getManager, transactionManager=", transactionManager);
    if (!transactionManager) {
      let queryRunner: QueryRunner;
      queryRunner = await connection.createQueryRunner();
      await queryRunner.connect();
      console.log("getManager, connect()");
      return new ConnectionManager(null, queryRunner);
    } else {
      if (transactionManager instanceof EntityManager) {
        return new ConnectionManager(transactionManager, null);
      } else {
        return transactionManager;
      }
    }
  }

  /**
   * 
   */
  protected getUsername() {

    // let result = null;
    // let dataInizio = new Date();
    // this.log.debug(AbstractService.name + "/getUsername ");
    // try {
    //   var getNamespace = require('continuation-local-storage').getNamespace;
    //   var myapp = getNamespace('myapp');
    //   this.log.debug(AbstractService.name + "/getUsername myapp: " + JSON.stringify(myapp));
    //   if (myapp && myapp.user) {
    //     result = myapp.user.username;
    //   }
    // } finally {
    //   let durata = new Date().getTime() - dataInizio.getTime();
    //   this.log.debug(AbstractService.name + "/getUsername username: " + result + " durata: " + durata);
    // }
    // return result;


    return "APP_BE";
  }

  stringYYYYMMDDToDate(dateString: string): Date {
    const year  = Number.parseInt(dateString.substring(0, 4));
    const month = Number.parseInt(dateString.substring(4, 6));
    const day   = Number.parseInt(dateString.substring(6, 8));

    return new Date(year, month - 1, day);
  }

}