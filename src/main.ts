import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

import {ConfigService} from '@nestjs/config';
import {DocumentBuilder, SwaggerCustomOptions, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const serviceName = configService.get<number>('SERVICE_NAME');


  const config = new DocumentBuilder()
    .setTitle(`${serviceName} API Docs`)
    .setDescription(`${serviceName} API 문서입니다.`)
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    }
  }
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, customOptions);
  await app.listen(port);
}
bootstrap();
