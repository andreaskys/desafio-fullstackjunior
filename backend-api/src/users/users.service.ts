import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

  async onModuleInit() {
    const adminEmail = 'admin@gmail.com';
    const adminExists = await this.userModel.findOne({email: adminEmail});

    if(!adminExists) {
      console.log('criando admin user');
      const passwordHash = await bcrypt.hash('123456', 10);
      await this.userModel.create({
        name:'Admin',
        email: adminEmail,
        password: passwordHash
      });
      console.log("User admin@gmail.com criado");
    }
  }

  async create(CreateUserDto:  CreateUserDto){
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(CreateUserDto.password, salt);

    const newUser = new this.userModel({
      ...CreateUserDto,
      password: passwordHash,
    });
    return newUser.save();
  }

  findAll(){
    return this.userModel.find().select('-password');
  }

  findOne(id: string) {
    return this.userModel.findById(id).select('-password');
  }

  async findByEmailAuth(email: string){
    return this.userModel.findOne({email});
  }

  remove(id:string){
    return this.userModel.findByIdAndDelete(id);
  }
}