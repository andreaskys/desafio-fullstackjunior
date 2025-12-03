import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService{
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ){}

async login(email:string, pass:string){
  
  const user = await this.usersService.findByEmailAuth(email);
  if(!user){
    throw new UnauthorizedException('Credenciais Invalidas ou nao existem!');
  }

  const isMatch = await bcrypt.compare(pass, user.password);
  if(!isMatch){
    throw new UnauthorizedException('Credenciais Invalidas ou nao existem!');
  }

  const payload = {email: user.email, sub: user._id };
  return {
    access_token: this.jwtService.sign(payload),
    user: {name: user.name, email: user.email}
  };
}
}