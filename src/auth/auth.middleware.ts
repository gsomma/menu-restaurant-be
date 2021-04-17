import { NestMiddleware, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    private readonly logger = new Logger("AuthMiddleware");

    constructor(
        private readonly authService: AuthService
    ) { }

    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        //next();
        try {

            // console.log(req.headers);

            if (req
                && req.headers
                && req.headers.authorization
            ) {
                this.logger.debug('authHeaders=' + JSON.stringify(req.headers.authorization));

                let token = req.headers.authorization.split(' ')[1];
                this.logger.log('token=' + token);

                const utenteLoggedDto = await this.authService.validateToken(token);
                this.logger.error("AuthMiddleware: utente " + JSON.stringify(utenteLoggedDto));
                if (!utenteLoggedDto) {
                    throw new HttpException('Utente inesistente.', HttpStatus.UNAUTHORIZED);
                }
                this.logger.debug('token decoded=' + JSON.stringify(utenteLoggedDto));

                //This is mandatory. Don't remove next "@ts-ignore"
                //@ts-ignore
                req.user = utenteLoggedDto;

                // 2020-12-01 inizio
                // var cls = require('continuation-local-storage');
                // var myapp = cls.createNamespace('myapp');
                // myapp.user = utenteLoggedDto;

                // var createNamespace = require('continuation-local-storage').createNamespace;
                // var myapp = createNamespace('myapp');
                // myapp.set("user", utenteLoggedDto);
                // 2020-12-01 fine

                next();

            } else {
                this.logger.error('Non autorizzato');
                throw new HttpException('Non autorizzato.', HttpStatus.UNAUTHORIZED);
            }

        } catch (err) {
            this.logger.log(err, 'Error in AuthMiddleware');
            this.logger.error(err, 'Error in AuthMiddleware');
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }

}
