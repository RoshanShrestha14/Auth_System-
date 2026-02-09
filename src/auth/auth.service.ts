import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register() {


    //check emial already exist or not 
    //hashin pw 
    //generate token 
    // store it into db 
    //send token in response 

    
    console.log(`now i am active`);
    return { message:"User is registe" };
  }
}
