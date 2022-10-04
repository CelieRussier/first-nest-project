import 'reflect-metadata'; // not sure it is the right place and right syntax...
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthGuard } from './auth.guard';
import { HttpExceptionFilter } from './http-exception.filter';
import { ResponseInterceptor } from './response.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Nest first project')
    .setDescription('To discover main NestJS features')
    .setVersion('1.0')
    .addTag('first nestJS project')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableShutdownHooks();
  app.useGlobalGuards(new AuthGuard());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, transform: true}));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector),
    {
      groups: ['api']
    }
    )
  );
  await app.listen(3000);
}
bootstrap();
