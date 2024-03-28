import {BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {User} from '../entities';
import {RefreshTokenRepository, UserRepository} from '../repositories';
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
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async login(
    email: string,
    password: string,
    req: RequestInfo
  ) {
    const user = await this.validateUser(email, password);
    const payload: TokenPayload = this.createTokenPayload(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(user, payload),
      this.createRefreshToken(user, payload),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
    };
  }

  async logout(userId: string) {
    return await this.refreshTokenRepository.remove(userId)
  }


  async refreshAccessToken(refreshToken: string, userId: string) {
    try {
      const {exp, ...payload} = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      const user = await this.userRepository.findOneBy({id: payload.sub});
      const checkRefreshToken = await this.refreshTokenRepository.findToken(userId)

      if (!user)
        throw new NotFoundException();
      if (user.id !== userId)
        throw new ForbiddenException();

      if (checkRefreshToken !== refreshToken) {
        throw new ForbiddenException();
      }
      return this.createAccessToken(user, payload as TokenPayload)

    } catch (error) {
      throw new NotFoundException();
    }
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
    const payloads = {...payload, tokeType: 'access'}
    return this.jwtService.sign(payloads, {expiresIn});
  }
  // refresh token create
  async createRefreshToken(user: User, payload: TokenPayload): Promise<string> {
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRY');
    const payloads = {...payload, tokeType: 'refresh'}
    const token = this.jwtService.sign(payloads, {expiresIn});
    const expiresAt = this.calculateExpiry(expiresIn);

    await this.refreshTokenRepository.saveRefreshToken(
      payload.jti,
      user,
      token,
      expiresAt,
    );

    return token;
  }
  // calculate expiration date
  private calculateExpiry(expiry: string): Date {
    let expiresInMilliseconds = 0;

    if (expiry.endsWith('d')) {
      const days = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = days * 24 * 60 * 60 * 1000;
    } else if (expiry.endsWith('h')) {
      const hours = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = hours * 60 * 60 * 1000;
    } else if (expiry.endsWith('m')) {
      const minutes = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = minutes * 60 * 1000;
    } else if (expiry.endsWith('s')) {
      const seconds = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = seconds * 1000;
    } else {
      throw new BadRequestException()
    }
    return new Date(Date.now() + expiresInMilliseconds);
  }

}
