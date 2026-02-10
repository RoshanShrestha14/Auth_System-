import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { registerUserDto } from 'src/auth/dto/register.User';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { AppLogger } from 'src/logger/logger.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: AppLogger,
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(registerDto: registerUserDto) {
    try {
      const user = await this.UserModel.create({
        fname: registerDto.fname,
        lname: registerDto.lname,
        email: registerDto.email,
        password: registerDto.password,
      });

      const payload = { sub: user._id };
      const token =await this.jwtService.signAsync(payload);

      this.logger.log(`user token is :${token}`,`User Service`)

      this.logger.log(
        `user create Succesfully :${registerDto.email}`,
        `User Service`,
      );

      return token;
    } catch (err: any) {
      this.logger.error(
        `User creation failed for email: ${registerDto.email}`,
        err?.stack,
        'UserService',
      );
      if (err?.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to create User');
    }
  }
}
