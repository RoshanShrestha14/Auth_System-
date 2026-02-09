import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { registerUserDto } from 'src/auth/dto/register.User';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
  async createUser(registerDto: registerUserDto) {
    return await this.UserModel.create({
      fname: registerDto.fname,
      lname: registerDto.lname,
      email: registerDto.email,
      password: registerDto.password,
    });
  }
}
