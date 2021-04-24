import {
    Controller, UseInterceptors, ClassSerializerInterceptor, Logger,
    Body, Post, Get, UseGuards, Put, Param, HttpStatus,
} from "@nestjs/common";
import { AuthService } from "src/services/auth.service";
import { MessageResponse } from "src/common/messageResponse";
import { LoggedinDto } from "src/dtos/loggedin.dto";
import { LoginDto } from "src/dtos/login.dto";
import { UserService } from "src/services/user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PasswordDto } from "src/dtos/password.dto";
import { CustomException } from "src/common/customException.helper";

const base64 = require('nodejs-base64-converter');

@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/auth')
export class LoginController {

    private readonly logger = new Logger(LoginController.name);

    constructor(
        private readonly authService: AuthService,
        private userService: UserService,
    ) { }

    @Post('login')
    async login(@Body() loginUserDto: LoginDto): Promise<LoggedinDto> {
        let ret: LoggedinDto = new LoggedinDto();
        this.logger.debug('LoginController/login - start: ' + JSON.stringify(loginUserDto));
        const user = await this.userService.findByUsername(loginUserDto.username);
        this.logger.debug('LoginController/login - user: ' + JSON.stringify(user));
        if (base64.decode(user.password) !== loginUserDto.password) {
            throw new CustomException(12, 'Password errata', HttpStatus.NOT_FOUND);
        }
        const obsToken = await this.authService.login(user);
        this.logger.debug('LoginController/login - token: ' + JSON.stringify(obsToken));

        ret.username = user.username;
        ret.id = user.id;
        ret.profile = user.profile;
        ret.token = obsToken.access_token;
        return ret;
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(): Promise<MessageResponse> {
        return new MessageResponse('Logut effettuato. Arrivederci');
    }

    @UseGuards(JwtAuthGuard)
    @Put(':username')
    update(@Param('username') username: string, @Body() passwords: PasswordDto): Promise<any> {
        return this.authService.updatePassword(username, passwords);
    }

}
