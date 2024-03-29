import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

import {CreateUserDto} from '../dto';
import {User} from '../entities';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.repo.findOneBy({email});
  }
  async findOneById(id: string): Promise<User> {
    return this.repo.findOneBy({id});
  }


  async createUser(dto: CreateUserDto, hashedPassword: string): Promise<User> {
    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.password = hashedPassword;
    user.phone = dto.phone;
    user.role = dto.role;
    return await this.repo.save(user);
  }

  async updateUserInfo(id: string, name: string, phone: string) {
    try {
      const user = await this.findOneById(id)
      user.name = user.name === name ? user.name : name
      user.phone = user.phone === phone ? user.phone : phone
      await this.repo.save(user);

      return {
        message: 'success',
        user: {
          name: user.name,
          phone: user.phone
        }
      }
    } catch (err) {
      return {
        message: 'fail'
      }
    }
  }
}
