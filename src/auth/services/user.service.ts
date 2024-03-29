import {RefreshTokenRepository} from './../repositories/refreshToken.repository';
import {UserRepository} from './../repositories/user.repository';
import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from '../dto';
import * as argon2 from 'argon2';
import {User} from '../entities';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly refreshTokenRepo: RefreshTokenRepository
  ) {
  }
  async createUser(dto: CreateUserDto) {
    const user = await this.userRepo.findOneByEmail(dto.email);
    if (user) throw new ConflictException()
    const hashedPassword = await argon2.hash(dto.password);
    return this.userRepo.createUser(dto, hashedPassword)
  }

  async updateUserInfo(userId: string, name: string, phone: string) {
    return this.userRepo.updateUserInfo(userId, name, phone)
  }

  async deleteUser(id: string) {
    const refreshDelete = await this.refreshTokenRepo.remove(id)
    if (!refreshDelete) throw new NotFoundException()
    const deleteState = await this.userRepo.delete({id})

    return {
      message: deleteState ? "success" : "fail"
    }
  }

  async validateUser(id: string): Promise<User> {
    const [user] = await Promise.all([
      this.userRepo.findOneBy({id}),
    ]);
    if (!user) {
      throw new NotFoundException()
    }
    return user;
  }


}
