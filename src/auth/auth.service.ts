import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { registerUserDto } from './dto/register.User';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  register(registerDto: registerUserDto) {
    console.log('registerDto is ', registerDto);

    //check emial already exist or not
    //hashin pw
    //generate token
    // store it into db
    //send token in response

    return this.userService.createUser();
  }
}
