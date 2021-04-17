import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { Order } from './entities/order.entity';
import { User } from './entities/user.entity';
import { OrderModule } from './modules/order.module';
import { UserModule } from './modules/user.module';
import { LoginController } from './controllers/login.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'restaurant',
      autoLoadEntities: true,
      synchronize: true,
      entities: [Order, User],
    }),
    AuthModule,
    OrderModule,
    UserModule,
  ],
  controllers: [AppController, LoginController],
  providers: [AppService],
})
export class AppModule { }
