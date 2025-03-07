// auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async loginAdmin(email: string, password: string): Promise<{ message: string, data: any }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    // Ở ví dụ đơn giản, so sánh password thẳng; trong thực tế nên dùng bcrypt để hash và so sánh
    if (user.password !== password) {
      throw new BadRequestException('Invalid credentials');
    }
    if (user.role !== 'admin') {
      throw new BadRequestException('Access denied: Not an admin');
    }
    return { message: 'Login successful', data: {'user_email': user.email, 'user_role': user.role} };
  }

  async register(userData: { email: string; password: string; role?: string }): Promise<{ message: string }> {
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    // Tạo user mới, nếu role không truyền vào sẽ mặc định là 'user'
    const newUser = this.userRepository.create({
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user',
    });
    await this.userRepository.save(newUser);
    return { message: 'User registration successful' };
  }

  async initializeAdminUser(): Promise<void> {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin';
    // Kiểm tra xem user admin đã tồn tại chưa
    const existingAdmin = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const adminUser = this.userRepository.create({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      await this.userRepository.save(adminUser);
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  }
}
