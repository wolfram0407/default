import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

import {RefreshToken, User} from '../entities';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repo: Repository<RefreshToken>,
  ) {

  }

  async saveRefreshToken(
    jti: string,
    user: User,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    console.log(user.id)
    const checkRefreshToken = await this.repo.findOneBy({
      user: {id: user.id}
    })
    const refreshToken = checkRefreshToken ? checkRefreshToken : new RefreshToken();
    refreshToken.jti = jti;
    refreshToken.user = user;
    refreshToken.token = token;
    refreshToken.expiresAt = expiresAt;
    refreshToken.isRevoked = false;
    return this.repo.save(refreshToken);
  }
}
