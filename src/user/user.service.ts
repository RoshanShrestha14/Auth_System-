import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { registerUserDto } from 'src/auth/dto/register.User';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { AppLogger } from 'src/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: AppLogger,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}
  async createUser(registerDto: registerUserDto) {
    try {
      const user = await this.UserModel.create(registerDto);

      this.logger.log(
        `User created successfully: ${registerDto.email}`,
        'UserService',
      );

      return user;
    } catch (err: any) {
      this.logger.error(
        `User creation failed for email: ${registerDto.email}`,
        err?.stack,
        'UserService',
      );

      if (err?.code === 11000) {
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }
  async findByEmail(email: string) {
    return this.UserModel.findOne({ email }).exec();
  }
  async getUserById(id: string) {
    return this.UserModel.findById(id).exec();
  }
  async updateRefreshtoken(userId: string, refreshToken: string) {
    this.logger.log(
      `hassed refresh toekn is ${refreshToken} and user id is ${userId}`,
      'UserService',
    );
    return await this.UserModel.findByIdAndUpdate(
      userId,
      { refreshTokenHash: refreshToken },
      { new: true },
    );
  }
}
