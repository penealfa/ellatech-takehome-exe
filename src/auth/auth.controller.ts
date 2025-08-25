// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseService } from '../response/response.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private responseService: ResponseService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.username, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const data = await this.authService.login(user);
    return this.responseService.success(data);
  }
}