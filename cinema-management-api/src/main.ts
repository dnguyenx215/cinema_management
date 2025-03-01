import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
      // Thêm cấu hình CORS
      app.enableCors({
        origin: '*', // URL của Angular app
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      });

      const authService = app.get(AuthService);
      await authService.initializeAdminUser();
  await app.listen(process.env.PORT ?? 3000);


}
bootstrap();
