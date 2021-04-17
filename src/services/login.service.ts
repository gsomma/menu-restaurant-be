// import { Injectable, Logger, HttpStatus } from "@nestjs/common";
// import { CustomException } from "src/common/customException.helper";
// import { LoginDto } from "src/dtos/login.dto";
// import { LoggedUserDto } from "src/dtos/logged-user.dto";
// import { LoginUserDto } from "src/dtos/login-user.dto";
// import { User } from "src/entities/user.entity";
// import { Connection } from "typeorm";
// import { AbstractService } from "./abstract.service";

// const jwt = require('jsonwebtoken');
// const base64 = require('nodejs-base64-converter');

// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// @Injectable()
// export class LoginService extends AbstractService {

//   private readonly logger = new Logger("LoginService");


//   constructor(
//     private readonly connection: Connection,
//   ) {
//     super();
//   }

//   /**
//    *
//    * @param loginDto
//    */
//   async login(loginDto: LoginUserDto): Promise<LoggedUserDto> {
//     this.logger.debug("LoginService/login");
//     let result;

//     const queryRunner = this.connection.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();


//     try {

//       //const loginDto = new LoginDto(loginDto);
//       //let valid = await loginDto.validate();
//       // this.logger.debug("LoginService/login 2");
//       // if (valid && !valid.isValid) {
//       //   throw valid.err;
//       // }
//       this.logger.debug("LoginService/login 3");

//       //this.logger.log("UtenteDto  " + JSON.stringify(loginDto));

//       let username = loginDto.username;
//       this.logger.log("Username  " + username);

//       //let profilo = loginDto.profilo;
//       //this.logger.debug("Profilo   " + profilo);

//       this.logger.debug("LoginService/login 3 A");

//       const utente: User = await queryRunner.manager.createQueryBuilder()
//         .select("utente")
//         .from(User, "utente")
//         .where("utente.username = :username", { username })
//         .getOne();

//       if (!utente) {
//         this.logger.error("Utente inesistente " + JSON.stringify(utente));
//         throw new CustomException(1, `Utente '${username}' inesistente`, HttpStatus.UNAUTHORIZED);
//       }

//       this.logger.debug("LoginService/login 4");

//       let password = base64.decode(utente.password);

//       this.logger.log("Utente.Password: " + utente.password);
//       this.logger.log("Password: " + password);

//       if (loginDto.password !== password) {
//         //this.logger.error("Password non corretta " + JSON.stringify(utente));
//         throw new CustomException(2, `Password non corretta`, HttpStatus.UNAUTHORIZED);
//       }

//       this.logger.log("Utente.Profilo: " + utente.profile);
//       //this.logger.log("Profilo: " + profilo);
//       if (!utente.isActive) {
//         //this.logger.error("Utente non attivo " + JSON.stringify(utente));
//         throw new CustomException(3, `Utente non attivo`, HttpStatus.UNAUTHORIZED);
//       }
//       // if (profilo === ProfiloEnum.MASTER && utente.profilo !== ProfiloEnum.MASTER) {
//       //   //this.logger.error("Utente non autorizzato " + JSON.stringify(utente));
//       //   throw new CustomException(2, `Utente non autorizzato`, HttpStatus.UNAUTHORIZED);
//       // }

//       // let hwBaia;
//       // if (utente.profilo !== ProfiloEnum.MASTER && profilo !== 'magazzino') {
//       //   hwBaia = await this.hwBaiaService.findByIp(host);
//       //   if (!hwBaia) {
//       //     this.logger.debug("LoginService/numero baia " + hwBaia?.numero_baia);
//       //     throw new CustomException(4, `Postazione Baia non censita`, HttpStatus.UNAUTHORIZED);
//       //   }
//       // }

//       //this.logger.debug('hwBaia: ' + JSON.stringify(hwBaia));
//       const token = await this.generateJWT(utente.username, utente.profile);

//       result = LoggedUserDto.firstTime(utente, utente.profile, token);

//       // //
//       // //Aggiornamento cronologia
//       // //
//       // const cronologia = new Cronologia(null);
//       // cronologia.nota = null;
//       // cronologia.entita = EntitaEnum.UTENTE
//       // cronologia.operazione = OperazioneEnum.LOGIN;
//       // cronologia.rigaDb = JSON.stringify(result);
//       // cronologia.run = null;
//       // cronologia.usrIns = utente.username;
//       //await this.createCronologia(queryRunner, cronologia);

//       await queryRunner.commitTransaction();

//     } catch (err) {
//       this.logger.error(err, "'Errore login");
//       await queryRunner.rollbackTransaction();
//       throw err;

//     } finally {
//       await queryRunner.release();
//     }

//     return result;
//   }

//   /**
//    *
//    * @param key
//    */
//   public generateJWT(username: string, profiloDB: string) {
//     try {
//       var expire = process.env.TOKEN_EXPIRE_TIME;

//       //this.logger.debug("generate token"+" key="+JSON.stringify(key)+" expire="+expire);
//       let token = jwt.sign({
//         username: username,
//         profilo: profiloDB
//       }, process.env.TOKEN_SECRET_KEY, { expiresIn: expire });

//       // if (tokenPrefix === 'L') {
//       //   if (profiloBodyDto === 'master') {
//       //     tokenPrefix = 'M';
//       //   } else
//       //     if (profiloBodyDto === 'operatore') {
//       //       tokenPrefix = 'O';
//       //     }
//       //   // else
//       //   //   if (profiloBodyDto === 'baia') {
//       //   //     tokenPrefix = 'B';
//       //   //   }
//       // }

//       return token;
//     } catch (error) {
//       this.logger.error(error, 'Error in generateJWT');
//       throw error;
//     }
//   }

//   /**
//    *
//    * @param token
//    */
//   async verifyToken(token: string): Promise<LoggedUserDto> {
//     this.logger.log("userService/verifyToken start " + token);
//     this.logger.log("userService/verifyToken TOKEN_SECRET_KEY " + process.env.TOKEN_SECRET_KEY);

//     let result;

//     const queryRunner = this.connection.createQueryRunner();
//     await queryRunner.connect();

//     try {
//       const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
//       this.logger.debug('token decoded' + JSON.stringify(decoded));

//       const username = decoded.username;
//       this.logger.debug('username=' + username);

//       const utente = await queryRunner.manager.createQueryBuilder()
//         .select("utente")
//         .from(User, "utente")
//         .where("utente.username = :username", { username })
//         .getOne();

//       this.logger.debug('Utente: ' + JSON.stringify(utente));

//       result = LoggedUserDto.firstTime(utente, decoded.profilo, null);

//     } catch (error) {
//       this.logger.error(error, 'Error in findByToken');
//       throw error;
//     } finally {
//       await queryRunner.release();
//     }

//     return result;
//   }

// }
