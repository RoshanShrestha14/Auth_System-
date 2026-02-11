import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { registerUserDto } from './dto/register.User';
import * as bcrypt from 'bcrypt';
import { loginUserDto } from './dto/login.User';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async generateTokens(userId: string) {
    const payload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET as string,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET as string,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES as any,
    });

    return { accessToken, refreshToken };
  }
  async register(registerDto: registerUserDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id.toString(),
    );
    return { accessToken, refreshToken };
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

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id.toString(),
    );
    return { accessToken, refreshToken };
  }
}
