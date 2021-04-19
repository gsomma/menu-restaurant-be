import {
    Controller, UseInterceptors, ClassSerializerInterceptor, Logger,
    Body, Post, Get,
} from "@nestjs/common";
import { AuthService } from "src/services/auth.service";
import { MessageResponse } from "src/common/messageResponse";
import { LoggedinDto } from "src/dtos/loggedin.dto";
import { LoginDto } from "src/dtos/login.dto";
import { UserService } from "src/services/user.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/auth')
//@ApiTags('Login')
export class LoginController {

    private readonly logger = new Logger("LoginController");

    constructor(
        private readonly authService: AuthService,
        private userService: UserService,
    ) { }

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
    }
    
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
