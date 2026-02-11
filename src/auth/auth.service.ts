import {
  ConsoleLogger,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const updatedRegisterUser = await this.userService.updateRefreshtoken(
      user._id.toString(),
      refreshTokenHash,
    );
    console.log('updated register user is ,', updatedRegisterUser);

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
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const updatedRegisterUser = await this.userService.updateRefreshtoken(
      user._id.toString(),
      refreshTokenHash,
    );

    console.log('updated register user is ', updatedRegisterUser);
    return { accessToken, refreshToken };
  }

  async refreshToken(oldRefreshToken: string) {
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const decoded = await this.jwtService.verifyAsync(oldRefreshToken, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const userId = decoded.sub;

    const user = await this.userService.getUserById(userId);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isMatch = await bcrypt.compare(
      oldRefreshToken,
      user.refreshTokenHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token does not match');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id.toString(),
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const updatedRegisterUser = await this.userService.updateRefreshtoken(
      user._id.toString(),
      refreshTokenHash,
    );

    console.log('updated register user is ', updatedRegisterUser);
    return { accessToken, refreshToken };
  }
}
