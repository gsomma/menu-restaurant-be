import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_CONSTANTS } from 'src/common/constants';
import { UserModule } from 'src/modules/user.module';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { LocalStrategy } from '../auth/strategies/local.strategy';
import { LoginController } from 'src/controllers/login.controller';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_CONSTANTS.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [LoginController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(MiddlewareLogin)
    //   .forRoutes(
    //     { path: 'api/login', method: RequestMethod.ALL }
    //   );
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/login', method: RequestMethod.ALL },
      )
      .forRoutes(
        '*'
      );
  }
}