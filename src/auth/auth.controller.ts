import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerUserDto } from './dto/register.User';
import { loginUserDto } from './dto/login.User';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: registerUserDto) {
    const result = await this.authService.register(registerDto);
    return result;
  }

  @Post('login')
  async login(@Body() loginDto: loginUserDto) {
    const result = await this.authService.login(loginDto);
    return result;
  }
}
