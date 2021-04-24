import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Log4jsService } from './services/log4js.service';

async function bootstrap() {
  const logger = new Log4jsService("DEBUG");
  const app = await NestFactory.create(AppModule, { cors: true, logger });
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle(process.env.APP_BE_TITLE)
    .setDescription(process.env.APP_BE_DESCRIPTION)
    .setVersion(process.env.APP_BE_VERSION)
    .addTag(process.env.APP_BE_TAG)
    .addBearerAuth()
    .build()
    ;

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);
  
  await app.listen(4226);  //process.env.APP_BE_LISTEN_PORT
  // eliminato timeout di 2 minuti che provocava la recall della chiamata BE
  //const server = server.setTimeout(0);

  // DEFAULT
  // const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  // await app.listen(3000);
}
bootstrap();
