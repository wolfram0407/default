import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {User} from '../entities';
import {UserRepository} from '../repositories';
import * as argon2 from 'argon2';
import {v4 as uuidv4} from 'uuid';

import {RequestInfo, TokenPayload} from '../types';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
    req: RequestInfo
  ) {
    const user = await this.validateUser(email, password);
    const payload: TokenPayload = this.createTokenPayload(user.id);

    const [accessToken] = await Promise.all([
      this.createAccessToken(user, payload),
    ]);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }





  // user 인증
  private async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({where: {email}});
    if (user && (await argon2.verify(user.password, plainPassword))) {
      return user;
    }
    throw new UnauthorizedException();
  }
  // payload create
  createTokenPayload(userId: string): TokenPayload {
    return {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      jti: uuidv4(),
    };
  }
  // access token create
  async createAccessToken(user: User, payload: TokenPayload): Promise<string> {
    const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRY');
    return this.jwtService.sign(payload, {expiresIn});
  }




}
