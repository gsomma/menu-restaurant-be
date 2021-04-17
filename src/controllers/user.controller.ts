import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Logger, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { MessageResponse } from 'src/common/messageResponse';
import { UserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { UserProfile } from 'src/enums/user-profile.enum';
import { UserService } from 'src/services/user.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(RolesGuard)
@Controller('api/user')
export class UserController {

    private readonly logger = new Logger("UserController");

    constructor(private userService: UserService) { }

    @UseGuards(JwtAuthGuard)
    @Roles(UserProfile.ADMINISTRATOR, UserProfile.CLIENT, UserProfile.OPERATOR)
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserProfile.ADMINISTRATOR, UserProfile.CLIENT, UserProfile.OPERATOR)
    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserProfile.ADMINISTRATOR)
    @Post()
    async create(@Body() user: UserDto): Promise<UserDto> {
        return this.userService.create(user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserProfile.ADMINISTRATOR)
    @Put(':id')
    async update(@Param('id', new ParseIntPipe()) id: number, @Body() user: UserDto): Promise<UserDto> {
        return this.userService.update(id, user);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserProfile.ADMINISTRATOR)
    @Delete(':id')
    async delete(@Param('id', new ParseIntPipe()) id: number): Promise<MessageResponse> {
        return this.userService.delete(id);
    }
}
