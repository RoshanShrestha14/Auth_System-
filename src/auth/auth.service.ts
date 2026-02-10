import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { registerUserDto } from './dto/register.User';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(registerDto: registerUserDto) {
    const hash = await bcrypt.hash(registerDto.password, 10);

    const token = await this.userService.createUser({
      ...registerDto,
      password: hash,
    });

    return token
  }
}
