import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
      // Thêm cấu hình CORS
      app.enableCors({
        origin: '*', // URL của Angular app
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      });
  await app.listen(process.env.PORT ?? 3000);


}
bootstrap();
