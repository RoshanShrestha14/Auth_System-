import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { registerUserDto } from './dto/register.User';
import bcrypt from 'bcrypt';
import { loginUserDto } from './dto/login.User';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: registerUserDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { sub: user._id };
    const token = await this.jwtService.signAsync(payload);

    return { message: `User Created`, token: token };
  }

  async login(loginDto: loginUserDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id };
    const token = await this.jwtService.signAsync(payload);

    return { message: `User logged in`, token: token };
  }
}
