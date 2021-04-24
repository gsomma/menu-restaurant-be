import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Logger, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { MessageResponse } from 'src/common/messageResponse';
import { OrderDto } from 'src/dtos/order.dto';
import { Order } from 'src/entities/order.entity';
import { UserProfile } from 'src/enums/user-profile.enum';
import { OrderService } from '../services/order.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(RolesGuard)
@Controller('api/order')
export class OrderController {

    private readonly logger = new Logger(OrderController.name);

    constructor(private orderService: OrderService) { }

    //@UseGuards(AuthGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(UserProfile.ADMINISTRATOR, UserProfile.CLIENT, UserProfile.OPERATOR)
    @Get()
    async findAll(): Promise<Order[]> {
        return this.orderService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserProfile.ADMINISTRATOR, UserProfile.CLIENT, UserProfile.OPERATOR)
    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<Order> {
        return this.orderService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserProfile.ADMINISTRATOR)
    @Post()
    async create(@Body() order: OrderDto): Promise<OrderDto> {
        return this.orderService.create(order);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserProfile.ADMINISTRATOR)
    @Put(':id')
    async update(@Param('id', new ParseIntPipe()) id: number, @Body() order: OrderDto): Promise<OrderDto> {
        return this.orderService.update(id, order);
    }
    
    @UseGuards(JwtAuthGuard)
    @Roles(UserProfile.ADMINISTRATOR)
    @Delete(':id')
    async delete(@Param('id', new ParseIntPipe()) id: number): Promise<MessageResponse> {
        return this.orderService.delete(id);
    }
}
