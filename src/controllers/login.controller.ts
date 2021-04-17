import {
    Controller, UseInterceptors, ClassSerializerInterceptor, Logger,
    Body, Post, UseGuards, Get,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "src/services/auth.service";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { MessageResponse } from "src/common/messageResponse";
import { LoggedinDto } from "src/dtos/loggedin.dto";
import { LoginDto } from "src/dtos/login.dto";
import { UserService } from "src/services/user.service";
import { forkJoin } from "rxjs";


@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/auth')
//@ApiTags('Login')
export class LoginController {

    private readonly logger = new Logger("LoginController");

    constructor(
        private readonly authService: AuthService,
        private userService: UserService,
    ) { }

    //@UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() loginUserDto: LoginDto): Promise<LoggedinDto> {
        let ret: LoggedinDto = new LoggedinDto();
        const user = await this.userService.findByUsername(loginUserDto.username);
        const obsToken = await this.authService.login(user);

        ret.username = user.username;
        ret.id = user.id;
        ret.profile = user.profile;
        ret.token = obsToken.access_token;
        return ret;
        // const obsToken = this.authService.login(loginUserDto);
        // const obsUser = this.userService.findByUsername(loginUserDto.username);
        // return forkJoin({ obsToken, obsUser }).toPromise().then(res => {
        //     ret.username = res.obsUser.username;
        //     ret.id = res.obsUser.id;
        //     ret.profile = res.obsUser.profile;
        //     ret.token = res.obsToken.access_token;
        //     return ret;
        // });
    }
    // @Post('login')
    // @UsePipes(new ValidationPipe({ transform: true }))
    // async login(@Body() loginUserDto: LoginUserDto): Promise<LoggedUserDto> {
    //     this.logger.log('LoginController.login / start: ' + JSON.stringify(loginUserDto));
    //     return this.loginService.login(loginUserDto);
    // }

    //@UseGuards(AuthGuard)
    //@Roles('master', 'operatore')
    //@ApiForbiddenResponse()
    //@ApiNotFoundResponse()
    //@ApiBadRequestResponse()
    @Get('logout')
    async logout(): Promise<MessageResponse> {
        return new MessageResponse('Logut effettuato. Arrivederci');
    }

}
