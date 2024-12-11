import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('nest boilerplate')
    .setDescription('The nest boilerplate API description')
    .setVersion('1.0')
    .addServer('/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);
  app.useGlobalInterceptors(new ResponseInterceptor()); // 启用全局拦截器
  app.setGlobalPrefix('api'); // 设置全局前缀

  await app.listen(process.env.PORT ?? 4869);
}
bootstrap();
