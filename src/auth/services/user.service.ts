import {UserRepository} from './../repositories/user.repository';
import {ConflictException, Injectable} from '@nestjs/common';
import {CreateUserDto} from '../dto';
import * as argon2 from 'argon2';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository
  ) {
  }
  async createUser(dto: CreateUserDto) {
    const user = await this.userRepo.findOneByEmail(dto.email);
    if (user) throw new ConflictException()
    const hashedPassword = await argon2.hash(dto.password);
    return this.userRepo.createUser(dto, hashedPassword)
  }


}
