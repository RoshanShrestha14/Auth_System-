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

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  async createUser(registerDto: registerUserDto) {
    try {
      const user =  await this.UserModel.create({
        fname: registerDto.fname,
        lname: registerDto.lname,
        email: registerDto.email,
        password: registerDto.password,
      });

      this.logger.log('User created successfully');

      return user;

    } catch (err: any) {
      this.logger.error(
        `User creation failed for email: ${registerDto.email}`,
        err?.stack,
      );
      if (err?.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to create User');
    }
  }
}
