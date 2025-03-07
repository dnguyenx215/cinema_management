// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async loginAdmin(@Body() body: { email?: string; password?: string }) {
    if (!body || !body.email || !body.password) {
      throw new BadRequestException('Missing email or password');
    }
    return await this.authService.loginAdmin(body.email, body.password);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: { email?: string; password?: string; role?: string }) {
    if (!body || !body.email || !body.password) {
      throw new BadRequestException('Missing email or password');
    }
    // Ép kiểu để đảm bảo email và password là string
    return await this.authService.register({
      email: body.email!,
      password: body.password!,
      role: body.role,
    });
  }
}
